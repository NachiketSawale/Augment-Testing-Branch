/**
 * Created by pel on 10/19/2021.
 */
/* global  */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'documents.project';
	var defectModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectDocumentNumberGenerationServiceProvider
	 * @description provides number generation services for project document modules
	 */
	angular.module(moduleName).factory('projectDocumentNumberGenerationServiceProvider', ['$q', '_', '$translate', 'platformDataServiceFactory',
		function ($q, _, $translate, platformDataServiceFactory) {

			var numberGenerationService = function (serviceName) {
				var numberGenerationSettingInfo = {
					module: defectModule,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.clerk.entityNumberGenerationSetting',
					presenter: {list: {}},
					httpRead: {
						route: globals.webApiBaseUrl + 'documents/numbergeneration/',
						endRead: 'list'
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

					var res = catSettings && catSettings.HasToCreate ? $translate.instant('cloud.common.isGenerated') : '';
					if (!_.isUndefined(current) && current !== null && current !== '' && res === '' && current !== $translate.instant('cloud.common.isGenerated')) {
						res = current;
					}
					return res;
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

