from django.db import models
from django.forms import Widget

import json
from typing import NamedTuple


class Position(NamedTuple):
    lat: float
    long: float

    def __str__(self):
        return f'{self.lat:.6f},{self.long:.6f}'


class MapLocationWidget(Widget):
    template_name = 'forms/map-location.html'

    class Media:
        # @see https://github.com/Leaflet/Leaflet
        # @see https://github.com/domoritz/leaflet-locatecontrol
        css = {'all': [
            'leaflet/leaflet.css',
            'leaflet/locate/L.Control.Locate.css']}
        js = ['leaflet/leaflet.js',
              'leaflet/locate/L.Control.Locate.min.js',
              'map-location.js']

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        context['map_options'] = json.dumps(
            context['widget']['attrs'].get('options'))
        return context


class LocationField(models.Field):
    description = 'Choose location on map'

    def __init__(self, *args, options={}, **kwargs):
        self.options = options
        kwargs['max_length'] = 22  # e.g. "-180.123456,-90.123456"
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        del kwargs['max_length']
        return name, path, args, kwargs

    @property
    def non_db_attrs(self):
        return super().non_db_attrs + ('options',)  # type: ignore

    def formfield(self, **kwargs):
        return super().formfield(**{
            'widget': MapLocationWidget({'options': self.options}),
            **kwargs
        })

    def from_db_value(self, value: str, expression, connection) \
            -> 'Position|None':
        if not value:
            return None
        lat, lon = value.split(',')
        return Position(float(lat), float(lon))

    def to_python(self, value) -> 'Position|None':
        # throw django.core.exceptions.ValidationError
        if isinstance(value, Position):
            return value
        if not value:
            return None
        lat, lon = value.split(',')
        return Position(float(lat), float(lon))

    def get_prep_value(self, value) -> str:
        if isinstance(value, Position):
            return f'{value.lat},{value.long}'
        return value

    def db_type(self, connection):
        return 'char(22)'
