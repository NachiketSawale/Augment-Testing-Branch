
(function (angular) {
	'use strict';
	var moduleName = 'hsqe.checklist';
	angular.module(moduleName).controller('checkListModelObjectController',
		['$scope', 'platformGridControllerService', 'hsqeCheckListDataService', 'hsqeCheckListModelObjectDataService', 'hsqeCheckListModelObjectUIStandardService',
			'platformTranslateService', 'hsqeCheckListModelObjectValidationService', 'modelViewerDragdropService', 'platformMenuListUtilitiesService',
			function ($scope, gridControllerService, parentService, dataService, formConfig,
				translateService, validationService, modelViewerDragdropService, platformMenuListUtilitiesService) {
				gridControllerService.initListController($scope, formConfig, dataService, validationService, {});

				$scope.ddTarget.canDrop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) {
						return parentService.getSelected();
					}
					else if (info.draggedData && info.draggedData.sourceGrid.type === 'modelMainObjectDataService') {
						return false;
					}
				};

				$scope.ddTarget.drop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) {
						var documents = parentService.getSelectedEntities();
						modelViewerDragdropService.paste().then(function (createParam) {
							var objectIds = createParam.includedObjectIds;
							var reqParameters = [];
							angular.forEach(documents, function (item) {
								var param = {
									CheckListId: item.Id,
									MdlModelId: createParam.modelId,
									ObjectIds: objectIds.useGlobalModelIds().toCompressedString()
								};
								reqParameters.push(param);
							});
							dataService.createObjectSetToCheckList(reqParameters);
						});
					}
				};

				var toolbarItems = [
					platformMenuListUtilitiesService.createToggleItemForObservable({
						value: dataService.updateModelSelection,
						toolsScope: $scope
					})
				];

				gridControllerService.addTools(toolbarItems);
			}
		]);

})(angular);