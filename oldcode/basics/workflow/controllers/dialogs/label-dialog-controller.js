/* global angular */
(function () {
	'use strict';

	function labelDialog($scope, $translate, platformModuleStateService, basicsWorkflowActionEditorService) {

		$scope.escapeHtmlOptions = {
			ctrlId: 'escapeHtmlCheckbox',
			labelText: $translate.instant('basics.workflow.modalDialogs.labelTextEscapeHtml')
		};

		$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
		$scope.codeMirrorOptions.singleLine = false;
		$scope.codeMirrorOptions.singleBlock = true;
		$scope.codeMirrorOptions.lineWrapping = true;
		$scope.codeMirrorOptions.scrollbarStyle = 'native';
	}

	angular.module('basics.workflow').controller('basicsWorkflowLabelDialog', ['$scope', '$translate', 'platformModuleStateService', 'basicsWorkflowActionEditorService', labelDialog]);
})();
