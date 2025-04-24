/**
 * Created by wui on 5/8/2015.
 */

(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName, []);

	globals.modules.push(moduleName);
	angular.module(moduleName)
		.config(['mainViewServiceProvider',
			function (platformLayoutService) {

				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {

							platformSchemaService.initialize();

							return platformSchemaService.getSchemas([
								{typeName: 'CertificateDto', moduleSubModule: 'BusinessPartner.Certificate'},
								{typeName: 'CertificateReminderDto', moduleSubModule: 'BusinessPartner.Certificate'},
								{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
								{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'Certificate2subsidiaryDto', moduleSubModule: 'BusinessPartner.Certificate'},
								{typeName: 'GuarantorDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'}
							]);
						}],
						'registerWizards': ['genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
							function registerWizards(layoutService, wizardService) {
								var wizardData = [
									{
										serviceName: 'documentsCentralQueryWizardService',
										wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
										methodName: 'changeRubricCategory',
										canActivate: true,
										userParam: {
											'moduleName': moduleName
										}
									}
								];
								wizardService.registerWizard(wizardData);

							}]
					},
					'controller': 'businesspartnerCertificateMainController'
				};
				platformLayoutService.registerModule(options);
			}
		]).run(['genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
			function (layoutService, wizardService) {

				var wizardData = [{
					serviceName: 'businesspartnerCertificateWizardService',
					wizardGuid: '1D02A3E89F264539884BABA7F9AAC74A',
					methodName: 'changeStatus',
					canActivate: true
				}, {
					serviceName: 'businesspartnerCertificateWizardService',
					wizardGuid: '2E39FB5114254D97B971B73B022C43AB',
					methodName: 'changeStatusForProjectDocument',
					canActivate: true
				}, {
					serviceName: 'businesspartnerCertificateWizardService',
					wizardGuid: '4952BB1597D1428B91FC9122B7EB2A4B',
					methodName: 'sendEmail',
					canActivate: true
				}, {
					serviceName: 'businesspartnerCertificateWizardService',
					wizardGuid: '3D228FE680E543759C4080400F93A816',
					methodName: 'sendFax',
					canActivate: true
				}, {
					serviceName: 'businesspartnerCertificateWizardService',
					wizardGuid: 'A67C5601874147C89DA95F40A6012C47',
					methodName: 'createRequests',
					canActivate: true
				}, {
					serviceName: 'businesspartnerCertificateWizardService',
					wizardGuid: '01D63163D6C443988851E320F45893DA',
					methodName: 'createReminders',
					canActivate: true
				}, {
					serviceName: 'documentsProjectWizardService',
					wizardGuid: '906F29A4FFCD4856B97CC8395EE39B21',
					methodName: 'linkCx',
					canActivate: true
				}, {
					serviceName: 'documentsProjectWizardService',
					wizardGuid: '17F3EDBD264C47D78312B5DE24EDF37A',
					methodName: 'uploadCx',
					canActivate: true
				}];
				wizardService.registerWizard(wizardData);
			}])
		.run(['$injector', 'platformModuleNavigationService',
			function ($injector, naviService) {
				naviService.registerNavigationEndpoint(
					{
						moduleName: moduleName,
						navFunc: function (item, triggerField) {
							$injector.get('businesspartnerCertificateCertificateDataService').navigateTo(item, triggerField);
						}
					}
				);
			}]);

})(angular, globals);