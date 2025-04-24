/* global angular */
(function (angular) {
	'use strict';

	function reportLinkDialog($scope, $translate, platformGridAPI, basicsWorkflowActionEditorService, basicsWorkflowEditModes, basicsWorkflowReportUtilsService, basicsWorkflowGlobalContextUtil, $timeout) {
		var editModes = basicsWorkflowEditModes;
		var reportUtilsService = basicsWorkflowReportUtilsService;

		$scope.input = {};
		$scope.input.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
		$scope.input.editorMode = reportUtilsService.getEditMode($scope.modalOptions.value);
		$scope.modalOptions.value.parameters = basicsWorkflowActionEditorService.tryGetObjectFromJson($scope.modalOptions.value.parameters);
		$scope.modalOptions.value.report = basicsWorkflowActionEditorService.tryGetObjectFromJson($scope.modalOptions.value.report);

		$scope.modalOptions.disableOkButton = function () {
			if ($scope.input.editorMode === editModes.default) {
				return $scope.modalOptions.value.displayText && !_.isUndefined($scope.input.reportValue) ? false : true;
			} else {
				return $scope.modalOptions.value.displayText && $scope.input.reportScriptValue ? false : true;
			}
		};

		if ($scope.modalOptions.value.displayText === '') {
			$scope.modalOptions.value.displayText = $translate.instant('basics.workflow.controls.defaults.openReport');
		}

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

		$scope.gridId = 'A929224BDB7340408A5330B49A0999A9';

		$scope.gridData = {
			state: $scope.gridId
		};

		var paramColumns = [
			{
				id: 'name',
				field: 'Name',
				formatter: 'description',
				name: 'Parameter Name',
				name$tr$: 'basics.reporting.entityParameterName',
				readonly: true,
				width: 150
			},
			{
				id: 'type',
				field: 'ParamValueType',
				name: 'Type',
				formatter: 'description',
				name$tr$: 'basics.reporting.entityDatatype',
				readonly: true,
				width: 150
			},
			{
				id: 'value',
				field: 'ParamValue',
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
				name: 'Value',
				name$tr$: 'basics.reporting.entityParameterValue',
				// toolTip: 'Value',
				sortable: true,
				keyboard: {
					enter: true
				},
				width: 250
			}
		];

		// create grid
		if (!platformGridAPI.grids.exist($scope.gridId)) {
			var grid = {
				columns: paramColumns,
				data: [],
				id: $scope.gridId,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'Id'
				}
			};
			platformGridAPI.grids.config(grid);
		}

		// set values to the fields
		if ($scope.input.editorMode === editModes.expert) {
			$scope.input.parametersScriptValue = $scope.modalOptions.value.parameters;
			$scope.input.reportScriptValue = $scope.modalOptions.value.report;
		} else {
			setGridData(reportUtilsService.getParametersFromJson($scope.modalOptions.value.parameters));
			$scope.input.reportValue = $scope.modalOptions.value.report ? $scope.modalOptions.value.report.Id : undefined;
		}

		$scope.onReportChanged = function onReportChanged(reportId) {
			// clear grid
			setGridData([]);

			// add report parameters
			reportUtilsService.getParametersFromServer(reportId).then(function (response) {
				if (response) {
					setGridData(response);
				}
			});
		};

		$scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
			$scope.input.editorMode = radioValue;

			if (radioValue === editModes.default) {
				$timeout(function () {
					var grid = platformGridAPI.grids.element('Id', $scope.gridId);
					grid.instance.resizeCanvas();
				}, 0);
			}
		};

		$scope.modalOptions.ok = function ok(result) {
			// determine the values of all controls
			if ($scope.input.editorMode === editModes.expert) {
				$scope.modalOptions.value.parameters = $scope.input.parametersScriptValue;
				$scope.modalOptions.value.report = $scope.input.reportScriptValue;
				closeDialog(result);
			} else {
				platformGridAPI.grids.commitEdit($scope.gridId);
				$scope.modalOptions.value.parameters = reportUtilsService.getParametersFromGrid(getGridData());

				reportUtilsService.getReport($scope.input.reportValue).then(function (response) {
					if (response) {
						var item = response;
						var report = {
							Id: item.Id,
							Name: item.ReportName,
							Path: item.FilePath,
							TemplateName: item.FileName
						};

						$scope.modalOptions.value.report = report;
						closeDialog(result);
					}
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

		function setGridData(data) {
			platformGridAPI.items.data($scope.gridId, data);
		}

		function getGridData() {
			return platformGridAPI.items.data($scope.gridId);
		}

		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.gridId);
		});
	}

	angular.module('basics.workflow').controller('basicsWorkflowReportLinkDialog', ['$scope', '$translate', 'platformGridAPI', 'basicsWorkflowActionEditorService', 'basicsWorkflowEditModes', 'basicsWorkflowReportUtilsService', 'basicsWorkflowGlobalContextUtil', '$timeout', reportLinkDialog]);

})(angular);
