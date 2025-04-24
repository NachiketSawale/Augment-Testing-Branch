(function (){
	'use strict';

	var moduleName = 'procurement.common';
	var prcContractModule = 'procurement.contract';
	var cloudCommonModule = 'cloud.common';
	var salesContractModule = 'sales.contract';

	// eslint-disable-next-line no-redeclare
	/* global angular,$ */

	angular.module(moduleName).factory('procurementContractAdvanceDetailLayout', [
		'prcAndSalesContractAdvanceDetailLayout',
		'prcOnlyContractAdvanceDetailLayout',
		function(
			commonLayout,
			prcOnlyLayout
		) {
			var basicDataArray = commonLayout.groups[0].attributes.concat(prcOnlyLayout.groups[0].attributes);
			var additionGridArray = commonLayout.addition.grid.concat(prcOnlyLayout.addition.grid);
			var translationAddition = commonLayout.translationInfos.extraModules.concat(prcOnlyLayout.translationInfos.extraModules);
			var prcCommonLayout = $.extend(true, {}, commonLayout, prcOnlyLayout);
			prcCommonLayout.groups[0].attributes = basicDataArray;
			prcCommonLayout.addition.grid = additionGridArray;
			prcCommonLayout.translationInfos.extraModules = translationAddition;
			return prcCommonLayout;
		}]);

	angular.module(moduleName).factory('salesContractAdvanceDetailLayout', [
		'prcAndSalesContractAdvanceDetailLayout',
		'salesOnlyContractAdvanceDetailLayout',
		function(
			commonLayout,
			salesOnlyLayout
		) {
			var basicDataArray = commonLayout.groups[0].attributes.concat(salesOnlyLayout.groups[0].attributes);
			var additionGridArray = commonLayout.addition.grid.concat(salesOnlyLayout.addition.grid);
			var translationAddition = commonLayout.translationInfos.extraModules.concat(salesOnlyLayout.translationInfos.extraModules);
			var prcCommonLayout = $.extend(true, {}, commonLayout, salesOnlyLayout);
			prcCommonLayout.groups[0].attributes = basicDataArray;
			prcCommonLayout.addition.grid = additionGridArray;
			prcCommonLayout.translationInfos.extraModules = translationAddition;
			return prcCommonLayout;
		}]);

	angular.module(moduleName).factory('prcAndSalesContractAdvanceDetailLayout', [
		function () {
			return {
				'fid': 'procurement.contract.advance.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'translationInfos': {
					'extraModules': [prcContractModule, cloudCommonModule],
					'extraWords': {
						'DateDue': {
							'location': prcContractModule,
							'identifier': 'entityDateDue',
							'initial': 'Date Due'
						},
						'AmountDue': {
							'location': prcContractModule,
							'identifier': 'entityAmountDue',
							'initial': 'Amount Due'
						},
						'DateDone': {
							'location': prcContractModule,
							'identifier': 'entityDateDone',
							'initial': 'Date Done'
						},
						'AmountDone': {
							'location': prcContractModule,
							'identifier': 'entityAmountDone',
							'initial': 'Amount Done'
						},
						'Description': {
							'location': cloudCommonModule,
							'identifier': 'entityDescription',
							'initial': 'Description'
						},
						'AmountDueOc': {
							'location': prcContractModule,
							'identifier': 'entityAmountDueOc',
							'initial': 'Amount Due Oc'
						},
						'AmountDoneOc': {
							'location': prcContractModule,
							'identifier': 'entityAmountDoneOc',
							'initial': 'Amount Done Oc'
						},
						'PaymentTermFk': {
							location: moduleName,
							identifier: 'paymentTerm',
							initial: 'Payment Term'
						}
					}
				},
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['description', 'datedue', 'amountdue', 'datedone', 'amountdone', 'commenttext', 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'amountdueoc', 'amountdoneoc', 'paymenttermfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'commenttext': {
						maxLength: 252
					},
					'description': {
						maxLength: 252
					},
					'userdefined1': {
						maxLength: 252
					},
					'userdefined2': {
						maxLength: 252
					},
					'userdefined3': {
						maxLength: 252
					},
					'userdefined4': {
						maxLength: 252
					},
					'userdefined5': {
						maxLength: 252
					},
					'paymenttermfk':{
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookupdata-payment-term-lookup',
								'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-payment-term-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'showClearButton': true}
							}
						}
					}
				},
				'addition': {
					grid: [{
						'lookupDisplayColumn': true,
						'field': 'PaymentTermFk',
						'name$tr$': 'procurement.common.paymentTermDes',
						'width': 180
					}],
					detail: []
				}
			};
		}]);

	angular.module(moduleName).factory('prcOnlyContractAdvanceDetailLayout', [
		'basicsLookupdataConfigGenerator',
		function(
			basicsLookupdataConfigGenerator
		) {
			return {
				'groups': [{
					'gid': 'basicData',
					'attributes': ['prcadvancetypefk', 'percentprorata']
				}],
				'translationInfos': {
					'extraModules': [],
					'extraWords': {
						'PrcAdvanceTypeFk': {
							'location': prcContractModule,
							'identifier': 'entityAdvanceType',
							'initial': 'Advance Type'
						},
						'PercentProrata': {
							'location': prcContractModule,
							'identifier': 'entityPercentProrata',
							'initial': 'Percent Prorata'
						}
					},
				},
				'overloads': {
					'prcadvancetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.prcadvancetype', 'Description', null, false, {})
				},
				'addition': {
					grid: [],
					detail: []
				}
			};
		}]);

	angular.module(moduleName).factory('salesOnlyContractAdvanceDetailLayout', [
		'basicsLookupdataConfigGenerator',
		function(basicsLookupdataConfigGenerator) {
			return {
				'groups': [{
					'gid': 'basicData',
					'attributes': ['slsadvancetypefk', 'bilheaderfk', 'ordadvancestatusfk', 'reductionrule', 'reductionvalue']
				}],
				'translationInfos': {
					'extraModules': [salesContractModule],
					'extraWords': {
						'SlsAdvanceTypeFk': {
							'location': salesContractModule,
							'identifier': 'entityAdvanceType',
							'initial': 'Advance Type'
						},
						'OrdAdvanceStatusFk': {
							'location': salesContractModule,
							'identifier': 'ordAdvanceStatus',
							'initial': 'Advance Status'
						},
						'ReductionRule': {
							'location': salesContractModule,
							'identifier': 'entityReductionRule',
							'initial': 'Reduction Rule'
						},
						'ReductionValue': {
							'location': salesContractModule,
							'identifier': 'entityReductionValue',
							'initial': 'Reduction Value'
						},
						'BilHeaderFk': {
							'location': salesContractModule,
							'identifier': 'entityBilHeaderFk',
							'initial': 'Advance Payment Bill No.'
						},
					},
				},
				'overloads': {
					'slsadvancetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salesadvancetype', 'Description', null, false, {}),
					'ordadvancestatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('sales.contract.advance.status', null, {
						showIcon: true
					}),
					'bilheaderfk': {
						navigator: {
							moduleName: 'sales.billing'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'sales-common-bill-dialog-v2',
								lookupOptions: {
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo',
										name: 'Description',
										formatter: 'translation',
										name$tr$: 'cloud.common.entityDescription'
									}],
									filterKey: 'sales-contract-advance-billing-filter',
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesBillingV2',
								displayMember: 'BillNo'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								filterKey: 'sales-contract-advance-billing-filter',
								lookupDirective: 'sales-common-bill-dialog-v2',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'sales-contract-advance-billing-filter',
									'showClearButton': true
								}
							}
						}
					},
					'reductionrule': {
						width: 240,
						detail: {
							type: 'directive',
							directive: 'sales-contract-reduction-rule-lookup',
							options: {
								showClearButton: false
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'sales-contract-reduction-rule-lookup',
								lookupOptions: {
									showClearButton: false
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'reductionrule',
								displayMember: 'Description'
							}
						}
					}
				},
				'addition': {
					grid: [],
					detail: []
				}
			};
		}]);
})();