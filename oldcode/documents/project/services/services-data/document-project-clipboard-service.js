/**
 * Created by jim on 1/11/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.project';

	angular.module(moduleName).factory('documentProjectClipboardService', ['$q', '$http', '$injector', '$translate', 'PlatformMessenger',
		'platformModalService', 'documentsProjectDocumentDataService', 'documentsProjectDocumentModuleContext', '_', 'modelViewerDragdropService', 'documentsProjectModelObjectDataService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($q, $http, $injector, $translate, PlatformMessenger, platformModalService,
			documentsProjectDocumentDataService, documentsProjectDocumentModuleContext, _, modelViewerDragdropService, documentsProjectModelObjectDataService) {

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

			service.canDrag = function () {
				var currentModuleName = documentsProjectDocumentModuleContext.getConfig().moduleName;
				var item = documentsProjectDocumentDataService.getService({moduleName: currentModuleName}).getSelected();
				return item !== null;
			};

			service.canPaste = function (/* type */) {
				return false;
			};
			service.copy = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = false;
			};
			service.cut = function (items, type) {
				if (items) {
					clipboard.data = angular.copy(items);
					clipboard.type = type;
				}
			};

			service.fireOnDragStart = function () {

				service.onDragStart.fire();
			};

			service.fireOnDragEnd = function (e, arg) {
				service.onDragEnd.fire(e, arg);
			};

			service.fireOnDrag = function (e, arg) {
				service.onDrag.fire(e, arg);
			};

			service.clipboardHasData = function () {
				return clipboard.data !== null;
			};

			// #start drag & drop for 3D Viewer
			service.myDragdropAdapter = new modelViewerDragdropService.DragdropAdapter();
			service.myDragdropAdapter.canDrop = function (info) {
				if (!info.draggedData && info.draggedData.sourceGrid) {
					return;
				}
				if (info.draggedData.sourceGrid.type === 'modelMainObjectDataService') {
					return true;
				}
				return false;
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
						var currentModuleName = documentsProjectDocumentModuleContext.getConfig().moduleName;
						var documents = documentsProjectDocumentDataService.getService({moduleName: currentModuleName}).getSelectedEntities();
						angular.forEach(documents, function (item) {
							var param = {
								PrjDocumentId: item.Id,
								MdlModelId: createParam.modelId,
								ObjectIds: objectIds.useGlobalModelIds().toCompressedString()
							};
							reqParameters.push(param);
						});
						var documentModelService = documentsProjectModelObjectDataService.getService(documentsProjectDocumentModuleContext.getConfig());
						documentModelService.createObjectSetToDocument(reqParameters);
						clearClipboard();
					});
				}
			};

			/* function clearClipboard() {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			} */

			service.doPaste = function(obj, item, type/* , callback */) {
				add2Clipboard(obj.data, type);
				clipboard.cut = false;
			}

			return service;

		}]);
})(angular);
