(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('reportSettingTranslationService', ['$translate', '_',
		function ($translate, _) {

			var service = {};
			var reportSettingData = [
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.package'),
					Code: 'Package'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.packageStructure'),
					Code: 'PackageStructure'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.requisition'),
					Code: 'Requisition'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.firstName'),
					Code: 'FirstName'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.lastName'),
					Code: 'LastName'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.clerk'),
					Code: 'Clerk'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.department'),
					Code: 'Department'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.project'),
					Code: 'Project'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.rfq'),
					Code: 'RFQ'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.company'),
					Code: 'Company'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.page'),
					Code: 'Page'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.pages'),
					Code: 'Pages'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.date'),
					Code: 'Date'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.time'),
					Code: 'Time'
				},
				{
					Translated: $translate.instant('procurement.pricecomparison.printing.picture'),
					Code: 'Picture'
				}
			];


			/***
			 * for translation
			 * @param formatString => the total string
			 * @param fromTranslation => true, translation change to standard string
			 *          fromTranslation => false, standard change to translation string
			 * @returns {*}
			 */
			service.transform = function codeTranslationTransform(formatString, fromTranslation) {
				_.forEach(reportSettingData, function (item) {
					var code = new RegExp(item.Code, 'g');
					var translated = new RegExp(item.Translated, 'g');
					var first = !fromTranslation ? code : translated;
					var second = !fromTranslation ? item.Translated : item.Code;

					formatString = _.replace(formatString, first, second);
				});
				return formatString;
			};

			return service;
		}]);
})(angular);