(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('productionplanningItemProductSubviewController', SubviewController);
	SubviewController.$inject = [
		'$http',
		'$injector',
		'$scope',
		'$timeout',
		'basicsLookupdataLookupDescriptorService',
		'platformGridAPI',
		'platformSourceWindowControllerService',
		'platformContainerControllerService',
		'transportplanningRequisitionToBeAssignedButtonService',
		'basicsCommonToolbarExtensionService',
	'productionplanningItemJobBundleDataService'];

	function SubviewController($http,
		$injector,
		$scope,
		$timeout,
		basicsLookupdataLookupDescriptorService,
		platformGridAPI,
		platformSourceWindowControllerService,
		platformContainerControllerService,
		buttonService,
		basicsCommonToolbarExtensionService,
		productionplanningItemJobBundleDataService) {
		var containerUuid = $scope.getContainerUUID();
		var containerInfoService = platformContainerControllerService.getModuleInformationService(moduleName);
		var containerInfo = containerInfoService.getContainerInfoByGuid(containerUuid);
		var dataService = containerInfo.dataServiceName;

		function onParentServiceSelectionChanged() {
			dataService.doSetFilter(dataService);
		}
		function onParentItemProjectFkChanged(entity) {
			dataService.doSetFilter(dataService);
		}

		// get filterFields from the module-container.json file. filterFields of dataService will be used for setting default filter.
		dataService.filterFields = $scope.getContentValue('filter');

		dataService.parentService().registerSelectionChanged(onParentServiceSelectionChanged);

		// register handler to set filter of unassigned-bundles container when field ProjectFk of parentItem is changed(HP-ALM #115338).
		if (angular.isFunction(dataService.parentService().registerProjectFkChanged)) {
			dataService.parentService().registerProjectFkChanged(onParentItemProjectFkChanged);
		}

		platformSourceWindowControllerService.initSourceFilterController($scope, containerUuid,
			'productionplanningItemContainerInformationService', 'productionplanningItemProductContainerFilterService', {
				afterInitSubController: function ($scope) {
					// init extra buttons
					buttonService.addToolsUpdateOnSelectionChange($scope, dataService);
					buttonService.extendFilterButtons($scope, dataService);// remark: extend filter buttons for extra features(e.g. loading all bundle records when records can be retrieved is more than 100)
					basicsCommonToolbarExtensionService.insertBefore($scope, {
						id: 'assign',
						caption: 'productionplanning.common.assignProduct',
						type: 'item',
						sort: -1001,
						iconClass: 'tlb-icons ico-assign-bundle',
						fn: function () {
							dataService.assignByButton();
						},
						disabled: function () {
							const selectedArray = dataService.getSelectedEntities();
							return selectedArray.length === 0;
						}
					});
					// recover filter when reopen the unassigned-bundles container.
					dataService.recoverFilter();
				}
			});
		$scope.entity.inputOpen = true;
		$scope.$watch('entity.inputOpen',function (newVal) {
			if(newVal === false){
				$timeout(function(){
					platformGridAPI.grids.resize(containerUuid); // just for resize the bundle grid when the filter panel is collapsed
					// console.log($scope.entity.inputOpen);
				}, 400);
			}
			let parentSelected = dataService.parentService().getSelectedEntities();
			if(parentSelected.length < 1){
				$scope.entity.drawingId = null;
				$scope.entity.jobId = null;
				$scope.entity.projectId = null;
			}
		});

		// un-register on destroy
		$scope.$on('$destroy', function () {
			dataService.parentService().unregisterSelectionChanged(onParentServiceSelectionChanged);
			if (angular.isFunction(dataService.parentService().unregisterProjectFkChanged)) {
				dataService.parentService().unregisterProjectFkChanged(onParentItemProjectFkChanged);
			}
		});
	}
})(angular);
