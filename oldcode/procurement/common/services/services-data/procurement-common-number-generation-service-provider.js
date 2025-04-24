/**
 * Created by pel on 12/21/2018.
 */

(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	'use strict';

	var procurementCommonModule = 'procurement.common';

	/**
	 * @ngdoc service
	 * @name procurementCommonNumberGenerationServiceProvider
	 * @description provides number generation services for common modules
	 */
	angular.module(procurementCommonModule).factory('procurementCommonNumberGenerationServiceProvider', ['$q', '_', '$translate', 'platformDataServiceFactory',
		function ($q, _, $translate, platformDataServiceFactory) {

			var numberGenerationService = function (procurementXModule, submoduleName, serviceName) {
				var numberGenerationSettingInfo = {
					module: procurementXModule,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.clerk.entityNumberGenerationSetting',
					presenter: {list: {}},
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/' + submoduleName + '/numbergeneration/',
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

				service.hasToGenerateForRubricCategory = function hasToGenerateForRubricCategory(rcID, rubricIndex) {
					var catSettings;
					if(rubricIndex !== null && rubricIndex !== undefined){
						catSettings = _.find(container.data.itemList, {RubricCatID: rcID, NumberIndex: rubricIndex});
					}else{
						catSettings = _.find(container.data.itemList, {RubricCatID: rcID});
					}
					return catSettings && catSettings.HasToCreate;
				};

				service.provideNumberDefaultText = function provideNumberDefaultText(rcID, current, rubricIndex) {
					var res = current;
					var catSettings;
					if(rubricIndex !== null && rubricIndex !== undefined){
						catSettings = _.find(container.data.itemList, {RubricCatID: rcID, NumberIndex: rubricIndex});
					}else{
						catSettings = _.find(container.data.itemList, {RubricCatID: rcID});
					}
					res = catSettings && catSettings.HasToCreate ? $translate.instant('cloud.common.isGenerated') : '';
					return res;
				};

				service.assertLoaded();

				return service;
			};

			// service api
			return {
				getInstance: function getInstance(procurementXModule, submoduleName, serviceName) {
					return numberGenerationService(procurementXModule, submoduleName, serviceName);
				}
			};
		}

	]);

})(angular);
