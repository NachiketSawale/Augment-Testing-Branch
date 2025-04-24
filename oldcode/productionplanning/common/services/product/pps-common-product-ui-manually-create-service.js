
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';
	var engtaskModule = angular.module(moduleName);

	engtaskModule.factory('ppsCommonProductManuallyUICreateServiceFactory', UICreateService);
	UICreateService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'productionplanningCommonTranslationService'];

	function UICreateService(platformSchemaService,
							   platformUIStandardConfigService,
							   translationServ) {
		let service = {};

		service.CreateUIService = (isFieldProdplaceReadonly = false) => {
			var layoutConfig =
				{
					'fid': 'productionplanning.common.productlayout',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [{
						gid: 'baseGroup',
						attributes: ['enddate','prodplacefk']
					}],
					'overloads': {
						enddate: {
							detail: {
								type: 'dateutc',
								formatter: 'dateutc'
							},
							grid: {
								editor: 'dateutc',
								formatter: 'dateutc'
							}
						},
						prodplacefk: {
							readonly: isFieldProdplaceReadonly,
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'pps-production-place-dialog-lookup',
									lookupOptions: {
										filterKey: 'pps-common-product-prodPlace-site-filter', // this filter is registered in productionplanningCommonProductDetailLayout
										version: 3
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PpsProductionPlace',
									displayMember: 'Code',
									version: 3
								},
								width: 70
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupOptions: {
										filterKey: 'pps-common-product-prodPlace-site-filter',
										version: 3
									},
									lookupDirective: 'pps-production-place-dialog-lookup',
									descriptionMember: 'Description'
								}
							}
						}
					}
				};

			var BaseService = platformUIStandardConfigService;

			var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'});
			ruleSetAttributeDomains = ruleSetAttributeDomains.properties;
			return new BaseService(layoutConfig, ruleSetAttributeDomains, translationServ);
		};

		return service;
	}

	engtaskModule.factory('ppsCommonProductManuallyUICreateService', ppsCommonProductManuallyUICreateService);
	ppsCommonProductManuallyUICreateService.$inject = ['ppsCommonProductManuallyUICreateServiceFactory'];

	function ppsCommonProductManuallyUICreateService(ppsCommonProductManuallyUICreateServiceFactory) {
		return ppsCommonProductManuallyUICreateServiceFactory.CreateUIService();
	}

	engtaskModule.factory('ppsCommonProductManuallyUICreateService2', ppsCommonProductManuallyUICreateService2);
	ppsCommonProductManuallyUICreateService2.$inject = ['ppsCommonProductManuallyUICreateServiceFactory'];

	function ppsCommonProductManuallyUICreateService2(ppsCommonProductManuallyUICreateServiceFactory) {
		return ppsCommonProductManuallyUICreateServiceFactory.CreateUIService(true);
	}
})(angular);

