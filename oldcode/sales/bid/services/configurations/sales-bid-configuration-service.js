/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'sales.bid';
	angular.module(moduleName).factory('salesBidConfigurationService', ['$injector', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'salesCommonLookupConfigsService', 'salesBidTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',
		function ($injector, platformUIStandardConfigService, platformUIStandardExtentService, salesCommonLookupConfigsService, salesBidTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

			function getDetailLayout() {
				var bidsForProjectDetailLayout = {
					'fid': 'sales.bid.bids.detailform',
					'version': '0.5.0',
					'change': 'change',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': [
								'typefk', 'documenttype', 'rubriccategoryfk', 'configurationfk', 'companyresponsiblefk', 'billingschemafk', 'projectfk', 'estheaderfk',
								'languagefk', 'bidstatusfk', 'code', 'descriptioninfo', 'currencyfk', 'exchangerate', 'clerkfk',
								'amountnet', 'amountgross', 'amountnetoc', 'amountgrossoc',
								'contracttypefk', 'ordconditionfk', 'bidheaderfk', 'objunitfk', 'controllingunitfk', 'prcstructurefk', 'dateeffective',
								'prcincotermfk', 'bassalestaxmethodfk'
							]
						},
						{
							'gid': 'customerData',
							'attributes': [
								'businesspartnerfk', 'subsidiaryfk', 'customerfk', 'bpdcontactfk',
								'businesspartnerbilltofk', 'subsidiarybilltofk', 'customerbilltofk', 'contactbilltofk'
							]
						},
						{
							'gid': 'paymentData',
							'attributes': [
								'paymenttermfifk', 'paymenttermpafk', 'taxcodefk', 'vatgroupfk'
							]
						},
						{
							'gid': 'datesData',
							'attributes': [
								'quotedate', 'pricefixingdate', 'plannedstart', 'plannedend'
							]
						},
						{
							'gid': 'contractProbability',
							'attributes': [
								'ordprbltypercent', 'ordprbltylastvaldateandwhoupd'
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
						typefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.bidtype', null, {customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'}),
						documenttype: {
							readonly: true,
							isTransient: true
						},
						bidstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.bidstatus', null, {
							showIcon: true
						}),
						'quotedate': {
							readonly: true
						},
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
						estimationcode: {
							readonly: true
						},
						estimationdescription: {
							readonly: true
						},
						ordprbltypercent: {
							readonly: false
						},
						ordprbltylastvaldateandwhoupd: {
							readonly: true
						},
						'ordconditionfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ordercondition'),
						'bidheaderfk': overloadBidHeaderFk(),
						'code': {
							readonly: true,
							mandatory: true,
							searchable: true,
							navigator: {
								moduleName: 'sales.bid',
								registerService: 'salesBidService'
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
						'prcincotermfk': {
							'detail': {
								'type': 'directive',
								// 'directive': 'basics-lookupdata-incoterm-combobox',
								// 'options': {
								//    showClearButton: true
								// }
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-incoterm-combobox',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
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
									// displayMember: 'Description'
									displayMember: 'Code'
								}
							}
						},
						bpdcontactfk: {
							detail: {
								type: 'directive',
								directive: 'business-partner-main-filtered-contact-combobox',
								options: {
									initValueField: 'FamilyName',
									filterKey: 'sales-bid-contact-by-bizpartner-server-filter',
									showClearButton: true
								}
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'business-partner-main-filtered-contact-combobox',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'sales-bid-contact-by-bizpartner-server-filter'
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
						'businesspartnerfk': $injector.get('salesCommonLookupConfigsService').BusinessPartnerLookupConfig('salesBidService',true),
						'prjchangefk': {
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'project-change-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true,
										createOptions: {
											typeOptions: {
												isSales: true,
												isProjectChange: true
											}
										},
										filterKey: 'sales-bid-project-change-common-filter'
									}
								}
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'project-change-dialog',
									lookupOptions: {
										showClearButton: true,
										createOptions: {
											typeOptions: {
												isSales: true,
												isProjectChange: true
											}
										},
										filterKey: 'sales-bid-project-change-common-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'projectchange',
									displayMember: 'Code'
								},
								width: 130
							}
						}
					}
				};

				salesCommonLookupConfigsService.addCommonLookupsToLayout(bidsForProjectDetailLayout);
				salesCommonLookupConfigsService.registerCommonFilters();

				return bidsForProjectDetailLayout;
			}

			var BaseService = platformUIStandardConfigService;

			var salesBidHeaderDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'BidHeaderDto',
				moduleSubModule: 'Sales.Bid'
			});

			if (salesBidHeaderDomainSchema) {
				salesBidHeaderDomainSchema = salesBidHeaderDomainSchema.properties;
				salesCommonLookupConfigsService.addCommonDomainSchemaProps(salesBidHeaderDomainSchema);
			}

			// extend scheme for additional attributes
			salesBidHeaderDomainSchema.DocumentType = {domain: 'description'};
			salesBidHeaderDomainSchema.OrdPrbltyLastvalDateAndWhoupd = {domain: 'description'};

			function SalesBidUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			function overloadBidHeaderFk() {
				var ret;
				ret = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'salesBidHeaderRefLookupDataService',
					filter: function (item) {
						if (item && item.Version === 0) {
							return item;
						}
						return item.Id;
					}
				});
				ret.required = true;
				// adding bid status column
				var bidStatusColumConfig = {
					id: 'Status',
					field: 'BidStatusFk',
					name: 'Status',
					formatter: "lookup",
					name$tr$: 'entityBidStatusFk',
					formatterOptions: {
						displayMember: "Description",
						imageSelector: "platformStatusIconService",
						lookupModuleQualifier: "basics.customize.bidstatus",
						lookupSimpleLookup: true,
						valueMember: "Id"
					}
				};
				ret.grid.editorOptions.lookupOptions.columns.push(bidStatusColumConfig);
				ret.detail.options.lookupOptions.columns.push(bidStatusColumConfig);
				return ret;
			}
			let entityInformation = {module: angular.module('sales.bid'), moduleName: 'Sales.Bid', entity: 'BidHeader'};
			SalesBidUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesBidUIStandardService.prototype.constructor = SalesBidUIStandardService;
			var service = new BaseService(getDetailLayout(), salesBidHeaderDomainSchema, salesBidTranslationService,entityInformation);
			service.getDetailLayout = getDetailLayout;

			// TODO: #144627 refactor+simplify
			getDetailLayout().overloads.rubriccategoryfk.grid.editorOptions.lookupOptions.filterKey = 'sales-bid-rubric-category-by-rubric-filter';
			getDetailLayout().overloads.rubriccategoryfk.detail.options.lookupOptions.filterKey = 'sales-bid-rubric-category-by-rubric-filter';

			platformUIStandardExtentService.extend(service, salesCommonLookupConfigsService.getAdditionalGridColumnsFor(['projectfk', 'prcstructurefk']), salesBidHeaderDomainSchema);

			return service;
		}
	]);
})();
