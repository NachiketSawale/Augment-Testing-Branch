/**
 * Created by baitule on 30.08.2018.
 */

(function (angular) {
	/* global globals */
	'use strict';

	function basicWorkflowSoapActionEditorDirective(basicsWorkflowActionEditorService, _) {

		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/soap-action-editor.html',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr, ngModelCtrl) {
						var action = {};
						$scope.input = {};                                                                                      //"$scope.input" for input parameters; $scope.input = {url: '', action:'', content:''}
						$scope.output = {};                                                                                     //"$scope.ouput" for input parameters; $scope.output = {response: ''}

						//Opening and Closing of accordion in the container
						$scope.inputOpen = true;
						$scope.outputOpen = true;

						//code Mirror Options for single line text and multiLine text.
						$scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);                //Single-Line Code-Mirror for Url and Action input parameter
						$scope.codeMirrorOptionsContent = basicsWorkflowActionEditorService.setCodeMirrorOptions(false);        //Multi-Line Code-Mirror for Content input parameter

						//Formatter Model Control
						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								//get output item
								var outputResponse = basicsWorkflowActionEditorService.getEditorOutput('Response', action);
								var outputResponseStatus = basicsWorkflowActionEditorService.getEditorOutput('ResponseStatus', action);

								//Single-Line Code Mirror for Url
								var paramUrl = basicsWorkflowActionEditorService.getEditorInput('Url', action);

								//Single-Line Code Mirror for Action
								var paramAction = basicsWorkflowActionEditorService.getEditorInput('Action', action);

								//Multi-Line Code Mirror for Content
								var dataContent = basicsWorkflowActionEditorService.getEditorInput('Content', action);

								//Multi-Line Code Mirror for Options
								var dataOptions = basicsWorkflowActionEditorService.getEditorInput('Options', action);

								return {
									dataUrl: paramUrl ? paramUrl.value : '',
									dataAction: paramAction ? paramAction.value : '',
									dataContent: dataContent ? dataContent.value : '',
									dataOptions: dataOptions ? dataOptions.value : '',
									outputResponseValue: outputResponse ? outputResponse.value : '',
									outputResponseStatusValue: outputResponseStatus ? outputResponseStatus.value : ''
								};
							}
							return '';
						});

						//Renderer Model Control
						ngModelCtrl.$render = function () {
							$scope.input.url = ngModelCtrl.$viewValue.dataUrl;
							$scope.input.action = ngModelCtrl.$viewValue.dataAction;
							$scope.input.content = ngModelCtrl.$viewValue.dataContent;
							$scope.input.options = ngModelCtrl.$viewValue.dataOptions;
							$scope.output.response = ngModelCtrl.$viewValue.outputResponseValue;
							$scope.output.responseStatus = ngModelCtrl.$viewValue.outputResponseStatusValue;
						};

						//Parsers for Model Control to Push objects
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.dataUrl, 'Url', action);
							basicsWorkflowActionEditorService.setEditorInput(value.dataAction, 'Action', action);
							basicsWorkflowActionEditorService.setEditorInput(value.dataContent, 'Content', action);
							basicsWorkflowActionEditorService.setEditorInput(value.dataOptions, 'Options', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.dataResponse, 'Response', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.dataResponseStatus, 'ResponseStatus', action);
							return action;
						});

						//Saving the angular Model
						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								dataUrl: $scope.input.url,
								dataAction: $scope.input.action,
								dataContent: $scope.input.content,
								dataOptions: $scope.input.options,
								dataResponse: $scope.output.response,
								dataResponseStatus: $scope.output.responseStatus
							});
						}

						//Watch function to update the value change in save model.
						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						$scope.$watch('input.url', watchfn);
						$scope.$watch('input.action', watchfn);
						$scope.$watch('input.content', watchfn);
						$scope.$watch('input.options', watchfn);
						$scope.$watch('output.response', watchfn);
						$scope.$watch('output.responseStatus', watchfn);
					}
				};
			}
		};
	}

	basicWorkflowSoapActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', '_'];

	angular.module('basics.workflow')
		.directive('basicWorkflowSoapActionEditorDirective', basicWorkflowSoapActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'a70b38d0a3ae4bcdb8cef3e2ed17acaa',
					directive: 'basicWorkflowSoapActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
