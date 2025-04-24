/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'basics.controllingcostcodes';

	/**
	 * @ngdoc service
	 * @name basicsControllingCostCodesAccountUIStandardService
	 * @function
	 *
	 * @description
	 * basicsControllingCostCodesAccountUIStandardService
	 */
	angular.module(moduleName).factory('basicsControllingCostCodesAccountUIStandardService',
		['platformUIStandardConfigService', 'basicsControllingCostCodesTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',
			function (platformUIStandardConfigService, basicsControllingCostCodesTranslationService, platformSchemaService,basicsLookupdataConfigGenerator) {

				let BaseService = platformUIStandardConfigService;
				let basicsControllingCostCodesAccountUILayout = {

					'fid': 'basics.controllingcostcodes.account.layout',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['mdccontextfk','mdcledgercontextfk', 'basaccountfk', 'factor','nominaldimension1','nominaldimension2','nominaldimension3']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],

					'overloads': {
						'mdccontextfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.lookup.context', 'Description'),
						'mdcledgercontextfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-prc-structure-ledger-context-combo-box'
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'LedgerContext',
									displayMember: 'Description'
								},
								editor: 'lookup',
								editorOptions: {
									'directive': 'basics-prc-structure-ledger-context-combo-box'
								},
								width: 120
							}
						},
						'basaccountfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'procurementStructureAccountLookupDataService',
							enableCache: true
						}),
						'factor':{
							'change': 'change'
						},
						'nominaldimension1':{
							'change': 'change'
						},
						'nominaldimension2':{
							'change': 'change'
						},
						'nominaldimension3':{
							'change': 'change'
						}
					}
				};

				let basicsControllingCostCodesAccountDomainSchema = platformSchemaService.getSchemaFromCache({ typeName: 'Account2MdcContrCostDto',moduleSubModule: 'Basics.ControllingCostCodes'});
				if (basicsControllingCostCodesAccountDomainSchema) {
					basicsControllingCostCodesAccountDomainSchema = basicsControllingCostCodesAccountDomainSchema.properties;
				}

				function controllingCostCodesAccountUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				controllingCostCodesAccountUIStandardService.prototype = Object.create(BaseService.prototype);
				controllingCostCodesAccountUIStandardService.prototype.constructor = controllingCostCodesAccountUIStandardService;
				return new BaseService(basicsControllingCostCodesAccountUILayout, basicsControllingCostCodesAccountDomainSchema , basicsControllingCostCodesTranslationService);
			}
		]);
})(angular);

