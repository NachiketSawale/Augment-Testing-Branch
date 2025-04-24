(function (angular) {
	'use strict';
	const moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name basicsMaterialDocumentUIConfigurationService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementQuoteHeaderUIConfigurationService',
		['$injector', '_', 'platformUIStandardConfigService', 'platformSchemaService', 'procurementQuoteTranslationService', 'platformUIStandardExtentService', 'basicsCommonEvaluationFormatter', 'basicsLookupdataConfigGenerator', 'platformLayoutHelperService', 'procurementQuoteHeaderDataService',
			function ($injector, _, BaseService, platformSchemaService, translationService, extentService, evaluationFormatter, basicsLookupdataConfigGenerator, platformLayoutHelperService, procurementQuoteHeaderDataService) {

				function createMainDetailLayout() {
					return {
						fid: 'procurement.quote.header.detail',
						version: '1.0.0',
						showGrouping: true,
						'change': 'change',
						addValidationAutomatically: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['id', 'statusfk', 'code', 'qtnheaderfk', 'datequoted', 'datereceived', 'rfqheaderfk', 'projectfk', 'projectstatusfk', 'clerkprcfk', 'clerkreqfk', 'paymenttermfifk', 'paymenttermpafk', 'paymenttermadfk',
									'currencyfk', 'exchangerate', 'typefk', 'quoteversion',
									'datepricefixing', 'isvalidated', 'isexcluded', 'isshortlisted', 'evaluationschemafk', 'totalleadtime', 'billingschemafk', 'dateeffective', 'datedelivery', 'bpdvatgroupfk', 'overalldiscount', 'overalldiscountoc',
									'overalldiscountpercent', 'salestaxmethodfk', 'externalcode', 'userdefineddate01', 'prcstructurecode', 'prcstructuredescription', 'extendeddate', 'prccontracttypefk', 'prcawardmethodfk', 'prcconfigurationfk',
									'amountdiscountbasis', 'amountdiscountbasisoc', 'percentdiscount', 'amountdiscount', 'amountdiscountoc', 'dateawarddeadline']
							},
							{
								'gid': 'supplierGroup',
								'attributes': ['businesspartnerfk', 'subsidiaryfk', 'supplierfk','contactfk']
							},
							{
								'gid': 'deliveryGroup',
								'attributes': ['incotermfk', 'remark']
							},
							{
								'gid': 'packageGroup',
								'attributes': ['packagenumber', 'packagedescription', 'assetmastercode', 'assetmasterdescription', 'packagedeliveryaddress', 'packagetextinfo']
							},
							{
								'gid': 'userDefTextGroup',
								'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
							},
							{
								'gid': 'TotalGroup',
								'attributes': ['valuenet', 'valuenetoc', 'valuetax', 'valuetaxoc', 'gross', 'grossoc', 'valuenetfinal']
							},
							{
								'gid': 'itemGroup',
								'attributes': ['co2projecttotal', 'co2sourcetotal']
							},
							{
								'gid': 'SubmissionRequirement',
								'attributes': ['deadlinedate', 'deadlinetime']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							'id': {
								'readonly': true
							},
							'deadlinedate': {
								'readonly': true
							},
							'deadlinetime': {
								'readonly': true
							},
							'dateawarddeadline': {
								'readonly': true
							},
							'statusfk': {
								'detail': {
									'type': 'directive',
									'directive': 'procurement-quote-status-combobox',
									'options': {
										readOnly: true
									}
								},
								'grid': {
									width: 85,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'QuoteStatus',
										displayMember: 'Description',
										imageSelector: 'platformStatusIconService'
									}
								}
							},
							'code': {
								navigator: {
									moduleName: 'procurement.pricecomparison',
									registerService: 'procurementPriceComparisonMainService'
								},
								detail: {
									'type': 'directive',
									'directive': 'platform-composite-input',
									'label$tr$': 'cloud.common.entityReference',
									'model': 'Code',// use for validator
									'options': {
										'rows': [{
											'type': 'code',
											'model': 'Code',
											'cssLayout': 'md-4 lg-4'
										}, {
											'type': 'description',
											'model': 'Description',
											'cssLayout': 'md-8 lg-8',
											'validate': false
										}]
									}
								},
								'grid': {
									editor: 'code',
									formatter: 'code',
									width: 120
								}
							},
							'qtnheaderfk': {
								navigator: {
									moduleName: 'procurement.pricecomparison',
									registerService: 'procurementPriceComparisonMainService'
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'procurement-quote-header-lookup',
										descriptionField: 'Description',
										descriptionMember: 'Description',
										lookupOptions: {
											filterKey: 'procurement-quote-qtn-header-filter',
											showClearButton: false
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'procurement-quote-header-lookup',
										lookupOptions: {
											filterKey: 'procurement-quote-qtn-header-filter',
											showClearButton: false
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Quote',
										displayMember: 'Code'
									},
									width: 120
								}
							},
							'rfqheaderfk': {
								'navigator': {
									moduleName: 'procurement.rfq',
									registerService: 'procurementRfqMainService'
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'procurement-rfq-header-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											filterKey: 'procurement-quote-rfq-header-filter'
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'procurement-rfq-header-dialog',
										lookupOptions: {
											filterKey: 'procurement-quote-rfq-header-filter'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'RfqHeader',
										displayMember: 'Code'
									},
									width: 120
								}
							},
							'projectfk': platformLayoutHelperService.provideProjectLookupOverload('procurement-quote-project-filter'),
							'projectstatusfk': {
								'readonly': true,
								'grid': {
									'formatter': 'lookup',
									'formatterOptions': {
										'displayMember': 'Description',
										'imageSelector': 'platformStatusIconService',
										'lookupModuleQualifier': 'project.main.status',
										'lookupSimpleLookup': true,
										'valueMember': 'Id'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': ' basics-lookupdata-simple ',
									'options': {
										'lookupType': 'project.main.status',
										'eagerLoad': true,
										'valueMember': 'Id',
										'displayMember': 'Description',
										'filter': { showIcon: true },
										'imageSelector': 'platformStatusIconService',
										'lookupModuleQualifier': 'project.main.status'
									}
								}
							},
							'clerkprcfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'cloud-clerk-clerk-dialog',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'clerk',
										displayMember: 'Code'
									}
								}
							},
							'clerkreqfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'cloud-clerk-clerk-dialog',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'clerk',
										displayMember: 'Code'
									},
									width: 120
								}
							},
							'paymenttermfifk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-lookupdata-payment-term-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								'grid': {
									width: 200,
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-payment-term-lookup',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PaymentTerm',
										displayMember: 'Code'
									}
								}
							},
							'paymenttermpafk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-lookupdata-payment-term-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								'grid': {
									width: 200,
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-payment-term-lookup',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PaymentTerm',
										displayMember: 'Code'
									}
								}
							},
							'paymenttermadfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-lookupdata-payment-term-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								'grid': {
									width: 200,
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-payment-term-lookup',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PaymentTerm',
										displayMember: 'Code'
									}
								}
							},
							'currencyfk': {
								grid: {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'prc-Common-Basics-Currency-Lookup',
										'displayMember': 'Currency',
										'lookupOptions': {
											'filterKey': 'bas-currency-conversion-filter'
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'BasCurrency',
										'displayMember': 'Currency'
									},
									'width': 100
								},
								detail: {
									'type': 'directive',
									'directive': 'prc-Common-Basics-Currency-Lookup',
									'options': {
										'lookupType': 'BasCurrency',
										'filterKey': 'bas-currency-conversion-filter'
									}
								}
							},
							'typefk': {
								'detail': {
									'type': 'directive',
									'directive': 'procurement-quote-type-combobox',
									'options': {
										initValueField: 'TypeDescription'
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'procurement-quote-type-combobox'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'QuoteType',
										displayMember: 'Description'
									}
								}
							},
							'businesspartnerfk': {
								'navigator': {
									moduleName: 'businesspartner.main',
									registerService: 'businesspartnerMainHeaderDataService'
								},
								'detail': {
									'type': 'directive',
									// 'directive': 'business-partner-main-business-partner-dialog'
									'directive': 'filter-business-partner-dialog-lookup',
									'options': {
										'mainService': 'procurementQuoteHeaderDataService',
										'BusinessPartnerField': 'BusinesspartnerFk',
										'SubsidiaryField': 'SubsidiaryFk',
										'SupplierField': 'SupplierFk'
									}
								},
								'grid': {
									width: 120,
									editor: 'lookup',
									editorOptions: {
										// 'directive': 'business-partner-main-business-partner-dialog'
										'directive': 'filter-business-partner-dialog-lookup',
										'lookupOptions': {
											'mainService': 'procurementQuoteHeaderDataService',
											'BusinessPartnerField': 'BusinesspartnerFk',
											'SubsidiaryField': 'SubsidiaryFk',
											'SupplierField': 'SupplierFk'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BusinessPartner',
										displayMember: 'BusinessPartnerName1'
									}
								}
							},
							'contactfk': {
								navigator: {
									moduleName: 'businesspartner.contact'
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'business-partner-main-contact-dialog',
										'lookupOptions': {'filterKey': 'prc-con-contact-filter', 'showClearButton': true}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'Contact', 'displayMember': 'FullName'},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'business-partner-main-contact-dialog',
									'options': {
										'filterKey': 'prc-con-contact-filter', 'showClearButton': true
									}
								}
							},
							'subsidiaryfk': {
								'detail': {
									'type': 'directive',
									'directive': 'business-partner-main-subsidiary-lookup',
									'options': {
										showClearButton: true,
										filterKey: 'procurement-quote-subsidiary-filter',
										displayMember: 'AddressLine'
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-subsidiary-lookup',
										lookupOptions: {
											filterKey: 'procurement-quote-subsidiary-filter',
											showClearButton: true,
											displayMember: 'AddressLine'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'subsidiary',
										displayMember: 'AddressLine'
									}
								}
							},
							'supplierfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'business-partner-main-supplier-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'procurement-quote-supplier-filter'
										}
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-supplier-lookup',
										lookupOptions: {
											filterKey: 'procurement-quote-supplier-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'supplier',
										displayMember: 'Code'
									},
									width: 120
								}
							},
							'incotermfk': {
								'detail': {
									'type': 'directive',
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
										directive: 'basics-lookupdata-incoterm-combobox',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'prcincoterm',
										// displayMember: 'Description'
										displayMember: 'Code'
									}
								}
							},
							'evaluationschemafk': {
								readonly: true,
								'grid': {
									'formatter': 'lookup',
									'formatterOptions': {
										lookupType: 'EvaluationSchema',
										displayMember: 'Description'
									},
									'editor': 'lookup',
									'editorOptions': {
										directive: 'business-partner-evaluation-schema-combobox'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'business-partner-evaluation-schema-combobox',
									'model': 'EvaluationSchemaFk',
									'options': {
										displayMember: 'Description'
									}
								}
							},
							'totalleadtime': {
								readonly: true
							},
							'exchangerate': {
								'grid': {
									'editor': 'directive',
									'editorOptions': {
										'directive': 'procurement-common-exchangerate-input'
									},
									'formatter': 'exchangerate'
								},
								'detail': {
									'type': 'directive',
									'directive': 'procurement-common-exchangerate-input'
								}
							},
							'billingschemafk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'procurement-configuration-billing-schema-combobox',
										'lookupOptions': {
											'filterKey': 'prc-quote-billing-schema-filter'
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'PrcConfig2BSchema',
										'displayMember': 'DescriptionInfo.Translated'
									},
									name$tr$: 'cloud.common.entityBillingSchema',
									'width': 80
								},
								'detail': {
									'label$tr$': 'cloud.common.entityBillingSchema',
									'type': 'directive',
									'directive': 'procurement-configuration-billing-schema-Combobox',
									'options': {
										filterKey: 'prc-quote-billing-schema-filter'
									}
								}
							},
							'bpdvatgroupfk': {
								detail: {
									rid: 'bpdvatgroupfk',
									label: 'Vat Group',
									type: 'directive',
									model: 'BpdVatGroupFk',
									directive: 'business-partner-vat-group-lookup',
									options: {
										displayMember: 'DescriptionInfo.Translated',
										showClearButton: true
									},
									change: function(item, field) {
										procurementQuoteHeaderDataService.cellChange(item, field);
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-vat-group-lookup',
										lookupOptions: {
											displayMember: 'DescriptionInfo.Translated',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										displayMember: 'DescriptionInfo.Translated',
										lookupType: 'VatGroup'
									}
								}
							},
							'prccontracttypefk': {
								'readonly': true,
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-procurement-configuration-contract-type-combobox'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PrcContractType',
										displayMember: 'Description'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-procurement-configuration-contract-type-combobox',
									'model': 'PrcContractTypeFk',
									'options': {
										displayMember: 'Description'
									}
								}
							},
							'prcawardmethodfk': {
								'readonly': true,
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-procurement-configuration-award-method-combobox'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PrcAwardMethod',
										displayMember: 'Description'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-procurement-configuration-award-method-combobox',
									'model': 'PrcAwardMethodFk',
									'options': {
										displayMember: 'Description'
									}
								}
							},
							'packagenumber': {
								'readonly': true
							},
							'packagedescription': {
								'readonly': true
							},
							'assetmastercode': {
								'readonly': true
							},
							'assetmasterdescription': {
								'readonly': true
							},
							'packagedeliveryaddress': {
								'readonly': true
							},
							'packagetextinfo': {
								'readonly': true
							},
							'salestaxmethodfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salestaxmethod', 'Description'),
							'prcstructurecode': {
								'readonly': true
							},
							'prcstructuredescription': {
								'readonly': true
							},
							'extendeddate': {
								'readonly': true
							},
							'prcconfigurationfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-configuration-configuration-combobox'
								},
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'prcConfiguration',
										displayMember: 'DescriptionInfo.Translated'
									}
								},
								readonly: true
							},
							'co2projecttotal': {
								'readonly': true
							},
							'co2sourcetotal': {
								'readonly': true
							},
							'percentdiscount': {
								toolTip$tr$: 'procurement.quote.entityPercentDiscountTip'
							}
						},
						addition: {
							grid: getAdditionGrid(['RfqHeaderFk', 'QtnHeaderFk', 'IncotermFk', 'ClerkPrcFk', 'ClerkReqFk', 'PaymentTermFiFk', 'PaymentTermPaFk', 'PaymentTermAdFk', 'SupplierFk'],
								[
									{
										name: 'Reference Name',
										name$tr$: 'cloud.common.entityReferenceName',
										field: 'Description',
										editor: 'description',
										formatter: 'description',
										width: 150
									},
									{
										'formatter': 'money',
										'field': 'BillingSchemaFinal',
										'name': 'Billing Schema Final',
										'name$tr$': 'procurement.common.billingSchemaFinal',
										'width': 150,
										readonly: true
									},
									{
										'formatter': 'money',
										'field': 'BillingSchemaFinalOC',
										'name': 'Billing Schema Final OC',
										'name$tr$': 'procurement.common.billingSchemaFinalOc',
										'width': 150,
										readonly: true
									}
								]
							),
							'detail': [
								{
									afterId: 'schemaFinal',
									rid: 'BillingSchemaFinal',
									gid: 'baseGroup',
									model: 'BillingSchemaFinal',
									label: 'Billing Schema Final',
									label$tr$: 'procurement.common.billingSchemaFinal',
									type: 'money',
									readonly: true
								},{
									afterId: 'schemaFinalOc',
									rid: 'BillingSchemaFinalOC',
									gid: 'baseGroup',
									model: 'BillingSchemaFinalOC',
									label: 'Billing Schema Final OC',
									label$tr$: 'procurement.common.billingSchemaFinalOc',
									type: 'money',
									readonly: true
								}]
						}
					};

					/**
					 * @return {string}
					 */


					function getAdditionGrid(options, columns) {
						let grid = _.map(options, function (option) {
							let columnFields = option.split('$');
							let translationGrid = translationService.getTranslationInformation(columnFields[1] || columnFields[0].replace('Fk', 'Description'));
							let formatterOptions = {displayMember: columnFields[1]};
							return {
								lookupDisplayColumn: true,
								field: columnFields[0],
								name: translationGrid.initial,
								name$tr$: translationGrid.location + '.' + translationGrid.identifier,
								formatterOptions: formatterOptions,
								width: 150
							};
						});

						angular.forEach(columns, function (column) {
							column.lookupDisplayColumn = false;
							grid.push(column);
						});

						angular.forEach(grid, function (column) {
							column.grouping = {
								title: column.name,
								title$tr$: column.name$tr$,
								getter: column.field,
								aggregators: [],
								aggregateCollapsed: true
							};
						});

						return grid;
					}
				}

				let companyClerkAttributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'QuoteHeaderDto', moduleSubModule: 'Procurement.Quote'});
				let layout = createMainDetailLayout();

				let basicsClerkFormatService = $injector.get('basicsClerkFormatService');
				layout.overloads.clerkreqfk.grid.formatter = basicsClerkFormatService.formatClerk;
				layout.overloads.clerkprcfk.grid.formatter = basicsClerkFormatService.formatClerk;

				let service = new BaseService(layout, companyClerkAttributeDomains.properties, translationService);
				extentService.extend(service, layout.addition, companyClerkAttributeDomains.properties);
				return service;
			}]
	);

	// businesspartnerCertificateActualCertificateListController
	angular.module(moduleName).factory('procurementQuoteCertificateActualUIConfigurationService',
		['businesspartnerCertificateCertificateContainerServiceFactory', 'platformSchemaService', 'platformUIStandardConfigService', 'procurementQuoteHeaderDataService',
			'businesspartnerCertificateTranslationService', 'businesspartnerCertificateToContractLayout',
			function (serviceFactory, platformSchemaService, UIStandardConfigService, parentService, translationService, certificateToContractLayout) {

				// certificate ui standard service
				let domains = platformSchemaService.getSchemaFromCache({
					typeName: 'CertificateDto',
					moduleSubModule: 'BusinessPartner.Certificate'
				}).properties;

				return new UIStandardConfigService(certificateToContractLayout, domains, translationService);
			}]);
})(angular);
