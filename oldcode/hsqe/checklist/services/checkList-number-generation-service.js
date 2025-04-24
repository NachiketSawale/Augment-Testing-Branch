/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */

	'use strict';
	var moduleName = 'hsqe.checklist';
	var settingsServiceName = 'checkListNumberGenerationSettingsService';

	/**
	 * @ngdoc service
	 * @name checkListNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * checkListNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	angular.module(moduleName).factory(settingsServiceName, ['checkListNumberGenerationServiceProvider',
		function (checkListNumberGenerationServiceProvider) {
			return checkListNumberGenerationServiceProvider.getInstance(settingsServiceName);
		}]);

	/**
	 * @ngdoc service
	 * @name checkListNumberGenerationServiceProvider
	 * @description provides number generation services for defect modules
	 */
	angular.module(moduleName).factory('checkListNumberGenerationServiceProvider', ['$q', '_', '$translate', 'platformDataServiceFactory',
		function ($q, _, $translate, platformDataServiceFactory) {

			var numberGenerationService = function (serviceName) {
				var numberGenerationSettingInfo = {
					module: angular.module(moduleName),
					serviceName: serviceName,
					entityNameTranslationID: 'basics.clerk.entityNumberGenerationSetting',
					presenter: {list: {}},
					httpRead: {
						route: globals.webApiBaseUrl + 'hsqe/checklist/header/',
						endRead: 'numbergeneration'
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
					return catSettings && catSettings.HasToCreate;
				};

				service.provideNumberDefaultText = function provideNumberDefaultText(rcID, current) {
					var catSettings = _.find(container.data.itemList, {RubricCatID: rcID});
					current = catSettings && catSettings.HasToCreate ? $translate.instant('cloud.common.isGenerated') : '';
					return current;
				};

				service.assertLoaded();

				return service;
			};

			// service api
			return {
				getInstance: function getInstance(serviceName) {
					return numberGenerationService(serviceName);
				}
			};
		}

	]);
})(angular);
