/**
 * Created by zov on 02/04/2019.
 */
(function () {
	'use strict';
	/* global angular, globals */

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var wizardData = [{
				serviceName: 'productionplanningDrawingWizardService',
				wizardGuid: 'dea77d3e3d7b4db4b2ec0983b56cb46c',
				methodName: 'enableDrawing',
				canActivate: true
			}, {
				serviceName: 'productionplanningDrawingWizardService',
				wizardGuid: 'e1c699c1d7724f5bb3795e630c0a5155',
				methodName: 'disableDrawing',
				canActivate: true
			}, {
				serviceName: 'productionplanningDrawingWizardService',
				wizardGuid: 'fd40c676504e465e8d53aa205265877a',
				methodName: 'changeDrawingStatus',
				canActivate: true
			}, {
				serviceName: 'productionplanningDrawingWizardService',
				wizardGuid: '1d5b46fdx834435a810e5194jd1476c5',
				methodName: 'importPartList',
				canActivate: true
			}, {
				serviceName: 'productionplanningDrawingWizardService',
				wizardGuid: '95119eb4a47749b5a032cc225e2fdd11',
				methodName: 'enableComponent',
				canActivate: true
			}, {
				serviceName: 'productionplanningDrawingWizardService',
				wizardGuid: '8c6b8fce25154b8d957b62934aaac0c7',
				methodName: 'disableComponent',
				canActivate: true
			}, {
				serviceName: 'productionplanningDrawingWizardService',
				wizardGuid: 'e423a477ef5a4512837a4b31560223ab',
				methodName: 'changeComponentStatus',
				canActivate: true
			}, {
				serviceName: 'productionplanningDrawingWizardService',
				wizardGuid: '6666c67650yt465e7753aa205267877a',
				methodName: 'enableProductTemplate',
				canActivate: true
			}, {
				serviceName: 'productionplanningDrawingWizardService',
				wizardGuid: '6666c67650yt465e7753aa205267877b',
				methodName: 'disableProductTemplate',
				canActivate: true
			}];
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', function (platformSchemaService, basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						var moduleSubModule = 'ProductionPlanning.Drawing';
						return platformSchemaService.getSchemas([
							{typeName: 'EngDrawingDto', moduleSubModule: moduleSubModule},
							{typeName: 'EngDrawingComponentDto', moduleSubModule: moduleSubModule},
							{typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'},
							{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'LocationDto', moduleSubModule: 'Project.Location'},
							{typeName: 'EngDrwProgReportDto', moduleSubModule: 'ProductionPlanning.Engineering'},
							{typeName: 'RuleDto', moduleSubModule: 'ProductionPlanning.Accounting'},
							{typeName: 'ResultDto', moduleSubModule: 'ProductionPlanning.Accounting'},
							{typeName: 'RuleSetDto', moduleSubModule: 'ProductionPlanning.Accounting'},
							{typeName: 'EngStackDto', moduleSubModule: moduleSubModule},
							{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
							{typeName: 'CostGroupCatDto', moduleSubModule: 'Basics.CostGroups'},
							{typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'},
							{typeName: 'EngDrwRevisionDto', moduleSubModule: moduleSubModule},
							{typeName: 'EngTmplRevisionDto', moduleSubModule: moduleSubModule},
							{typeName: 'EngDrawingSkillDto', moduleSubModule: moduleSubModule},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PpsPlannedQuantityDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'},
							{typeName: 'PpsUpstreamItemTemplateDto', moduleSubModule: 'ProductionPlanning.Configuration'},
							{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
						]);
					}],
					'loadCustomColumns': ['ppsCommonCustomColumnsServiceFactory', function (customColumnsServiceFactory) {
						var customColumnsService = customColumnsServiceFactory.getService(moduleName);
						return customColumnsService.init('productionplanning/drawing/customcolumn');
					}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'fcdf2e62fb8848bc99dd1a52fdbdf47f',// accounting.ruleset
							'ad340a997e8b4ad2876dfdd9d2670656',// accounting.rule
							'464c261c2b7d4111b6717aa2c13b2e82'// accounting.result
						]);
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName,'productionplanning.header', 'productionplanning.common', 'productionplanning.ppsmaterial', 'productionplanning.producttemplate']);
					}]
				}
			};
			mainViewServiceProvider.registerModule(options);
		}]).run(['$injector', 'platformModuleNavigationService', function ($injector, naviService) {
		naviService.registerNavigationEndpoint(
			{
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					// remark: param item may is an engTask/engComponent item that has field EngDrawingFk, or an engDrawing item.
					var relField = {
						'Code': 'Id',
					}[triggerField] || triggerField;
					if (relField) {
						var data = _.get(item, relField);
						var dataServ = $injector.get('productionplanningDrawingMainService');
						if (_.isArray(data)) {
							dataServ.searchByCalIds(data);
						} else {
							dataServ.searchByCalId(data);
						}
					}
				}
			}
		);
	}]);
})();