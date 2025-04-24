// eslint-disable-next-line no-redeclare
/* global angular */

(function () {
	'use strict';
	const modName = 'procurement.stock';
	const basicsCommonModule = 'basics.common';
	const prcCommonModule = 'procurement.common';
	angular.module(modName).factory('procurementStockItemInfoLayout', [
		function () {
			const config = {
				'fid': 'procurement.stock.iteminfo',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['itemno', 'matcode', 'matdescriptioninfo', 'stockmatcode', 'descriptioninfo', 'pescode', 'pesdescription', 'concode', 'condescription',
							'conquantity', 'deliveredquantity', 'quantity', 'alternativequantity', 'itemdate', 'constatusfk', 'pesstatusfk'
						]
					}
				],
				'translationInfos': {
					'extraModules': [modName, basicsCommonModule, prcCommonModule],
					'extraWords': {
						ItemNo: {location: prcCommonModule, identifier: 'prcItemItemNo', initial: 'prcItemItemNo'},
						MatCode: {
							location: basicsCommonModule,
							identifier: 'entityMaterialCode',
							initial: 'Material Code'
						},
						MatDescriptionInfo: {
							location: modName,
							identifier: 'itemInfo.matDescription',
							initial: 'Material Description'
						},
						StockMatCode: {
							location: modName,
							identifier: 'itemInfo.matStockCode',
							initial: 'Material Stock Code'
						},
						DescriptionInfo: {
							location: basicsCommonModule,
							identifier: 'itemInfo.matStockDescription',
							initial: 'Material Stock Description'
						},
						PesCode: {location: modName, identifier: 'itemInfo.pesCode', initial: 'PES Code'},
						PesDescription: {location: modName, identifier: 'itemInfo.pesDes', initial: 'PES Description'},
						ConCode: {location: modName, identifier: 'itemInfo.conCode', initial: 'Contract Code'},
						ConDescription: {
							location: modName,
							identifier: 'itemInfo.conDes',
							initial: 'Contract Description'
						},
						ConQuantity: {
							location: modName,
							identifier: 'itemInfo.conQuantity',
							initial: 'Contracted Item Quantity'
						},
						DeliveredQuantity: {
							location: modName,
							identifier: 'itemInfo.deliveredQuantity',
							initial: 'Delivered Item Quantity'
						},
						Quantity: {location: modName, identifier: 'itemInfo.quantity', initial: 'Quantity'},
						AlternativeQuantity: {
							location: modName,
							identifier: 'itemInfo.alternativeQuantity',
							initial: 'Alternative Quantity'
						},
						ItemDate: {location: modName, identifier: 'itemInfo.itemDate', initial: 'Item Header Date'},
						ConStatusFk: {location: modName, identifier: 'itemInfo.conStatus', initial: 'Contract Status'},
						PesStatusFk: {location: modName, identifier: 'itemInfo.pesStatus', initial: 'PES Status'}
					}
				},
				'overloads': {
					itemno: {readonly: true},
					matcode: {readonly: true},
					matdescriptioninfo: {readonly: true},
					stockmatcode: {readonly: true},
					descriptioninfo: {readonly: true},
					pescode: {readonly: true},
					pesdescription: {readonly: true},
					concode: {readonly: true},
					condescription: {readonly: true},
					conquantity: {readonly: true, formatter: 'quantity'},
					deliveredquantity: {readonly: true, formatter: 'quantity'},
					quantity: {readonly: true, formatter: 'quantity'},
					alternativequantity: {readonly: true, formatter: 'quantity'},
					itemdate: {readonly: true},
					constatusfk: {
						readonly: true,
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ConStatus',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						}
					},
					pesstatusfk: {
						readonly: true,
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PesStatus',
								displayMember: 'Description',
								imageSelector: 'platformStatusIconService'
							}
						}
					},
				}
			};
			return config;
		}]);

	angular.module(modName).factory('procurementStockItemInfoUIStandardService',
		['platformUIStandardConfigService', 'procurementStockTranslationService',
			'procurementStockItemInfoLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				let BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'StockItemInfoVDto',
					moduleSubModule: 'Procurement.Stock'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				let service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
})();
