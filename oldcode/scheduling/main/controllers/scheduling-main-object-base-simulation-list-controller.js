/**
 * Created by Mohit on 03.01.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainObjectBaseSimulationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of scheduling main Object Base Simulation entities.
	 **/

	angular.module(moduleName).controller('schedulingMainObjectBaseSimulationListController', SchedulingMainObjectBaseSimulationListController);

	SchedulingMainObjectBaseSimulationListController.$inject = ['_', '$scope', '$injector','platformContainerControllerService', 'platformMenuListUtilitiesService', 'platformGridControllerService', 'schedulingMainObjectBaseSimulationDataService', '$rootScope','modelViewerModelSelectionService','modelViewerCompositeModelObjectSelectionService'];

	function SchedulingMainObjectBaseSimulationListController(_, $scope, $injector,platformContainerControllerService, platformMenuListUtilitiesService, platformGridControllerService, schedulingMainObjectBaseSimulationDataService, $rootScope, modelViewerModelSelectionService, modelViewerCompositeModelObjectSelectionService) {

		platformContainerControllerService.initController($scope, moduleName, '6f697738e6c64b698aa61a0713670dd6');
		
		let toolbarItems = [
			platformMenuListUtilitiesService.createToggleItemForObservable({
				value: schedulingMainObjectBaseSimulationDataService.updateModelSelection,
				toolsScope: $scope,
			}),
		];

		platformGridControllerService.addTools(toolbarItems);

		let createBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'create';
		});
		$scope.tools.items.splice(createBtnIdx, 1);

		let deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'delete';
		});
		$scope.tools.items.splice(deleteBtnIdx, 1);

		const unregisterBelongsToChanged = $rootScope.$on('belongsToChanged', function(){
			schedulingMainObjectBaseSimulationDataService.load();
		});
		const unregisterUpdateDone = $rootScope.$on('updateDone', function(){
			schedulingMainObjectBaseSimulationDataService.load();
		});

		let grid = $injector.get('platformGridAPI').grids.element('id', $scope.gridId);
		/**
		 * @ngdoc function
		 * @name updateData
		 * @function
		 * @methodOf modelMainObjectInfoDataService
		 * @description Updates the displayed data based upon the current model object selection.
		 */
		function updateData() {
			$scope.$evalAsync(function () {
				if (modelViewerModelSelectionService.getSelectedModelId()) {
					if (modelViewerCompositeModelObjectSelectionService.getSelectedObjectIdCount() > 0) {
						let modelId = modelViewerModelSelectionService.getSelectedModelId();
						let mdl2objList = schedulingMainObjectBaseSimulationDataService.getList();

						let selectedModel = [];
						let selObjects = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
						Object.keys(selObjects).some(function (subModelId) {
							if (selObjects[subModelId].length > 0) {
								selectedModel.push(selObjects[subModelId]);
							}
						});

						let selectedObj2MldList = [];
						angular.forEach(mdl2objList, function (item) {
							angular.forEach(selectedModel[0],function(sel){

								if(sel === item.ObjectFk && modelId === item.MdlModelFk){
									// eslint-disable-next-line no-undef
									let isAnyitemExist = _.find(selectedObj2MldList, function (list) {
										return list.ObjectFk === item.ObjectFk;
									});
									if(!isAnyitemExist) {
										selectedObj2MldList.push(item);
									}
								}
							});
						});
											
						if(selectedObj2MldList.length > 0){
							// eslint-disable-next-line
							let ids = _.map(selectedObj2MldList, 'Id');
							let rows = grid.dataView.mapIdsToRows(ids);
							grid.instance.setSelectedRows(rows, true);
							schedulingMainObjectBaseSimulationDataService.setSelectedEntities(selectedObj2MldList);
						} else {
							grid.instance.setSelectedRows(0, true);
							schedulingMainObjectBaseSimulationDataService.setSelectedEntities([]);
						}
					} else {
						grid.instance.setSelectedRows([-1], true);
					}
				}
			});
		}
		modelViewerModelSelectionService.onSelectedModelChanged.register(updateData);
		modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(updateData);

		$scope.$on('$destroy', function () {
			modelViewerModelSelectionService.onSelectedModelChanged.unregister(updateData);
			modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(updateData);
			unregisterBelongsToChanged();
			unregisterUpdateDone();
		});
	}
})(angular);
