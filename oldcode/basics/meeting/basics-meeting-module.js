/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'basics.meeting';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			let wizardData = [{
				serviceName: 'basicsMeetingSidebarWizardService',
				wizardGuid: '7f4683289c4f4817a820c26f919f5c5b',
				methodName: 'createMeeting',
				canActivate: true
			}, {
				serviceName: 'basicsMeetingSidebarWizardService',
				wizardGuid: '7e3367be7c524e95857d2f56e0864c0d',
				methodName: 'synchronizeMeeting',
				canActivate: true
			}, {
				serviceName: 'basicsMeetingSidebarWizardService',
				wizardGuid: 'e5f2d7cf403f41a2ab54cd1e69c89bc8',
				methodName: 'changeMeetingStatus',
				canActivate: true
			}, {
				serviceName: 'basicsMeetingSidebarWizardService',
				wizardGuid: '92a14f1359b249659F558aD2169909e0',
				methodName: 'changeAttendeeStatus',
				canActivate: true
			}];

			let options = {
				moduleName: moduleName,
				controller: 'basicsMeetingController',
				resolve: {
					loadDomains: ['platformSchemaService', 'basicsConfigWizardSidebarService', 'basicsMeetingConstantValues',
						function (platformSchemaService, basicsConfigWizardSidebarService, basicsMeetingConstantValues) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformSchemaService.getSchemas([
								basicsMeetingConstantValues.schemes.meeting,
								basicsMeetingConstantValues.schemes.attendee,
								basicsMeetingConstantValues.schemes.document
							]);
						}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: 'basics.meeting',
					navFunc: function (item, triggerField) {
						$injector.get('basicsMeetingMainService').navigateTo(item, triggerField);
					},
					hide: function (entity) {
						// show only unless meeting is under current company
						return entity.CompanyFk !== $injector.get('platformContextService').clientId;
					}
				}
			);
		}]);
})(angular);

