(function (angular){
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerSelectionService', [
		'PlatformMessenger',
		function (PlatformMessenger) {
			var service = {
				documentMode: false,
				selected: null,
				selectionChanged: new PlatformMessenger()
			};

			service.isDocumentModeEnabled = function () {
				return service.documentMode;
			};

			service.enableDocumentMode = function () {
				service.documentMode = true;
			};

			service.isTakeOffEnabled = function () {
				return !service.documentMode;
			};

			service.enableTakeOffMode = function () {
				service.documentMode = false;
			};

			service.getSelectedModelId = function () {
				return service.selected;
			};

			service.selectModel = function (modelId) {
				service.selected = modelId;
				service.enableTakeOffMode();
				service.selectionChanged.fire();
			};

			service.previewDocument = function (modelId) {
				service.selected = modelId;
				service.enableDocumentMode();
				service.selectionChanged.fire();
			};

			service.clearSelection = function () {
				service.selected = null;
				service.selectionChanged.fire();
			};

			return service;
		}
	]);

})(angular);