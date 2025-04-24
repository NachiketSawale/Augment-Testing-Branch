/**
 * Created by pel on 2/18/2020.
 */
/* global  */
(function (angular) {
	/* global globals,  */
	'use strict';

	var moduleName = 'defect.main';
	var defectModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name defectNumberGenerationServiceProvider
     * @description provides number generation services for defect modules
     */
	angular.module(moduleName).factory('defectNumberGenerationServiceProvider', ['$q', '_', '$translate', 'platformDataServiceFactory',
		function ($q, _, $translate, platformDataServiceFactory) {

			var numberGenerationService = function (serviceName) {
				var numberGenerationSettingInfo = {
					module: defectModule,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.clerk.entityNumberGenerationSetting',
					presenter: {list: {}},
					httpRead: {
						route: globals.webApiBaseUrl + 'defect/main/numbergeneration/',
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
					if(!_.isUndefined(current) && current !== null && current !== '' && res === '' && current !== $translate.instant('cloud.common.isGenerated')) {
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

