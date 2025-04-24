/**
 * Created by chi on 10/21/2018.
 */
(function(angular){
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementPriceComparisonOtherQuoteItemDialogController', procurementPriceComparisonOtherQuoteItemDialogController);

	procurementPriceComparisonOtherQuoteItemDialogController.$inject = ['$scope', 'basicsCommonDialogGridControllerService',
		'procurementPriceComparisonOtherQuoteItemDialogUIService', 'procurementPriceComparisonOtherQuoteItemDialogDataService',
		'platformGridAPI'];

	function procurementPriceComparisonOtherQuoteItemDialogController($scope, basicsCommonDialogGridControllerService,
		procurementPriceComparisonOtherQuoteItemDialogUIService, procurementPriceComparisonOtherQuoteItemDialogDataService,
		platformGridAPI){
		var gridConfig = {
			initCalled: false,
			columns: [],
			uuid: '6a97042cffd242c385d0fdc468a987fc',
			grouping: false
		};
		var entityType = $scope.modalOptions.entityType;
		var dataService = procurementPriceComparisonOtherQuoteItemDialogDataService.getService(entityType);
		var uiService = procurementPriceComparisonOtherQuoteItemDialogUIService.getService(entityType);

		basicsCommonDialogGridControllerService.initListController($scope, uiService, dataService, {}, gridConfig);

		$scope.modalOptions.ok = ok;
		$scope.modalOptions.cancel = cancel;

		var toolbarItems = [
			{
				id: 'setting',
				caption$tr$: 'cloud.common.gridlayout',
				type: 'item',
				iconClass: 'tlb-icons ico-settings',
				fn: function () {
					platformGridAPI.configuration.openConfigDialog($scope.gridId);
				}
			}
		];

		$scope.modalOptions.setTools = function (tools) {
			if (!$scope.modalOptions){
				return;
			}
			$scope.modalOptions.tools = tools;

			if (!angular.isFunction(tools.update)){
				$scope.modalOptions.tools.update = function () {};
			}
		};

		$scope.modalOptions.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: toolbarItems,
			update : function () {}
		});

		$scope.$on('$destroy', function(){
			dataService.clear();
		});

		dataService.loadByFilter($scope.modalOptions.filterParams);

		// ///////////
		function ok(){
			var selected = dataService.getSelected();
			dataService.clear();
			close({value: selected});
		}

		function cancel(){
			dataService.clear();
			close();
		}
        
		function close(result){
			if ($scope.$close) {
				$scope.$close(result);
			}
		}
	}
})(angular);