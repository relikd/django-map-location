.PHONY: help
help:
	@echo 'commands:'
	@echo '  install, dist'

.PHONY: install
install:
	[ -z "$${VIRTUAL_ENV}" ] \
	&& python3 -m pip install -e . --user \
	|| python3 -m pip install -e .

dist-env:
	@echo Creating virtual environment...
	@python3 -m venv 'dist-env'
	@source dist-env/bin/activate && pip install twine

.PHONY: dist
dist: dist-env
	[ -z "$${VIRTUAL_ENV}" ]  # you can not do this inside a virtual environment.
	rm -rf dist
	@echo Building...
	python3 setup.py sdist bdist_wheel
	@echo
	rm -rf ./*.egg-info/ ./build/
	@echo Publishing...
	@echo "\033[0;31mEnter your PyPI token:\033[0m"
	@source dist-env/bin/activate && export TWINE_USERNAME='__token__' && twine upload dist/*
