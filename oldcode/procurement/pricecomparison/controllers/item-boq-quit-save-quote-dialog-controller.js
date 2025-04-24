/**
 * Created by miu on 09/26/2022.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('procurementPriceComparisonItemBoqQuitSaveQuoteController', [
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
			controllerOptions) {

			$scope.trustAsHtml = $sce.trustAsHtml;
			$scope.modalOptions = {
				headerText: $translate.instant('procurement.pricecomparison.quit.saveQuote'),
				saveToOriginalText: $translate.instant('procurement.pricecomparison.quit.saveToOriginalText'),
				saveToNewVersionText: $translate.instant('procurement.pricecomparison.quit.saveToNewVersionText'),
				ignoreSaveText: $translate.instant('procurement.pricecomparison.quit.ignoreSaveText'),
				bodyText: $translate.instant('procurement.pricecomparison.quit.saveQuoteWarning'),
				saveToOriginal: function () {
					saveToQuote(false);
				},
				saveToNew: function () {
					saveToQuote(true);
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

			function saveToQuote(isNewVersion) {
				$scope.isLoading = true;
				let modifyType = controllerOptions.modifyType;

				switch (modifyType){
					case 1: {
						itemService.saveToQuote(isNewVersion).then(function (result) {
							$scope.isLoading = false;
							$scope.modalOptions.close({ok: result.status, isSaved: {isNewVersion: isNewVersion}});
						});
						break;
					}
					case 2: {
						boqService.saveToQuote(isNewVersion).then(function (result) {
							$scope.isLoading = false;
							$scope.modalOptions.close({ok: result.status, isSaved: {isNewVersion: isNewVersion}});
						});
						break;
					}
					case 3: {
						itemService.saveToQuote(isNewVersion).then(function () {
							boqService.saveToQuote(isNewVersion).then(function (result) {
								$scope.isLoading = false;
								$scope.modalOptions.close({ok: result.status, isSaved: {isNewVersion: isNewVersion}});
							});
						});
						break;
					}
				}

				/* let savePromises = [];
				if (modifyType === 1 || modifyType === 3) {
					savePromises.push(itemService.saveToQuote(isNewVersion));
				}
				if (modifyType === 2 || modifyType === 3) {
					savePromises.push(boqService.saveToQuote(isNewVersion));
				}
				if (savePromises.length > 0) {
					$q.all(savePromises).then(function (result) {
						$scope.isLoading = false;
						$scope.modalOptions.close({ok: true, isSaved: {isNewVersion: isNewVersion}});
					});
				} */
			}

			$scope.isLoading = false;

		}
	]);
})(angular);