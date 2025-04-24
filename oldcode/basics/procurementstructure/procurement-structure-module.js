/// <reference path='../help/10_angular/angular.js' />

(function (angular) {
	'use strict';

	/*
     ** basics.procurementstructure module is created.
     */
	var moduleName = 'basics.procurementstructure';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'ui.bootstrap']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'PrcStructureDto', moduleSubModule: 'Basics.ProcurementStructure'},
							{typeName: 'PrcConfiguration2GeneralsDto', moduleSubModule: 'Basics.ProcurementStructure'},
							{typeName: 'PrcConfiguration2CertDto', moduleSubModule: 'Basics.ProcurementStructure'},
							{typeName: 'PrcStructureAccountDto', moduleSubModule: 'Basics.ProcurementStructure'},
							{typeName: 'PrcStructure2clerkDto', moduleSubModule: 'Basics.ProcurementStructure'},
							{typeName: 'PrcStructure2EvaluationDto', moduleSubModule: 'Basics.ProcurementStructure'},
							{typeName: 'PrcStructureEventDto', moduleSubModule: 'Basics.ProcurementStructure'},
							{typeName: 'PrcStructureTaxDto', moduleSubModule: 'Basics.ProcurementStructure'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'PrcStructureDocDto', moduleSubModule: 'Basics.ProcurementStructure'},
							{typeName: 'InterCompanyStructureDto',moduleSubModule:'Basics.ProcurementStructure' },
							{typeName: 'MdcContextDto',moduleSubModule: 'Basics.ProcurementStructure'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
							{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
						]);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'basicsProcurementStructureStartBasisLookup',
							'basicsProcurementStructureEndBasisLookup',
							'prcBasLoadingCostCombobox'
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
				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService', 'platformTranslateService',
		function ($injector, naviService, layoutService, wizardService, platformTranslateService) {

			naviService.registerNavigationEndpoint(
				{
					moduleName: 'basics.procurementstructure',
					navFunc: function () {
						// use injector because Data-Services can not initialized in Run Phase -> too early
						$injector.get('basicsProcurementStructureService');
						naviService.getNavFunctionByModule('basics.procurementstructure').apply(this, arguments);
					}

				}
			);

			var wizardData = [{
				serviceName: 'procurementStructureSidebarWizardService',
				wizardGuid: '2128A4962715417A803EA812A1636A87',
				methodName: 'disableRecord',
				canActivate: true
			}, {
				serviceName: 'procurementStructureSidebarWizardService',
				wizardGuid: 'F1AC61DF49DE42709B7850A5F1E27DCF',
				methodName: 'enableRecord',
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
			}, {
				serviceName: 'procurementStructureDocumentProjectWizardService',
				wizardGuid: '7C60D477A72D48DF8756C54561CD3A01',
				methodName: 'changeStatusForProjectDocument',
				canActivate: true
			}];
			wizardService.registerWizard(wizardData);
			platformTranslateService.registerModule(moduleName);

		}]);

})(angular);