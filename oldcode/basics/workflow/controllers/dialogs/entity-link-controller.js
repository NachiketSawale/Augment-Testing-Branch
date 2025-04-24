/* global angular */
(function (angular) {
	'use strict';

	function moduleLinkDialog($scope, $translate, basicsWorkflowActionEditorService, basicsWorkflowEditModes, basicsWorkflowEntityUtilsService) {
		var editModes = basicsWorkflowEditModes;
		var entityUtilsService = basicsWorkflowEntityUtilsService;

		$scope.input = {};
		$scope.input.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

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
			$scope.modalOptions.value.displayText = $translate.instant('basics.workflow.controls.defaults.openEntity');
		}

		var moduleName = $scope.modalOptions.value.moduleName;
		if (_.isNull(moduleName) || angular.isUndefined(moduleName)) {
			$scope.input.editorMode = editModes.default;
			setValues(moduleName);
		} else {
			entityUtilsService.getModuleWithNavigationEndpointByModuleName($scope.modalOptions.value.moduleName).then(function (module) {
				$scope.input.editorMode = _.isNull(module) ? editModes.expert : editModes.default;
				setValues($scope.input.editorMode === editModes.expert ? moduleName : module);
			});
		}

		function setValues(module) {
			// set values to the fields
			if ($scope.input.editorMode === editModes.expert) {
				$scope.input.moduleScriptValue = module;
			} else {
				$scope.input.moduleValue = module ? module.Id : undefined;
			}
		}

		$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
			$scope.input.editorMode = radioValue;
		};

		$scope.modalOptions.ok = function ok(result) {
			// determine the values of all controls
			if ($scope.input.editorMode === editModes.expert) {
				$scope.modalOptions.value.moduleName = $scope.input.moduleScriptValue;
				closeDialog(result);
			} else {
				entityUtilsService.getModuleWithNavigationEndpointById($scope.input.moduleValue).then(function (module) {
					$scope.modalOptions.value.moduleName = module ? module.InternalName : '';
					closeDialog(result);
				});
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

	angular.module('basics.workflow').controller('basicsWorkflowModuleLinkDialog', ['$scope', '$translate', 'basicsWorkflowActionEditorService', 'basicsWorkflowEditModes', 'basicsWorkflowEntityUtilsService', moduleLinkDialog]);

})(angular);
