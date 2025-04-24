/**
 * Created by uestuenel on 08.06.2016.
 */

(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowGetCharacteristicEditorDirective(basicsWorkflowActionEditorService, basicsWorkflowEditModes, $translate, $http) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/get-characteristic-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						//scope variables
						scope.output = {};
						scope.input = {};

						//Code Mirror
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						//Radio mode
						scope.radioGroupOpt = basicsWorkflowActionEditorService.getRadioGroupOptions($translate);
						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							scope.input.editorMode = radioValue;
						};
						scope.onRadioGroupOptChanged('1');

						//select options for lookup selection
						scope.selectOptions = {
							displayMember: 'Code',
							valueMember: 'Id',
							items: [],
							watchItems: true
						};

						//scope.workflowCharacteristic = [];

						//retrieve data
						function getDataFromAction(key) {
							var param = _.find(action.input, {key: key});
							return param ? param.value : '';
						}

						//formatter
						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var output = basicsWorkflowActionEditorService.getEditorOutput('Characteristic', action);
								return {
									objectId: getDataFromAction('ObjectId', 'input'),
									sectionId: getDataFromAction('SectionId', 'input'),
									code: getDataFromAction('Code', 'input'),
									outputCharacteristic: output ? output.value : ''
								};
							}
							return '';
						});

						//Render
						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.objectId = ngModelCtrl.$viewValue.objectId;        //for Object Id of input parameter
								scope.input.sectionId = ngModelCtrl.$viewValue.sectionId;      //for Section Id of input parameter
								scope.input.code = ngModelCtrl.$viewValue.code;            //for Code Id of input parameter
								scope.output.characteristicId = ngModelCtrl.$viewValue.outputCharacteristic;  //for Chacteristic's Id/name in Output parameter
							}
						};

						//Parser
						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.objectId, 'ObjectId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.sectionId, 'SectionId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.code, 'Code', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.outputCharacteristic, 'Characteristic', action);
							return action;
						});

						//Save View Model
						function saveNgModel() {
							// var sectionId = scope.input.editorMode === 2 ? scope.input.sectionId : scope.input.sectionId;
							var code = scope.input.editorMode === 2 ? scope.input.code : scope.input.code;

							ngModelCtrl.$setViewValue({
								objectId: scope.input.objectId,
								sectionId: scope.input.sectionId,
								code: code,
								outputCharacteristic: scope.output.characteristicId
							});
						}

						function watchSectionId(newVal, oldVal) {
							if (!_.isNull(newVal) && !_.isUndefined(newVal) && newVal !== '') {         //check for the emptz string for the first get call
								$http({
									method: 'GET',
									url: globals.webApiBaseUrl + 'basics/characteristic/characteristic/lookup?sectionId=' + newVal
								}).then(function (response) {
									scope.selectOptions.items = response.data;
								});
								watchfn(newVal, oldVal);
							}
						}

						//Watch funtion over input and output parameters
						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						//to monitor/watch over any changes in the variables
						scope.$watch('input.objectId', watchfn);
						scope.$watch('input.sectionId', watchSectionId);
						scope.$watch('input.code', watchfn);
						scope.$watch('output.characteristicId', watchfn);
					}

				};
			}
		};
	}

	basicsWorkflowGetCharacteristicEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'basicsWorkflowEditModes', '$translate', '$http'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowGetCharacteristicEditorDirective', basicsWorkflowGetCharacteristicEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '85bd807fc5084f2885fd0be84b8c8ba4',
					directive: 'basicsWorkflowGetCharacteristicEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
