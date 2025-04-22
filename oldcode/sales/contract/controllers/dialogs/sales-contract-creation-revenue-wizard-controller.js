/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name salesContractCreationRevenueWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard creation Revenue dialog
	 **/

	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractCreationRevenueWizardController', [
		'_', '$scope', '$modalInstance', '$injector', '$translate', 'platformModalService', 'salesContractCreateRevenueWizardDialogService', 'salesContractCreateWizardDialogUIService', 'basicsLookupdataLookupFilterService', 'basicsCostCodesLookupService',
		function (_, $scope, $modalInstance, $injector, $translate, platformModalService, salesContractCreateRevenueWizardDialogService, salesContractCreateWizardDialogUIService, basicsLookupdataLookupFilterService, basicsCostCodesLookupService) {

			$scope.entity = salesContractCreateRevenueWizardDialogService.getContractSelected();

			$scope.formOptions = {
				configure: salesContractCreateWizardDialogUIService.getRevenueFormConfiguration()
			};

			$scope.modalOptions = {
				headerText: $translate.instant('sales.contract.wizardCWCreateRevenue'),
				ok: ok,
				cancel: close
			};

			$scope.loading = {
				show: false,
				text: $translate.instant('sales.contract.wizardCWCreateRevenueInProgress')
			};

			function ok() {
				$scope.loading.show = true;
				createRevenueFromContract();
			}

			function close() {
				$modalInstance.dismiss('cancel');
			}

			function createRevenueFromContract(){
				salesContractCreateRevenueWizardDialogService.createRevenueFromContract($scope.entity).then(function(response){
					var prjEstimate = response.data;
					if(prjEstimate && prjEstimate.PrjEstimate) {
						var navigator = {moduleName: 'estimate.main'};

						$scope.loading.show = false;

						close();
						$injector.get('platformModuleNavigationService').navigate(navigator, prjEstimate);
						$injector.get('salesCommonUtilsService').toggleSideBarWizard();
					}
					else if(prjEstimate && prjEstimate.ErrorMessage){
						// show error message box
						platformModalService.showErrorBox(prjEstimate.ErrorMessage, 'cloud.common.errorMessage');
						$scope.loading.show = false;
					}
				},
				function () {
					$scope.loading.show = false;
				});
			}

			var revenueCostCodeTypes = [];

			var revenueFilter = [
				{
					key: 'sales-contract-costcode-revenue-filter',
					fn: function (item) {
						// should filter with cost code type(isRevenue)
						return (revenueCostCodeTypes && revenueCostCodeTypes.length>0 && _.includes(revenueCostCodeTypes, item.CostCodeTypeFk) && !item.IsRate);
					}
				},
				{
					key: 'sales-contract-costcode-discount-filter',
					fn: function (item) {
						// should filter IsRate = false
						return (!item.IsRate);
					}
				}
			];

			function init() {
				basicsCostCodesLookupService.loadCostCodeTypeAsync().then(function (costCodeTyps) {
					revenueCostCodeTypes = _.map(_.filter(costCodeTyps.data, {'IsRevenueCc': true}), 'Id');
				});
			}

			init();

			basicsLookupdataLookupFilterService.registerFilter(revenueFilter);

			// disable [OK]-Button?
			$scope.$watchGroup(['entity.EstHeaderFk', 'entity.mdcCostCodeFk', 'entity.disCountCostCodeFk'], function () {
				$scope.isOkDisabled = !$scope.entity.EstHeaderFk || !$scope.entity.mdcCostCodeFk || !$scope.entity.disCountCostCodeFk;
			});

			$scope.$on('$destroy', function () {
				basicsLookupdataLookupFilterService.unregisterFilter(revenueFilter);
			});
		}]);
})();
