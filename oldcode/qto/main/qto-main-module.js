(function (angular) {
	'use strict';
	/* global globals, _ */

	/*
	 ** qto.main module is created.
	 */
	var moduleName = 'qto.main';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'project.location','sales.wip']);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'boq.main', 'estimate.main'], true);
					}],
					'loadDomains': ['platformSchemaService', 'boqMainSchemaService', function (platformSchemaService, boqMainSchemaService) {
						var schemas = _.concat([
							{typeName: 'QtoHeaderDto', moduleSubModule: 'Qto.Main'},
							{typeName: 'QtoDetailDto', moduleSubModule: 'Qto.Main'},
							{typeName: 'QtoSheetDto', moduleSubModule: 'Qto.Main'},
							{typeName: 'LocationDto', moduleSubModule: 'Project.Location'},
							{typeName: 'PrcPostconHistoryDto', moduleSubModule: 'Procurement.Common'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Wip'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'QtoDetailDocumentDto', moduleSubModule: 'Qto.Main'},
							{typeName: 'QtoDetailCommentsDto', moduleSubModule: 'Qto.Main'},
							{typeName: 'QtoCommentDto', moduleSubModule: 'Qto.Formula'},
							{typeName: 'OrdHeaderDto', moduleSubModule: 'Sales.Contract'},
							{typeName: 'QtoAddressRangeDetailDto', moduleSubModule: 'Qto.Main'},
							{typeName: 'ProjectBillToDto',moduleSubModule: 'Project.Main'},
							{typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'},
						], boqMainSchemaService.getSchemas());

						platformSchemaService.initialize();
						return platformSchemaService.getSchemas(schemas);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'qtoDetailReferenceLookup',
							'qtoFormulaGonimeterLookup',
							'qtoFormulaIconCombobox',
							'qtoMainProjectBoqLookup',
							'qtoDetailBoqReferenceLookup',
							'procurementCommonPrcBoqExtendedLookup'
						]);
					}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'4eaa47c530984b87853c6f2e4e4fc67e'
						]);
					}],
					'loadQtoCopyOpionProfile': ['qtoMainDetailCopyConfigService', function(qtoMainDetailCopyConfigService){
						qtoMainDetailCopyConfigService.getProfile();
					}],
					'registerWizards': ['basicsConfigWizardSidebarService', function (wizardService) {
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
	]).run(['$injector', 'platformModuleNavigationService', 'genericWizardContainerLayoutService', 'basicsConfigWizardSidebarService',
		function ($injector, naviService, layoutService, wizardService) {
			naviService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item, triggerField) {
					$injector.get('qtoMainHeaderDataService').setQtoHeader(item, triggerField);
				}
			});
			var CreateWD = wizardService.WizardData;
			var wizardData = [{
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: '084269094DED41F690D67457D5ED8E18',
				methodName: 'disableRecord',
				canActivate: true
			}, {
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: '3AA5200BABEE45BB834485AF159780D0',
				methodName: 'enableRecord',
				canActivate: true
			}, {
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: '6A57335CC29649E6A323570E20061696',
				methodName: 'createPes',
				canActivate: true
			}, {
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: 'c7bc361bf0454bbebcfe192f4e2965de',
				methodName: 'exportREB',
				canActivate: true
			}, {
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: '18b83d1f31874b04aaed0867a64a457e',
				methodName: 'importREB',
				canActivate: true
			}, {
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: 'D8247B7259AB49DAA9FB2DE6534251D3',
				methodName: 'changeQtoStatus',
				canActivate: true
			}, {
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: 'b69c2c819c7b417d9269ffde64e0a55f',
				methodName: 'searchQtoDetails',
				canActivate: true
			}, {
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: '0940b54374e24089a26a1ac56d8a1dba',
				methodName: 'renumberQtoDetails',
				canActivate: true
			}, {
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: 'EF9D526175D0474EA980E93BD3048F05',
				methodName: 'changeDetailQtoStatus',
				canActivate: true
			}, {
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: 'BBA0722907CC40EE8C49B29F68DB036C',
				methodName: 'UpdateBoqWqAq',
				canActivate: true
			}, {
				serviceName: 'qtoMainSidebarWizardService',
				wizardGuid: 'a1564717adc2423e84f89ec330a0d426',
				methodName: 'changeQtoSheetStatus',
				canActivate: true
			},
			new CreateWD('qtoMainSidebarWizardService', '1262CF2006FE41C5BF2781E7A9107A81', 'createWIP', true),
			new CreateWD('qtoMainSidebarWizardService', '4D02B8CE2356458BB1F53C12697A283D', 'createBill', true)
			];
			wizardService.registerWizard(wizardData);
		}]);

})(angular);