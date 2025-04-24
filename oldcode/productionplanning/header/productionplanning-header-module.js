(function (angular) {
	'use strict';
	/* global globals */
	/*
	 ** productionplanning.header module is created.
	 */
	var moduleName = 'productionplanning.header';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var wizardData = [
				{
					serviceName: 'productionplanningHeaderWizardService',
					wizardGuid: 'c2ff7e202d5f4ea7bf16abcd450f3594',
					methodName: 'disableHeader',
					canActivate: true
				}, {
					serviceName: 'productionplanningHeaderWizardService',
					wizardGuid: 'bcdd43e906b449bcb3a23f041a0a747a',
					methodName: 'enableHeader',
					canActivate: true
				},
				{
					serviceName: 'productionplanningHeaderWizardService',
					wizardGuid: 'a7905833028a4766bdc95cc3549035f8',
					methodName: 'changeHeaderStatus',
					canActivate: true
				},
				{
					serviceName: 'productionplanningHeaderWizardService',
					wizardGuid: '2c2c1621cb2f49d9be279cf430ffc694',
					methodName: 'changeStatusForProjectDocument',
					canActivate: true
				},
				{
					serviceName: 'productionplanningHeaderWizardService',
					wizardGuid: '9065e7dd71ab49eba2b6adc4f4001724',
					methodName: 'changeUpstreamStatus',
					canActivate: true
				}, {
					serviceName: 'productionplanningHeaderWizardService',
					wizardGuid: '60f0be5d1bed48618329f296940d41ad',
					methodName: 'createUpstreamPackages',
					canActivate: true
				}, {
					serviceName: 'productionplanningHeaderWizardService',
					wizardGuid: '2d1bababfa40410ca725cb16c4d77304',
					methodName: 'changeUpStreamFormDataStatus',
					canActivate: true
				}, {
					serviceName: 'productionplanningHeaderWizardService',
					wizardGuid: '7d2e60555c7043b7bde0df3f40b6f84b',
					methodName: 'importPlannedQuantities',
					canActivate: true
				}, {
					serviceName: 'documentsCentralQueryWizardService',
					wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
					methodName: 'changeRubricCategory',
					canActivate: true,
					userParam: {
						'moduleName': moduleName
					}
				}, {
					serviceName: 'basicsUserFormFormDataWizardService',
					wizardGuid: '7b0fb8993f56434f99368ec9875ee4fd',
					methodName: 'changeFormDataStatus',
					canActivate: true
				}, {
					serviceName: 'productionplanningHeaderWizardService',
					wizardGuid: '5278acf16e7f4e94985bcd549381b9ff',
					methodName: 'transferPreliminary',
					canActivate: true
				}, {
					serviceName: 'productionplanningHeaderWizardService',
					wizardGuid: '354e923a93694bd8a0c6dffbafc86e8b',
					methodName: 'createPreliminaryItems',
					canActivate: true
				}, {
					serviceName: 'basicsUserFormFormDataWizardService',
					wizardGuid: '74a279b3d2884562ba49048b8cb88d9f',
					methodName: 'changeFormDataStatus',
					canActivate: true
				}
			];
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', function (platformSchemaService, basicsConfigWizardSidebarService) {
						var moduleSubModule = 'ProductionPlanning.Header';
						basicsConfigWizardSidebarService.registerWizard(wizardData);
						return platformSchemaService.getSchemas([
							{typeName: 'Header2BpDto', moduleSubModule: moduleSubModule},
							{typeName: 'Header2ContactDto', moduleSubModule: moduleSubModule},
							{typeName: 'HeaderDto', moduleSubModule: moduleSubModule},
							{typeName: 'Header2ClerkDto', moduleSubModule: moduleSubModule},
							{typeName: 'DocumentDto', moduleSubModule: moduleSubModule},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'GenericDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'PrcPackageDto', moduleSubModule: 'Procurement.Package'},
							{typeName: 'PpsUpstreamItemDto', moduleSubModule: 'ProductionPlanning.Item'},
							{typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'},
							{typeName: 'RequisitionDto', moduleSubModule: 'Resource.Requisition'},
							{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'FormDataDto', moduleSubModule: 'Basics.UserForm'},
							{typeName: 'ProductDescriptionDto', moduleSubModule: 'ProductionPlanning.ProductTemplate'},
							{typeName: 'PpsPlannedQuantityDto', moduleSubModule: 'ProductionPlanning.FormulaConfiguration'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'CommonBizPartnerDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'CommonBizPartnerContactDto', moduleSubModule: 'ProductionPlanning.Common'},
							{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'},
							{typeName: 'BusinessPartnerDto', moduleSubModule: 'BusinessPartner.Main'},
							{typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'},
							{typeName: 'EngDrawingDto', moduleSubModule: 'ProductionPlanning.Drawing'}
						]);
					}],
					'loadTranslation': ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName, 'productionplanning.common', 'productionplanning.engineering', 'basics.customize']);
						// remark: wiki of platformTranslateService is http://rib-s-wiki01.rib-software.com/cloud/wiki/54/angular-translation#Platform-Translation-Service
					}],

					'loadCustomColumns': ['ppsCommonCustomColumnsServiceFactory', 'productionPlanningFormulaConfigurationTranslationService', function (customColumnsServiceFactory, translationService) {
						var customColumnsService = customColumnsServiceFactory.getServiceForPlnQty('productionplanning.formulaconfiguration');
						return customColumnsService.init('productionplanning/formulaconfiguration/plannedquantity/customcolumn').then(function () {
							translationService.setTranslationForCustomColumns();
						});
					}],
					loadCodeGenerationInfo: ['basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', '$http', function (basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue, $http) {
						var ppsEntityId = ppsCommonCodGeneratorConstantValue.PpsEntityConstant.PPSHeader;
						$http.get(globals.webApiBaseUrl + 'productionplanning/common/getRubricCatId?ppsEntityId=' + ppsEntityId).then(function (response) {
							ppsCommonCodGeneratorConstantValue.CategoryConstant.PpsHeaderCat = response.data;
						});
						return basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsHeaderNumberInfoService', ppsCommonCodGeneratorConstantValue.RubricConstant.ProductionPlanning).load();
					}]
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
							'PpsHeaderFk': 'PpsHeaderFk',
							'Code': 'Id'
						}[triggerField] || triggerField;
						if (relField) {
							$injector.get('productionplanningHeaderDataService').searchByCalId(item[relField]);
						}
					}
				}
			);
		}]);

})(angular);