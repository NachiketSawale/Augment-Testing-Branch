/**
 * Created by lsi on 1/12/2021.
 */

(function () {
	/* global _,globals */
	'use strict';
	var moduleName = 'businesspartner.main';
	var basicsMaterialModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name businesspartnerNumberGenerationSettingsService
	 * @function
	 * @description
	 * businesspartnerNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	angular.module(moduleName).factory('businesspartnerNumberGenerationSettingsService', [
		'$q',
		'$translate',
		'platformDataServiceFactory',
		function (
			$q,
			$translate,
			platformDataServiceFactory
		) {
			function numberGenerationService(entityName, serviceName) {
				var numberGenerationSettingInfo = {
					module: basicsMaterialModule,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.clerk.entityNumberGenerationSetting',
					presenter: {list: {}},
					httpRead: {
						route: globals.webApiBaseUrl + 'businesspartner/main/' + entityName + '/',
						endRead: 'numberlist'
					}
				};
				var container = platformDataServiceFactory.createNewComplete(numberGenerationSettingInfo);
				var service = container.service;
				container.data.dataLoaded = false;
				service.assertLoaded = function assertNumberGenerationSettingsLoaded() {
					var defer = $q.defer();
					service.load().then(
						function () {
							container.data.dataLoaded = true;
							defer.resolve(true);
						}
					);
					return defer.promise;
				};
				service.hasToGenerateForRubricCategory = function hasToGenerateForRubricCategory(rcID) {
					var catSettings = _.find(container.data.itemList, {RubricCatID: rcID});
					return catSettings && catSettings.CanCreate && catSettings.HasToCreate;
				};
				service.assertLoaded();
				return service;
			}

			return {
				getInstance: function getInstance(entityName, serviceName) {
					return numberGenerationService(entityName, serviceName);
				}
			};
		}]);
})();