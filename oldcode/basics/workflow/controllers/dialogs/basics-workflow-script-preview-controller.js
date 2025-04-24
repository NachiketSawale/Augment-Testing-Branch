/* global angular */
(function (angular) {
	'use strict';

	function scriptPreviewDialog($scope, $translate, basicsWorkflowActionEditorService) {
		$scope.input = {};
		$scope.input.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
		$scope.input.codeMirrorOptions.readOnly = true;
	}

	angular.module('basics.workflow').controller('basicsWorkflowScriptPreviewDialog', ['$scope', '$translate', 'basicsWorkflowActionEditorService', scriptPreviewDialog]);

})(angular);
