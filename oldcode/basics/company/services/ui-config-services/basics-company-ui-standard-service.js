/**
 * Created by henkel on 16.09.2014
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of company entities
	 */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCompanyUIStandardService',
		['platformUIStandardConfigService', '$injector', 'basicsCompanyTranslationService', 'basicsLookupdataConfigGenerator',
			'platformSchemaService', 'basicsCommonComplexFormatter', 'platformObjectHelper', 'platformUIStandardExtentService',
			'basicsLookupdataLookupFilterService', 'basicsCommonComplexFormatter', 'basicsCommonCommunicationFormatter',

			function (platformUIStandardConfigService, $injector, basicsCompanyTranslationService, basicsLookupdataConfigGenerator,
			          platformSchemaService, basicsCommonComplexFormatter, platformObjectHelper, platformUIStandardExtentService,
			          basicsLookupdataLookupFilterService, complexFormatter, communicationFormatter) {
				function filterByMasterDataContext(item, company) {
					return item.ContextFk === company.ContextFk;
				}

				function filterByLedgerContext(item, company) {
					return item.LedgerContextFk === company.LedgerContextFk;
				}

				var filters = [
					{
						key: 'basicsCompanyByMasterDataContext-filter',
						fn: filterByMasterDataContext
					},
					{
						key: 'basicsCompanyByLedgerContext-filter',
						fn: filterByLedgerContext
					},
					{
						key: 'basics-company-main-calendar-filter',
						fn: function (item, object) {
							return (item.SchedulingContextFk === object.SchedulingContextFk);
						}
					},
					{
						key: 'basics-company-main-billingschema-filter',
						fn: function (item, object) {
							return (item.LedgerContextFk === object.LedgerContextFk);
						}
					},
					//supplier
					{
						key: 'basics-company-main-supplier-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-supplier-basic-filter',
						fn: function (currentItem) {
							return {SubledgerContextFk: currentItem.SubledgerContextFk};
						}
					},
					//customer
					{
						key: 'basics-company-main-customer-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-customer-basic-filter',
						fn: function (currentItem) {
							return {SubledgerContextFk: currentItem.SubledgerContextFk};
						}
					},
					{
						key: 'basics-company-main-taxcode-filter',
						fn: function (currentItem, rel) {
							return currentItem.LedgerContextFk === rel.LedgerContextFk;
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				function createLineItemContextOverload() {
					var overload = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.internal.lineitemcontext', null, {
						field: 'ContextFk',
						customIntegerProperty: 'MDC_CONTEXT_FK'
					});
					overload.detail.options.filterKey = 'basicsCompanyByMasterDataContext-filter';
					overload.grid.editorOptions.lookupOptions.filterKey = 'basicsCompanyByMasterDataContext-filter';
					return overload;
				}

				function createCalendarSchedulingContextOverload() {
					var overload = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.internal.lookup.calendar', null, {
						field: 'SchedulingContextFk',
						customIntegerProperty: 'BAS_SCHEDULING_CONTEXT_FK'
					});
					overload.detail.options.filterKey = 'basics-company-main-calendar-filter';
					overload.grid.editorOptions.lookupOptions.filterKey = 'basics-company-main-calendar-filter';
					return overload;
				}

				function createBillingSchemaLedgerContextOverload() {
					var overload = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.internal.lookup.billingschema', null, {
						field: 'LedgerContextFk',
						customIntegerProperty: 'MDC_LEDGER_CONTEXT_FK'
					});
					overload.detail.options.filterKey = 'basics-company-main-billingschema-filter';
					overload.grid.editorOptions.lookupOptions.filterKey = 'basics-company-main-billingschema-filter';
					return overload;
				}

				function createMainDetailLayout() {
					return {

						fid: 'basics.company.companydetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						addAdditionalColumns: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'address',
								'attributes': ['code', 'loginallowed', 'clerkfk', 'companytypefk', 'companyname', 'companyname2', 'companyname3', 'countryfk', 'addressfk', 'telephonenumberfk', 'telephonetelefaxfk', 'email', 'internet', 'currencyfk', 'languagefk', 'profitcenter', 'dunsno', 'externalcode', 'islive']
							},
							{
								'gid': 'standardValues',
								'attributes': ['billingschemafk', 'taxcodefk', 'paymenttermpafk', 'paymenttermfifk', 'calendarfk', 'signatory', 'crefono', 'vatno', 'taxno', 'businesspartnerfk','prrmethodfk', 'isrestrictedtoprofitcenter', 'issequencebasedonprofitcenter']
							},
							{
								'gid': 'masterDataPool',
								'attributes': ['contextfk', 'schedulingcontextfk', 'hsqcontextfk', 'lineitemcontextfk', 'ledgercontextfk', 'subledgercontextfk', 'modulecontextfk', 'textmodulecontextfk', 'resourcecontextfk', 'equipmentcontextfk', 'defectcontextfk', 'timesheetcontextfk', 'logisticcontextfk', 'projectcontextfk', 'priceconditionfk', 'equipmentdivisionfk', 'isribarchive', 'iscalculateovergross']
							},
							{
								gid: 'userDefTextGroup',
								isUserDefText: true,
								attCount: 5,
								attName: 'userdefined',
								noInfix: true
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							internet: {
								grid: {
									editor: 'url',
									formatterOptions: {
										dataServiceName: 'basicsCompanyMainService'
									},
									formatter: 'url'
								}
							},
							clerkfk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Clerk',
										displayMember: 'Code'
									}
								}
							},
							calendarfk: createCalendarSchedulingContextOverload(),
							addressfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-address-dialog',
									model: 'AddressDto',
									options: {
										titleField: 'cloud.common.address',
										foreignKey: 'AddressFk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'basics-common-address-dialog',
										lookupOptions: {
											foreignKey: 'AddressFk',
											titleField: 'cloud.common.address'
										}
									},
									formatter: 'description',
									field: 'AddressDto',
									formatterOptions: {
										displayMember: 'Address'
									}
								}
							},
							telephonenumberfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-telephone-dialog',
									model: 'TelephoneNumberDto',
									options: {
										titleField: 'cloud.common.telephoneNumber',
										foreignKey: 'TelephoneNumberFk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									field: 'TelephoneNumberDto',
									editorOptions: {
										lookupDirective: 'basics-common-telephone-dialog',
										lookupOptions: {
											foreignKey: 'TelephoneNumberFk',
											titleField: 'cloud.common.telephoneNumber'
										}
									},
									formatter: complexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							},
							telephonetelefaxfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-telephone-dialog',
									model: 'TelephoneNumberTelefaxDto',
									options: {
										titleField: 'cloud.common.fax',
										foreignKey: 'telephoneTelefaxFk',
										showClearButton: true
									}
								},
								'grid': {
									'editor': 'lookup',
									'field': 'TelephoneNumberTelefaxDto',
									'editorOptions': {
										'lookupDirective': 'basics-common-telephone-dialog',
										'lookupOptions': {
											foreignKey: 'telephoneTelefaxFk',
											titleField: 'cloud.common.fax'
										}
									},
									formatter: complexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							},
							currencyfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsCurrencyLookupDataService'}),
							billingschemafk: createBillingSchemaLedgerContextOverload(),
							paymenttermpafk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.paymentterm'),
							paymenttermfifk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.paymentterm'),
							languagefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.language'),
							lineitemcontextfk: createLineItemContextOverload(),

							ledgercontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.ledgercontext'),
							subledgercontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.subledgercontext'),
							modulecontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.modulecontext'),
							textmodulecontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.textmodulecontext'),

							contextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.context'),
							taxcodefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomTaxCodeLookupDataService',
								filterKey: 'basicsCompanyByLedgerContext-filter'
							}),
							schedulingcontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.schedulingcontext'),
							hsqcontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.hsqcontext'),
							countryfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCountrySortByDescriptionLookupDataService'
							}),
							companytypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.type', null, {
								field: 'CompanyTypeFk',
								filterKey: 'basics-company-type-filter'
							}),
							resourcecontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.resourcecontext'),
							equipmentcontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentcontext'),
							defectcontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.defectcontext'),
							timesheetcontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.timesheetcontext'),
							logisticcontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticscontext'),
							priceconditionfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'logisticPriceConditionByContextLookupDataService',
								filter: function (item) {
									if (item) {
										return item.LogisticContextFk;
									}
									return 0;
								}
							}),
							projectcontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontext'),
							equipmentdivisionfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentdivision', null),
							businesspartnerfk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-business-partner-dialog',
									options: {
										initValueField: 'BusinesspartnerBpName1',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-business-partner-dialog'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BusinessPartner',
										displayMember: 'BusinessPartnerName1'
									}
								}
							},
							prrmethodfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.revenuerecognitionmethod'),
							externalcode: {
								maxLength: 252
							},
							email: {
								grid: {
									editor: 'directive',
									editorOptions: {
										directive: 'basics-common-email-input',
										dataServiceName: 'basicsCompanyMainService'
									},
									formatter: communicationFormatter,
									formatterOptions: {
										domainType: 'email'
									},
									width: 150
								},
								detail: {
									type: 'directive',
									directive: 'basics-common-email-input',
									dataServiceName: 'basicsCompanyMainService'
								}
							},
							islive: { readonly: true }
						}
					};
				}

				var companyDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CompanyDto',
					moduleSubModule: 'Basics.Company'
				});
				companyAttributeDomains = companyAttributeDomains.properties;

				function extendGroupingFn() {
					return {
						'grid': platformObjectHelper.extendGrouping([
							{
								'afterId': 'clerkfk',
								'id': 'ClerkDescription_description',
								'field': 'ClerkFk',
								'name': 'Clerk Description',
								'name$tr$': 'basics.company.clerkdesc',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'clerk',
									displayMember: 'Description'
								},
								width: 140
							}
						])
					};
				}

				var service = new BaseService(companyDetailLayout, companyAttributeDomains, basicsCompanyTranslationService);
				platformUIStandardExtentService.extend(service, extendGroupingFn(), companyAttributeDomains);

				return service;
			}
		]);
})(angular);
