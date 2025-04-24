/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
     * @ngdoc service
     * @name hsqeCheckListClipBoardService
     * @function
     *
     * @description
     * Provides some information on all containers in the module.
     */
	angular.module(moduleName).factory('hsqeCheckListClipBoardService', ['platformModalService', '$translate', 'PlatformMessenger', 'hsqeCheckListDataService', 'modelViewerDragdropService', 'hsqeCheckListModelObjectDataService',
		function (platformModalService, $translate, PlatformMessenger, dataService, modelViewerDragdropService, hsqeCheckListModelObjectDataService) {
			var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			var service = {};

			service.clipboardStateChanged = new PlatformMessenger();
			service.onDragStart = new PlatformMessenger();
			service.onDragEnd = new PlatformMessenger();
			service.onDrag = new PlatformMessenger();
			service.onPostClipboardError = new PlatformMessenger();

			var add2Clipboard = function (item, type) {
				clipboard.type = type;
				clipboard.data = angular.copy(item);
				clipboard.dataFlattened = [];
				service.clipboardStateChanged.fire();
			};

			var clearClipboard = function () {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			};
			service.setClipboardMode = function (clipboardMode) {
				clipboard.cut = clipboardMode;
			};

			service.getClipboard = function () {
				return clipboard;
			};

			service.canDrag = function (type) {
				if (type === 'hsqeCheckListTemplateDataService') return true;
				var item = dataService.getSelected();
				return item !== null;
			};

			service.canPaste = function canPaste() {
				return false;
			};
			service.copy = function copy(items, type) {
				add2Clipboard(items, type);
				clipboard.cut = false;
			};
			service.cut = function cut(items, type) {
				if (items) {
					clipboard.data = angular.copy(items);
					clipboard.type = type;
				}
			};

			service.doCanPaste = function (obj, type, item/* , itemService */) {
				return false;
			};

			service.doPaste = function (obj, item, type/* , callback */) {
			};

			service.fireOnDragStart = function fireOnDragStart() {
				service.onDragStart.fire();
			};

			service.fireOnDragEnd = function fireOnDragEnd(e, arg) {
				service.onDragEnd.fire(e, arg);
			};

			service.fireOnDrag = function fireOnDrag(e, arg) {
				service.onDrag.fire(e, arg);
			};

			service.clipboardHasData = function clipboardHasData() {
				return clipboard.data !== null;
			};
			// #start drag & drop for 3D Viewer
			service.myDragdropAdapter = new modelViewerDragdropService.DragdropAdapter();
			service.myDragdropAdapter.canDrop = function (info) {
				if (!info.draggedData && info.draggedData.sourceGrid) {
					return;
				}
				return info.draggedData.sourceGrid.type === 'modelMainObjectDataService';
			};

			service.myDragdropAdapter.drop = function (info) {
				if (!info.draggedData && info.draggedData.sourceGrid) {
					return;
				}
				var grid = info.draggedData.sourceGrid;
				var draggedData = grid.data;
				if (draggedData && grid.type === 'modelMainObjectDataService') {// drag project document to 3D viewer
					modelViewerDragdropService.paste().then(function (createParam) {
						var objectIds = createParam.includedObjectIds;
						var reqParameters = [];
						var defects = dataService.getSelectedEntities();
						angular.forEach(defects, function (item) {
							var param = {
								CheckListId: item.Id,
								MdlModelId: createParam.modelId,
								ObjectIds: objectIds.useGlobalModelIds().toCompressedString()
							};
							reqParameters.push(param);
						});
						hsqeCheckListModelObjectDataService.createObjectSetToCheckList(reqParameters);
						clearClipboard();
					});
				}
			};
			/*
			function createItemByTemplate() {
				clipboard.data.forEach(function (item) {
					if (dataService.createItemByTemplate) {
						dataService.createItemByTemplate(item);
					}
				});
				clearClipboard();
			}
			*/
			return service;
		}
	]);
})(angular);
