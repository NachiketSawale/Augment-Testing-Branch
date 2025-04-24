/**
 * Created by uestuenel on 11.07.2016.
 */
(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowReportClientActionParamsContainer(basicsWorkflowActionEditorService, platformGridAPI,
		platformCreateUuid, _, basicsWorkflowReportUtilsService, basicsWorkflowEditModes, $translate, $timeout,
		basicsWorkflowReportFilename, basicsWorkflowGlobalContextUtil) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: true,
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/report-client-action-params.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						/* is avalable
						 scope.input = {};
						 scope.input.radioGroupOpt
						 scope.codeMirrorOptions
						 */

						var action = {};

						scope.input.editorModeReportParams = basicsWorkflowEditModes.default;

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
							scope.input.editorModeReportParams = radioValue;

							$timeout(function () {
								platformGridAPI.grids.resize(scope.gridId);
							}, 0);
						};

						scope.EvaluateProxyOptions = {
							ctrlId: 'EvaluateProxyCheckbox',
							labelText: $translate.instant('basics.workflow.action.customEditor.EvaluateProxy'),
							toolTipTitle: $translate.instant('basics.workflow.action.customEditor.EvaluateProxy'),
							toolTipCaption: $translate.instant('basics.workflow.action.customEditor.EvaluateProxyTooltipCaption')
						};

						//set grid
						scope.gridId = platformCreateUuid();

						scope.gridDataReport = {
							state: scope.gridId
						};

						if (!platformGridAPI.grids.exist(scope.gridId)) {
							var gridConfig = {
								data: [],
								columns: [
									{
										id: 'name',
										field: 'Name',
										name: 'Parameter Name',
										name$tr$: 'basics.reporting.entityParameterName',
										width: 200
									},
									{
										id: 'value',
										field: 'ParamValue',
										name: 'ParamValue',
										name$tr$: 'basics.reporting.entityParameterValue',
										formatter: 'remark',
										editor: 'directive',
										editorOptions: {
											directive: 'basics-workflow-grid-script-editor-directive',
											hintOptions: {
												get globalScope() {
													return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
												}
											}
										},
										width: 200
									},
									{
										id: 'type',
										field: 'ParamValueType',
										name: 'ParamValueType',
										name$tr$: 'basics.reporting.entityDatatype',
										width: 200
									}
								],
								id: scope.gridId,
								options: {
									tree: false,
									indicator: true,
									idProperty: 'Id'
								}
							};

							platformGridAPI.grids.config(gridConfig);
						}

						var valueInParametersGrid = function (gridContent) {
							var data = basicsWorkflowReportUtilsService.getParametersFromJson(gridContent);

							return _.filter(data, 'ParamValue');
						};

						scope.onReportChanged = function onReportChanged(reportId) {
							// add report parameters
							getReportGridContent(reportId, valueInParametersGrid(getGridData()));

							//save grid content. Column 'value' save by grid-event
							saveNgModel();
						};

						function getReportGridContent(reportId, paramValue) {
							basicsWorkflowReportUtilsService.getParametersFromServer(reportId).then(function (response) {
								if (response) {

									var gridItems = response;

									_.forEach(gridItems, function (gridItem) {
										var param = _.find(paramValue, {Name: gridItem.Name});
										if (param) {
											gridItem.ParamValue = param.ParamValue;
										} else {
											gridItem.ParamValue = undefined;
										}
									});

									platformGridAPI.items.data(scope.gridId, gridItems);
									platformGridAPI.grids.resize(scope.gridId);
								}
							});
						}

						function getGridData() {
							return platformGridAPI.items.data(scope.gridId);
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var gridData = getContentFromModel('Parameters', value);
								var reportData = getContentFromModel('ReportId', value);
								var evaluateProxy = getContentFromModel('EvaluateProxy',value);
								scope.evaluateProxy = getContentFromModel('EvaluateProxy',value);
								return {
									gridData: gridData,
									reportData: reportData,
									evaluateProxy: evaluateProxy
								};
							}
							return '';
						});

						//get datas from ngModel
						function getContentFromModel(key, value) {
							var param = _.find(value.input, {key: key});

							return param ? param.value : '';
						}

						ngModelCtrl.$render = function () {
							scope.input.report = parseInt(ngModelCtrl.$viewValue.reportData) ? parseInt(ngModelCtrl.$viewValue.reportData) : 0;
							scope.input.reportScript = ngModelCtrl.$viewValue.reportData;
							scope.input.paramScript = ngModelCtrl.$viewValue.gridData;
							scope.input.evaluateProxy = ngModelCtrl.$viewValue.evaluateProxy;

							if (scope.input.report === 0 && ngModelCtrl.$viewValue.reportData !== '') {
								scope.input.editorModeReportParams = basicsWorkflowEditModes.expert;
							}

							if (scope.input.report > 0) {
								getReportGridContent(scope.input.report, valueInParametersGrid(ngModelCtrl.$viewValue.gridData));
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.gridData, 'Parameters', action);
							basicsWorkflowActionEditorService.setEditorInput(value.reportData, 'ReportId', action);
							basicsWorkflowActionEditorService.setEditorInput(value.evaluateProxy, 'EvaluateProxy', action);

							return action;
						});

						function saveNgModel() {
							var report = scope.input.editorModeReportParams === 2 ? scope.input.reportScript : scope.input.report;
							var reportGrid = scope.input.editorModeReportParams === 2 ? scope.input.paramScript : basicsWorkflowReportUtilsService.getParametersFromGrid(getGridData());

							ngModelCtrl.$setViewValue({
								reportData: report,
								gridData: reportGrid,
								evaluateProxy : scope.evaluateProxy
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal && scope.input.editorModeReportParams === 2) {
								//only for codemirror content
								saveNgModel();
							}
						}

						//function for saving changes in checkboxe
						scope.changeCheckbox = function () {
							saveNgModel();
						};

						scope.$watch('input.reportScript', watchfn);
						scope.$watch('input.paramScript', watchfn);

						platformGridAPI.events.register(scope.gridId, 'onCellChange', onChangeGridContent);

						function onChangeGridContent() {
							saveNgModel();
						}

						scope.$on('$destroy', function () {
							platformGridAPI.events.unregister(scope.gridId, 'onCellChange', onChangeGridContent);
							platformGridAPI.grids.unregister(scope.gridId);
						});
					}
				};
			}
		};
	}

	basicsWorkflowReportClientActionParamsContainer.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'platformCreateUuid', '_', 'basicsWorkflowReportUtilsService', 'basicsWorkflowEditModes', '$translate',
		'$timeout', 'basicsWorkflowReportFilename', 'basicsWorkflowGlobalContextUtil'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowReportClientActionParamsContainer', basicsWorkflowReportClientActionParamsContainer);

})(angular);
