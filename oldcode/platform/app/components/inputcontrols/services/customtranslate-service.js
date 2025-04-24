(function (angular) {
	'use strict';

	angular.module('platform')
		.factory('platformCustomTranslateService', platformCustomTranslateService);

	platformCustomTranslateService.$inject = ['$http', 'platformTranslateService', '$q', 'platformContextService', '_', 'platformGridDialogService'];

	function platformCustomTranslateService($http, platformTranslateService, $q, platformContextService, _, platformGridDialogService) {
		var translationPrefix = '$cust';
		var registeredControls = [];

		function ControlNotRegisteredException(message) {
			this.message = message;
			this.name = 'ControlNotRegisteredException';
		}

		function loadTranslationFromServer(translationKey, culture) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'cloud/translation/custom/load',
				params: {translationKey: translationKey, culture: culture}
			});
		}

		function loadTranslation(translationKey, culture, refreshCache) {
			var usedCulture = culture ? culture : platformContextService.getLanguage();
			var control = getControlByKey(translationKey);

			if (control && control.info && control.info.cacheEnabled) {
				// Data could be cached
				if (control.data && !refreshCache) {
					// cached data exixts -> return this cached data
					return $q.when({data: control.data[usedCulture]});
				} else {
					// no cached data exists or should be refreshed -> load data from database
					return loadTranslationsFromServer(translationKey).then(function (result) {
						control.data = result.data;
						return {data: control.data[usedCulture]};
					});
				}
			} else {
				// Data shouldn't be cached -> simply load the data
				return loadTranslationFromServer(translationKey, usedCulture);
			}
		}

		function loadTranslationsFromServer(translationKey) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'cloud/translation/custom/loadlist',
				params: {translationKey: translationKey}
			});
		}

		function loadTranslations(translationKey, refreshCache) {
			var control = getControlByKey(translationKey);

			if (control && control.info && control.info.cacheEnabled) {
				// Data could be cached
				if (control.data && !refreshCache) {
					// cached data exixts -> return this cached data
					return $q.when({data: control.data});
				} else {
					// no cached data exists or it should be refreshed -> load data from database
					return loadTranslationsFromServer(translationKey).then(function (result) {
						control.data = result.data;
						return {data: control.data};
					});
				}
			} else {
				// Data shouldn't be cached -> simply load the data
				return loadTranslationsFromServer(translationKey);
			}
		}

		function saveTranslationToServer(translationKey, translation, culture) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'cloud/translation/custom/save',
				params: {translationKey: translationKey, translation: translation, culture: culture}
			});
		}

		function saveTranslation(translationKey, translation, culture) {
			var usedCulture = culture ? culture : platformContextService.getLanguage();
			var control = getControlByKey(translationKey);

			if (control.info && control.info.cacheEnabled) {
				// Data should be cached
				if (!control.data) {
					control.data = {};
				}
				control.data[usedCulture] = translation;
				control.isDirty = true;
				return $q.when();
			}

			// Data shouldn't be cached -> simply save the data
			return saveTranslationToServer(translationKey, translation, usedCulture);
		}

		function saveTranslationsToServer(translationKey, translations) {
			return $http.post(globals.webApiBaseUrl + 'cloud/translation/custom/savelist', {
				translationKey: translationKey,
				translations: translations
			});
		}

		function saveTranslations(translationKey, translations) {
			var control = getControlByKey(translationKey);

			if (control && control.info && control.info.cacheEnabled) {
				// Data should be cached -> saves to cache
				control.data = translations;
				control.isDirty = true;
				return $q.when();
			}

			// Data shouldn't be cached  -> simply saves the data
			return saveTranslationsToServer(translationKey, translations);
		}

		function writeCachedData(translationKey) {
			var keys, changedControls, lists = [];

			if (_.isNil(translationKey)) {
				// Take all changed controls
				changedControls = _.filter(registeredControls, function (c) {
					return c.isDirty;
				});
			} else {
				// use only the selected keys whose data has changed
				keys = _.isArray(translationKey) ? translationKey : [translationKey];
				changedControls = _.filter(registeredControls, function (c) {
					return c.isDirty && keys.includes(c.translationKey);
				});
			}

			lists = _.map(changedControls, function (c) {
				return {translationKey: c.translationKey, translations: c.data};
			});

			if (lists && lists.length > 0) {
				return $http.post(globals.webApiBaseUrl + 'cloud/translation/custom/savelists', lists).then(function () {
					_.forEach(changedControls, function (control) {
						control.isDirty = false;
					});
				});
			}

			return $q.when();
		}

		// delete translation from file
		function deleteTranslationByKeyToServer(translationKey) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'cloud/translation/custom/deletetranslationbykey',
				params: {translationkey: translationKey}
			});
		}

		// delete translation from file
		function deleteTranslationByKey(translationKey) {
			var control = getControlByKey(translationKey);
			if (control.info && control.info.cacheEnabled) {
				// Data should be cached
				if (control.data) {
					for (var culture in control.data) {
						if (control.data.hasOwnProperty(culture)) {
							control.data[culture] = null;
						}
					}
					// control.data = undefined;
					control.isDirty = true;
				}

				return $q.when();
			}

			// Data shouldn't be cached  -> simply delete the data
			return deleteTranslationByKeyToServer(translationKey);
		}

		// delete all translation files of an id
		function deleteTranslationFilesByKey(translationKey) {
			return getTranslationKeyParts(translationKey).then(function (parts) {
				return deleteTranslationFilesById(parts.section, parts.id);
			});
		}

		function deleteTranslationFilesByIdToServer(section, id) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'cloud/translation/custom/deletetranslationsbyid',
				params: {section: section, id: id}
			});
		}

		function deleteTranslationFilesById(section, id) {
			return deleteTranslationFilesByIdToServer(section, id).then(function (result) {
				if (result.data) {
					var controls = getControlsById(section, id);
					return iterateControls(controls, function (control) {
						control.data = undefined;
						// update of controls is deactivated by design. That should be done by the control or by the developer.
						// update(control.translationKey, { id: '1', name: 'id deleted'});
					});
				}
			});
		}

		function createTranslationKey(options) {
			return translationPrefix + '.' + options.section + '.' + options.id + (!_.isNil(options.structure) ? '.' + options.structure : '') + '.' + options.name;
		}

		function changeTranslationIdToServer(section, oldId, newId) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'cloud/translation/custom/renametranslationid',
				params: {section: section, oldId: oldId, newId: newId}
			});
		}

		function changeTranslationId(section, oldId, newId) {
			if(oldId === newId) {
				return $q.when(false);
			}

			return changeTranslationIdToServer(section, oldId, newId).then(function (result) {
				if (result.data) {
					var controls = getControlsById(section, oldId);

					return iterateControls(controls, function (control) {
						control.translationKey = control.translationKey.replace(oldId, newId);
					});
				}
			});
		}

		function duplicateTranslationIdToServer(section, oldId, newId) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'cloud/translation/custom/duplicatetranslationid',
				params: {section: section, oldId: oldId, newId: newId}
			});
		}

		function duplicateTranslationId(section, sourceId, targetId) {
			return duplicateTranslationIdToServer(section, sourceId, targetId).then(function (result) {
				if (result.data) {
					var controls = getControlsById(section, sourceId);

					return iterateControls(controls, function (control) {
						var newC = _.cloneDeep(control);
						newC.translationKey = newC.translationKey.replace(sourceId, targetId);
						registerControlObject(newC);
					});
				}
			});
		}

		function loadSection(section) {
			return $http.get(globals.webApiBaseUrl + 'cloud/translation/custom/loadsection', section);
		}

		function reloadTranslations(section) {
			return platformTranslateService.reloadCustomTranslation(section);
		}

		function registerTranslations(section) {
			return platformTranslateService.registerCustomTranslation(section);
		}

		function registerControl(translationKey, info, data, isDirty) {
			registerControlObject({
				translationKey: translationKey,
				info: info || undefined,
				data: data || undefined,
				isDirty: isDirty || false
			});
		}

		function registerControlObject(control) {
			if (control && control.translationKey && _.isString(control.translationKey)) {
				var existingControl = _.find(registeredControls, {'translationKey': control.translationKey});
				if (!existingControl) {
					// ToDo: What shall we do if control is already registered?
					registeredControls.push(control);
				}
			}
		}

		function unregisterControl(translationKey) {
			if (translationKey && _.isString(translationKey)) {
				_.remove(registeredControls, function (n) {
					return n.translationKey === translationKey;
				});
			}
		}

		function updateControl(translationKey, info) {
			var control = _.find(registeredControls, {'translationKey': translationKey});
			if (control && control.info && control.info.funcs) {
				if (_.isFunction(control.info.funcs.update)) {
					control.info.funcs.update(info);
				}
			}
		}

		function setControlValue(translationKey, value, info) {
			var control = _.find(registeredControls, {'translationKey': translationKey});
			if (control && control.info && control.info.funcs) {
				if (_.isFunction(control.info.funcs.setValue)) {
					control.info.funcs.setValue(value, info);
				}
			}
		}

		function getControlByKey(translationKey, preventNull) {
			var c = _.find(registeredControls, {'translationKey': translationKey});
			if (preventNull && _.isNil(c)) {
				throw new ControlNotRegisteredException('The custom translation control is not registered.');
			}
			return c;
		}

		function getControlsById(section, id) {
			var c = _.filter(registeredControls, function (c) {
				return c.translationKey.includes(section + '.' + id);
			});
			return c || [];
		}

		function getTranslationKeyParts(translationKey) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'cloud/translation/custom/gettranslationkeyparts',
				params: {translationKey: translationKey}
			}).then(function (result) {
				return result.data;
			});
		}

		function iterateControls(controls, func) {
			if (controls && controls.length > 0) {
				try {
					_.forEach(controls, function (control) {
						func(control);
					});

					return true;
				} catch (ex) {
					return false;
				}
			}
			return false;
		}

		function getTranslationPrefix() {
			return translationPrefix;
		}

		function openTranslationDialog(languageKey, editorType) {
			// var languages = getUiLanguageItems();
			return loadTranslations(languageKey).then(function (result) {
				// convert object in array
				let translations = _.map(result.data, function (value, key) {
					return {'culture': key, 'description': value};
				});

				let cols = [{
					id: 'culture',
					name$tr$: 'platform.customTranslateControl.language',
					formatter: 'description',
					field: 'culture',
					width: 200
				}, {
					id: 'description',
					name$tr$: 'platform.customTranslateControl.description',
					formatter: 'description',
					field: 'description',
					editor: editorType,
					width: 400
				}];

				return platformGridDialogService.showDialog({
					columns: cols,
					items: translations,
					idProperty: 'culture',
					tree: false,
					headerText$tr$: 'platform.customTranslateControl.header',
					isReadOnly: false
				 });
			});
		}

		return {
			/**
			 * @ngdoc function
			 * @name getTranslation
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Gets the translated string of the defined culture.
			 * @param { string } translationKey The translation key, e.g. '$cust.searchForms.134.987.title'
			 * @param { string } culture The culture, e.g. "de". If undefined the current ui language will be used.
			 * @param { boolean } refreshCache If true, then the cache is ignored and the data is reloaded.
			 * @return { string } The translated string
			 */
			getTranslation: loadTranslation,
			/**
			 * @ngdoc function
			 * @name getTranslations
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Gets all translations of this translation key.
			 * @param { string } translationKey The translation key, e.g. '$cust.searchForms.134.987.title'
			 * @param { boolean } refreshCache If true, then the cache is ignored and the data is reloaded.
			 * @return { object } An object with a property for each culture and its translation as value.
			 */
			getTranslations: loadTranslations,
			/**
			 * @ngdoc function
			 * @name saveTranslation
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Saves the translation string in the defined culture.
			 * @param { string } translationKey The translation key, e.g. '$cust.searchForms.134.987.title'
			 * @param { string } translation The translated string to be saved.
			 * @param { string } culture The culture, e.g. "de". If no culture is set the current ui language will be used.
			 */
			saveTranslation: saveTranslation,
			/**
			 * @ngdoc function
			 * @name saveTranslations
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Saves all translations of the translation key.
			 * @param { string } translationKey The translation key, e.g. '$cust.searchForms.134.987.title'
			 * @param { object } translations An object with a property for each culture and its translation as value.
			 */
			saveTranslations: saveTranslations,
			/**
			 * @ngdoc function
			 * @name getTranslationPrefix
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Returns the string prefix that identifies a translation file.
			 * @return { string } The prefix string
			 */
			getTranslationPrefix: getTranslationPrefix,
			/**
			 * @ngdoc function
			 * @name deleteTranslationByKey
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Deletes only the single translation that is defined by the translation key. Other translations of the same section and id are not affected.
			 * @param { string } translationKey The translation key, e.g. '$cust.searchForms.134.987.title'.
			 * @return { boolean } True, if successfull. Otherwise false.
			 */
			deleteTranslationByKey: deleteTranslationByKey,
			/**
			 * @ngdoc function
			 * @name deleteTranslationByKey
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Deletes every translation from the defined ID. The information required for this action is taken from the given translation key, i.e. the section and the id. This also affects other translations of the same ID.
			 * @param { string } translationKey The translation key, e.g. '$cust.searchForms.134.987.title'. Actually only the following part is needed: '$cust.searchForms.134'
			 * @return { boolean } True, if successfull. Otherwise false.
			 */
			deleteTranslationsByKey: deleteTranslationFilesByKey,
			/**
			 * @ngdoc function
			 * @name deleteTranslationById
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Deletes every translation from the defined ID. This also affects other translations of the same ID.
			 * @param { string } section The section, e.g. "searchForms". Usually the 2nd part of a TranslationKey..
			 * @param { string } id The identifier used for the filename, e.g. "44538d840a146787". Usually the 3rd part of a translationKey.
			 * @return { boolean } True, if successfull. Otherwise false.
			 */
			deleteTranslationsById: deleteTranslationFilesById,
			/**
			 * @ngdoc function
			 * @name changeTranslationId
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Moves the existing translations of an ID to another ID. This affects several translations if they use the same ID.
			 * @param { string } section The name of the section, e.g. "searchForms".
			 * @param { string } oldId The old id of the translation
			 * @param { string } newId The new id of the translation
			 * @return { boolean } True, if successfull. Otherwise false.
			 */
			renameTranslationId: changeTranslationId,
			/**
			 * @ngdoc function
			 * @name duplicateTranslationId
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Copies the existing translations of an ID to another ID.
			 * @param { string } section The name of the section, e.g. "searchForms".
			 * @param { string } sourceId The source id of the translation to be copied.
			 * @param { string } targetId The target id of the translation.
			 * @return { boolean } True, if successfull. Otherwise false.
			 */
			duplicateTranslationId: duplicateTranslationId,
			/**
			 * @ngdoc function
			 * @name getSection
			 * @function
			 * @methodOf platformCustomTranslateService
			 * @description Gets all translations of a specified section.
			 * @param { string } section The name of the section, e.g. "searchForms".
			 * @return { object } An object with the translations.
			 */
			getSection: loadSection,
			/**
			 * @ngdoc function
			 * @name registerTranslations
			 * @function
			 * @methodOf platform:platformCustomTranslateService
			 * @description To use the custom translations from a section it is necessary to initial register this section to the Platform Translation Service.
			 * @param {string|array} section Section(s) to be registered.
			 * @returns {promise} promise
			 */
			registerTranslations: registerTranslations,
			/**
			 * @ngdoc function
			 * @name reloadTranslations
			 * @function
			 * @methodOf platform:platformCustomTranslateService
			 * @description Triggers the Platform Translation Service to reload the translations of the specified sections.
			 * This function must be executed every time a translation has changed after it has been initially registered. Only then will the changes have an effect on the translation.
			 * @param {string|array} section Section(s) to be reloaded.
			 * @returns {promise} promise
			 */
			reloadTranslations: reloadTranslations,
			/**
			 * @ngdoc function
			 * @name writeCachedData
			 * @function
			 * @methodOf platform:platformCustomTranslateService
			 * @description Writes the cached data to disc. Necessary to save the data if cacheEnabled is set to true.
			 * @param {string|array} translationKey translationKey(s) to be persisted. If undefined then every changed controls data will be saved.
			 */
			writeCachedData: writeCachedData,
			/**
			 * @ngdoc function
			 * @name createTranslationKey
			 * @function
			 * @methodOf platform:platformCustomTranslateService
			 * @description Creates a translate key with the information of the control options object.
			 * @param {object} options The options of the custom translation control
			 * @returns { string } The translation key
			 */
			createTranslationKey: createTranslationKey,
			/**
			 * @ngdoc function
			 * @name openTranslationDialog
			 * @function
			 * @methodOf platform:platformCustomTranslateService
			 * @description Open Translation-Dialog with all translations to a key
			 * @param {string} languageKey
			 * @returns { string } The translation key
			 */
			openTranslationDialog: openTranslationDialog,
			/**
			 * Functions that handle the control directly and not its data. This is only possible if the control has been registered before.
			 */
			control: {
				/**
				 * @ngdoc function
				 * @name register
				 * @function
				 * @methodOf platform:platformCustomTranslateService
				 * @description Registers a control on the Custom Translate Service so that certain functions that affect the control can be called via the service. This function is only required for internal purposes by a control that uses the Custom Translate Service, such as the Custom Translate Control. This function is not actually relevant for using the control.
				 * @param { string } translationKey The translation key, e.g. '$cust.searchForms.134.987.title'. Actually only the following part is needed: '$cust.searchForms.134'
				 * @param {object} info An easy to extend object with values and functions. Mostly the options object of the control. (see wiki)
				 * @param {object} data The translations of the control. This is optional and only useful if cacheEnabled is set to true.
				 * @param {object} options The options of the custom translation control
				 * @returns { boolean } isDirty A flag to indicate whether a control's data is changed.
				 */
				register: registerControl,
				/**
				 * @ngdoc function
				 * @name unregister
				 * @function
				 * @methodOf platform:platformCustomTranslateService
				 * @description Unregisters a control that was previously registered. This action should always be performed if the control is destroyed. This function is only required for internal purposes by a control that uses the Custom Translate Service, such as the Custom Translate Control. This function is not actually relevant for using the control.
				 * @param {string} translationKey The translation key of the control.
				 */
				unregister: unregisterControl,
				/**
				 * @ngdoc function
				 * @name update
				 * @function
				 * @methodOf platform:platformCustomTranslateService
				 * @description Triggers a reload of the control's data.
				 * @param {string} translationKey The translation key of the control.
				 */
				update: updateControl,
				/**
				 * @ngdoc function
				 * @name setValue
				 * @function
				 * @methodOf platform:platformCustomTranslateService
				 * @description Changes the current value of the control.
				 * @param {string} translationKey The translation key of the control.
				 * @param {string} value The new value of the control.
				 */
				setValue: setControlValue
			}
		};
	}
})(angular);