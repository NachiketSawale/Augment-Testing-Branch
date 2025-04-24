/**
 * Created by alm on 5/26/2022.
 */

(function () {
	'use strict';
	let moduleName = 'procurement.requisition';
	let cloudCommonModule = 'cloud.common';
	let boqMainModule = 'boq.main';
	angular.module(moduleName).factory('procurementRequisitionBoqVariantLayout', ['basicsLookupdataConfigGenerator',
		function procurementRequisitionBoqVariantLayout(basicsLookupdataConfigGenerator) {
			return {
				fid: 'procurement.Requisition.boqVariantForm',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['boqlinetypefk', 'reference', 'briefinfo', 'basitemtypefk', 'quantity', 'basuomfk', 'price', 'finalprice', 'finalpriceoc', 'finalgross', 'finalgrossoc']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule, boqMainModule],
					'extraWords': {
						BoqLineTypeFk: {location: boqMainModule, identifier: 'BoqLineTypeFk', initial: 'BoQ Line Type'},
						Reference: {location: cloudCommonModule, identifier: 'entityReference', initial: 'Reference'},
						BriefInfo: {
							location: cloudCommonModule,
							identifier: 'entityBriefInfo',
							initial: 'Outline Specification'
						},
						BasItemTypeFk: {
							location: boqMainModule,
							identifier: 'BasItemTypeFk',
							initial: 'Item Type Stand/Opt'
						},
						Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity'},
						BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM'},
						Price: {location: boqMainModule, identifier: 'Price', initial: 'Unit Rate'},
						Finalprice: {location: boqMainModule, identifier: 'Finalprice', initial: 'Final Price'},
						FinalpriceOc: {location: boqMainModule, identifier: 'FinalpriceOc', initial: 'Final Price Oc'},
						Finalgross: {
							location: boqMainModule,
							identifier: 'Finalgrosss',
							initial: 'Final Price (Gross)'
						},
						FinalgrossOc: {
							location: boqMainModule,
							identifier: 'FinalpriceOc',
							initial: 'Final Price Oc(Gross)'
						},
					}
				},
				overloads:{
					'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'boqUomLookupDataService',
						filterKey: 'boq-uom-filter',
						filter: function (boqItem) {
							var currentBoqHeader = null;
							if (boqItem) {
								currentBoqHeader = {BoqHeaderId: boqItem.BoqHeaderFk};
							}

							return currentBoqHeader;
						}
					}),
					'basitemtypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.boqitemtype', 'Description'),
					'boqlinetypefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'boqLineTypeLookupDataService',
						enableCache: true,
						gridLess: true,
						additionalColumns: false,
						filterKey: 'boq-line-type-filter',
						filter: function (item) {
							var currentLineTypeAndBoqHeader = null;
							if (item) {
								currentLineTypeAndBoqHeader = {};
								currentLineTypeAndBoqHeader.BoqLineTypeFk = item.BoqLineTypeFk;
								currentLineTypeAndBoqHeader.BoqHeaderFk = item.BoqHeaderFk;
							}

							return currentLineTypeAndBoqHeader;
						}
					})
				}
			};
		}
	]);


	angular.module(moduleName).factory('procurementRequisitionBoqVariantUIStandardService',

		['platformUIStandardConfigService', 'procurementRequisitionTranslationService', 'platformSchemaService', 'procurementRequisitionBoqVariantLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, procurementRequisitionBoqVariantLayout, platformUIStandardExtentService) {

				let BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'BoqItemDto',
					moduleSubModule: 'Boq.Main'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				let service = new BaseService(procurementRequisitionBoqVariantLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, procurementRequisitionBoqVariantLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
