(function (angular) {
	'use strict';
	var moduleName = 'basics.workflow';

	/**
	 * @ngdoc service
	 * @name basicsWorkflowApproverUiService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  approver Entity.
	 **/
	angular.module(moduleName).service('basicsWorkflowApproverUiService', BasicsWorkflowApproverUiService);

	BasicsWorkflowApproverUiService.$inject = ['platformUIConfigInitService', 'basicsWorkflowTranslationService', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator'];

	function BasicsWorkflowApproverUiService(platformUIConfigInitService, basicsWorkflowTranslationService, platformLayoutHelperService) {

		function getApproverConfigLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basicsWorkflowApproverUiService',
				['instancefk', 'actioninstancefk', 'clerkfk', 'isapproved', 'evaluatedon', 'comment', 'duedate', 'evaluationlevel']);

			res.overloads = {
				clerkfk: platformLayoutHelperService.provideClerkLookupOverload()
			};

			return res;
		}

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: getApproverConfigLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Basics.Workflow',
				typeName: 'ApproverDto'
			},
			translator: basicsWorkflowTranslationService
		});
	}
})(angular);
