/**
 * Created by alm on 2020-6-1.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.project';
	angular.module(moduleName).controller('documentsProjectModelObjectController', ['$scope', 'platformGridControllerService', 'documentsProjectDocumentModuleContext', 'documentsProjectDocumentDataService', 'documentsProjectModelObjectUIService', 'documentsProjectModelObjectDataService', 'documentsProjectModelObjectValidationService', 'modelViewerDragdropService', 'platformMenuListUtilitiesService',
		function ($scope, gridControllerService, documentsProjectDocumentModuleContext, documentsProjectDocumentDataService, gridColumns, documentsProjectModelObjectDataService, documentsProjectModelObjectValidationService, modelViewerDragdropService, platformMenuListUtilitiesService) {

			var config = documentsProjectDocumentModuleContext.getConfig();
			var modelConfig = angular.copy(config);
			documentsProjectDocumentDataService.setIsContainerConnected(true);
			modelConfig.parentService = documentsProjectDocumentDataService.getService(config);
			var dataService = documentsProjectModelObjectDataService.getService(modelConfig);
			var validationService = documentsProjectModelObjectValidationService.getService(dataService);
			var gridConfig = {
				columns: []
			};

			gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

			$scope.ddTarget.canDrop = function (info) {
				if (info.draggedData && info.draggedData.draggingFromViewer) {
					return modelConfig.parentService.getSelected();
				}
			};

			$scope.ddTarget.drop = function (info) {
				if (info.draggedData && info.draggedData.draggingFromViewer) {
					var documents = modelConfig.parentService.getSelectedEntities();
					modelViewerDragdropService.paste().then(function (createParam) {
						var objectIds = createParam.includedObjectIds;
						var reqParameters = [];
						angular.forEach(documents, function (item) {
							var param = {
								PrjDocumentId: item.Id,
								MdlModelId: createParam.modelId,
								ObjectIds: objectIds.useGlobalModelIds().toCompressedString()
							};
							reqParameters.push(param);
						});
						dataService.createObjectSetToDocument(reqParameters);

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

			$scope.$on('$destroy', function () {
				documentsProjectDocumentDataService.setIsContainerConnected(false);
			});

		}]);
})(angular);
