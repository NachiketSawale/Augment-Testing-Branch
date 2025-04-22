/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('salesBillingIndirectBalancingConfigurationService',
		['_', 'platformUIStandardConfigService', 'basicsLookupdataConfigGenerator', 'salesBillingTranslationService', 'platformSchemaService',
			function (_, platformUIStandardConfigService, basicsLookupdataConfigGenerator, salesBillingTranslationService, platformSchemaService) {

				var indirectsBalancingDetailLayout = {
					'fid': 'sales.billing.indirectsbalancing.detailform',
					'version': '0.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['ordheaderfk']
						}, {
							'gid': 'decreasedMargins',
							'attributes': ['isdeficitdjcrisk', 'isdeficitgcrisk', 'isdeficitdjcprofit', 'isdeficitgcprofit']
						}, {
							'gid': 'increasedMargins',
							'attributes': ['issurplusgconly']
						}, {
							'gid': 'markups',
							'attributes': ['calculationbase', 'admingeneralpercentage', 'riskpercentage', 'profitpercentage']
						}, {
							'gid': 'standardAwardedBaseAlternativeItems',
							'attributes': ['islowerlimitstrdbasealternitem', 'lowerlimitstrdbasealternitem', 'isupperlimitstrdbasealternitem', 'upperlimitstrdbasealternitem']
						}, {
							'gid': 'changeOrderItems',
							'attributes': ['islowerlimitprjchgitem', 'lowerlimitprjchgitem', 'isupperlimitprjchgitem', 'upperlimitprjchgitem']
						}, {
							'gid': 'specialBalancing',
							'attributes': ['isbalanceboqitemtypedwtmitem', 'isbalanceboqitemtypeoptional', 'isbalanceboqitemtype2basealt', 'isbalanceboqitemprjchg']
						}, {
							'gid': 'entityHistory',
							'isHistory': true
						}
					],

					'overloads': {
						'ordheaderfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'salesCommonContractLookupDataService',
							moduleQualifier: 'salesCommonContractLookupDataService',
							readonly: true,
							isComposite: true,
							navigator: {
								moduleName: 'sales.contract'
							}
						}),
						'calculationbase': {
							rid: 'calculationbase',
							model: 'CalculationBase',
							type: 'dropdown',
							options: {
								items: [ // TODO: extract types
									{id: 0, description: 'Of Revenue'},
									{id: 1, description: 'On Total Job Costs'}
								],
								valueMember: 'id',
								displayMember: 'description'
							},
							visible: true
						}
					}
				};
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'IndirectCostBalancingConfigDetailDto',
					moduleSubModule: 'Sales.Billing'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
					// extend scheme for additional attributes
					domainSchema.OrdHeaderFk = {domain: 'lookup'};
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;
				var service = new BaseService(indirectsBalancingDetailLayout, domainSchema, salesBillingTranslationService);

				service.getLayoutForCustomizing = function getLayoutForCustomizing() {
					var layoutForCustomizing = _.cloneDeep(service.getStandardConfigForDetailView());
					
					// remove contract
					_.remove(layoutForCustomizing.groups, {gid: 'basicData'});
					_.remove(layoutForCustomizing.rows, {rid: 'ordheaderfk'});

					return layoutForCustomizing;
				};

				return service;
			}
		]);
})();
