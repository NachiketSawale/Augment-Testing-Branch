/**
 * Created by baitule on 30.08.2018.
 */

(function (angular) {
	/* global globals */
	'use strict';

	function basicWorkflowSaveTextInNewFileActionActionEditorDirective(basicsWorkflowActionEditorService, _) {

		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/save-text-in-new-file-action-editor.html',
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

						$scope.appendToExistingFileOptions = {
							ctrlId: 'appendToExistingFileCheckbox'
						};

						function getDataFromAction(key) {
							var param = _.find(action.input, {key: key});
							return param ? param.value : '';
						}

						//Formatter Model Control
						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								//get output item
								var response = basicsWorkflowActionEditorService.getEditorOutput('Response', action);

								return {
									fileName: getDataFromAction('FileName'),
									savePath: getDataFromAction('SavePath'),
									content: getDataFromAction('Content'),
									appendToExistingFile: getDataFromAction('AppendToExistingFile'),
									response: response ? response.value : ''
								};
							}
							return '';
						});

						//Renderer Model Control
						ngModelCtrl.$render = function () {
							$scope.input.fileName = ngModelCtrl.$viewValue.fileName;
							$scope.input.savePath = ngModelCtrl.$viewValue.savePath;
							$scope.input.content = ngModelCtrl.$viewValue.content;
							$scope.input.appendToExistingFile = ngModelCtrl.$viewValue.appendToExistingFile;
							$scope.output.response = ngModelCtrl.$viewValue.response;
						};

						//Parsers for Model Control to Push objects
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.fileName, 'FileName', action);
							basicsWorkflowActionEditorService.setEditorInput(value.savePath, 'SavePath', action);
							basicsWorkflowActionEditorService.setEditorInput(value.content, 'Content', action);
							basicsWorkflowActionEditorService.setEditorInput(value.appendToExistingFile, 'AppendToExistingFile', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.response, 'Response', action);
							return action;
						});

						//Saving the angular Model
						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								fileName: $scope.input.fileName,
								savePath: $scope.input.savePath,
								content: $scope.input.content,
								appendToExistingFile: $scope.input.appendToExistingFile,
								response: $scope.output.response
							});
						}

						//Watch function to update the value change in save model.
						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						$scope.changeCheckbox = function () {
							saveNgModel();
						};

						$scope.$watch('input.fileName', watchfn);
						$scope.$watch('input.savePath', watchfn);
						$scope.$watch('input.content', watchfn);
						$scope.$watch('output.response', watchfn);
					}
				};
			}
		};
	}

	basicWorkflowSaveTextInNewFileActionActionEditorDirective.$inject = ['basicsWorkflowActionEditorService', '_'];

	angular.module('basics.workflow')
		.directive('basicWorkflowSaveTextInNewFileActionActionEditorDirective', basicWorkflowSaveTextInNewFileActionActionEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '61fb887694ff4817883324dd6f17b2d5',
					directive: 'basicWorkflowSaveTextInNewFileActionActionEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
