(function(angular){

	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonItemInfoBlSpecificationController', procurementCommonItemInfoBlSpecificationController);

	procurementCommonItemInfoBlSpecificationController.$inject = ['$scope', '$sce', 'procurementContextService', 'procurementCommonPrcItemDataService',
		'procurementCommonItemInfoBlDataService'];

	function procurementCommonItemInfoBlSpecificationController($scope, $sce, procurementContextService, procurementCommonPrcItemDataService,
		procurementCommonItemInfoBlDataService){

		var mainService = procurementContextService.getMainService();
		var prcItemDataService = procurementCommonPrcItemDataService.getService(mainService);

		var parentDataService = procurementCommonItemInfoBlDataService.getService(prcItemDataService);

		$scope.trustAsHtml = $sce.trustAsHtml;

		// region directive parameter
		$scope.specificationPlain = {
			Content: null,
			Id: 0,
			Version: 0
		};
		$scope.addTextComplement = null;
		$scope.selectTextComplement = null;
		$scope.readonly = true;
		$scope.editorOptions = {
			cursorPos: {
				get: null,
				set: null
			}
		};
		// endregion

		var toolbarItems = [
			{
				id: 't7',
				caption: 'boq.main.addTextComplementClient',
				type: 'item',
				iconClass: 'tlb-icons ico-wildcard-1',
				fn: function() {

				},
				disabled: function() {
					return $scope.readonly; // || !canEditContent(); --> need to watch cursor pos!
				}
			}
		];

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: toolbarItems
		});

		$scope.onTextChanged = function () {
			//
		};

		initial();

		function initial(){
			loadData();
		}

		var onItemSelectionChanged = function () {
			loadData();
		};

		parentDataService.registerSelectionChanged(onItemSelectionChanged);

		function loadData(){
			parentDataService.getItemInfoBlSpecification().then(function(response){
				$scope.specificationPlain = angular.copy(response);
			});
		}
		// unregister boq service messenger
		$scope.$on('$destroy', function () {
			parentDataService.unregisterSelectionChanged(onItemSelectionChanged);
		});
	}

})(angular);