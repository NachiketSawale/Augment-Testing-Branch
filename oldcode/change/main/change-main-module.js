(function (angular) {
	/* global angular */
	/* global globals */
	'use strict';

	var moduleName = 'change.main';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'platform', 'procurement.contract']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name change.main
	 * @description
	 * Module definition of the change module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var wizardData = [{
				serviceName: 'changeMainWizardService',
				wizardGuid: '251b9f6b8b3b40d5be5064933cdde53f',
				methodName: 'changeStatus',
				canActivate: true
			},
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
			var options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['$injector', 'platformModuleInitialConfigurationService', 'platformSchemaService','basicsConfigWizardSidebarService',
						function ($injector, platformModuleInitialConfigurationService, platformSchemaService, basicsConfigWizardSidebarService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							return platformModuleInitialConfigurationService.load('Change.Main').then(function (modData) {
								var schemes = modData.schemes;
								schemes.push(
									{typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
									{typeName: 'ProjectDto', moduleSubModule: 'Project.Main'},
									{typeName: 'OrdBillingschemaDto', moduleSubModule: 'Sales.Contract'},
									{typeName: 'BidBillingschemaDto', moduleSubModule: 'Sales.Bid'},
									{typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'},
									{typeName: 'BoqHeaderDto', moduleSubModule: 'Boq.Main'},
									{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project' },
									{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project' },
									{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
									{typeName: 'ChangeTotalsVDto', moduleSubModule: 'Change.Main'},
									{typeName: 'ChangeTotalsGroupedVDto', moduleSubModule: 'Change.Main'},
									{typeName: 'Change2ExternalDto', moduleSubModule: 'Change.Main'},
									{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
									{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
									{typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower' },
									{typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower' },
									{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
									{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Bid'},
									{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Billing'},
									{typeName: 'GeneralsDto', moduleSubModule: 'Sales.Contract'},
									{typeName: 'ChangeReferenceDto', moduleSubModule: 'Change.Main'}
								);

								$injector.get('changeMainTranslationService').loadDynamicTranslations();
								return platformSchemaService.getSchemas(schemes);
							});
						}
					],
					loadLookup: ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load(['contractHeaderPurchaseOrdersCombobox',
							'boqMainTextComplementCombobox',
							'boqMainCatalogAssignmentModeCombobox',
							'businessPartnerMainSupplierLookup']);
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'changeMainConstantValues', function (basicsCompanyNumberGenerationInfoService, changeMainConstantValues) {
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('changeMainNumberInfoService', changeMainConstantValues.rubricId).load();
					}],
					loadContributionTypes:['basicsLookupdataSimpleLookupService', function(simpleLookupService){
						return simpleLookupService.getList({
							lookupModuleQualifier: 'basics.customize.projectchangecontributiontype',
							displayMember: 'Description',
							valueMember: 'Id'
						});
					}]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', function ($injector, naviService) {
		naviService.registerNavigationEndpoint({
			moduleName: moduleName,
			navFunc: function (item, triggerField) {
				$injector.get('changeMainService').navigateToChange(item, triggerField);
			}
		}
		);
	}]);
})(angular);
