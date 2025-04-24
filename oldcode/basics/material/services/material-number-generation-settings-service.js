/**
 * Created by lvy on 8/7/2020.
 */

(function () {
	/*global _,globals*/
	'use strict';

	var moduleName = 'basics.material';
	var basicsMaterialModule = angular.module(moduleName);
	var serviceName = 'materialNumberGenerationSettingsService';

	/**
	 * @ngdoc service
	 * @name materialNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * materialNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	angular.module(moduleName).factory(serviceName, [
		'$q',
		'$translate',
		'platformDataServiceFactory',
		function (
			$q,
			$translate,
			platformDataServiceFactory
		) {
			function numberGenerationService() {
				var numberGenerationSettingInfo = {
					module: basicsMaterialModule,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.clerk.entityNumberGenerationSetting',
					presenter: {list: {}},
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/material/numbergeneration/',
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
					var res = current;
					var catSettings = _.find(container.data.itemList, {RubricCatID: rcID});

					res = catSettings && catSettings.HasToCreate ? $translate.instant('cloud.common.isGenerated') : '';
					return res;
				};

				service.assertLoaded();

				return service;
			}

			return numberGenerationService();
		}]);
})();