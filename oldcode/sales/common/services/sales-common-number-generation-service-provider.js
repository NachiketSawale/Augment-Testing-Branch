/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonNumberGenerationServiceProvider
	 * @description provides number generation services for common modules
	 */
	angular.module(salesCommonModule).factory('salesCommonNumberGenerationServiceProvider', ['$q', '_', 'globals', '$translate', 'platformDataServiceFactory',
		function ($q, _, globals, $translate, platformDataServiceFactory) {

			var NumberGenerationService = function (salesXModule, submoduleName, serviceName) {
				var numberGenerationSettingInfo = {
					module: salesXModule,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.clerk.entityNumberGenerationSetting',
					presenter: {list: {}},
					httpRead: {route: globals.webApiBaseUrl + 'sales/' + submoduleName + '/numbergeneration/', endRead: 'list'}
				};

				var container = platformDataServiceFactory.createNewComplete(numberGenerationSettingInfo);
				var service = container.service;
				container.data.dataLoaded = false;

				service.assertLoaded = function assertNumberGenerationSettingsLoaded() {
					var defer = $q.defer();
					if (!container.data.dataLoaded) {
						service.load().then(
							function () {
								container.data.dataLoaded = true;
								defer.resolve(true);
							}
						);
						return defer.promise;
					} else {
						return $q.when(true);
					}
				};

				service.hasToGenerateForRubricCategory = function hasToGenerateForRubricCategory(rcID, rubricIndex) {
					rubricIndex = rubricIndex || 0;
					var catSettings = _.find(container.data.itemList, {RubricCatID: rcID, NumberIndex: rubricIndex});
					return catSettings && catSettings.HasToCreate;
				};

				service.provideNumberDefaultText = function provideNumberDefaultText(rcID, current, rubricIndex) {
					rubricIndex = rubricIndex || 0;
					var res = current;
					var catSettings = _.find(container.data.itemList, {RubricCatID: rcID, NumberIndex: rubricIndex});

					res = catSettings && catSettings.HasToCreate ? $translate.instant('sales.common.isGenerated') : '';
					return res;
				};

				service.assertLoaded();

				return service;
			};

			// service api
			return {
				getInstance: function getInstance(salesXModule, submoduleName, serviceName) {
					return new NumberGenerationService(salesXModule, submoduleName, serviceName);
				}
			};
		}

	]);

})();
