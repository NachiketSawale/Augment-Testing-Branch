(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainUnitUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of Unit entities
	 */
	angular.module(moduleName).factory('objectMainUnitUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {

					return {

						'fid': 'object.main.unitdetailform',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['headerfk', 'code', 'description', 'unitstatusfk', 'iscontainer', 'unitsubtypefk', 'unittypespecfk', 'unitkindfk', 'unitcategoryfk', 'levelfk', 'locationfk', 'controllingunitfk', 'parking', 'portion', 'unitnumber', 'situation', 'floorspace', 'price', 'priceextra', 'clerksalfk', 'clerktecfk', 'isparkingspace', 'unit2objunitstring', 'contractno', 'datehandover', 'hasnodefects', 'isinvestor', 'clerkextfk', 'installmentagreementfk', 'currentinstallment', 'taxcodefk', 'priceparkingspace', 'specialpitches', 'pricesdetailed', 'totalcost', 'unittypefk', 'rubriccategoryfk', 'countryfk','addressfk']
							},
							{
								'gid': 'remarkGroup',
								'attributes': ['remark01', 'remark02', 'remark03', 'remark04', 'remark05']
							},
							{
								'gid': 'estateAgentGroup',
								'attributes': ['businesspartner01fk', 'subsidiary01fk', 'customer01fk', 'contact01fk']
							},
							{
								'gid': 'clientGroup',
								'attributes': ['businesspartner02fk', 'subsidiary02fk', 'customer02fk', 'contact02fk']
							},
							{
								'gid': 'notaryGroup',
								'attributes': ['businesspartner03fk', 'subsidiary03fk', 'customer03fk', 'contact03fk']
							},
							{
								'gid': 'trusteeGroup',
								'attributes': ['businesspartner04fk', 'subsidiary04fk', 'customer04fk', 'contact04fk']
							},
							{
								'gid': 'renterGroup',
								'attributes': ['businesspartner05fk', 'subsidiary05fk', 'customer05fk', 'contact05fk']
							},
							{
								'gid': 'userDefinedMoneyGroup',
								'attributes': ['userdefinedmoney01', 'userdefinedmoney02', 'userdefinedmoney03', 'userdefinedmoney04', 'userdefinedmoney05']
							},
							{
								'gid': 'DateGroup',
								'attributes': ['datereserved', 'datefundingconfirmed', 'datecontract', 'datewelcomepackage', 'dateconsulting', 'datematurity', 'dateregister', 'datelatestmodification']
							},
							{
								gid: 'userDefinedTextGroup',
								isUserDefText: true,
								attCount: 5,
								attName: 'userdefinedtext'
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							headerfk: {
								detail: {
									type: 'code',
									formatter: 'code',
									model: 'Header.Code'
								},
								grid: {
									formatter: 'code',
									field: 'Header.Code',
									addColumns: [
										{
											id: 'Description',
											field: 'Header.Description',
											name: 'Description',
											width: 200,
											formatter: 'description',
											name$tr$: 'cloud.common.entityDescription'
										}
									]
								},
								readonly: true
							},
							addressfk :{
								detail: {
									type: 'directive',
									directive: 'basics-common-address-dialog',
									model: 'Address',
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
									field: 'Address',
									formatterOptions: {
										displayMember: 'Street'
									}
								}
							},
							countryfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCountryLookupDataService',
								enableCache: true
							}),
							levelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'objectProjectLevelLookupDataService',
								filter: function (item) {
									return item;
								}
							}, {bulkSupport: false}),
							unitstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.objectunitstatus', null, {
								showIcon: true,
								imageSelectorService: 'platformStatusIconService'
							}),
							unitsubtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectunitsubtype', null,{
								field: 'UnittypeFk',
								filterKey: 'object-main-sub-type-by-type-filter',
								customIntegerProperty: 'OBJ_UNITTYPE_FK'
							}),
							unittypespecfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectunittypespec', null,{
								field: 'UnittypeFk',
								filterKey: 'object-main-sub-type-by-type-filter',
								customIntegerProperty: 'OBJ_UNITTYPE_FK'
							}),
							unitkindfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectunitkind'),
							unitcategoryfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectunitcategory'),
							locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectLocationLookupDataService',
								filter: function (item) {
									var prj;
									if (item && item.Header) {
										prj = item.Header.ProjectFk;  // jshint ignore:line
									}
									return prj;
								}
							}),
							controllingunitfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingStructureUnitLookupDataService',
								filter: function (item) {
									var prj;
									if (item && item.Header) {
										prj = item.Header.ProjectFk; // jshint ignore:line
									}
									return prj;
								}
							}),
							businesspartner01fk: {
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
							subsidiary01fk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-subsidiary-lookup',
									options: {
										initValueField: 'SubsidiaryAddress',
										filterKey: 'object-main-unit-bizpartner-01-filter',
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
											filterKey: 'object-main-unit-bizpartner-01-filter',
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
							customer01fk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-customer-lookup',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-01-filter',
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
										descriptionField: 'BusinessPartnerName1',
										descriptionMember: 'BusinessPartnerName1',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-01-filter',
											showClearButton: true
										}
									}
								}
							},
							contact01fk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-filtered-contact-combobox',
									options: {
										initValueField: 'FamilyName',
										filterKey: 'object-main-unit-bizpartner-01-server-filter',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-filtered-contact-combobox',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'object-main-unit-bizpartner-01-server-filter'
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
							businesspartner02fk: {
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
							subsidiary02fk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-subsidiary-lookup',
									options: {
										initValueField: 'SubsidiaryAddress',
										filterKey: 'object-main-unit-bizpartner-02-filter',
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
											filterKey: 'object-main-unit-bizpartner-02-filter',
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
							customer02fk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-customer-lookup',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-02-filter',
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
										descriptionField: 'BusinessPartnerName1',
										descriptionMember: 'BusinessPartnerName1',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-02-filter',
											showClearButton: true
										}
									}
								}
							},
							contact02fk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-filtered-contact-combobox',
									options: {
										initValueField: 'FamilyName',
										filterKey: 'object-main-unit-bizpartner-02-server-filter',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-filtered-contact-combobox',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'object-main-unit-bizpartner-02-server-filter'
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
							businesspartner03fk: {
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
							subsidiary03fk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-subsidiary-lookup',
									options: {
										initValueField: 'SubsidiaryAddress',
										filterKey: 'object-main-unit-bizpartner-03-filter',
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
											filterKey: 'object-main-unit-bizpartner-03-filter',
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
							customer03fk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-customer-lookup',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-03-filter',
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
										descriptionField: 'BusinessPartnerName1',
										descriptionMember: 'BusinessPartnerName1',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-03-filter',
											showClearButton: true
										}
									}
								}
							},
							contact03fk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-filtered-contact-combobox',
									options: {
										initValueField: 'FamilyName',
										filterKey: 'object-main-unit-bizpartner-03-server-filter',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-filtered-contact-combobox',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'object-main-unit-bizpartner-03-server-filter'
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
							businesspartner04fk: {
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
							subsidiary04fk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-subsidiary-lookup',
									options: {
										initValueField: 'SubsidiaryAddress',
										filterKey: 'object-main-unit-bizpartner-04-filter',
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
											filterKey: 'object-main-unit-bizpartner-04-filter',
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
							customer04fk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-customer-lookup',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-04-filter',
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
										descriptionField: 'BusinessPartnerName1',
										descriptionMember: 'BusinessPartnerName1',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-04-filter',
											showClearButton: true
										}
									}
								}
							},
							contact04fk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-filtered-contact-combobox',
									options: {
										initValueField: 'FamilyName',
										filterKey: 'object-main-unit-bizpartner-04-server-filter',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-filtered-contact-combobox',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'object-main-unit-bizpartner-04-server-filter'
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
							businesspartner05fk: {
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
							subsidiary05fk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-subsidiary-lookup',
									options: {
										initValueField: 'SubsidiaryAddress',
										filterKey: 'object-main-unit-bizpartner-05-filter',
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
											filterKey: 'object-main-unit-bizpartner-05-filter',
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
							customer05fk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-customer-lookup',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-05-filter',
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
										descriptionField: 'BusinessPartnerName1',
										descriptionMember: 'BusinessPartnerName1',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-05-filter',
											showClearButton: true
										}
									}
								}
							},
							contact05fk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-filtered-contact-combobox',
									options: {
										initValueField: 'FamilyName',
										filterKey: 'object-main-unit-bizpartner-05-server-filter',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-filtered-contact-combobox',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'object-main-unit-bizpartner-05-server-filter'
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
							clerksalfk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									},
									requiredInErrorHandling: true
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
										displayMember: 'Description'
									}
								}
							},
							clerktecfk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									},
									requiredInErrorHandling: true
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
										displayMember: 'Description'
									}
								}
							},
							clerkextfk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									},
									requiredInErrorHandling: true
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
										displayMember: 'Description'
									}
								}
							},
							taxcodefk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-master-data-context-tax-code-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								grid: {
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
							installmentagreementfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.installmentagreement'),
							unit2objunitstring: {
								readonly: true
							},
							priceparkingspace: {readonly: true},
							specialpitches: {readonly: true},
							totalcost: {readonly: true},
							pricesdetailed: {readonly: true},
							unittypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectunittype'),
							rubriccategoryfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
										lookupOptions: {
											filterKey: 'object-main-rubric-category-lookup-filter',
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
											filterKey: 'object-main-rubric-category-lookup-filter',
											showClearButton: true
										}
									}
								}
							}
						}
					};
				}

				var unitDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var unitAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'UnitDto',
					moduleSubModule: 'Object.Main'
				});
				unitAttributeDomains = unitAttributeDomains.properties;


				function UnitUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitUIStandardService.prototype.constructor = UnitUIStandardService;

				return new BaseService(unitDetailLayout, unitAttributeDomains, objectMainTranslationService);
			}
		]);
})();
