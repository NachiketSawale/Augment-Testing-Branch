/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';

	var moduleName = 'basics.clerk';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);
	/*
	 /**
	 * @ngdoc module
	 * @name basics.clerk
	 * @description
	 * Module definition of the basics module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [
				{
					serviceName: 'basicsClerkSidebarWizardService',
					wizardGuid: '13e2ed83635142b9965c9fd873ef322c',
					methodName: 'disableClerk',
					canActivate: true
				},
				{
					serviceName: 'basicsClerkSidebarWizardService',
					wizardGuid: '31ff2dc732194d7da5d36dcd35c30a96',
					methodName: 'enableClerk',
					canActivate: true
				},
				{
					serviceName: 'basicsClerkCreateClerksFromUsersWizardService',
					wizardGuid: '9fc228d8786d419ca4c795ff7f50f66a',
					methodName: 'createClerksFromUsers',
					canActivate: true
				}
			];

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', function (platformSchemaService, basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);

						return platformSchemaService.getSchemas([
							{typeName: 'ClerkAbsenceDto', moduleSubModule: 'Basics.Clerk'},
							{typeName: 'ClerkDto', moduleSubModule: 'Basics.Clerk'},
							{typeName: 'ClerkGroupDto', moduleSubModule: 'Basics.Clerk'},
							{typeName: 'ClerkForEstimateDto', moduleSubModule: 'Basics.Clerk'},
							{typeName: 'ClerkForPackageDto', moduleSubModule: 'Basics.Clerk'},
							{typeName: 'ClerkForProjectDto', moduleSubModule: 'Basics.Clerk'},
							{typeName: 'ClerkForScheduleDto', moduleSubModule: 'Basics.Clerk'},
							{typeName: 'ClerkForWicDto', moduleSubModule: 'Basics.Clerk'},
							{typeName: 'Clerk2documentDto', moduleSubModule: 'Basics.Clerk'},
							{typeName: 'ClerkAbsenceProxyDto', moduleSubModule: 'Basics.Clerk'},
							{typeName: 'ClerkRoleDefaultValueDto', moduleSubModule: 'Basics.Clerk'}
						]);
					}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule('usermanagement.user', true);
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, platformModuleNavigationService) {
			platformModuleNavigationService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('basicsClerkMainService').navigateTo(item, triggerField);
					}
				}
			);
		}]
	);
})(angular);
