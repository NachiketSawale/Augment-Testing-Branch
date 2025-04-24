(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainProspectUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of prospect entities
	 */
	angular.module(moduleName).factory('objectMainProspectUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',
			function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {

						'fid': 'object.main.prospectdetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['businesspartnerfk', 'subsidiaryfk', 'customerfk', 'contactfk', 'prospectstatusfk', 'interestfk', 'dateofcontact', 'targetamount', 'businesspartnereafk', 'subsidiaryeafk', 'customereafk', 'contacteafk', 'remark']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
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
							subsidiaryfk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-subsidiary-lookup',
									options: {
										initValueField: 'SubsidiaryAddress',
										filterKey: 'object-main-unit-bizpartner-filter',
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
											filterKey: 'object-main-unit-bizpartner-filter',
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
							customerfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-customer-lookup',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-filter',
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {'lookupType': 'customer', 'displayMember': 'Code'},
									width: 125,
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'business-partner-main-customer-lookup',
										descriptionField: 'BusinessPartnerName1',
										descriptionMember: 'BusinessPartnerName1',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-filter',
											showClearButton: true
										}
									},
								},
							},
							contactfk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-filtered-contact-combobox',
									options: {
										initValueField: 'FamilyName',
										filterKey: 'object-main-unit-bizpartner-server-filter',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-filtered-contact-combobox',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'object-main-unit-bizpartner-server-filter'
										}
									},
									width: 125,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'FamilyName'
									}
								},
							},
							prospectstatusfk:basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.objectprospectstatus', null, {
								showIcon: true,
								imageSelectorService: 'platformStatusIconService'
							}),
							interestfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectinterest'),
							businesspartnereafk: {
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
							subsidiaryeafk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-subsidiary-lookup',
									options: {
										initValueField: 'SubsidiaryAddress',
										filterKey: 'object-main-unit-bizpartner-ea-filter',
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
											filterKey: 'object-main-unit-bizpartner-ea-filter',
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
							customereafk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-customer-lookup',
										lookupOptions: {
											filterKey: 'object-main-unit-bizpartner-ea-filter',
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
											filterKey: 'object-main-unit-bizpartner-ea-filter',
											showClearButton: true
										}
									}
								}
							},
							contacteafk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-filtered-contact-combobox',
									options: {
										initValueField: 'FamilyName',
										filterKey: 'object-main-unit-bizpartner-ea-server-filter',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-filtered-contact-combobox',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'object-main-unit-bizpartner-ea-server-filter'
										}
									},
									width: 125,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'contact',
										displayMember: 'FamilyName'
									}
								}
							}
						}
					};
				}

				var objectMainProspectDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var objectMainProspectAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ProspectDto',
					moduleSubModule: 'Object.Main'
				});
				objectMainProspectAttributeDomains = objectMainProspectAttributeDomains.properties;


				function ProspectUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProspectUIStandardService.prototype = Object.create(BaseService.prototype);
				ProspectUIStandardService.prototype.constructor = ProspectUIStandardService;

				return new BaseService(objectMainProspectDetailLayout, objectMainProspectAttributeDomains, objectMainTranslationService);
			}
		]);
})();
