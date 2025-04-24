/**
 * Created by waz on 8/16/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).controller('transportplanningBundleSubviewController', SubviewController);
	SubviewController.$inject = [
		'$http',
		'$injector',
		'$scope',
		'$timeout',
		'basicsLookupdataLookupDescriptorService',
		'platformGridAPI',
		'platformSourceWindowControllerService',
		'platformContainerControllerService',
		'transportplanningBundleButtonService',
		'ppsCommonNotifyUpdatingService',
		'productionplanningItemReassignedProductDataService',
		'basicsCommonToolbarExtensionService'];

	function SubviewController(
		$http,
		$injector,
		$scope,
		$timeout,
		basicsLookupdataLookupDescriptorService,
		platformGridAPI,
		platformSourceWindowControllerService,
		platformContainerControllerService,
		buttonService,
		ppsCommonNotifyUpdatingService,
		productionplanningItemReassignedProductDataService,
		basicsCommonToolbarExtensionService) {

		var containerUuid = $scope.getContainerUUID();
		var containerInfoService = platformContainerControllerService.getModuleInformationService(moduleName);
		var containerInfo = containerInfoService.getContainerInfoByGuid(containerUuid);
		var containerType = $scope.getContentValue('containerType');
		var dataService = $injector.get(containerInfo.dataServiceName);
		var showMoveToRoot = $scope.getContentValue('showMoveToRoot');

		function onParentServiceSelectionChanged() {
			dataService.doSetFilter(dataService);
		}

		function onParentItemProjectFkChanged(entity) {
			dataService.doSetFilter(dataService);
		}

		switch (containerType) {
			case 'List':
				platformContainerControllerService.initController($scope, moduleName, containerUuid);
				if ($scope.getContentValue('isDocumentReadOnly') === true) {
					dataService.isDocumentReadOnly = true;
				}
				buttonService.extendDocumentButtons($scope, dataService);
				buttonService.addToolsUpdateOnSelectionChange($scope, dataService);
				if (showMoveToRoot === true) {
					buttonService.extendMoveToRootButton($scope, dataService);
					// disable button when saving
					var updateToolbarBtnFn = function () {
						if ($scope.tools) {
							$scope.tools.update();
						}
					};
					ppsCommonNotifyUpdatingService.registerUpdating(updateToolbarBtnFn);
					ppsCommonNotifyUpdatingService.registerUpdateDone(updateToolbarBtnFn);
					$scope.$on('$destroy', function () {
						ppsCommonNotifyUpdatingService.unregisterUpdating(updateToolbarBtnFn);
						ppsCommonNotifyUpdatingService.unregisterUpdateDone(updateToolbarBtnFn);
					});
				}
				if ($scope.getContentValue('canDrop') === true) {
					let origDrop = $scope.ddTarget.drop;
					$scope.ddTarget.drop = function (info) {
						if (info.draggedData && info.draggedData.sourceGrid) { // code that determines whether the dragged data can be handled
							// handle dragged data
							productionplanningItemReassignedProductDataService.moveToSelected();
						} else {
							origDrop.call($scope.ddTarget, info);
						}
					};
				}

				if(dataService.getServiceName() === 'productionplanningItemJobBundleDataService'){
					dataService.doUpdateToolbar = (isAnyData) =>{
						const selected = dataService.getSelected();
						selected.IsLinkedToProducts = isAnyData;
						if($scope.tools){
							const deleteBtn = $scope.tools.items.find(e => e.id === 'delete');
							if(deleteBtn && !_.isFunction(deleteBtn.disabled)){
								deleteBtn.disabled = () => {
									return !dataService.canDelete();
								}
							}
							$scope.tools.update();
						}
					}
				}

				break;
			case 'Detail':
				platformContainerControllerService.initController($scope, moduleName, containerUuid);
				break;
			case 'Reference':
				platformContainerControllerService.initController($scope, moduleName, containerUuid);
				buttonService.extendDocumentButtons($scope, dataService);
				buttonService.extendReferenceButtons($scope, dataService);
				break;
			case 'Unassigned':
				// get filterFields from the module-container.json file. filterFields of dataService will be used for setting default filter.
				dataService.filterFields = $scope.getContentValue('filter');

				dataService.parentService().registerSelectionChanged(onParentServiceSelectionChanged);

				// register handler to set filter of unassigned-bundles container when field ProjectFk of parentItem is changed(HP-ALM #115338).
				if (angular.isFunction(dataService.parentService().registerProjectFkChanged)) {
					dataService.parentService().registerProjectFkChanged(onParentItemProjectFkChanged);
				}

				platformSourceWindowControllerService.initSourceFilterController($scope, containerUuid,
					'transportplanningBundleContainerInformationService', 'transportplanningBundleContainerFilterService', {
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

				// set Opening of accordion, $scope.entity.inputOpen is referenced in template "transportplanning.bundle/partials/source-list.html"
				$scope.entity.inputOpen = true;
				$scope.$watch('entity.inputOpen', function (newVal) {
					if (newVal === false) {
						$timeout(function () {
							platformGridAPI.grids.resize(containerUuid); // just for resize the bundle grid when the filter panel is collapsed
							// console.log($scope.entity.inputOpen);
						}, 400);
					}
					let parentSelected = platformGridAPI.grids.element('id','67f457b1928342c4a65cee89c48693d0').instance.getSelectedRows();
					if(parentSelected.length < 1){
						$scope.entity.drawingId = null;
						$scope.entity.jobId = null;
						$scope.entity.projectId = null;
						$scope.entity.puId = null;
						$scope.entity.siteId = null;
					}
				});

				// un-register on destroy
				$scope.$on('$destroy', function () {
					dataService.parentService().unregisterSelectionChanged(onParentServiceSelectionChanged);
					if (angular.isFunction(dataService.parentService().unregisterProjectFkChanged)) {
						dataService.parentService().unregisterProjectFkChanged(onParentItemProjectFkChanged);
					}
				});

				break;
			case 'Readonly':
				platformContainerControllerService.initController($scope, moduleName, containerUuid);
				buttonService.addToolsUpdateOnSelectionChange($scope, dataService);
				buttonService.extendDocumentButtons($scope, dataService);
				break;
		}
	}
})(angular);
