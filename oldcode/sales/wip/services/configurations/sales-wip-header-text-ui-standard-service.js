/**
 * $Id: sales-wip-header-text-ui-standard-service.js 48260 2022-07-27 08:33:04Z postic $
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesWipHeaderTextUIStandardService
	 * @function
	 *
	 * @description
	 * salesWipHeaderTextUIStandardService is used for header text controller
	 */
	salesWipModule.factory('salesWipHeaderTextUIStandardService', ['platformUIStandardConfigService', 'platformSchemaService', 'salesWipTranslationService', 'platformUIStandardExtentService', 'basicsLookupdataConfigGenerator',
		function (platformUIStandardConfigService, platformSchemaService, salesWipTranslationService, platformUIStandardExtentService, basicsLookupdataConfigGenerator) {

			var salesWipHeaderTextLayout = {
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [{
					'gid': 'baseGroup',
					'attributes': ['prctexttypefk', 'bastextmoduletypefk']
				}],
				'overloads': {
					'prctexttypefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({ dataServiceName: 'prcCommonTextTypeLookupDataService', enableCache: true }),
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
				domainSchema.TextType = { domain: 'string' };
			}

			function UIStandardService(layout, scheme, translationService) {
				BaseService.call(this, layout, scheme, translationService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;

			var service = new BaseService(salesWipHeaderTextLayout, domainSchema, salesWipTranslationService);
			platformUIStandardExtentService.extend(service, salesWipHeaderTextLayout.addition, domainSchema);

			// override getStandardConfigForDetailView
			var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
			service.getStandardConfigForDetailView = function () {
				return angular.copy(basicGetStandardConfigForDetailView());
			};

			return service;
		}
	]);
})();
