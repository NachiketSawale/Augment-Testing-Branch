/**
 * Created by saa.mik on 03.12.2020.
 */
(function (angular) {
	'use strict';

	var serviceName = 'DocumentClientAction';

	function ClientAction(_, basicsWorkflowUtilityService, $http, platformDialogService, basicsCommonDocumentPreviewService) {  // jshint ignore:line
		var self = this;
		self.Id = '000090ce354a11ebadc10242ac120002';
		self.Input = ['DocumentId','EvaluateProxy'];
		//self.Output = ['DocumentId'];
		self.Description = 'Document-ClientAction';
		self.Comment = 'Document-ClientAction';
		self.ActionType = 6;
		self.IsInstant = true;
		//self.directive = 'reportClientActionDirective';
		self.Namespace = 'Basics.Workflow';
		self.execute = function (task) {
			var Context = task.Context || {};
			var documentId = _.find(task.Input, {key: 'DocumentId'}).value;

			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/common/document/preview',
				params: {fileArchiveDocId: documentId}
			}).then(function (response) {
				window.open(response.data, '_blank');
				return {data: {task: task, context: Context, result: 'true'}};
			});
		};
	}

	angular.module('basics.workflow').service(serviceName,
		['_', 'basicsWorkflowUtilityService', '$http', 'platformDialogService', 'basicsCommonDocumentPreviewService', ClientAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);
})(angular);
