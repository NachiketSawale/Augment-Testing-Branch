(function (angular) {
	'use strict';
	var moduleName = 'basics.workflow';

	/**
	 * @ngdoc service
	 * @name basicsWorkflowApproverConfigUiService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  approverConfig entity.
	 **/
	angular.module(moduleName).service('basicsWorkflowApproverConfigUiService', BasicsWorkflowApproverConfigUiService);

	BasicsWorkflowApproverConfigUiService.$inject = ['platformUIConfigInitService', 'basicsWorkflowTranslationService', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator'];

	function BasicsWorkflowApproverConfigUiService(platformUIConfigInitService, basicsWorkflowTranslationService, platformLayoutHelperService, basicsLookupdataConfigGenerator) {

		function getApproverConfigLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basicsWorkflowApproverConfigUiService',
				['clerkrolefk', 'evaluationlevel', 'timetoapprove', 'classifiednum', 'classifieddate', 'classifiedamount', 'classifiedtext', 'formular', 'ismail', 'needcomment4approve', 'needcomment4reject','allowreject2level','issendmailtoclerk']);

			res.overloads = {
				//clerkfk: platformLayoutHelperService.provideClerkLookupOverload(),
				clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomClerkRoleLookupDataService',
					enableCache: true
				})
			};

			return res;
		}

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: getApproverConfigLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Basics.Workflow',
				typeName: 'ApproverConfigDto'
			},
			translator: basicsWorkflowTranslationService
		});
	}
})(angular);
