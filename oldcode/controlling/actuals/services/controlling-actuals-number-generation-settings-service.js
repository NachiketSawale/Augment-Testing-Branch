/**
 * Created by lvy on 3/18/2021.
 */

(function () {
	/* global _,globals */
	'use strict';

	var moduleName = 'controlling.actuals';
	var basicsMaterialModule = angular.module(moduleName);
	var serviceName = 'actualsNumberGenerationSettingsService';

	/**
	 * @ngdoc service
	 * @name actualsNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * actualsNumberGenerationSettingsService is the data service for number genereation related functionality.
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
						route: globals.webApiBaseUrl + 'controlling/actuals/numbergeneration/',
						endRead: 'list'
					}
				};

				let container = platformDataServiceFactory.createNewComplete(numberGenerationSettingInfo);
				let service = container.service;

				service.actualsRubricCategoryID = 447;
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

				service.hasToGenerateForRubricCategory = function hasToGenerateForRubricCategory() {
					var catSettings = _.find(container.data.itemList, {RubricCatID: service.actualsRubricCategoryID});
					return catSettings && catSettings.HasToCreate;
				};

				service.provideNumberDefaultText = function provideNumberDefaultText(current) {
					var res = current;
					var catSettings = _.find(container.data.itemList, {RubricCatID: service.actualsRubricCategoryID});

					res = catSettings && catSettings.HasToCreate ? $translate.instant('cloud.common.isGenerated') : '';
					return res;
				};

				service.assertLoaded();

				return service;
			}

			return numberGenerationService();
		}]);
})();