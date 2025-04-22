/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractConfigurationService', ['_', '$injector', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'salesCommonLookupConfigsService', 'salesContractTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'basicsCommonComplexFormatter',
		function (_, $injector, platformUIStandardConfigService, platformUIStandardExtentService, salesCommonLookupConfigsService, salesContractTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, basicsCommonComplexFormatter) {

			var contractsForProjectDetailLayout = {
				'fid': 'sales.contract.contracts.detailform',
				'version': '0.7.0',
				'change': 'change',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [
							'typefk', 'documenttype', 'rubriccategoryfk', 'configurationfk', 'billingmethodfk', 'companyresponsiblefk', 'billingschemafk', 'projectfk', 'billtofk', 
							'languagefk', 'ordstatusfk', 'code', 'descriptioninfo', 'currencyfk', 'bankfk', 'clerkfk', 'exchangerate',
							'amountnet', 'amountgross', 'amountnetoc', 'amountgrossoc',
							'contracttypefk', 'ordconditionfk', 'ordernocustomer','projectnocustomer',
							'bidheaderfk', 'ordheaderfk', 'estheaderfk', 'objunitfk', 'controllingunitfk', 'prcstructurefk', 'dateeffective',
							'qtoheadercode', 'qtoheaderdescription', 'bassalestaxmethodfk', 'isnotaccrualprr', 'iscanceled', 'isframework', 'frameworkcontractfk', 'isfreeitemsallowed', 'isbilloptionalitems','boqwiccatfk', 'boqwiccatboqfk'
						]
					},
					{
						'gid': 'customerData',
						'attributes': [
							'businesspartnerfk', 'subsidiaryfk', 'customerfk', 'contactfk', 'isdiversedebitorsallowed',
							'businesspartnerbilltofk', 'subsidiarybilltofk', 'customerbilltofk', 'contactbilltofk'
						]
					},
					{
						'gid': 'paymentData',
						'attributes': [
							'paymenttermfifk', 'paymenttermpafk', 'paymenttermadfk', 'taxcodefk', 'vatgroupfk'
						]
					},
					{
						'gid': 'datesData',
						'attributes': [
							'orderdate', 'plannedstart', 'plannedend'
						]
					},
					{
						'gid': 'generalSettingsData',
						'attributes': [
							'wiptypefk', 'revisionapplicable', 'wipfirst', 'wipduration', 'isdays',
							'wipcurrent', 'wipfrom', 'wipuntil', 'iswarrenty', 'warrantyamount', 'ordwarrentytypefk'
						]
					},
					{
						'gid': 'deliveryRequirements',
						'attributes': [
							'prcincotermfk', 'addressentity'
						]
					},
					{
						'gid': 'otherData',
						'attributes': [
							'prjchangefk', 'prjchangestatusfk', 'remark', 'commenttext'
						]
					},
					{
						'gid': 'userDefText',
						'isUserDefText': true,
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
					},
					{
						'gid': 'userDefDates',
						'attributes': ['userdefineddate01', 'userdefineddate02', 'userdefineddate03', 'userdefineddate04', 'userdefineddate05']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				'overloads': {
					typefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ordertype', null, {customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'}),
					isfreeitemsallowed: {
						readonly: false,
						mandatory: true
					},
					isbilloptionalitems: {
						readonly: false,
						mandatory: true
					},
					billingmethodfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salesbillingmethod'),
					'boqwiccatfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						moduleQualifier: 'estimateAssembliesWicGroupLookupDataService',
						dataServiceName: 'estimateAssembliesWicGroupLookupDataService',
						enableCache: true,
						valMember: 'Id',
						dispMember: 'Code'
					}, {
						name: 'Framework WIC Group',
						name$tr$: 'sales.contract.entityFwBoqWicCatFk',
						label: 'Framework WIC Group',
						label$tr$: 'sales.contract.entityFwBoqWicCatFk'
					}),
					'boqwiccatboqfk': {
						'navigator': {
							moduleName: 'boq.wic'
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'prc-common-wic-cat-boq-lookup',
								descriptionMember: 'BoqRootItem.BriefInfo.Translated',
								lookupOptions: {
									'filterKey': 'prc-con-wic-cat-boq-filter'
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'prc-common-wic-cat-boq-lookup',
								'lookupOptions': {
									'additionalColumns': true,
									'displayMember': 'BoqRootItem.Reference',
									'descriptionMember': 'BoqRootItem.BriefInfo.Translated',
									'addGridColumns': [
										{
											id: 'briefinfo',
											field: 'BoqRootItem.BriefInfo.Translated',
											name: 'Description',
											formatter: 'description',
											width: 150,
											name$tr$: 'cloud.common.entityDescription'
										}
									],
									'filterKey': 'prc-con-wic-cat-boq-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcWicCatBoqs',
								displayMember: 'BoqRootItem.Reference',
								descriptionMember: 'BoqRootItem.BriefInfo.Translated',
								pKeyMaps: [{ pkMember: 'BoqWicCatFk', fkMember: 'BoqWicCatFk' }]
							},
							width: 130
						}
					},
					'isframework': {
						'readonly': true,
						'width': 80
					},
					// #78328 + 76722
					documenttype: {
						readonly: true,
						isTransient: true
					},
					ordstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.orderstatus', null, {
						showIcon: true
					}),
					// TODO: see defect #82272: we need to find a solution to restrict e.g. by contract status
					// 'orderdate': {
					//  readonly: true
					// },
					'amountnet': {
						readonly: true
					},
					'amountnetoc': {
						readonly: true
					},
					'amountgross': {
						readonly: true
					},
					'amountgrossoc': {
						readonly: true
					},
					ordconditionfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ordercondition'),
					bidheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'salesCommonBidLookupDataService',
						filter: function (item) {
							// list bids from same project
							return item && item.ProjectFk ? item.ProjectFk : -1;
						},
						isComposite: true,
						readonly: true,
						navigator: {
							moduleName: 'sales.bid'
						}
					}),
					'frameworkcontractfk': {
						readonly: true,
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-contract-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'sales-common-contract-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesContract',
								displayMember: 'Code'
							}
						}
					},
					'ordheaderfk': overloadOrdHeaderFk(),
					'code': {
						readonly: true,
						mandatory: true,
						searchable: true,
						navigator: {
							moduleName: 'sales.contract',
							registerService: 'salesContractService'
						}
					},
					 billtofk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'projectBilltoLookupDataService',
						filter: function (item) {
							return item.ProjectFk;
					   },
						showClearButton: true,
					}),
					'addressentity': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-common-address-complex-control',
								'lookupOptions': {
									'foreignKey': 'AddressFk',
									'titleField': 'cloud.common.entityDeliveryAddress',
									'showClearButton': true,
									'hideSeachButton':true,
									'mainService':'salesContractService'
								}
							},
							'formatter': basicsCommonComplexFormatter,
							'formatterOptions': {'displayMember': 'AddressLine'},
							'width': 180
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-address-complex-control',
							'options': {
								'titleField': 'cloud.common.entityDeliveryAddress',
								'foreignKey': 'AddressFk',
								'showClearButton': true,
								'hideSeachButton':true,
								'mainService':'salesContractService'
							}
						}
					},
					'taxcodefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							},
							'change': 'formOptions.onPropertyChanged'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-master-data-context-tax-code-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TaxCode',
								displayMember: 'Code'
							},
							width: 100
						}
					},
					bankfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'businessPartnerMainBankLookupDataService',
						additionalColumns: false,
						dispMember: 'IbanNameOrBicAccountName',
						isComposite: false,
						filter: function () {
							return $injector.get('salesCommonContextService').getCompany().BusinessPartnerFk || -1;
						}
					}),
					wiptypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.workinprogresstype'),
					ordwarrentytypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.orderwarrentytype'),
					'prcincotermfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-incoterm-combobox',
							'options': {
								showClearButton: true
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-lookupdata-incoterm-combobox'
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcincoterm',
								displayMember: 'Description'
							}
						}
					},
					contactfk: {
						detail: {
							type: 'directive',
							directive: 'business-partner-main-filtered-contact-combobox',
							options: {
								initValueField: 'FamilyName',
								filterKey: 'sales-contract-contact-by-bizpartner-server-filter',
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-filtered-contact-combobox',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'sales-contract-contact-by-bizpartner-server-filter'
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'FamilyName'
							}
						}
					},
					qtoheadercode: {
						readonly: true,
						navigator: {
							moduleName: 'qto.main'
						},
						detail: {
							'type': 'directive',
							'directive': 'platform-composite-input',
							'model': 'QtoHeaderCode',
							'options': {
								'rows': [{
									'type': 'code',
									'model': 'QtoHeaderCode',
									'cssLayout': 'xs-12 sm-12 md-4 lg-4',
									'readonly': true
								}, {
									'type': 'description',
									'model': 'QtoHeaderDescription',
									'cssLayout': 'xs-12 sm-12 md-8 lg-8',
									'validate': false,
									'readonly': true
								}]
							}
						}
					},
					qtoheaderdescription: {
						readonly: true
					},
					'businesspartnerfk': $injector.get('salesCommonLookupConfigsService').BusinessPartnerLookupConfig('salesContractService'),
					prjchangefk: {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'project-change-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: false,
									createOptions: {
										typeOptions: {
											isSales: true,
											isChangeOrder: true
										}
									},
									filterKey: 'sales-contract-project-change-common-filter'
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'project-change-dialog',
								lookupOptions: {
									showClearButton: false,
									createOptions: {
										typeOptions: {
											IsSales: true,
											IsChangeOrder: true
										}
									},
									filterKey: 'sales-contract-project-change-common-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'projectchange',
								displayMember: 'Code'
							},
							width: 130
						},
						required: true
					},
					prjchangestatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projectchangestatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusIconService',
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
						field: 'RubricCategoryFk',
						isTransient: true
					})
				}
			};

			salesCommonLookupConfigsService.addCommonLookupsToLayout(contractsForProjectDetailLayout);
			salesCommonLookupConfigsService.registerCommonFilters();

			var BaseService = platformUIStandardConfigService;

			var salesContractOrdHeaderDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'OrdHeaderDto',
				moduleSubModule: 'Sales.Contract'
			});

			if (salesContractOrdHeaderDomainSchema) {
				salesContractOrdHeaderDomainSchema = salesContractOrdHeaderDomainSchema.properties;
				salesCommonLookupConfigsService.addCommonDomainSchemaProps(salesContractOrdHeaderDomainSchema);
			}

			// extend scheme for additional attributes
			salesContractOrdHeaderDomainSchema.DocumentType = {domain: 'description'};

			function SalesContractUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			function overloadOrdHeaderFk() {
				var ret;
				ret = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'salesCommonContractLookupDataService',
					moduleQualifier: 'salesCommonContractLookupDataService',
					filter: function (item) {
						// list contracts from same project
						return item && item.ProjectFk ? item.ProjectFk : -1;
					},
					filterKey: 'sales-contract-contract-self-reference-exclude-filter',
					isComposite: true,
					navigator: {
						moduleName: 'sales.contract'
					}
				});
				ret.required = true;
				return ret;
			}

			let entityInformation = { module: angular.module('sales.contract'), moduleName: 'Sales.Contract', entity: 'OrdHeader' };
			SalesContractUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesContractUIStandardService.prototype.constructor = SalesContractUIStandardService;
			var service = new BaseService(contractsForProjectDetailLayout, salesContractOrdHeaderDomainSchema, salesContractTranslationService, entityInformation);

			// TODO: #144627 refactor+simplify
			contractsForProjectDetailLayout.overloads.rubriccategoryfk.grid.editorOptions.lookupOptions.filterKey = 'sales-contract-rubric-category-by-rubric-filter';
			contractsForProjectDetailLayout.overloads.rubriccategoryfk.detail.options.lookupOptions.filterKey = 'sales-contract-rubric-category-by-rubric-filter';

			platformUIStandardExtentService.extend(service, salesCommonLookupConfigsService.getAdditionalGridColumnsFor(['projectfk', 'prcstructurefk','prjchangefk']), salesContractOrdHeaderDomainSchema);

			// re-use the layout configuration somewhere else (e.g. in the wip module)
			service.getLayoutDetailConfiguration = function getLayoutDetailConfiguration() {
				return _.cloneDeep(contractsForProjectDetailLayout);
			};

			return service;
		}
	]);
})();
