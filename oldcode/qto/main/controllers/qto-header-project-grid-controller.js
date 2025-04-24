(function (angular){
	'use strict';

	let moduleName='qto.main';

	angular.module(moduleName).controller('qtoMainHeaderProjectGridController',
		['_', '$scope', '$injector', 'platformGridControllerService', 'qtoMainHeaderProjectUIStandardService', 'qtoMainHeaderProjectDataService',
			'qtoMainHeaderValidationService', 'platformGridControllerService','$translate','platformModuleNavigationService',
			function (_, $scope, $injector, gridControllerService, gridColumns, qtoMainHeaderDataService, 
				validationService, platformGridControllerService,$translate, naviService) {

				let gridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function (arg) {
						let currentItem = arg.item;
						let colId = arg.grid.getColumns()[arg.cell].id;
						if(colId === 'nodecimals'){
							if(currentItem.NoDecimals === '' || currentItem.NoDecimals === 0){
								currentItem.NoDecimals = 3;
							}
						}else if(colId === 'qtotypefk'){
							qtoMainHeaderDataService.getGoniometer(arg.item);
						}
					}
				};

				gridControllerService.initListController($scope, gridColumns, qtoMainHeaderDataService, validationService, gridConfig);

				platformGridControllerService.addTools([{
					id: 't15',
					caption: $translate.instant('sales.bid.goToSalesBid'),
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function openSalesBid() {
						// Go to sales bid module
						let navigator = {moduleName: moduleName},
							selectedItem = qtoMainHeaderDataService.getSelected();

						if (qtoMainHeaderDataService.isSelection(selectedItem)) {
							naviService.navigate(navigator, selectedItem);
						}
					},
					disabled: function () {
						return _.isEmpty(qtoMainHeaderDataService.getSelected());
					}
				}, {
					id: 't16',
					caption: $translate.instant('qto.main.filterVersionQto'),
					type: 'check',
					value: qtoMainHeaderDataService.getFilterVersion(),
					iconClass: 'tlb-icons ico-filter-current-version',
					fn: function () {
						qtoMainHeaderDataService.setFilterVersion(this.value);
						qtoMainHeaderDataService.load();
					}
				}]);


				$scope.$on('$destroy', function () {

				});
			}]);
})(angular);