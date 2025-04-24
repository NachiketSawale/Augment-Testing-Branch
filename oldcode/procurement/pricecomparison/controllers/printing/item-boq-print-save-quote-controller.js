/**
 * Created by wed on 11/01/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('procurementPriceComparisonItemBoqPrintSaveQuoteController', [
		'_',
		'$q',
		'$sce',
		'$scope',
		'$modalInstance',
		'$translate',
		'platformObjectHelper',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonPrintCommonService',
		'procurementPriceComparisonPrintSettingService',
		'procurementPriceComparisonBoqHelperService',
		'procurementPriceComparisonItemHelperService',
		'controllerOptions',
		function (_,
			$q,
			$sce,
			$scope,
			$modalInstance,
			$translate,
			platformObjectHelper,
			constants,
			itemService,
			boqService,
			commonService,
			printCommonService,
			settingService,
			boqHelper,
			itemHelper,
			controllerOptions) {

			$scope.trustAsHtml = $sce.trustAsHtml;
			$scope.modalOptions = {
				headerText: $translate.instant('procurement.pricecomparison.printing.saveQuote'),
				saveToOriginalText: $translate.instant('procurement.pricecomparison.printing.saveToOriginalText'),
				saveToNewVersionText: $translate.instant('procurement.pricecomparison.printing.saveToNewVersionText'),
				ignoreSaveText: $translate.instant('procurement.pricecomparison.printing.ignoreSaveText'),
				bodyText: $translate.instant('procurement.pricecomparison.printing.saveQuoteWarning'),
				saveToOriginal: function () {
					saveToQuote(controllerOptions.printType, false);
				},
				saveToNew: function () {
					saveToQuote(controllerOptions.printType, true);
				},
				ignore: function () {
					this.close({ok: true});
				},
				close: function (result) {
					$modalInstance.close(result);
				},
				cancel: function (result) {
					$modalInstance.close(result);
				}
			};

			function saveToQuote(printType, isNewVersion) {
				$scope.isLoading = true;
				var savePromise = null, dataService = null;
				if (printType === constants.printType.item) {
					dataService = itemService;
					savePromise = itemService.saveToQuote(isNewVersion);
				} else {
					dataService = boqService;
					savePromise = boqService.saveToQuote(isNewVersion);
				}
				savePromise.then(function (result) {
					if (isNewVersion) {
						var quoteHeaderNews = result.data.QuoteHeaderNews,
							originalToNews = result.data.OriginalToQuoteHeaderNews;
						// modifiedData = result.modifiedData;
						var type = commonService.constant.compareType.prcItem,
							qtnIds = Object.keys(result.modifiedData) || [];
						commonService.reloadNewVersion(quoteHeaderNews, type, qtnIds, dataService.reloadLatestQuotes).then(function () {
							$scope.isLoading = false;
							$scope.modalOptions.close({
								ok: true,
								isNewVersion: true,
								OriginalToQuoteHeaderNews: originalToNews,
								QuoteHeaderNews: quoteHeaderNews
							});
						});
						return;
					}
					$scope.isLoading = false;
					$scope.modalOptions.close({ok: true});
				});
			}

			$scope.isLoading = false;

		}
	]);
})(angular);