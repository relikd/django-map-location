import setuptools

with open('README.md', 'r') as f:
    long_description = f.read()

setuptools.setup(
    name='django-map-location',
    description='Django Map-Location Field',
    version='0.9.1',
    author='relikd',
    license='MIT',
    long_description=long_description,
    long_description_content_type='text/markdown',
    url='https://github.com/relikd/django-map-location',
    packages=['map_location'],
    include_package_data=True,
    install_requires=['Django>=4.0'],
    keywords=['OpenStreetMap', 'OSM', 'Leaflet', 'Django',
              'Geo', 'GPS', 'Position', 'Location'],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Framework :: Django :: 4.0',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
    ],
    python_requires='>=3.6',
)
