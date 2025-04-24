/**
 * Created by wui on 3/23/2020.
 */
/* jshint -W098 */
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).service('modelWdeViewerDragdropService', ['platformDragdropService', 'modelViewerCompositeModelObjectSelectionService',
		function (platformDragdropService, modelViewerCompositeModelObjectSelectionService) {

			this.initialize = function (scope, viewUUID, options) {
				scope.ddTarget = new platformDragdropService.DragdropTarget(platformDragdropService.dragAreas.main, viewUUID);

				scope.ddTarget.canDrop = function (info) {
					if (info.draggedData && info.draggedData.modelDataSource) {
						return info.draggedData.modelDataSource.canDrop(info);
					} else {
						return false;
					}
				};

				scope.ddTarget.drop = function (info) {
					if (info.draggedData && info.draggedData.modelDataSource) {
						info.draggedData.modelDataSource.drop(info);
					}
				};

				scope.ddTarget.getAllowedActions = function () {
					return [platformDragdropService.actions.link];
				};

				scope.startDrag = function () {
					var objectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();

					platformDragdropService.startDrag({
						draggingFromViewer: true,
						getDraggedObjectIds: objectIds
					}, [
						platformDragdropService.actions.link
					], {
						number: objectIds.totalCount(),
						text: 'model.viewer.operator.drag.objectData'
					});
				};
			};

		}
	]);

})(angular);


