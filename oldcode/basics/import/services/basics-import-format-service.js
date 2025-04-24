/**
 * Created by reimer on 06.02.2019
 */

(function () {

	'use strict';

	var moduleName = 'basics.import';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsImportFormatService', ['$translate', 'platformTranslateService',
		function ($translate, platformTranslateService) {
			var service = {};
			var validExcelProfileContexts;

			var allExcelProfileContexts = [];
			// ensure that the translation is loaded
			platformTranslateService.registerModule('basics.export', true).then(function () {
				allExcelProfileContexts = [
					{
						Id: 3,
						Code: 'General',
						Description: $translate.instant('basics.export.excelProfileContextFree')
					},
					{
						Id: 4,
						Code: 'BoqBidder',
						Description: $translate.instant('basics.export.excelProfileContextBidder')
					},
					{
						Id: 5,
						Code: 'BoqPlanner',
						Description: $translate.instant('basics.export.excelProfileContextPlanner')
					},
					{
						Id: 6,
						Code: 'MatBidder',
						Description: $translate.instant('basics.export.excelProfileContextMaterial')
					},
					{
						Id: 7,
						Code: 'BoqPes',
						Description: $translate.instant('basics.export.excelProfileContextPes')
					}
				];
			});

			service.addValidExcelProfileContexts = function (validExcelProfileContextsParam) {
				validExcelProfileContexts = ['General'];
				if (validExcelProfileContextsParam) {
					validExcelProfileContexts = validExcelProfileContexts.concat(validExcelProfileContextsParam);
				}
			};

			service.getList = function () {
				return _.filter(allExcelProfileContexts, function (epc) {
					return validExcelProfileContexts.includes(epc.Code);
				});
			};

			service.isFixedRibFormat = function (id) {
				return id !== 3;
			};

			return service;
		}
	]);
})(angular);
