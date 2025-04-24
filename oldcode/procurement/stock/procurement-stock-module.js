/**
 * Created by wui on 8/21/2017.
 */
(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	'use strict';

	var moduleName = 'procurement.stock';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/**
	 * Stock Management Module
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {
			var wizardData = [
				{
					serviceName: 'procurementInvoiceWizardsService',
					wizardGuid: 'd3ca8a9357d24628bf1e3e2f99b7e1e7',
					methodName: 'Stock Transaction Calculator',
					canActivate: true
				},{
					serviceName: 'projectStockSidebarWizardService',
					wizardGuid: '2cd0b934ad0e4cbdbd760f82a31a0686',
					methodName: 'ClearProjectStock',
					canActivate: true
				},{
					serviceName: 'projectStockSidebarWizardService',
					wizardGuid: '2d69a3c1ef3347498d697685bc88c584',
					methodName: 'CreateOrderProposal',
					canActivate: true
				}, {
					serviceName: 'projectStockSidebarWizardService',
					wizardGuid: '8d718dd09ebe4aed88af9ea2e8bd4b4f',
					methodName: 'createAccrualTransaction',
					canActivate: true
				}
			];
			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', 'platformTranslateService',
						function (platformSchemaService, basicsConfigWizardSidebarService, platformTranslateService) {
							basicsConfigWizardSidebarService.registerWizard(wizardData);
							platformTranslateService.registerModule([
								moduleName,
								'model.main',
								'model.simulation',
								'model.viewer',
								'procurement.common',
								'project.stock',
								'basics.common'
							]);
							return platformSchemaService.getSchemas([
								{typeName: 'StockHeaderVDto', moduleSubModule: 'Procurement.Stock'},
								{typeName:'StockTotalVDto', moduleSubModule: 'Procurement.Stock'},
								{typeName:'StockTransactionDto', moduleSubModule: 'Procurement.Stock'},
								{typeName:'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'ProjectStockDownTimeDto', moduleSubModule: 'Project.Stock'},
								{typeName: 'CompanyTrans2StockDto', moduleSubModule: 'Procurement.Stock'},
								{typeName: 'StockItemInfoVDto', moduleSubModule: 'Procurement.Stock'}
							]);
						}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function(basicsLookupdataLookupDefinitionService){
						return basicsLookupdataLookupDefinitionService.load([
							// 'procurementStockStockHeaderDialog',
							'businessPartnerMainSupplierLookup'
						]);
					}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
				}
			};

			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: 'procurement.stock',
					navFunc: function (item, triggerField) {
						$injector.get('procurementStockHeaderDataService').navigateTo(item, triggerField);
					}
				}
			);
		}]);
})(angular);