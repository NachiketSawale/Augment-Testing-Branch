(function () {
	'use strict';

	angular.module('basics.workflow').factory('basicsWorkflowScriptPreviewService', ['platformModalService', 'platformModuleStateService',
		function (platformModalService, platformModuleStateService) {
			var service = {};

			function loadScriptFile() {
				var file = platformModuleStateService.state('basics.workflow').selectedScript;

				var name = file.FileName;
				var path = file.FilePath;
				var text = window.atob(file.FileStream._buffer);

				return {
					fileName: name,
					filePath: path,
					scriptText: text
				};
			}

			service.showPreviewDialog = function () {
				var script = loadScriptFile();
				var myDialogOptions = {
					headerTextKey: 'basics.workflow.modalDialogs.scriptPreview',
					bodyTemplateUrl: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-script-preview-dialog.html',
					width: '70%',
					resizeable: true,
					dataItem: {
						fileName: script.fileName,
						filePath: script.filePath,
						scriptText: script.scriptText
					}
				};

				platformModalService.showDialog(myDialogOptions);
			};

			return service;
		}]);
})();