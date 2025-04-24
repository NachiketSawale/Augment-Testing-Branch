/* global angular */
(function (angular) {
	'use strict';

	function workflowLinkDialog($scope, $translate, basicsWorkflowActionEditorService, basicsWorkflowEditModes, platformModuleStateService) {
		var editModes = basicsWorkflowEditModes;

		$scope.input = {};
		$scope.input.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

		//get list for selectbox
		var workflowState = platformModuleStateService.state('basics.workflow');

		$scope.selectOptions = {
			items: workflowState.mainEntities,
			valueMember: 'Id',
			displayMember: 'Description'
		};

		$scope.input.radioGroupOpt = {
			displayMember: 'description',
			valueMember: 'value',
			cssMember: 'cssClass',
			items: [
				{
					value: 1,
					description: $translate.instant('basics.workflow.modalDialogs.defaultRadio'),
					cssClass: 'pull-left spaceToUp'
				},
				{
					value: 2,
					description: $translate.instant('basics.workflow.modalDialogs.expertRadio'),
					cssClass: 'pull-left margin-left-ld'
				}
			]
		};

		if ($scope.modalOptions.value.displayText === '') {
			$scope.modalOptions.value.displayText = $translate.instant('basics.workflow.controls.defaults.openWorkflow');
		}

		var templateId = $scope.modalOptions.value.templateId;
		$scope.input.editorMode = _.isUndefined(templateId) || Number.isInteger(templateId) ? editModes.default : editModes.expert;

		// set values to the fields
		if ($scope.input.editorMode === editModes.expert) {
			$scope.input.workflowScriptValue = templateId;
		} else {
			$scope.input.workflowValue = templateId;
		}

		$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
			$scope.input.editorMode = radioValue;
		};

		$scope.modalOptions.ok = function ok(result) {
			// determine the values of all controls
			if ($scope.input.editorMode === editModes.expert) {
				$scope.modalOptions.value.templateId = $scope.input.workflowScriptValue;
				closeDialog(result);
			} else {
				$scope.modalOptions.value.templateId = $scope.input.workflowValue;
				closeDialog(result);
			}
		};

		function closeDialog(result) {
			// create result object with values
			var customResult = result || {};
			if (_.isObject($scope.modalOptions.value)) {
				customResult.value = $scope.modalOptions.value;
			}
			customResult.ok = true;

			// close modal dialog
			$scope.$close(customResult);
		}

		$scope.$on('$destroy', function () {

		});
	}

	angular.module('basics.workflow').controller('basicsWorkflowWorkflowLinkDialog', ['$scope', '$translate',
		'basicsWorkflowActionEditorService', 'basicsWorkflowEditModes', 'platformModuleStateService', workflowLinkDialog]);

})(angular);
