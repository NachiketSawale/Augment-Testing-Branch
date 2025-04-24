/**
 * Created by saa.hof on 04.01.2018.
 */
(function (angular) {
	'use strict';

	var serviceName = 'ReportClientAction';

	function ClientAction(_, basicsWorkflowUtilityService, $http, reportingPlatformService, platformDialogService) {  // jshint ignore:line
		var self = this;
		self.Id = '0000d20625b5c1a74a869be4fb7ac4e2';
		self.Input = ['PreviewMode', 'ReportId', 'Parameters','EvaluateProxy'];
		self.Output = ['ReportId'];
		self.Description = 'Report-ClientAction';
		self.Comment = 'Report-ClientAction';
		self.ActionType = 6;
		self.IsInstant = true;
		//self.directive = 'reportClientActionDirective';
		self.Namespace = 'Basics.Workflow';
		self.execute = function (task) {
			var Context = task.Context || {};
			var reportId = _.find(task.Input, {key: 'ReportId'}).value;
			var previewModeVar = _.find(task.Input, {key: 'PreviewMode'});
			return $http({method: 'GET', url: globals.webApiBaseUrl + 'basics/reporting/report/reportById?id=' + reportId})
				.then(
					function (response) {
						var reportData = {
							Name: response.data.ReportName,               // name
							TemplateName: response.data.FileName,       // template
							Path: response.data.FilePath
						};
						var parameterInput = _.find(task.Input, {'key': 'Parameters'});
						var parameters = angular.fromJson(parameterInput.value || null);

						reportingPlatformService.prepare(reportData, parameters, !_.isNil(previewModeVar) ? previewModeVar.value : '')
							.then(function (response) {
								if (_.isNil(response)) {
									platformDialogService.showErrorBox('basics.workflow.modalDialogs.reportError', 'cloud.common.errorMessage');
								} else {
									Context[task.output[0].value] = response.Name;
									reportingPlatformService.show(response);
								}
							});
						return {data: {task: task, context: Context, result: 'true'}};
					}
				);
		};
	}

	angular.module('basics.workflow').service(serviceName,
		['_', 'basicsWorkflowUtilityService', '$http', 'reportingPlatformService', 'platformDialogService', ClientAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);
})(angular);
