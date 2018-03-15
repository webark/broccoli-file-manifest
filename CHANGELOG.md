# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.5.2"></a>
## [1.5.2](https://github.com/webark/broccoli-style-manifest/compare/v1.5.1...v1.5.2) (2018-03-15)



<a name="1.5.1"></a>
## [1.5.1](https://github.com/webark/broccoli-style-manifest/compare/v1.5.0...v1.5.1) (2018-03-15)


### Bug Fixes

* **improved rebuild:** switching to 'broccoli-caching-writer' for more standard way of preventing needless rebuilds ([e77d63d](https://github.com/webark/broccoli-style-manifest/commit/e77d63d))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/webark/broccoli-style-manifest/compare/v1.4.0...v1.5.0) (2018-02-21)


### Features

* **sorting:** Ensure consistent file sorting on Windows ([ea00db0](https://github.com/webark/broccoli-style-manifest/commit/ea00db0))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/webark/broccoli-style-manifest/compare/v1.3.1...v1.4.0) (2017-11-02)


### Features

* **sorting:** now sorting files in manifest first by depth, then by alphanumeric ([c144ca9](https://github.com/webark/broccoli-style-manifest/commit/c144ca9))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/webark/broccoli-style-manifest/compare/v1.3.0...v1.3.1) (2017-11-01)


### Bug Fixes

* **improved rebuild:** doing a more definitive way of checking to see if a rebuild of the mmanifest should happen ([ee8813c](https://github.com/webark/broccoli-style-manifest/commit/ee8813c))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/webark/broccoli-style-manifest/compare/v1.2.2...v1.3.0) (2017-10-31)


### Features

* **better ordering:** updaing order so more deeply nested files come after thier ansestors ([f59ccea](https://github.com/webark/broccoli-style-manifest/commit/f59ccea))
* **excluding directories:** we don't care about the directories so we are excluding them now ([b30050d](https://github.com/webark/broccoli-style-manifest/commit/b30050d))
* **limit rebuild:** only rebuilding the manifest file if something has changed about it ([1f6ddaf](https://github.com/webark/broccoli-style-manifest/commit/1f6ddaf))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/webark/broccoli-style-manifest/compare/v1.2.1...v1.2.2) (2017-04-05)


### Bug Fixes

* **defaults:** adding back in the default for the default extention ([1ca5f96](https://github.com/webark/broccoli-style-manifest/commit/1ca5f96))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/webark/broccoli-style-manifest/compare/v1.2.0...v1.2.1) (2017-04-05)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/webark/broccoli-style-manifest/compare/v1.1.0...v1.2.0) (2017-04-05)


### Features

* **better defaults:** allowing to set the default extension when no files are passed to the plugin, also explicitly stating that the filename should not have an extension ([6472c35](https://github.com/webark/broccoli-style-manifest/commit/6472c35))



<a name="1.1.0"></a>
# 1.1.0 (2017-04-01)


### Features

* **setup:** initial commit of functionality for generating an import manifest file ([6897ee7](https://github.com/webark/broccoli-style-manifest/commit/6897ee7))
