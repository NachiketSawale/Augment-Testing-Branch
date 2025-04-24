/**
 * Created by Frank Baedeker on 21.08.2014.
 */
(function () {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});

		return gridColumns;
	}

	angular.module(moduleName).value('projectMainLayoutConfig', {
		'addition': {
			'grid': extendGrouping([
				{
					'afterId': 'companyresponsiblefk',
					'id': 'companyresponsiblefk-name',
					'field': 'CompanyResponsibleFk',
					'name': 'ProfitCenter Name',
					'name$tr$': 'project.main.entityProfitCenterName',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'company',
						displayMember: 'CompanyName'
					},
					width: 140
				}
			])
		}
	});

	angular.module(moduleName).factory('projectMainStandardConfigurationService',

		['platformUIStandardConfigService', 'platformLayoutHelperService', 'projectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'platformUIStandardExtentService', 'projectMainLayoutConfig',
			'basicsCommonComplexFormatter', 'basicsLookupdataConfigGeneratorExtension', 'basicsCommonCommunicationFormatter',

			/* jshint -W072 */ // many parameters because of dependency injection
			function (platformUIStandardConfigService, platformLayoutHelperService, projectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService, platformUIStandardExtentService, projectMainLayoutConfig,
				basicsCommonComplexFormatter, basicsLookupdataConfigGeneratorExtension, communicationFormatter) {

				function createMainDetailLayout() {
					return {
						fid: 'project.main.projectdetailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['statusfk', 'typefk', 'projectmodefk', 'projectindex', 'rubriccategoryfk', 'projectno', 'projectlongno', 'projectname', 'projectname2',
									'matchcode', 'projectdescription', 'currencyfk', 'clerkfk', 'clerkaddress', 'clerkemail', 'clerkmobilenumber',
									'clerktelephonenumber', 'companyresponsiblefk', 'startdate', 'enddate', 'projectgroupfk', 'businessunitfk', 'remark',
									'dateeffective','prjcategoryfk','prjclassificationfk','prjkindfk','quantitycontrolfk','projectoriginfk']
							},
							{
								gid: 'customerGroup',
								attributes: ['businesspartnerfk', 'subsidiaryfk', 'customerfk', 'customergroupfk', 'contactfk', 'realestatefk']
							},
							{
								gid: 'projectAddressGroup',
								attributes: ['countryfk', 'addressfk', 'regionfk', 'telephonenumberfk', 'telephonetelefaxfk', 'telephonemobilfk', 'email']
							},
							{
								gid: 'contractGroup',
								attributes: ['contracttypefk', 'contractno', 'paymenttermpafk', 'paymenttermfifk', 'billingschemafk', 'wicfk', 'calloffno', 'calloffdate', 'calloffremark', 'languagecontractfk', 'orderdate']
							},
							{
								gid: 'submissionGroup',
								attributes: ['publicationdate', 'datereceipt', 'closingdatetime', 'closinglocation', 'plannedawarddate', 'tenderdate', 'tenderremark', 'validityperiod', 'validitydate']
							},
							{
								gid: 'executionGroup',
								attributes: ['preliminarydelivery', 'finaldelivery', 'endaftertermextension', 'startaccordinginjunction', 'startexecution', 'endexecution', 'durationtermextension', 'delayindays']
							},
							{
								gid: 'warrantyGroup',
								attributes: ['handoverdate', 'warrentystart', 'warrentyend', 'warrentyremark']
							},
							{
								gid: 'settingGroup',
								attributes: ['istemplate', 'calendarfk', 'controllingunittemplatefk', 'controltemplatefk', 'assetmasterfk', 'prjcontenttypefk', 'isadministration', 'isintercompany',
									'rubriccategorycontrollingunitfk', 'rubriccatlocationfk', 'rubriccategorysalesfk', 'catalogconfigtypefk', 'iscompleteperformance', 'isestimateboqdriven', 'rubriccategorybilltofk']
							},
							{
								gid: 'userDefTextGroup',
								isUserDefText: true,
								attCount: 5,
								attName: 'userdefined',
								noInfix: true
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							catalogconfigtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcatalogconfigurationtype'),
							statusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('project.main.status', null, {
								field: 'RubricCategoryFk',
								filterKey: 'project-main-status-by-rubric-category-filter',
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								showIcon: true
							}),
							projectindex: { readonly: true},
							isadministration: { readonly: true },
							clerkaddress: { readonly: true },
							clerkemail: { readonly: true },
							clerkmobilenumber: { readonly: true },
							clerktelephonenumber: { readonly: true },
							typefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projecttype', null, {
								showIcon: true,
								imageSelectorService: 'basicsCustomizeProjectTypeIconService'
							}),
							projectmodefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectmode'),
							rubriccategoryfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										lookupOptions: {
											filterKey: 'project-main-rubric-category-lookup-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description'},
									width: 125
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											filterKey: 'project-main-rubric-category-lookup-filter',
											showClearButton: true
										}
									}
								}
							},
							currencyfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true
							}),
							projectoriginfk: platformLayoutHelperService.provideProjectLookupReadOnlyOverload(),
							quantitycontrolfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomProjectQuantityControlLookupDataService',
								enableCache: true,
								filterKey: 'project-main-quantity-control-is-live-filter',
							}),
							clerkfk: platformLayoutHelperService.provideClerkLookupOverload(true, 'ClerkFk', 'basics-clerk-by-company-filter'),
							companyresponsiblefk: {
								'grid': {
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
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'model': 'CompanyResponsibleFk',
									'options': {
										lookupDirective: 'basics-company-company-lookup',
										descriptionMember: 'CompanyName'
									},
									'change': 'formOptions.onPropertyChanged'
								}
							},
							projectgroupfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'project-group-data-dialog',
										lookupOptions: {
											additionalColumns: true,
											filterKey: 'project-group-hide-inactive-leave-filter',
											displayMember: 'Code',
											addGridColumns: [{
												id: 'Description',
												field: 'DescriptionInfo',
												name: 'Description',
												width: 300,
												formatter: 'translation',
												name$tr$: 'cloud.common.entityDescription'
											}]
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ProjectGroupTree',
										displayMember: 'Code',
										version:3
									},
									width: 140
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'project-group-data-dialog',
										displayMember: 'Code',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'project-group-hide-inactive-leave-filter'
										}
									}
								}
							},
							businessunitfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.businessunit'),
							businesspartnerfk: {
								detail:  {
									type: 'directive',
									directive: 'business-partner-main-business-partner-dialog',
									options: {
										displayMember: 'BusinessPartnerName1',
										showClearButton: true,
										'filterKey': 'procurement-contract-businesspartner-businesspartner-filter',
										IsShowBranch: true,
										mainService:'projectMainService',
										BusinessPartnerField:'BusinesspartnerFk',
										SubsidiaryField:'SubsidiaryFk',
										SupplierField:'SupplierFk',
										ContactField: 'ContactFk'
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-business-partner-dialog',
										lookupOptions: {
											showClearButton: true,
											'filterKey': 'procurement-contract-businesspartner-businesspartner-filter',
											IsShowBranch: true,
											mainService:'projectMainService',
											BusinessPartnerField:'BusinessPartnerFk',
											SubsidiaryField:'SubsidiaryFk',
											SupplierField:'SupplierFk',
											ContactField: 'ContactFk'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BusinessPartner',
										displayMember: 'BusinessPartnerName1'
									},
									width: 150
								},
							},
							customerfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-customer-lookup',
										lookupOptions: {
											filterKey: 'project-main-customer-subsidiary-filter',
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
										descriptionMember: 'Description',
										lookupOptions: {
											filterKey: 'project-main-customer-subsidiary-filter',
											showClearButton: true
										}
									}
								}
							},
							customergroupfk: basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.customergroup', null, {showClearButton: true}),
							contactfk: {
								mandatory: true,
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
							realestatefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('businesspartner.lookup.realestate', 'OBJECT_NAME'),
							subsidiaryfk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-subsidiary-lookup',
									options: {
										initValueField: 'SubsidiaryAddress',
										filterKey: 'project-main-project-subsidiary-filter',
										showClearButton: true,
										displayMember: 'AddressLine'
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-subsidiary-lookup',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'project-main-project-subsidiary-filter',
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
							countryfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCountryLookupDataService',
								enableCache: true
							}),
							addressfk: {
								detail: {
									type: 'directive',
									directive: 'basics-common-address-dialog',
									model: 'AddressEntity',
									options: {
										titleField: 'cloud.common.entityAddress',
										foreignKey: 'AddressFk',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									field: 'AddressEntity',
									editorOptions: {
										lookupDirective: 'basics-common-address-dialog',
										'lookupOptions': {
											foreignKey: 'AddressFk',
											titleField: 'cloud.common.entityAddress'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'AddressLine'
									}
								}
							},
							regionfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.main.region'),
							contracttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.main.contracttype'),
							paymenttermpafk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.paymentterm'),
							paymenttermfifk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.paymentterm'),
							billingschemafk: {
								detail: {
									type: 'directive',
									directive: 'basics-billing-schema-billing-schema-combobox',
									options: {
										descriptionMember: 'Description',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'basics-billing-schema-billing-schema-combobox',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BillingSchema',
										displayMember: 'Description'
									}
								}
							},
							wicfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('masterdata.context.wic'),
							languagecontractfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.language'),
							/*
							calendarfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingLookupCalendarDataService',
								enableCache: true
							}),
*/
							calendarfk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'scheduling-calendar-filter-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										descriptionField: 'StructureDescription',
										lookupOptions: {
											showClearButton: true,
											defaultFilter: {'calendarType': 'enterprise', 'projectId': 'Id'},
											version: 3
										}
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											showClearButton: true,
											defaultFilter: {'calendarType': 'enterprise', 'projectId': 'Id'}
										},
										directive: 'scheduling-calendar-filter-lookup'
									},
									width: 150,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'schedulingCalendar',
										displayMember: 'Code',
										version: 3
									}
								}
							},
							projectno: {
								navigator: {
									moduleName: 'iTWO 5D',
									targetID: 'project.main.project'
								},
								requiredInErrorHandling: true
							},
							projectname: { requiredInErrorHandling: true },
							projectlongno: { readonly: true, maxLength : 252 },
							controllingunittemplatefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('project.main.controllingunittemplate'),
							controltemplatefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingControllingunittemplateLookupService',
								showClearButton: true
							}),
							assetmasterfk: {
								grid: {
									formatter: 'lookup',
									formatterOptions: {lookupType: 'AssertMaster', displayMember: 'Code'},
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-asset-master-dialog',
										lookupOptions: {
											showClearButton: true,
											additionalColumns: true,
											displayMember: 'Code',
											addGridColumns: [{
												id: 'Description',
												field: 'DescriptionInfo',
												name: 'Description',
												width: 300,
												formatter: 'translation',
												name$tr$: 'cloud.common.entityDescription'
											}]
										}
									},
									width: 150
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-asset-master-dialog',
										'descriptionMember': 'DescriptionInfo.Translated',
										lookupOptions: {'showClearButton': true}
									}
								}
							},
							'telephonenumberfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-common-telephone-dialog',
									'model': 'TelephoneNumber',
									'options': {
										titleField: 'cloud.common.TelephoneDialogPhoneNumber',
										foreignKey: 'TelephoneNumberFk',
										showClearButton: true
									}
								}, 'grid': {
									'editor': 'lookup',
									'field': 'TelephoneNumber',
									'editorOptions': {
										'lookupDirective': 'basics-common-telephone-dialog',
										'lookupOptions': {
											foreignKey: 'TelephoneNumberFk',
											titleField: 'cloud.common.TelephoneDialogPhoneNumber'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							},
							'telephonetelefaxfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-common-telephone-dialog',
									'model': 'TelephoneNumberTelefax',
									'options': {
										titleField: 'cloud.common.fax',
										foreignKey: 'TelephoneTelefaxFk',
										showClearButton: true
									}
								},
								'grid': {
									'editor': 'lookup',
									'field': 'TelephoneNumberTelefax',
									'editorOptions': {
										'lookupDirective': 'basics-common-telephone-dialog',
										'lookupOptions': {
											foreignKey: 'TelephoneTelefaxFk',
											titleField: 'cloud.common.fax'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							},
							'telephonemobilfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-common-telephone-dialog',
									'model': 'TelephoneMobil',
									'options': {
										titleField: 'cloud.common.mobile',
										foreignKey: 'TelephoneMobilFk',
										showClearButton: true
									}
								},
								'grid': {
									'editor': 'lookup',
									'field': 'TelephoneMobil',
									'editorOptions': {
										'lookupDirective': 'basics-common-telephone-dialog',
										'lookupOptions': {
											foreignKey: 'TelephoneMobilFk',
											titleField: 'cloud.common.mobile'
										}
									},
									formatter: basicsCommonComplexFormatter,
									formatterOptions: {
										displayMember: 'Telephone',
										domainType: 'phone'
									}
								}
							},
							istemplate: { readonly: true },
							prjcontenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontenttype'),
							rubriccatlocationfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.rubriccategory', null, {
								field: 'RubricFk',
								filterKey: 'project-location-rubric-category-by-rubric-filter',
								customIntegerProperty: 'BAS_RUBRIC_FK'
							}),
							rubriccategorysalesfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.rubriccategory', null, {
								field: 'RubricFk',
								filterKey: 'project-sales-rubric-category-by-rubric-filter',
								customIntegerProperty: 'BAS_RUBRIC_FK'
							}),
							rubriccategorybilltofk:basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.rubriccategory', null, {
								field: 'RubricFk',
								filterKey: 'project-bill-to-rubric-category-by-rubric-filter',
								customIntegerProperty: 'BAS_RUBRIC_FK'
							}),
							rubriccategorycontrollingunitfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										lookupOptions: {
											filterKey: 'project-controlling-unit-rubric-category-by-rubric-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'RubricCategoryByRubricAndCompany',
										displayMember: 'Description'
									},
									width: 125
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										descriptionMember: 'Description',
										lookupOptions: {
											filterKey: 'project-controlling-unit-rubric-category-by-rubric-filter',
											showClearButton: true
										}
									}
								}
							},
							CatalogConfigTypeFk: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
								'basics.customize.projectcatalogconfigurationtype',
								'',
								{
									gid: 'baseGroup',
									rid: 'costGroupConfigurationType',
									required: true,
									model: 'CostGroupConfigurationTypeFk',
									sortOrder: 5,
									label$tr$: 'project.main.costGroupConfiguration'
								}
							),
							prjcategoryfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcategory'),
							prjclassificationfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectclassification'),
							prjkindfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectkind'),
							'email': {
								'grid': {
									editor: 'directive',
									editorOptions: {
										directive: 'basics-common-email-input',
										dataServiceName: 'projectMainService'
									},
									formatter: communicationFormatter,
									formatterOptions: {
										domainType: 'email'
									},
									width: 150
								},
								'detail': {
									type: 'directive',
									directive: 'basics-common-email-input',
									dataServiceName: 'projectMainService'
								}
							}
						}
					};
				}

				var projectMainDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var projectProjectAttributeDomains = platformSchemaService.getSchemaFromCache({

					typeName: 'ProjectDto',
					moduleSubModule: 'Project.Main'
				});
				if (projectProjectAttributeDomains) {
					projectProjectAttributeDomains = projectProjectAttributeDomains.properties;
				}
				const entityInformation = { module: angular.module(moduleName), moduleName: 'Project.Main', entity: 'Project' };
				var service = new BaseService(projectMainDetailLayout, projectProjectAttributeDomains, projectMainTranslationService, entityInformation);

				platformUIStandardExtentService.extend(service, projectMainLayoutConfig.addition, projectProjectAttributeDomains);

				service.getProjectMainLayout = function () {
					return createMainDetailLayout();
				};

				return service;
			}
		]);
})();
