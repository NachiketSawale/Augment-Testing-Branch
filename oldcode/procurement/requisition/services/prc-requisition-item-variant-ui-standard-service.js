/**
 * Created by alm on 5/26/2022.
 */

(function () {
	'use strict';
	let moduleName = 'procurement.requisition';
	let cloudCommonModule = 'cloud.common';
	let prcCommonModule = 'procurement.common';
	angular.module(moduleName).factory('procurementRequisitionItemVariantLayout', [
		function procurementRequisitionItemVariantLayout() {
			return {
				fid: 'procurement.Requisition.itemVariantForm',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['mdcmaterialfk','itemno', 'description1', 'quantity', 'basuomfk', 'price', 'total', 'totaloc', 'totalgross', 'totalgrossoc']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule, prcCommonModule],
					'extraWords': {
						MdcMaterialFk:{location: prcCommonModule, identifier: 'prcItemMaterialNo', initial: 'prcItemMaterialNo'},
						Itemno: {location: prcCommonModule, identifier: 'prcItemItemNo', initial: 'prcItemItemNo'},
						Description1: {
							location: prcCommonModule,
							identifier: 'prcItemDescription1',
							initial: 'prcItemDescription1'
						},
						Quantity: {
							location: cloudCommonModule,
							identifier: 'entityQuantity',
							initial: 'entityQuantity'
						},
						BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'entityUoM'},
						Price: {location: cloudCommonModule, identifier: 'entityPrice', initial: 'entityPrice'},
						Total: {location: cloudCommonModule, identifier: 'entityTotal', initial: 'entityTotal'},
						TotalOc: {
							location: prcCommonModule,
							identifier: 'prcItemTotalCurrency',
							initial: 'prcItemTotalCurrency'
						},
						TotalGross: {location: prcCommonModule, identifier: 'totalGross', initial: 'Total (Gross)'},
						TotalGrossOc: {
							location: prcCommonModule,
							identifier: 'totalOcGross',
							initial: 'Total Gross (Oc)'
						}
					}
				},
				overloads:{
					'basuomfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup'
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Uom',
								displayMember: 'Unit'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									isFastDataRecording: true
								}
							},
							width: 100
						}
					},
					'mdcmaterialfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-material-material-lookup',
							'options': {
								filterKey: 'procurement-common-item-mdcmaterial-filter',
								showClearButton: true,
								gridOptions: {
									multiSelect: true
								},
								usageContext: 'procurementCommonPrcItemDataService'
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialCommodity',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									filterKey: 'procurement-common-item-mdcmaterial-filter',
									showClearButton: true,
									gridOptions: {
										multiSelect: true
									},
									usageContext: 'procurementCommonPrcItemDataService'
								},
								directive: 'basics-material-material-lookup',
							},
							width: 100
						}
					}
				}
			};
		}
	]);


	angular.module(moduleName).factory('procurementRequisitionItemVariantUIStandardService',

		['platformUIStandardConfigService', 'procurementRequisitionTranslationService', 'platformSchemaService', 'procurementRequisitionItemVariantLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, procurementRequisitionItemVariantLayout, platformUIStandardExtentService) {

				let BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcItemDto',
					moduleSubModule: 'Procurement.Common'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				let service = new BaseService(procurementRequisitionItemVariantLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, procurementRequisitionItemVariantLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
