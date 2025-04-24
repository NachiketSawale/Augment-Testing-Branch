/* global angular */
(function (angular) {
	'use strict';

	function wwwLinkDialog($scope, $translate, basicsWorkflowActionEditorService) {
		$scope.input = {};
		$scope.input.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

		if ($scope.modalOptions.value.displayText === '') {
			$scope.modalOptions.value.displayText = $translate.instant('basics.workflow.controls.defaults.openUrl');
		}
	}

	angular.module('basics.workflow').controller('basicsWorkflowWwwLinkDialog', ['$scope', '$translate', 'basicsWorkflowActionEditorService', wwwLinkDialog]);

})(angular);
