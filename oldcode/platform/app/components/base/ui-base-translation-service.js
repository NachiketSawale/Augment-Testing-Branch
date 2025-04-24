/**
 * Created by reimer on 29.01.2015.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name
	 * @description base class for ui translationn services
	 */
	angular.module('platform').factory('platformUIBaseTranslationService', ['platformTranslateService',

		function (platformTranslateService) {

			return function (layouts, privates) {

				// fallback (when using service as prototype)
				if (!privates) {
					privates = {};
				}

				var self = this;

				var modules = ['cloud.common'];

				privates.toTranslate = {};
				// translate;
				// updateCallback;

				var defaultWords = {
					basicData: {location: modules[0], identifier: 'entityProperties', initial: 'Basic Data'},
					Code: {location: modules[0], identifier: 'entityCode', initial: 'Code'},
					Description: {location: modules[0], identifier: 'entityDescription', initial: 'Description'},
					DescriptionInfo: {location: modules[0], identifier: 'entityDescription', initial: 'Description'},
					entityHistory: {location: modules[0], identifier: 'entityHistory', initial: 'History'},
					InsertedAt: {location: modules[0], identifier: 'entityInsertedAt', initial: 'Inserted At'},
					InsertedBy: {location: modules[0], identifier: 'entityInsertedBy', initial: 'Inserted By'},
					UpdatedAt: {location: modules[0], identifier: 'entityUpdatedAt', initial: 'Updated At'},
					UpdatedBy: {location: modules[0], identifier: 'entityUpdatedBy', initial: 'Updated By'},
					Inserted: {location: modules[0], identifier: 'entityInserted', initial: 'Inserted'},
					Updated: {location: modules[0], identifier: 'entityUpdated', initial: 'Updated'},
					Version: {location: modules[0], identifier: 'entityVersion', initial: 'Version'},
					Id: {location: modules[0], identifier: 'entityId', initial: 'ID'},
					Checked: {location: modules[0], identifier: 'entityChecked', initial: 'Checked'}
				};
				var addDefaultWords = true;

				privates.words = {};
				if (addDefaultWords) {
					privates.words = defaultWords;
					addDefaultWords = false;
				}

				var layoutArray;
				if (angular.isArray(layouts)) {
					layoutArray = layouts;
				} else {
					layoutArray = [layouts];   // cast object as array
				}

				layoutArray.forEach(function (layout) {
					// if (layout.hasOwnProperty('translationInfos')) {
					var propertyName = adjustTranslationInfoName(layout);
					if (propertyName) {
						modules = modules.concat(layout[propertyName].extraModules);
						angular.extend(privates.words, layout[propertyName].extraWords);
					}
				});

				function adjustTranslationInfoName(layout) {

					var supportedNames = ['translationInfo', 'translationInfos', 'translationInformation'];
					for (var i = 0; i < supportedNames.length; i++) {
						if (layout.hasOwnProperty(supportedNames[i])) {
							return supportedNames[i];
						}
					}
					return null;
				}

				function initializeTranslation() {

					var result = {};
					for (var i = 0; i < modules.length; i++) {
						var module = modules[i];
						result[module] = [];
					}

					for (var text in privates.words) {
						if (privates.words.hasOwnProperty(text)) {
							var code = privates.words[text].identifier;
							var addTo = privates.words[text].location;
							result[addTo].push(code);
						}
					}

					// result[cloudCommonModule] = _.uniq(result[cloudCommonModule]);
					// result[moduleName] = _.uniq(result[moduleName]);
					return result;
				}

				privates.toTranslate = initializeTranslation();

				self.getTranslationInformation = privates.getTranslationInformation || function (key) {
					return privates.words[key];
				};

				self.getTranslate = function () {
					return privates.translate;
				};

				function loadModuleTranslation() {
					if (_.isNil(privates.translate)) {
						privates.translate = platformTranslateService.instant(privates.toTranslate);
					}
				}

				loadModuleTranslation();

				var loadTranslations = function () {
					privates.translate = null;

					loadModuleTranslation();

					if (!_.isNil(privates.updateCallback)) {
						privates.updateCallback();
					}
				};

				self.registerUpdates = function (callback) {
					privates.updateCallback = callback;
					platformTranslateService.translationChanged.register(loadTranslations);
				};

				self.unregisterUpdates = function () {
					privates.updateCallback = null;
					platformTranslateService.translationChanged.unregister(loadTranslations);
				};

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule(modules)) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				// needed when using service in combination with platformMainControllerService
				self.loadTranslations = function () {
					loadTranslations();
				};

			};
		}

	]);

})(angular);

