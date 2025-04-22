/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingIndirectsBalancingDetailController
	 * @function
	 *
	 * @description
	 * Controller for the Indirect Costs Balancing.
	 **/
	angular.module(moduleName).controller('salesBillingIndirectsBalancingDetailController',
		['_', '$timeout', '$scope', '$translate', 'platformContainerControllerService', 'salesBillingService', 'salesBillingIndirectBalancingService',
			function (_, $timeout, $scope, $translate, platformContainerControllerService, salesBillingService, salesBillingIndirectBalancingService) {

				platformContainerControllerService.initController($scope, moduleName, '64014298059f4aaaa1f0892cf486aea6', 'salesBillingTranslations');

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [{
						id: 'tCreateICBC',
						sort: 1000,
						caption: 'sales.billing.createIndirectCostsBalancingConfigTooltip',
						type: 'item',
						iconClass: 'tlb-icons ico-new',
						disabled: function () { // TODO: check logic
							var enable = false;
							if (!salesBillingService.getSelected()) {
								enable = false;
							} else if (salesBillingService.getSelected() && $scope.currentItem === null) {
								enable = true;
							}
							return !enable;
						},
						fn: function createIndirectCostsBalancingConfig() {
							salesBillingIndirectBalancingService.showCreateConfigDialog();
						}
					},{
						id: 'd999',
						sort: 999,
						type: 'divider'
					}]
				});

				// TODO:
				function updateTools() {
					$scope.tools.items = _.filter($scope.tools.items,function (d) {
						return d.id==='t108' || d.id ==='gridSearchAll' ||
							d.id ==='gridSearchColumn' || d.id ==='t200'|| d.id ==='t7' ||
							d.id ==='t8'|| d.id ==='t9' || d.id ==='t10';
					});
					$timeout(function () {
						$scope.tools.update();
					});
				}

				updateTools();

				// helper functions
				function updateWhiteboard(selectedBillEntity, config) {
					if (selectedBillEntity === null) {
						$scope.getUiAddOns().getWhiteboard().showInfo($translate.instant('sales.billing.noBillHeaderSelected'));
					} else if (config === null) {
						$scope.getUiAddOns().getWhiteboard().showInfo($translate.instant('sales.billing.noConfigForSelectedBill'));
					} else {
						$scope.getUiAddOns().getWhiteboard().setVisible(false);
					}
				}

				// lifecycle / events
				var billSelectionChanged = function selectionChangeHandler(e, selectedBill) {
					if (_.has(selectedBill, 'Id')) {
						salesBillingIndirectBalancingService.getIndirectCostsBalancingConfigByBill(selectedBill.Id).then(function (response) {
							var currentIndirectsBalConfig = _.isObject(response.data) ? response.data : null;
							salesBillingIndirectBalancingService.setCurrentConfig(currentIndirectsBalConfig);
							salesBillingIndirectBalancingService.resetServiceData();
							$scope.currentItem = currentIndirectsBalConfig;
							updateWhiteboard(selectedBill, currentIndirectsBalConfig);
						});
					} else {
						$scope.currentItem = null;
						updateWhiteboard(null, null);
					}
				};

				billSelectionChanged(null, salesBillingService.getSelected());

				salesBillingService.registerSelectionChanged(billSelectionChanged);


			}]);
})(angular);
