(function () {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentBusinessPartnerUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of business partner entities
	 */
	angular.module(moduleName).factory('resourceEquipmentBusinessPartnerUIStandardService',
		['platformUIStandardConfigService', '$injector', 'resourceEquipmentTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, resourceEquipmentTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						'fid': 'object.main.resourceequipmentplantfixedsssetdetailform',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'showGrouping': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['partnertypefk', 'businesspartnerfk', 'contactfk', 'subsidiaryfk', 'commenttext', 'warrantydate', 'email', 'telephonenumberfk', 'firstname', 'rolefk', 'lastname','telephonenumbermobilefk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							partnertypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentpartnertype'),
							businesspartnerfk:	 {
								navigator: {
									moduleName: 'businesspartner.main'
								},
								detail: {
									type: 'directive',
									directive: 'business-partner-main-business-partner-dialog',
									options: {
										initValueField: 'BusinesspartnerBpName1',
										showClearButton: true,
										'IsShowBranch': true,
										'mainService': 'resourceEquipmentBusinessPartnerDataService',
										'BusinessPartnerField': 'BusinessPartnerFk',
										'SubsidiaryField': 'SubsidiaryFk',
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-business-partner-dialog',
										'lookupOptions': {
											'IsShowBranch': true,
											'mainService': 'resourceEquipmentBusinessPartnerDataService',
											'BusinessPartnerField': 'BusinessPartnerFk',
											'SubsidiaryField': 'SubsidiaryFk'
									  }
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
										filterKey: 'resource-equipment-bizpartner-filter',
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
											filterKey: 'resource-equipment-bizpartner-filter',
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
							contactfk: {
								detail: {
									type: 'directive',
									directive: 'business-partner-main-filtered-contact-combobox',
									options: {
										initValueField: 'FamilyName',
										filterKey: 'resource-equipment-bizpartner-server-filter',
										showClearButton: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'business-partner-main-filtered-contact-combobox',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'resource-equipment-bizpartner-server-filter'
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
							rolefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.prj2bp.role'),email: { readonly: true },
							telephonenumberfk: { readonly: true },
							firstname: { readonly: true },
							lastname: { readonly: true },
							telephonenumbermobilefk: { readonly: true },
						}
					};
				}

				var resourceEquipmentBusinessPartnerDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resourceEquipmentBusinessPartnerAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BusinessPartnerDto',
					moduleSubModule: 'Resource.Equipment'
				});
				resourceEquipmentBusinessPartnerAttributeDomains = resourceEquipmentBusinessPartnerAttributeDomains.properties;


				function ResourceEquipmentBusinessPartnerUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ResourceEquipmentBusinessPartnerUIStandardService.prototype = Object.create(BaseService.prototype);
				ResourceEquipmentBusinessPartnerUIStandardService.prototype.constructor = ResourceEquipmentBusinessPartnerUIStandardService;

				return new BaseService(resourceEquipmentBusinessPartnerDetailLayout, resourceEquipmentBusinessPartnerAttributeDomains, resourceEquipmentTranslationService);
			}
		]);
})();
