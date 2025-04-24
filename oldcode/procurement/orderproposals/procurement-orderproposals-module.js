/*
 * $Id: procurement-orderproposals-module.js 579498 2020-03-17 08:27:34Z yew $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'procurement.orderproposals';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var wizardData = [
				{
					serviceName: 'ProcurementOrderProposalsSidebarWizardService',
					wizardGuid: '006cc44ad01647f78818662a8cf4483d',
					methodName: 'CreateContract',
					canActivate: true
				}, {
					serviceName: 'ProcurementOrderProposalsSidebarWizardService',
					wizardGuid: '8545a67d634242eda41b7f39cd041aa8',
					methodName: 'CreateRequisition',
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
								'procurement.common'
							]);
							return platformSchemaService.getSchemas([
								{typeName: 'OrderProposalDto', moduleSubModule: 'Procurement.OrderProposals'},
								{typeName: 'StockTotalVDto', moduleSubModule: 'Procurement.Stock'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'},
								{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact'}
							]);
						}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['platformTranslateService',
		function (platformTranslateService) {
			platformTranslateService.registerModule(moduleName);
		}
	]);

})(angular);
