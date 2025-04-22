/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractWipConfigurationService', ['_', '$injector', 'platformUIStandardConfigService', 'salesCommonLookupConfigsService', 'salesContractTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'salesWipConfigurationService',
		function (_, $injector, platformUIStandardConfigService, salesCommonLookupConfigsService, salesContractTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, salesWipConfigurationService) {

			// get a copy from the original service
			var wipDetailLayout = salesWipConfigurationService.getLayoutDetailConfiguration();

			salesCommonLookupConfigsService.addCommonLookupsToLayout(wipDetailLayout);

			// make all other attributes readonly
			var overloads = wipDetailLayout.overloads;
			_.each(_.flatten(_.map(wipDetailLayout.groups, 'attributes')), function(attribute) {
				if (angular.isUndefined(overloads[attribute])) {
					overloads[attribute] = angular.extend(overloads[attribute] || {}, {readonly: true});
				}
			});

			var BaseService = platformUIStandardConfigService;

			var salesContractHeaderDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'WipHeaderDto',
				moduleSubModule: 'Sales.Wip'
			});

			if (salesContractHeaderDomainSchema) {
				salesContractHeaderDomainSchema = salesContractHeaderDomainSchema.properties;
			}

			function SalesContractWipUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			SalesContractWipUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesContractWipUIStandardService.prototype.constructor = SalesContractWipUIStandardService;
			return new BaseService(wipDetailLayout, salesContractHeaderDomainSchema, salesContractTranslationService);
		}
	]);
})();
