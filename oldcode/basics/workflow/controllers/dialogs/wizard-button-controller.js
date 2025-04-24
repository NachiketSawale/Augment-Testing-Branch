/* global angular */
(function (angular) {
	'use strict';

	function wizardButtonDialog($scope, platformModuleStateService, basicsWorkflowActionEditorService, basicsWorkflowMasterDataService) {
		$scope.module = [];
		$scope.input = {};
		$scope.input.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

		var state = platformModuleStateService.state('basics.workflow');
		$scope.wizards = state.wizards;
		$scope.moduleChanged = function () {
			basicsWorkflowMasterDataService.getWizard($scope.modalOptions.value.module).then(function (response) {
				$scope.wizards = response;
			});
		};
		$scope.selectOptionsWizard = {
			displayMember: 'Description',
			valueMember: 'WizardGUID',
			get items() {
				return $scope.wizards;
			},
			set items(val) {
				$scope.wizards = val;
			}
		};
		$scope.selectOptionsModule = {
			displayMember: 'Description.Description',
			valueMember: 'Id',
			get items() {
				return state.module;
			}
		};

		if ($scope.modalOptions.value.module) {
			var current = $scope.modalOptions.value.wizard;
			$scope.moduleChanged();
			$scope.modalOptions.value.wizard = current;
		}

	}

	angular.module('basics.workflow').controller('basicsWorkflowWizardButtonDialog', ['$scope',
		'platformModuleStateService', 'basicsWorkflowActionEditorService', 'basicsWorkflowMasterDataService', wizardButtonDialog]);

})(angular);
