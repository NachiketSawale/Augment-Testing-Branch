(function (angular) {
	'use strict';

	function startWorkflowEditorUtilService(basicsWorkflowActionEditorService, platformModuleStateService,
	                                        basicsWorkflowEditModes, $translate) {
		var templateKey = 'TemplateId';
		var service = {};
		service.postLinkFn = function postLink($scope, iElement, attr, ngModelCtrl) {
			var action = {};
			//accordion
			$scope.inputOpen = true;
			$scope.outputOpen = true;

			//radio-button
			$scope.input = {};
			$scope.editorMode = basicsWorkflowEditModes.default;
			$scope.radioGroupOpt = {
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

			$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
				$scope.editorMode = radioValue;
			};

			//select domain controler
			$scope.getEditorInput = basicsWorkflowActionEditorService.getEditorInput;

			$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

			function getFormatterHelper(parameterType, result) {
				return function (field) {
					if (field.key && field.value) {
						result[parameterType][field.key] = field.value ? field.value : '';
					}
				};
			}

			ngModelCtrl.$formatters.push(function (value) {
				action = value;
				if (action) {
					var result = {
						input: {},
						output: {}
					};
					_.forEach(value.input, getFormatterHelper('input', result));
					$scope.$watch(function () {
						return $scope.input;
					}, watchfn, true);
					_.forEach(value.output, getFormatterHelper('output', result));
					$scope.$watch(function () {
						return $scope.output;
					}, watchfn, true);
					return result;
				}
				return '';
			});

			ngModelCtrl.$render = function () {
				$scope.input = ngModelCtrl.$viewValue.input;
				$scope.output = ngModelCtrl.$viewValue.output;

				if ($scope.input) {
					$scope.input.editorMode = angular.isNumber($scope.input[templateKey]) ? 1 : 2;
				}
			};

			ngModelCtrl.$parsers.push(function (value) {
				var util = basicsWorkflowActionEditorService;
				util.parserHelper(util.setEditorInput, value.input, action);
				util.parserHelper(util.setEditorOutput, value.output, action);
				return action;
			});

			function watchfn(newVal, oldVal) {
				if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
					var viewValue = {
						input: $scope.input,
						output: $scope.output
					};

					ngModelCtrl.$setViewValue(viewValue);
				}
			}

		};
		return service;
	}

	startWorkflowEditorUtilService.$inject = ['basicsWorkflowActionEditorService', 'platformModuleStateService',
		'basicsWorkflowEditModes', '$translate'];

	angular.module('basics.workflow').factory('basicsWorkflowStartWorkflowEditorUtilService', startWorkflowEditorUtilService);

})(angular);
