(function () {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentProcurementContractsUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of plant component entities
	 */
	angular.module(moduleName).factory('resourceEquipmentProcurementContractsUIStandardService',
		['platformUIStandardConfigService', 'platformLayoutHelperService', '$injector', 'resourceEquipmentTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, platformLayoutHelperService, $injector, resourceEquipmentTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'object.main.resourceequipmentprocurementcontractsdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						addAdditionalColumns: true,
						showGrouping: true,
						groups: [
							{
								gid: 'basicData',
								attributes: ['businesspartnerfk', 'uomfk', 'quantity', 'total', 'pricetotal', 'dateordered', 'contractdescription', 'contractcontrollingunitcode', 'contractcontrollingunitdescription', 'contractstatusfk', 'contractheaderfk', 'contractcontrollingunitfk', 'procurementheaderfk']
							},
							{
								gid: 'itemData',
								attributes: ['itemdescription1', 'itemdescription2', 'itemfk', 'itemprocurementstructurecode', 'itemprocurementstructuredescription', 'itemcontrollingunitcode', 'itemcontrollingunitdescription', 'itemcontrollingunitfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							itemcontrollingunitfk: {
								grid:
								{
									formatter: 'lookup',
									formatterOptions:
									{
										'lookupType': 'ControllingUnit',
										'displayMember': 'Code'
									},  'width': 80
								},
								detail:
								{
									type: 'directive', 'directive': 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'controlling-structure-dialog-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											'filterKey': 'prc-con-controlling-by-prj-filter',
											showClearButton: true, considerPlanningElement: true,
											selectableCallback: function (dataItem)
											{
												return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
											}
										},
									}
								},
								readonly: true
							},
							itemfk: {
								detail: {
									'type': 'directive',
									'directive': 'procurement-common-item-merged-lookup',
									'options': {
										showClearButton: true,
										filterKey: 'prc-invoice-item-filter',
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupOptions: {
											showClearButton: true,
											filterKey: 'prc-invoice-item-filter'
										},
										directive: 'procurement-common-item-merged-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PrcItemMergedLookup',
										displayMember: 'Itemno',
										version: 3
									},
									width: 100
								},
								readonly: true
							},
							contractcontrollingunitfk: {
								'navigator': {
									moduleName: 'controlling.structure'
								},
								grid: {
									'editor': 'lookup',
									'editorOptions': {
										'lookupDirective': 'controlling-structure-dialog-lookup',
										'lookupOptions': {
											'filterKey': 'prc-con-controlling-by-prj-filter',
											'showClearButton': true,
											considerPlanningElement: true,
											selectableCallback: function (dataItem) {
												return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementContractHeaderDataService);
											}
										}
									},
									'formatter': 'lookup',
									'formatterOptions': { 'lookupType': 'ControllingUnit', 'displayMember': 'Code' },
									'width': 80
								},
								detail: {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'controlling-structure-dialog-lookup',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'filterKey': 'prc-con-controlling-by-prj-filter',
											'showClearButton': true,
											considerPlanningElement: true,
											selectableCallback: function (dataItem) {
												return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementContractHeaderDataService);
											}
										}
									}
								},
								readonly: true
							},
							contractheaderfk: {
								navigator: {
									moduleName: 'procurement.contract'
								},
								grid: {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'prc-con-header-dialog',
										'lookupOptions': {
											'filterKey': 'prc-con-header-filter',
											'showClearButton': true,
											'dialogOptions': {
												'alerts': [{
													theme: 'info',
													message: 'Setting basis contract will overwrite quite a lot of related fields',
													message$tr$: 'procurement.common.contractHeaderUpdateInfo'
												}]
											}
										}
									},
									'formatter': 'lookup',
									'formatterOptions': { 'lookupType': 'conheaderview', 'displayMember': 'Code' },
									'width': 100
								},
								detail: {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'prc-con-header-dialog',
										'descriptionMember': 'Description',
										'lookupOptions': {
											'showClearButton': true,
											'filterKey': 'prc-con-header-filter',
											'dialogOptions': {
												'alerts': [{
													theme: 'info',
													message: 'Setting basis contract will overwrite quite a lot of related fields',
													message$tr$: 'procurement.common.contractHeaderUpdateInfo'
												}]
											}
										}
									},

								},
								readonly: true
							},
							contractstatusfk: {
								grid: {
									'editor': '',
									'editorOptions': null,
									'formatter': 'lookup',
									'formatterOptions': {
										lookupType: 'ConStatus',
										displayMember: 'DescriptionInfo.Translated',
										imageSelector: 'platformStatusIconService'
									}
								},
								detail: {
									'type': 'directive',
									'directive': 'procurement-contract-header-status-combobox',
								},
								readonly: true
							},
							uomfk:{
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-uom-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Uom',
										displayMember: 'Unit'
									},
									width: 100
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-uom-lookup'
								},
								readonly: true,
							},
							businesspartnerfk: {
								navigator: {
									moduleName: 'businesspartner.main'
								},
								detail: {
									type: 'directive',
									directive: 'business-partner-main-business-partner-dialog',
									options: {
										'initValueField': 'BusinesspartnerBpName1',
										'showClearButton': true,
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
								},
								readonly: true
							},
							quantity: { readonly: true },
							total: { readonly: true },
							pricetotal: { readonly: true },
							contractcode: { readonly: true },
							dateordered: { readonly: true },
							contractdescription: { readonly: true },
							contractcontrollingunitcode: { readonly: true },
							contractcontrollingunitdescription: { readonly: true },
							itemdescription1: { readonly: true },
							itemdescription2: { readonly: true },
							itemprocurementstructurecode: { readonly: true },
							itemprocurementstructuredescription: { readonly: true },
							itemcontrollingunitcode: { readonly: true },
							itemcontrollingunitdescription: { readonly: true },
							procurementheaderfk: { readonly: true },
						}
					};
				}

				var resourceEquipmentProcurementContractsDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resourceEquipmentProcurementContractsAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PlantProcurementContractVDto',
					moduleSubModule: 'Resource.Equipment'
				});
				resourceEquipmentProcurementContractsAttributeDomains = resourceEquipmentProcurementContractsAttributeDomains.properties;


				function ResourceEquipmentProcurementContractsUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ResourceEquipmentProcurementContractsUIStandardService.prototype = Object.create(BaseService.prototype);
				ResourceEquipmentProcurementContractsUIStandardService.prototype.constructor = ResourceEquipmentProcurementContractsUIStandardService;

				return new BaseService(resourceEquipmentProcurementContractsDetailLayout, resourceEquipmentProcurementContractsAttributeDomains, resourceEquipmentTranslationService);
			}
		]);
})();
