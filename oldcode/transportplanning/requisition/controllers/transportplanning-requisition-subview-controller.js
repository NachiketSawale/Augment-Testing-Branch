(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).controller('transportplanningRequisitionSubviewController', SubviewController);
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
		'ppsCommonNotifyUpdatingService',
		'productionplanningItemReassignedProductDataService'];

	function SubviewController($http,
		$injector,
		$scope,
		$timeout,
		basicsLookupdataLookupDescriptorService,
		platformGridAPI,
		platformSourceWindowControllerService,
		platformContainerControllerService,
		buttonService,
		ppsCommonNotifyUpdatingService,
		productionplanningItemReassignedProductDataService) {
		var containerUuid = $scope.getContainerUUID();
		var containerInfoService = platformContainerControllerService.getModuleInformationService(moduleName);
		var containerInfo = containerInfoService.getContainerInfoByGuid(containerUuid);
		var dataService = containerInfo.dataServiceName;
		let isTree = containerInfo.isTree;

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
			'transportplanningRequisitionContainerInformationService', isTree ? 'transportplanningRequisitionContainerFilterForTreeService' : 'transportplanningRequisitionContainerFilterForListService', {
				afterInitSubController: function ($scope) {
					// init extra buttons
					buttonService.addToolsUpdateOnSelectionChange($scope, dataService);
					buttonService.extendAssignButtons($scope, dataService);
					buttonService.extendCreateTrsReqButton($scope, dataService);
					buttonService.extendDocumentButtons($scope, dataService);
					buttonService.extendFilterButtons($scope, dataService);// remark: extend filter buttons for extra features(e.g. loading all bundle records when records can be retrieved is more than 100)
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
			let parentSelected = platformGridAPI.grids.element('id','67f457b1928342c4a65cee89c48693d0').instance.getSelectedRows();
			if(parentSelected.length < 1){
				$scope.entity.drawingId = null;
				$scope.entity.jobId = null;
				$scope.entity.jobIdFromHistory = null;
				$scope.entity.projectId = null;
				$scope.entity.puId = null;
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
