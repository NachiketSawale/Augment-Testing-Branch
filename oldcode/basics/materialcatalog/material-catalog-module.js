/// <reference path='../help/10_angular/angular.js' />

(function (angular) {
	'use strict';

	/*
     ** basics.materialcatalog module is created.
     */
	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'ui.bootstrap']);
	globals.modules.push(moduleName);
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'MaterialCatalogDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'MaterialDiscountGroupDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'MaterialGroupDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'MaterialGroupAIMappingDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'MaterialGroupCharDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'MaterialGroupCharvalDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'MaterialPriceVersionDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'MaterialPriceVersion2CompanyDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'PriceVersionUsedCompanyDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'MdcMatPricever2custDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'MdcMaterialCatCompanyDto', moduleSubModule: 'Basics.MaterialCatalog'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'}

						]);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'basicsMaterialCatalogDiscountTypeComboBox',
							'businessPartnerMainSupplierLookup'
						]);
					}],
					'registerWizards': ['basicsConfigWizardSidebarService', 'basicsMaterialCatalogMaterialGroupService', function (wizardService, mainService) {

						var wizardData = [{
							serviceName: 'materialcatalogSidebarWizardService',
							wizardGuid: 'D159C643127049EC98D3E29DE633579B',
							methodName: 'updateCount',
							canActivate: true
						}, {
							serviceName: 'materialcatalogSidebarWizardService',
							wizardGuid: '451836DA793347B3BC479DE9422D2797',
							methodName: 'disableRecord',
							canActivate: true
						}, {
							serviceName: 'materialcatalogSidebarWizardService',
							wizardGuid: '5C0D377ED48542B7B60505846ACCDC43',
							methodName: 'enableRecord',
							canActivate: true
						}, {
							serviceName: 'materialcatalogSidebarWizardService',
							wizardGuid: '46498E3CB12E46D6B8A1F6E4E7A5F23E',
							methodName: 'deepCopyMaterialCatalog',
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
							serviceName: 'materialcatalogSidebarWizardService',
							wizardGuid: '687850B694344FAA846F44FA2941261F',
							methodName: 'changeStatusForProjectDocument',
							canActivate: true
						}, {
							serviceName: 'basicsCharacteristicBulkEditorService',
							wizardGuid: '12f9d13b74d54c438dc7cc660743141e',
							methodName: 'showEditor',
							canActivate: true,
							userParam: {
								'parentService': mainService,
								'sectionId': 15,
								'moduleName': moduleName
							}
						}, {
							serviceName: 'materialcatalogSidebarWizardService',
							wizardGuid: '8388963FFC3C412E8DEA897C4E3BED77',
							methodName: 'syncMaterialCatlogFromYtwo',
							canActivate: true
						}, {
							serviceName: 'materialcatalogSidebarWizardService',
							wizardGuid: '00A045BB6A514F72A2A0835062391C79',
							methodName: 'materialGroupsAiMapping',
							canActivate: true
						}, {
							serviceName: 'documentsCentralQueryWizardService',
							wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
							methodName: 'changeRubricCategory',
							canActivate: true,
							userParam: {
								'moduleName': moduleName
							}
						}];
						wizardService.registerWizard(wizardData);
					}],/*,
                    'loadContainers:':['mainViewService','$http', function (mainViewService,$http) {
                        var containerList=	mainViewService.getContainers();
                        var removeContainers = ['basics.materialcatalog.priceVersion.customer', 'basics.materialcatalog.priceVersion.customer.form'];
                        _.forEach(removeContainers,function(item){
                            var index = _.findIndex(containerList,{id:item});
                            if(index > 1){
                                containerList.splice(index,1);
                            }
                        });
                        var container = mainViewService.setContainers(containerList);
                    }]*/
					loadInternetColumns: ['basicsMaterialCatalogService', function (basicsMaterialCatalogService) {
						return basicsMaterialCatalogService.isInternetFieldsFn(); // eventType is indirectly referenced by ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType() in processItem() of dataProcessor of transportplanningTransportMainService
					}],
				}
			};
			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function navFunc(item, triggerField) {
						if (triggerField === 'CatalogCode') {
							$injector.get('basicsMaterialCatalogService').searchByCalCode(item, triggerField);
						}
						else {
							$injector.get('basicsMaterialCatalogService').searchByCalId(item, triggerField);
						}
					}
				}
			);

			// var wizardData = [{
			// 	serviceName: 'materialcatalogSidebarWizardService',
			// 	wizardGuid: 'D159C643127049EC98D3E29DE633579B',
			// 	methodName: 'updateCount',
			// 	canActivate: true
			// },{
			// 	serviceName: 'materialcatalogSidebarWizardService',
			// 	wizardGuid: '451836DA793347B3BC479DE9422D2797',
			// 	methodName: 'disableRecord',
			// 	canActivate: true
			// },{
			// 	serviceName: 'materialcatalogSidebarWizardService',
			// 	wizardGuid: '5C0D377ED48542B7B60505846ACCDC43',
			// 	methodName: 'enableRecord',
			// 	canActivate: true
			// },{
			// 	serviceName: 'materialcatalogSidebarWizardService',
			// 	wizardGuid: '46498E3CB12E46D6B8A1F6E4E7A5F23E',
			// 	methodName: 'deepCopyMaterialCatalog',
			// 	canActivate: true
			// },{
			// 	serviceName: 'documentsProjectWizardService',
			// 	wizardGuid: '906F29A4FFCD4856B97CC8395EE39B21',
			// 	methodName: 'linkCx',
			// 	canActivate: true
			// }];
			// wizardService.registerWizard(wizardData);

		}]);

})(angular);