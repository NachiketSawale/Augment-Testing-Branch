/* global angular */
(function (angular) {
	'use strict';

	function documentLinkDialog(_, $scope, $translate, basicsWorkflowActionEditorService, basicsWorkflowtypeSelectedModes) {
		$scope.input = {};
		$scope.input.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

		var typeSelectedMode = $scope.modalOptions.value.typeSelectedMode;
		$scope.input.typeSelectedMode = _.isNil(typeSelectedMode) || typeSelectedMode === '' ? basicsWorkflowtypeSelectedModes.single : typeSelectedMode;
		$scope.input.typeRadioGroupOpt = [
			{
				value: basicsWorkflowtypeSelectedModes.single,
				description: $translate.instant('basics.workflow.modalDialogs.singleDocRadio'),
				cssClass: 'pull-left spaceToUp'
			},
			{
				value: basicsWorkflowtypeSelectedModes.multi,
				description: $translate.instant('basics.workflow.modalDialogs.multiDocRadio'),
				cssClass: 'pull-left margin-left-ld'
			}
		];

		if ($scope.modalOptions.value.displayText === '') {
			$scope.modalOptions.value.displayText = $translate.instant('basics.workflow.controls.defaults.openDocument');
		}

		var ok = $scope.modalOptions.ok;

		$scope.modalOptions.ok = function (result) {
			$scope.modalOptions.value.typeSelectedMode = $scope.input.typeSelectedMode;

			ok(result);
		};
	}

	angular.module('basics.workflow').controller('basicsWorkflowDocumentLinkDialog',
		['_', '$scope', '$translate', 'basicsWorkflowActionEditorService', 'basicsWorkflowtypeSelectedModes', documentLinkDialog]);
})(angular);
