/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformTranslateService
	 * @function
	 * @requires $q, $translate, $translatePartialLoader, $rootScope
	 * @description
	 * platformTranslateService provides translation support with loading parts by using $translatePartialLoader automatically.
	 * Additionally translation of objects containing tagged values is supported (like grid and form configuration)
	 */
	angular.module('platform').factory('platformTranslateService', platformTranslateService);

	platformTranslateService.$inject = ['$q', '$translate', '$translatePartialLoader', '$rootScope', 'PlatformMessenger', '$timeout', '_'];

	function platformTranslateService($q, $translate, $translatePartialLoader, $rootScope, PlatformMessenger, $timeout, _) {
		const defaultTag = '$tr$';
		const defaultParamTag = defaultTag + 'param$';

		/**
		 * @ngdoc function
		 * @name setObject
		 * @function
		 * @methodOf platform:platformTranslateService
		 * @description converts a dotted key string to an object structure and assigns value
		 * @param {string} name dotted key (cloud.desktop.testData)
		 * @param {string} value value
		 * @param {object} context object where properties will be added
		 * @returns {object}
		 */
		const setObject = function setObject(name, value, context) {
			const parts = name.split('.');
			const p = parts.pop();

			for (let i = 0, j; context && (j = parts[i]); i++) {
				context = (j in context ? context[j] : context[j] = {});
			}

			return context && p ? (context[p] = value) : undefined; // Object
		};

		function translateTaggedProperty(item, propName, options) {
			if (angular.isArray(propName)) {
				_.forEach(propName, function (prop) {
					translateTaggedProperty(item, prop, options);
				});
			} else {
				const propTagName = propName + defaultTag;

				if (_.has(item, propTagName)) {
					const id = item[propTagName];
					const value = $translate.instant(id, item[propName + defaultParamTag]);

					if (id !== value) {
						item[propName] = value;
					} else {
						if (options && !_.isUndefined(options.notFound)) {
							if (_.isFunction(options.notFound)) {
								options.notFound(id);
							} else {
								options.notFound = true;
							}
						}
					}
				}
			}
		}

		const translationChanged = new PlatformMessenger();

		/**
		 * @ngdoc function
		 * @name translateObject
		 * @function instantly translates an object (recursively)
		 * @methodOf platform:platformTranslateService
		 * @description instantly translates an object (recursively)
		 * @param obj {object|array} [array of] objects to be translated
		 * @param tokens {string[]|string} tokens, can be null|undefined
		 * @param options [object] additional options
		 * @returns {object} translated grid configuration
		 */
		function translateObject(obj, tokens, options) {
			if (angular.isArray(obj)) {
				_.forEach(obj, function (item) {
					translateObject(item, tokens, options);
				});
			} else if (angular.isObject(obj)) {
				const localTokens = tokens ? tokens : [];

				_.forEach(Object.getOwnPropertyNames(obj), function (prop) {
					if (angular.isArray(obj[prop]) || angular.isObject(obj[prop])) {
						if (!angular.isObject(options) || (options.recursive !== false)) {
							translateObject(obj[prop], tokens, options);
						}
					} else if (!tokens) {
						const index = prop.indexOf(defaultTag);

						if (index !== -1) {
							localTokens.push(prop.substring(0, index));
						}
					}
				});

				translateTaggedProperty(obj, localTokens, options);
			}

			return obj;
		}

		/**
		 * @ngdoc function
		 * @name updateCustomTranslationKey
		 * @function
		 * @methodOf platformTranslateService
		 * @description updates key if $cust. is missing
		 * @param {string|array} key or key[]
		 * @returns {string} key including $cust.
		 */
		function updateCustomTranslationKey(key) {
			if (angular.isString(key)) {
				if (!key.startsWith('$cust.')) {
					key = '$cust.' + key;
				}
			} else if (angular.isArray(key)) {
				for (let i = 0; i < key.length; ++i) {
					key[i] = updateCustomTranslationKey(key[i]);
				}
			}

			return key;
		}

		let delayLoaded = null;

		const service = {
			/**
			 * @ngdoc function
			 * @name registerModule
			 * @function
			 * @methodOf platform:platformTranslateService
			 * @description registers a module to be loaded into translation tables
			 * @param module {string|array} module(s) which translations should be loaded
			 * @param promise [boolean] returns promise
			 * @returns {boolean|promise} true when translation table will be updated
			 */
			registerModule: function registerModule(module, promise) {
				let dirty = false;

				if (angular.isString(module) && !$translatePartialLoader.isPartAvailable(module)) {
					$translatePartialLoader.addPart(module);
					dirty = true;
				} else if (angular.isArray(module)) {
					_.forEach(module, function (part) {
						if (!$translatePartialLoader.isPartAvailable(part)) {
							$translatePartialLoader.addPart(part);
							dirty = true;
						}
					});
				}

				if (!dirty) {
					return promise ? $q.when(dirty) : dirty;
				}

				if (!delayLoaded) {
					delayLoaded = $q.defer();

					$timeout(function () {
						const finished = delayLoaded;

						delayLoaded = null;
						service.updateTranslation()
							.then(function () {
								finished.resolve(true);
							});
					});
				}

				return promise ? delayLoaded.promise : dirty;
			},

			/**
			 * @ngdoc function
			 * @name registerCustomTranslation
			 * @function
			 * @methodOf platform:platformTranslateService
			 * @description registers custom translation to be loaded
			 * @param key {string|array} custom translation(s) to be loaded
			 * @returns {promise} promise
			 */
			registerCustomTranslation: function registerCustomTranslation(key) {
				return service.registerModule(updateCustomTranslationKey(key), true);
			},

			/**
			 * @ngdoc function
			 * @name reloadCustomTranslation
			 * @function
			 * @methodOf platform:platformTranslateService
			 * @description reloads custom translation
			 * @param key {string|array} custom translation(s) to be reloaded
			 * @returns {promise} promise
			 */
			reloadCustomTranslation: function reloadCustomTranslation(key) {
				key = updateCustomTranslationKey(key);

				if (angular.isString(key)) {
					$translatePartialLoader.deletePart(key);
					$translatePartialLoader.addPart(key);
				} else if (angular.isArray(key)) {
					_.forEach(key, function (key) {
						$translatePartialLoader.deletePart(key);
						$translatePartialLoader.addPart(key);
					});
				}

				return this.updateTranslation();
			},

			/**
			 * @ngdoc function
			 * @name updateTranslation
			 * @function
			 * @methodOf platform:platformTranslateService
			 * @description forces an update of existing translation tables
			 */
			updateTranslation: function updateTranslation() {
				return $translate.refresh()
					.then(function () {
						translationChanged.fire();

						return true;
					});
			},

			/**
			 * @ngdoc function
			 * @name translate
			 * @function
			 * @methodOf platform:platformTranslateService
			 * @description translates id(s) from translation table
			 * @param id {string|array|object} A token which represents a translation id. This can be optionally an array of translation ids which
			 *                              results that the function returns an object where each key is the translation id and the value the translation.
			 * @param asObject {boolean=} when true, dotted keys will be converted to an object
			 * @param interpolateParams {object=} An object hash for dynamic values
			 * @returns {promise} translated ids
			 */
			translate: function translate(id, asObject, interpolateParams) {
				let ids = [];

				// check if translate(id, interpolationParams) is called
				if (angular.isObject(asObject)) {
					interpolateParams = asObject;
					asObject = !angular.isArray(id);
				}

				if (angular.isArray(id) || angular.isString(id)) {
					ids = id;
				} else {
					// always convert back to object
					asObject = true;

					// convert object to an array of dotted strings
					_.forEach(Object.getOwnPropertyNames(id), function (item) {
						_.forEach(id[item], function (key) {
							ids.push(item + '.' + key);
						});
					});
				}

				// noinspection FunctionWithMultipleReturnPointsJS
				return $translate(ids, interpolateParams)
					.then(function (values) {
						// convert translated ids back to an object
						if (!asObject) {
							return values;
						} else {
							const converted = {};

							if (angular.isObject(values)) {
								_.forEach(Object.getOwnPropertyNames(values), function (item) {
									setObject(item, values[item], converted);
								});
							} else {
								setObject(id, values, converted);
							}

							return converted;
						}
					});
			},

			/**
			 * @ngdoc function
			 * @name instant
			 * @function
			 * @methodOf platform:platformTranslateService
			 * @description instantly translates id(s) from translation table
			 * @param id {object|array|string} A token which represents a translation id.
			 * @param interpolateParams [object=] An object hash for placeholder values
			 * @param noConvert [boolean] don't convert ids to object-hash
			 * @returns {object} translated ids
			 */
			instant: function instant(id, interpolateParams, noConvert) {
				let ids = [];

				if (angular.isString(id) || angular.isArray(id)) {
					ids = id;
				} else {
					_.forEach(Object.getOwnPropertyNames(id), function (item) {
						_.forEach(id[item], function (key) {
							ids.push(item + '.' + key);
						});
					});
				}

				const translated = $translate.instant(ids, interpolateParams);
				let converted = {};

				if (noConvert && (angular.isString(ids) || angular.isArray(ids))) {
					converted = translated;
				} else {
					if (angular.isString(id)) {
						setObject(id, translated, converted);
					} else {
						_.forEach(Object.getOwnPropertyNames(translated), function (item) {
							setObject(item, translated[item], converted);
						});
					}
				}

				return converted;
			},

			/**
			 * @ngdoc function
			 * @name instantviaTemplate
			 * @function
			 * @methodOf platform:platformTranslateService
			 * @description instantly translates id(s) from translation table
			 * @param id {object|array|string} A token which represents a translation id.
			 * @param interpolateParams [object=] An object hash for placeholder values
			 * @returns {object} translated ids
			 */
			instantviaTemplate: function instantviatemplate(id, interpolateParams) {
				const theText = $translate.instant(id);
				const compile = _.template(theText);

				return compile(interpolateParams);
			},

			/**
			 * @ngdoc function
			 * @name translateTileGroupConfig
			 * @function
			 * @methodOf platform:platformTranslateService
			 * @description instantly translates desktop groups/tiles definition
			 * @param {object} config desktop groups/tiles definition
			 * @returns {object} translated desktop groups/tiles definition
			 */
			translateTileGroupConfig: function translateTileGroupConfig(config) {
				_.forEach(config, function (group) {
					translateTaggedProperty(group, 'TileGroupName');

					if (angular.isArray(group.tiles)) {
						_.forEach(group.tiles, function (item) {
							translateTaggedProperty(item, ['DisplayName', 'Description']);
						});
					}
				});

				return config;
			},

			/**
			 * @ngdoc function
			 * @name translateObject
			 * @function instantly translates an object (recursively)
			 * @methodOf platform:platformTranslateService
			 * @description instantly translates an object (recursively)
			 * @param obj {object|array} [array of] objects to be translated
			 * @param tokens {string[]|string} tokens, can be null|undefined
			 * @param options [object] additional options
			 * @returns {object} translated grid configuration
			 */
			translateObject: translateObject,

			/**
			 * @ngdoc function
			 * @name translateFormConfig
			 * @function
			 * @methodOf platform:platformTranslateService
			 * @description instantly translates form configuration
			 * @param {object} config form configuration to be translated
			 * @returns {object} translated form configuration
			 */
			translateFormConfig: function translateFormConfig(config) {
				if (angular.isArray(config.groups)) {
					_.forEach(config.groups, function (item) {
						translateTaggedProperty(item, ['header', 'groupDescription']);
					});
				}

				if (angular.isArray(config.rows)) {
					_.forEach(config.rows, function (item) {
						translateTaggedProperty(item, ['label', 'toolTip']);

						if (_.has(item, 'options')) {
							translateObject(item.options, ['label', 'toolTip']);
						}
					});
				}

				return config;
			},

			/**
			 * @ngdoc function
			 * @name translateFormContainerOptions
			 * @function
			 * @methodOf platform:platformTranslateService
			 * @description instantly translates form configuration
			 * @param {object} config form container options to be translated
			 * @returns {object} translated form container options
			 */
			translateFormContainerOptions: function translateFormContainerOptions(config) {
				translateTaggedProperty(config, 'title');
				this.translateFormConfig(config.formOptions.configure);

				return config;
			},

			/**
			 * @ngdoc function
			 * @name translateGridConfig
			 * @function instantly translates grid configuration
			 * @methodOf platform:platformTranslateService
			 * @description instantly translates grid configuration
			 * [
			 *   { id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.boq.gridColumnCodeText', width: 120, toolTip: 'Unique code field', toolTip$tr$: 'cloud.boq.gridColumnCodeTooltip' },
			 *   { id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.boq.gridColumnDescriptionText', editor: Slick.Editors.LongText, width: 250 },
			 *   { id: 'tot', field: 'Total', name: 'Total', name$tr$: 'cloud.boq.gridColumnTotalText', formatter: folderTotalFormatter, width: 100 }
			 * ]
			 * @param config {object|array} [array of] grid configuration to be translated
			 * @returns {object} translated grid configuration
			 */
			translateGridConfig: function translateGridConfig(config) {
				const tokens = ['name', 'toolTip', 'footerText'];

				if (angular.isArray(config)) {
					_.forEach(config, function (item) {
						translateTaggedProperty(item, tokens);
					});
				} else {
					translateTaggedProperty(config, tokens);
				}

				return config;
			},

			translationChanged: translationChanged
		};

		return service;
	}
})(angular);

