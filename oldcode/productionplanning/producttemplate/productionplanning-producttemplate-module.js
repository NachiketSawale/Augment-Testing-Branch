(function (angular) {
	'use strict';

	/*
	 ** productionplanning.producttemplate module is created.
	 */
	var moduleName = 'productionplanning.producttemplate';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var wizardData = [{
				serviceName: 'productionplanningProductTemplateWizardService',
				wizardGuid: '6666c67650yt465e7753aa205267877a',
				methodName: 'enableProductTemplate',
				canActivate: true
			}, {
				serviceName: 'productionplanningProductTemplateWizardService',
				wizardGuid: '6666c67650yt465e7753aa205267877b',
				methodName: 'disableProductTemplate',
				canActivate: true
			}];

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', function (platformSchemaService, basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						var moduleSubModule = 'ProductionPlanning.ProductTemplate';
						return platformSchemaService.getSchemas([
							{typeName: 'ProductDescriptionDto', moduleSubModule: moduleSubModule},
							{typeName: 'ProductDescParamDto', moduleSubModule: moduleSubModule},
							{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'ProductParamDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'EngDrawingComponentDto', moduleSubModule: 'ProductionPlanning.Drawing'},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'RuleDto', moduleSubModule: 'ProductionPlanning.Accounting'},
							{ typeName: 'PpsParameterDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'},
							{ typeName: 'MdcDrawingComponentDto', moduleSubModule: 'ProductionPlanning.PpsMaterial' },
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
						]);
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'productionplanning.common', 'productionplanning.drawing']);
						// remark: wiki of platformTranslateService is http://rib-s-wiki01.rib-software.com/cloud/wiki/54/angular-translation#Platform-Translation-Service
					}],
					'loadCommonCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionplanningCommonTranslationService', function (customColumnsServiceFactory, translationServ) {
						return customColumnsServiceFactory.initCommonCustomColumnsService().then(function () {
							translationServ.setTranslationForCustomColumns();
						});
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function(basicsLookupdataLookupDefinitionService){
						return basicsLookupdataLookupDefinitionService.load([
							'basicsDependentDataDomainCombobox'
						]);
					}],
					'loadUom': [ 'basicsUnitLookupDataService',
						function (basicsUnitLookupDataService) {
							basicsUnitLookupDataService.getListSync({lookupType: 'basicsUnitLookupDataService'});
						}
					],
				}

			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						var relField = {
							'ProductDescriptionFk': 'ProductDescriptionFk',
							'Code': 'Id'
						}[triggerField];
						if (relField) {
							$injector.get('productionplanningProducttemplateMainService').searchByCalId(item[relField]);
						}
					}
				}
			);
		}]);

})(angular);