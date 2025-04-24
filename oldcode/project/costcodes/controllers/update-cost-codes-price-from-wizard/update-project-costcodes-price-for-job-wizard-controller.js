/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/**
	 * @ngdoc controller
	 * @function
	 * @description
	 **/
	let moduleName = 'project.costcodes';
	angular.module(moduleName).controller('projectCostcodesPriceForJobWizardController',
		['$scope',
			'_',
			'$translate',
			'$injector',
			'platformGridAPI',
			'platformModalService',
			'platformTranslateService',
			'projectMainService',
			'projectMainUpdatePricesWizardCommonService',
			'projectCostCodesPriceListForJobDataService',
			'basicsLookupdataLookupDescriptorService',
			function ($scope,
				_,
				$translate,
				$injector,
				platformGridAPI,
				platformModalService,
				platformTranslateService,
				projectMainService,
				projectMainUpdatePricesWizardCommonService,
				dataService,
				basicsLookupdataLookupDescriptorService) {

				$scope.ok = function () {
					let selectPrj = projectMainUpdatePricesWizardCommonService.getProject();
					let usingInSummary = projectMainUpdatePricesWizardCommonService.isUsingInEstimateResourceSummary();
					let showSuccess = function showSuccess() {
						platformModalService.showMsgBox($translate.instant('project.main.updateCostCodesPricesSuccess'),
							$translate.instant('project.main.updateCostCodesPricesTitle'),
							'ico-info').then(function (response) {
							if (response.ok === true) {
								projectMainService.deselect();
								projectMainService.load().then(function () {
									projectMainService.setSelected(selectPrj);
									let gridId = '713B7D2A532B43948197621BA89AD67A';
									platformGridAPI.rows.scrollIntoViewByItem(gridId, selectPrj);
								});
							}
						});
						$scope.modalOptions.ok();
					};

					let showFailed = function showFailed() {
						platformModalService.showMsgBox($translate.instant('project.main.updateCostCodesPricesFailed'), $translate.instant('project.main.updateCostCodesPricesTitle'), 'ico-info');
					};

					dataService.updatePrice().then(function (result) {
						if (result === true) {
							if (!usingInSummary) {
								showSuccess();
							} else if (usingInSummary) {
								projectMainUpdatePricesWizardCommonService.onResultGridDataSet.fire();
								$scope.modalOptions.ok();
							}
						} else {
							showFailed();
						}
					});
				};

				$scope.updateAllWithBase = function updateAllWithBase(){
					dataService.setAllBaseSelected();
				};

				function init() {
					basicsLookupdataLookupDescriptorService.updateData('costcodepriceversion', dataService.additionalPriceVersions);
				}
				init();

				// remove the loading icon after concurrency exception
				function closePopWindow(){
					$scope.$close({ok: true});
				}

				$injector.get('platformConcurrencyExceptionHandler').registerConcurrencyExceptionHandler(closePopWindow);

				$scope.$on('$destroy', function () {
					$injector.get('platformConcurrencyExceptionHandler').unregisterConcurrencyExceptionHandler(closePopWindow);
				});
			}
		]);
})();
