/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonLookupConfigsService
	 * @description provides common lookup configs for sales modules
	 */
	angular.module(salesCommonModule).service('salesCommonLookupConfigsService', ['_', '$injector', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService','basicsLookupdataLookupDescriptorService',
		function (_, $injector, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService,basicsLookupdataLookupDescriptorService) {

			var lookupConfigs = {
				'rubriccategoryfk': {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							lookupOptions: {
								filterKey: '',
								showClearButton: false,
								disableDataCaching: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'RubricCategoryByRubricAndCompany',
							'displayMember': 'Description'
						},
						width: 125,
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: '',
								showClearButton: false,
								disableDataCaching: true
							}
						}
					},
					readonly: true
				},
				'configurationfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-configuration-configuration-combobox',
						'options': {
							'readOnly': true
						}
					},
					'grid': {
						'editorOptions': {
							'directive': 'basics-configuration-configuration-combobox',
							'lookupOptions': {
								'readOnly': true
							}
						},
						'formatterOptions': {
							'lookupType': 'prcConfiguration',
							'displayMember': 'DescriptionInfo.Translated'
						}
					}
				},
				'companyresponsiblefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'salesBidCompanyLookupDataService',
					enableCache: true,
					filter: function (item) {
						return item.CompanyFk;
					}
				}, {
					required: true
				}),
				'projectfk': {
					'navigator': {
						moduleName: 'project.main'
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								showClearButton: false,
								readOnly: true
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookup-data-project-project-dialog',
							lookupOptions: {
								showClearButton: false,
								readOnly: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						}
					}
				},
				// TODO: why two times? (see #126111 and #127303)
				'bassalestaxmethodfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salestaxmethod', 'Description'),
				'salestaxmethodfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salestaxmethod', 'Description'),
				estheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'estimateMainHeaderLookupDataService',
					desMember: 'DescriptionInfo.Translated',
					enableCache: true,
					readonly: true,
					filter: function (item) {
						return item && item.ProjectFk ? item.ProjectFk : 0;
					},
					isComposite: true,
					navigator: {
						moduleName: 'estimate.main'
					}
				}),
				'languagefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.language'),
				'currencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCurrencyLookupDataService',
					enableCache: true
				}, {
					required: true
				}),
				// TODO: we will use procurement exchange rate directive here at the moment
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
				'clerkfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description'
						}
					},
					'grid': {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'cloud-clerk-clerk-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Clerk',
							displayMember: 'Code'
						}
					}
				},
				'customerfk': {
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'business-partner-main-customer-lookup',
							lookupOptions: {
								filterKey: 'sales-common-customer-filter',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {'lookupType': 'customer', 'displayMember': 'Code'},
						width: 125
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'business-partner-main-customer-lookup',
							descriptionField: 'Description',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'sales-common-customer-filter',
								showClearButton: true
							}
						}
					}
				},
				'customerbilltofk': { // TODO: almost the same like customerfk but other filter
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'business-partner-main-customer-lookup',
							lookupOptions: {
								filterKey: 'sales-common-customer-billto-filter',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {'lookupType': 'customer', 'displayMember': 'Code'},
						width: 125
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'business-partner-main-customer-lookup',
							descriptionField: 'Description',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'sales-common-customer-billto-filter',
								showClearButton: true
							}
						}
					}
				},
				// TODO: use basicsLookupdataConfigGenerator
				'billingschemafk': {
					detail: {
						type: 'directive',
						directive: 'procurement-configuration-billing-schema-combobox',
						options: {
							descriptionMember: 'Description',
							showClearButton: false,
							filterKey: 'sales-common-billing-schema-filter'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'procurement-configuration-billing-schema-combobox',
							lookupOptions: {
								showClearButton: false,
								filterKey: 'sales-common-billing-schema-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BillingSchema',
							displayMember: 'DescriptionInfo.Translated'
						}/* ,
						name$tr$: 'sales.common.entityBillingSchemaFk' */
					}
				},
				'paymenttermfifk': {
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
				},
				'paymenttermpafk': {
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
				},
				'paymenttermadfk': {
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
				},
				'contracttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.main.contracttype'),
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
						// 'change': 'formOptions.onPropertyChanged'
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
				'prjchangefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'project-change-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'sales-common-project-change-common-filter'
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'project-change-dialog',
							lookupOptions: {
								'showClearButton': true,
								filterKey: 'sales-common-project-change-common-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'projectchange',
							displayMember: 'Code'
						},
						width: 130
					}
				},
				'prjchangestatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projectchangestatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusIconService',
					field: 'RubricCategoryFk',
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					isTransient: true
				}),
				'businesspartnerfk': {
					'navigator': {
						moduleName: 'businesspartner.main',
						registerService: 'businesspartnerMainHeaderDataService'
					},
					detail: {
						type: 'directive',
						directive: 'business-partner-main-business-partner-dialog',
						options: {
							initValueField: 'BusinesspartnerBpName1',
							showClearButton: false
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							showClearButton: false,
							directive: 'business-partner-main-business-partner-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						}
					}
				},
				'businesspartnerbilltofk': {
					'navigator': {
						moduleName: 'businesspartner.main',
						registerService: 'businesspartnerMainHeaderDataService'
					},
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
							showClearButton: true,
							directive: 'business-partner-main-business-partner-dialog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						}
					}
				},
				contactbilltofk: {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-filtered-contact-combobox',
						options: {
							initValueField: 'FamilyName',
							filterKey: 'sales-common-contact-by-bizpartner-server-filter',
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-filtered-contact-combobox',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'sales-common-contact-by-bizpartner-server-filter'
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
				'subsidiaryfk': {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-subsidiary-lookup',
						options: {
							initValueField: 'SubsidiaryAddress',
							filterKey: 'sales-common-subsidiary-filter',
							showClearButton: false,
							displayMember: 'AddressLine'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-subsidiary-lookup',
							lookupOptions: {
								showClearButton: false,
								filterKey: 'sales-common-subsidiary-filter',
								displayMember: 'AddressLine'
							}
						},
						width: 125,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Subsidiary',
							displayMember: 'AddressLine'
						}
					}
				},
				'subsidiarybilltofk': { // TODO: almost the same like subsidiaryfk but other filter
					detail: {
						type: 'directive',
						directive: 'business-partner-main-subsidiary-lookup',
						options: {
							initValueField: 'SubsidiaryAddress',
							filterKey: 'sales-common-subsidiary-billto-filter',
							showClearButton: false,
							displayMember: 'AddressLine'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-subsidiary-lookup',
							lookupOptions: {
								showClearButton: false,
								filterKey: 'sales-common-subsidiary-billto-filter',
								displayMember: 'AddressLine'
							}
						},
						width: 125,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Subsidiary',
							displayMember: 'AddressLine'
						}
					}
				},
				// TODO: see 83110+83079 - make obj unit lookup project dependent
				objunitfk: {
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-object-unit-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'sales-common-object-unit-by-project-filter',
								showClearButton: true
							}
						},
						requiredInErrorHandling: false
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'basics-object-unit-dialog',
							lookupOptions: {
								filterKey: 'sales-common-object-unit-by-project-filter',
								showClearButton: true,
								displayMember: 'Code',
								addGridColumns: [{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									width: 200,
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								additionalColumns: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ObjectUnit',
							displayMember: 'Code'
						}
					}
				},
				controllingunitfk: {
					navigator: {
						moduleName: 'controlling.structure'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'controlling-structure-dialog-lookup',
							lookupOptions: {
								filterKey: 'sales-common-controlling-unit-filter',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {'lookupType': 'ControllingUnit', 'displayMember': 'Code'},
						width: 80
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'controlling-structure-dialog-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'sales-common-controlling-unit-filter',
								showClearButton: true
							}
						}
					}
				},
				prcstructurefk: {
					navigator: {
						moduleName: 'basics.procurementstructure'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-procurementstructure-structure-dialog',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcstructure',
							displayMember: 'Code'
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-procurementstructure-structure-dialog',
							descriptionField: 'StructureDescription',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								initValueField: 'StructureCode',
								showClearButton: true
							}
						}
					}
				},
				vatgroupfk: {
					grid: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
						lookupName: 'businesspartner.vatgroup',
						readOnly: false,
						options: {showClearButton: false}
					}),
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-simple',
						options: {
							lookupType: 'businesspartner.vatgroup',
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'businesspartner.vatgroup',
							showClearButton: false
						},
						change: 'formOptions.onPropertyChanged'
					}
				},
				'mdcsalestaxgroupfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomSalesTaxGroupLookupDataService',
					desMember: 'DescriptionInfo.Translated',
					enableCache: true,
					showClearButton: true,
					filterKey: 'saleTaxCodeByLedgerContext-filter'
				}),
				'companyicdebtorfk': {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-company-company-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						},
						width: 140
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-company-company-lookup',
							descriptionMember: 'CompanyName',
							lookupOptions: {}
						}
					},
					readonly: true
				}
			};

			var additionalGridColumns = {
				projectfk: {
					lookupDisplayColumn: true,
					id: 'projectfk_projectname',
					field: 'ProjectFk',
					name$tr$: 'cloud.common.entityProjectName',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Project',
						displayMember: 'ProjectName'
					},
					grouping: {
						title: 'cloud.common.entityProjectName',
						getter: 'ProjectFk',
						aggregators: [],
						aggregateCollapsed: true
					}
				},
				prcstructurefk: {
					lookupDisplayColumn: true,
					id: 'prcstructurefk_description',
					field: 'PrcStructureFk',
					name: 'Procurement Structure Description',
					name$tr$: 'sales.common.prcStructureDescription',
					displayMember: 'DescriptionInfo.Translated',
					width: 145
				},
				prjchangefk: {
					'lookupDisplayColumn': true,
					'id': 'prjchangefkDescription',
					'field': 'PrjChangeFk',
					'displayMember': 'Description',
					'name$tr$': 'sales.common.entityPrjChangeDesc',
					'width': 150
				},
				companyicdebtorfk: {
					'lookupDisplayColumn': true,
					'id': 'CompanyIcDebtorName',
					'field': 'CompanyIcDebtorFk',
					'displayMember': 'CompanyName',
					'name$tr$': 'sales.billing.iCCompanyCustomerName',
					'width': 150
				}
			};

			function getAdditionalGridColumnFor(foreignKeyName) {
				return additionalGridColumns[foreignKeyName];
			}

			function getAdditionalGridColumnsFor(columns) {
				if (_.isArray(columns)) {
					return {
						'grid': _.map(columns, getAdditionalGridColumnFor)
					};
				} else {
					throw new Error('Parameter is not an array!');
				}
			}

			function getLookupConfigFor(foreignKeyName) {
				return lookupConfigs[foreignKeyName];
			}

			function addCommonLookupsToLayout(layout) {
				var attributes = _.flatten(_.compact(_.map(_.get(layout, 'groups'), 'attributes')));
				_.each(attributes, function (attribute) {
					if (angular.isDefined(lookupConfigs[attribute]) && !layout.overloads[attribute]) {
						layout.overloads[attribute] = _.cloneDeep(lookupConfigs[attribute]);
					}
				});
			}

			function addCommonDomainSchemaProps(domainSchema) {
				if (domainSchema) {
					domainSchema.PrjChangeStatusFk = {domain: 'integer'};
				}
			}

			// common filter for sales modules
			var registered = false;
			var filters = [
				{
					key: 'sales-common-object-unit-by-project-filter',
					serverSide: true,
					fn: function (salesItem) {
						return {ProjectId: salesItem.ProjectFk};
					}
				},
				{
					key: 'sales-common-controlling-unit-filter',
					serverSide: true,
					serverKey: 'sales.common.controlling.unit.filter.isBillingElement',
					fn: function (entity) {
						return {
							FilterKey: 'sales.common.controlling.unit.filter.isBillingElement',
							ByStructure: true,
							ExtraFilter: false,
							PrjProjectFk: entity ? entity.ProjectFk : null,
							CompanyFk: $injector.get('platformContextService').getContext().clientId
						};
					}
				},
				{
					key: 'sales-common-contact-by-bizpartner-server-filter',
					serverSide: true,
					serverKey: 'business-partner-contact-filter-by-simple-business-partner',
					fn: function (entity) {
						return {
							BusinessPartnerFk: entity.BusinesspartnerBilltoFk
						};
					}
				},
				{
					key: 'sales-common-project-change-common-filter',
					serverSide: true,
					serverKey: 'sales-common-project-change-common-filter',
					fn: function (item) {
						if (item.ProjectFk) {
							return {ProjectFk: item.ProjectFk};
						}
					}
				},
				{ // TODO: move to sales bid submodule?
					key: 'sales-bid-project-change-common-filter',
					serverSide: true,
					serverKey: 'sales-bid-project-change-common-filter',
					fn: function (item) {
						if (item.ProjectFk) {
							return {
								ProjectFk: item.ProjectFk,
								IsChangeOrder: null,
								IsProjectChange: true
							};
						}
					}
				},
				{
					key: 'sales-common-project-filterkey',
					serverSide: true,
					fn: function () {
						return {
							// login company is handled serverside by project lookup
							// (see ProjectLogic.cs:DoBuildLookupSearchFilter)
							IsAdministration: false
						};
					}
				},
				{
					key: 'saleTaxCodeByLedgerContext-filter',
					serverSide: false,
					fn: function (item) {
						var loginCompanyFk = $injector.get('platformContextService').getContext().clientId;
						var LedgerContextFk;
						if (loginCompanyFk) {
							var companies = basicsLookupdataLookupDescriptorService.getData('Company');
							let company = _.find(companies, {Id: loginCompanyFk});
							if (company) {
								LedgerContextFk = company.LedgerContextFk;
							}
						}
						return (item.LedgerContextFk === LedgerContextFk) && item.IsLive;
					}
				},
				{
					key: 'sales-common-billing-schema-filter',
					serverSide: true,
					fn: function (currentItem) {
						if (!currentItem || !currentItem.Id) {
							return '';
						}
						var data = basicsLookupdataLookupDescriptorService.getData('prcconfiguration');
						var config = _.find(data, {Id: currentItem.ConfigurationFk});

						return 'PrcConfigHeaderFk=' + (config ? config.PrcConfigHeaderFk : -1);
					}
				},
				{
					key: 'sales-common-project-contract-type-lookup-filter',
					serverSide: false,
					fn: function (item) {
						return item.IsLive || item.isLive;
					}
				}
			];

			function registerCommonFilters() {
				if (!registered) {
					basicsLookupdataLookupFilterService.registerFilter(filters);
					registered = true;
				}
			}

			function unregisterCommonFilters() {
				if (registered) {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
					registered = false;
				}
			}

			function BusinessPartnerLookUpConfigForForm(mainService,validationService) {
				var data = {
					gid: 'baseGroup',
					rid: 'businesspartnerfk',
					model: 'BusinesspartnerFk',
					sortOrder: 7,
					required: true,
					label: 'Business Partner',
					label$tr$: 'cloud.common.entityBusinessPartner',
					type: 'directive',
					validator: $injector.get(validationService).validateBusinesspartnerFk,
					asyncValidator: $injector.get(validationService).asyncValidateBusinesspartnerFk,
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'business-partner-main-business-partner-dialog',
						descriptionMember: 'Description',
						lookupOptions: {
							'showClearButton': false,
							'IsShowBranch': true,
							'mainService': mainService,
							'BusinessPartnerField': 'BusinessPartnerFk',
							'SubsidiaryField': 'SubsidiaryFk',
							'ContactField': 'BpdContactFk'
						}
					}
				};
				return data;
			}

			function BusinessPartnerLookupConfig(mainService, isSpecialName) {
				var data = {
					navigator: {
						moduleName: 'businesspartner.main',
						registerService: 'businesspartnerMainHeaderDataService',
					},
					detail: {
						type: 'directive',
						directive: 'filter-business-partner-dialog-lookup',
						options: {
							initValueField: 'BusinesspartnerBpName1',
							showClearButton: false,
							IsShowBranch: true,
							'mainService': mainService,
							BusinessPartnerField: 'BusinessPartnerFk',
							SubsidiaryField: 'SubsidiaryFk',
							ContactField: isSpecialName ? 'BpdContactFk' : 'ContactFk',
						},
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'filter-business-partner-dialog-lookup',
							lookupOptions: {
								showClearButton: false,
								IsShowBranch: true,
								'mainService': mainService,
								BusinessPartnerField: 'BusinessPartnerFk',
								SubsidiaryField: 'SubsidiaryFk',
								ContactField: isSpecialName ? 'BpdContactFk' : 'ContactFk',
							},
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1',
						},
					},
				};
				return data;
			}

			return {
				getAdditionalGridColumnFor: getAdditionalGridColumnFor,
				getAdditionalGridColumnsFor: getAdditionalGridColumnsFor,
				getLookupConfigFor: getLookupConfigFor,
				addCommonLookupsToLayout: addCommonLookupsToLayout,
				addCommonDomainSchemaProps: addCommonDomainSchemaProps,
				registerCommonFilters: registerCommonFilters,
				unregisterCommonFilters: unregisterCommonFilters,
				BusinessPartnerLookUpConfigForForm: BusinessPartnerLookUpConfigForForm,
				BusinessPartnerLookupConfig: BusinessPartnerLookupConfig
			};
		}

	]);

})();
