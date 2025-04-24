(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowPinboardLinkDialog(_, $scope, $translate, $http, $q, basicsWorkflowActionEditorService, basicsWorkflowEditModes) {
		var editModes = basicsWorkflowEditModes;

		$scope.input = {};
		$scope.input.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

		$scope.selectOptions = {
			items: [],
			valueMember: 'Qualifier',
			displayMember: 'Qualifier'
		};

		function getList() {
			var defer = $q.defer();
			$http.get(globals.webApiBaseUrl + 'basics/common/comment/commentconfiglist')
				.then(function (response) {
					defer.resolve(response);
				});

			return defer.promise;
		}

		getList().then(function (response) {
			$scope.selectOptions.items = response.data;
			if ($scope.input.editorMode === editModes.expert) {
				$scope.input.workflowValue = $scope.modalOptions.value.qualifier;
			}
		});

		$scope.input.radioGroupOpt = {
			displayMember: 'description',
			valueMember: 'value',
			cssMember: 'cssClass',
			items: [
				{
					value: 1,
					description: $translate.instant('basics.workflow.modalDialogs.pinboardOnlyForWorkflow'),
					cssClass: 'pull-left spaceToUp'
				},
				{
					value: 2,
					description: $translate.instant('basics.workflow.modalDialogs.module'),
					cssClass: 'pull-left margin-left-ld'
				}
			]
		};

		var mainEntityId = $scope.modalOptions.value.mainEntityId;
		var editorMode = $scope.modalOptions.value.editorMode;

		$scope.input.editorMode = _.isUndefined(editorMode) ? editModes.default : editorMode;
		$scope.input.workflowGroupString = $scope.modalOptions.value.workflowGroupString;

		// set values to the fields
		if ($scope.input.editorMode === editModes.expert) {
			$scope.input.workflowScriptValue = mainEntityId;
		}

		$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
			$scope.input.editorMode = radioValue;
		};

		$scope.modalOptions.ok = function ok(result) {
			// determine the values of all controls
			$scope.modalOptions.value.editorMode = $scope.input.editorMode;
			if ($scope.input.editorMode === editModes.expert) {
				$scope.modalOptions.value.qualifier = $scope.input.workflowValue;
				$scope.modalOptions.value.mainEntityId = $scope.input.workflowScriptValue;
			} else {
				$scope.modalOptions.value.qualifier = 'basics.workflow.instancecomment';
				$scope.modalOptions.value.workflowGroupString = $scope.input.workflowGroupString;
			}
			closeDialog(result);
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

	angular.module('basics.workflow').controller('basicsWorkflowPinboardLinkDialog',
		['_',
			'$scope',
			'$translate',
			'$http',
			'$q',
			'basicsWorkflowActionEditorService',
			'basicsWorkflowEditModes',
			basicsWorkflowPinboardLinkDialog]);

})(angular);
