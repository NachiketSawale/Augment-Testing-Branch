(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc controller
	 * @name createContractSuccessController
	 * @requires $scope
	 * @description
	 * */
	angular.module(moduleName).controller('createContractSuccessController', [
		'$scope',
		'$translate',
		'platformModuleNavigationService',
		function ($scope,
			$translate,
			platformModuleNavigationService) {

			$scope.onOK = function () {
				$scope.$close(false);
			};
			let codes=[];
			_.map($scope.modalOptions.itemList, function (item) {
				codes.push(item.Code);
			});
			$scope.dialog = {
				modalOptions: {
					topDescription: {
						iconClass: 'tlb-icons ico-info',
						text: $translate.instant('procurement.pricecomparison.wizard.create.contract.successfully')+'<br/>'+ $translate.instant('procurement.pricecomparison.wizard.create.contract.newCode',{newCode:codes.join(', ')})
					}
				}
			};
			$scope.goToContract = function () {
				var ids = _.map($scope.modalOptions.itemList, function (item) {
					return item.Id;
				});
				if (ids.length > 0) {
					$scope.$close(false);
					var navigator = {
						moduleName: 'procurement.contract',
						registerService: 'procurementContractHeaderDataService'
					};
					platformModuleNavigationService.navigate(navigator, ids);
				}
			};
		}
	]);
})(angular);
