/**
 * Created by saa.mik on 03.12.2020.
 */
(function (angular) {
	'use strict';

	function basicsWorkflowDocumentClientActionEditorContainer(basicsWorkflowActionEditorService, platformGridAPI,
	                                                           platformCreateUuid,$translate, _) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/document-client-action-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {};
						scope.output = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						// init EvaluateProxy checkbox
						scope.EvaluateProxyOptions = {
							ctrlId: 'EvaluateProxyCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.EvaluateProxy'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.EvaluateProxy'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.EvaluateProxyTooltipCaption')
						};

						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.input = {};

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								//var popUp = getContentFromModel('IsPopUp', value);
								var document = getContentFromModel('DocumentId', value);
								scope.EvaluateProxy = _.find(action.input, {key: 'EvaluateProxy'});
								//var EvaluateProxy = getContentFromModel('EvaluateProxy', value);

								//one output parameter 'DocId'
								//var outputProperty = basicsWorkflowActionEditorService.getEditorOutput('ReportId', action);

								return {
									//popUp: popUp,
									document: document,
									EvaluateProxy: scope.EvaluateProxy,
									//outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						//get datas from ngModel
						function getContentFromModel(key, value) {
							var param = _.find(value.input, {key: key});

							return param ? param.value : '';
						}

						// existing code
						ngModelCtrl.$render = function () {
							//scope.input.popUp = ngModelCtrl.$viewValue.popUp;
							scope.input.document = ngModelCtrl.$viewValue.document;
							//scope.input.EvaluateProxy = ngModelCtrl.$viewValue.EvaluateProxy;
							//render output parameters
							//scope.output.report = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							//basicsWorkflowActionEditorService.setEditorInput(value.popUp, 'IsPopUp', action);
							basicsWorkflowActionEditorService.setEditorInput(value.document, 'DocumentId', action);
							//basicsWorkflowActionEditorService.setEditorInput(value.EvaluateProxy, 'EvaluateProxy', action);

							//save output parameter
							//basicsWorkflowActionEditorService.setEditorOutput(value.scriptOutput, 'DocumentId', action);

							return action;
						});

						function saveNgModel() {
							ngModelCtrl.$setViewValue({
								//popUp: scope.input.popUp,
								document: scope.input.document,
								//EvaluateProxy: scope.input.EvaluateProxy,
								//scriptOutput: scope.output.document
							});
						}

						scope.changeCheckbox = function () {
							scope.EvaluateProxy.value = _.toString(!scope.EvaluateProxyCheckbox);
						};

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch(function () {
							return scope.EvaluateProxy.value;
						}, function () {
							scope.EvaluateProxyCheckbox = scope.EvaluateProxy.value === true || scope.EvaluateProxy.value === 'true';
						});

						//scope.$watch('input.popUp', watchfn);
						scope.$watch('input.document', watchfn);
						//scope.$watch('input.EvaluateProxy', watchfn);
						// scope.$watch('output.report', watchfn);
					}
				};
			}
		};
	}

	basicsWorkflowDocumentClientActionEditorContainer.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'platformCreateUuid', '$translate', '_'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowDocumentClientActionEditorContainer', basicsWorkflowDocumentClientActionEditorContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '000090ce354a11ebadc10242ac120002',
					directive: 'basicsWorkflowDocumentClientActionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);
})(angular);
