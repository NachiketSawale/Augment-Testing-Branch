/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingHeaderTextUIStandardService
	 * @function
	 *
	 * @description
	 * salesBillingHeaderTextUIStandardService is used for header text controller
	 */
	salesBillingModule.factory('salesBillingHeaderTextUIStandardService', ['platformUIStandardConfigService', 'platformSchemaService', 'salesBillingTranslationService', 'platformUIStandardExtentService', 'basicsLookupdataConfigGenerator',
		function (platformUIStandardConfigService, platformSchemaService, salesBillingTranslationService, platformUIStandardExtentService, basicsLookupdataConfigGenerator) {

			var salesBillingHeaderTextLayout = {
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [{
					'gid': 'baseGroup',
					'attributes': ['prctexttypefk', 'bastextmoduletypefk']
				}],
				'overloads': {
					'prctexttypefk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName:'prcCommonTextTypeLookupDataService' ,enableCache: true}),
					'bastextmoduletypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.textmoduletype')
				},
				'addition': {
					'grid': [],
					'detail': []
				}
			};

			var BaseService = platformUIStandardConfigService,
				domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'SalesHeaderblobDto',
					moduleSubModule: 'Sales.Common'
				});

			if (domainSchema) {
				domainSchema = domainSchema.properties;

				// add domain for name
				domainSchema.TextType = {domain: 'string'};
			}

			function UIStandardService(layout, scheme, translationService) {
				BaseService.call(this, layout, scheme, translationService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;

			var service = new BaseService(salesBillingHeaderTextLayout, domainSchema, salesBillingTranslationService);
			platformUIStandardExtentService.extend(service, salesBillingHeaderTextLayout.addition, domainSchema);

			// override getStandardConfigForDetailView
			var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
			service.getStandardConfigForDetailView = function (){
				return angular.copy(basicGetStandardConfigForDetailView());
			};

			return service;
		}
	]);
})();
