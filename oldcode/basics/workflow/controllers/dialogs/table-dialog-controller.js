/**
 * Created by xai on 8/24/2017.
 */
/* global angular */
(function () {
	'use strict';

	function TableDialog($scope, basicsWorkflowActionEditorService) {
		$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);
		$scope.codeMirrorOptions.singleLine = false;
		$scope.codeMirrorOptions.singleBlock = true;
		$scope.codeMirrorOptions.lineWrapping = true;
		$scope.codeMirrorOptions.scrollbarStyle = 'native';
	}

	angular.module('basics.workflow').controller('basicsWorkflowTableDialog', ['$scope', 'basicsWorkflowActionEditorService', TableDialog]);
})();