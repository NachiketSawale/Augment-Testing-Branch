
(function (angular) {
	'use strict';
	var moduleName = 'procurement.orderproposals';
	angular.module(moduleName).controller('OrderProposalsCreateContractRequisitionSuccessController', [
		'$scope', '_', '$translate', 'platformModuleNavigationService', 'procurementOrderProposalsDataService',
		function orderProposalsCreateContractRequisitionSuccess($scope, _, $translate, platformModuleNavigationService, procurementOrderProposalsDataService) {

			$scope.onOK = function onOK() {
				procurementOrderProposalsDataService.callRefresh();
				$scope.$close(false);
			};
			$scope.dialog = {
				modalOptions: {
					topDescription: {
						iconClass: 'tlb-icons ico-info',
						text: $translate.instant('procurement.stock.wizard.createByOrderProposal.success',{
							createType: $scope.modalOptions.headerText
						}) + ' (' + $scope.modalOptions.itemList.codes + ')'
					}
				}
			};
			$scope.modalOptions.gotoType = $translate.instant('procurement.stock.wizard.createByOrderProposal.goto',{goto: $scope.modalOptions.item});
			
			$scope.goToModule = function goToModule() {
				var ids = $scope.modalOptions.itemList.ids;
				ids = _.isArray(ids) ? ids : [ids];
				if (ids.length > 0) {
					procurementOrderProposalsDataService.callRefresh();
					$scope.$close(false);
					var navigator = {
						moduleName: $scope.modalOptions.moduleName,
						registerService: $scope.modalOptions.registerService
					};
					platformModuleNavigationService.navigate(navigator, ids);
				}
			};
		}
	]);
})(angular);