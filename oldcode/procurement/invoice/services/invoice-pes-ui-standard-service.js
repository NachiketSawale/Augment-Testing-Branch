(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var modName = 'procurement.invoice';
	angular.module(modName).factory('procurementInvoicePesLayout', [
		function () {
			return  {
				'fid': 'procurement.invoice.pes.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'pes',
						'attributes': ['pesheaderfk', 'pesvalueoc', 'pesvatoc', 'pesvalue', 'pesvat']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName, 'basics.common'],
					'extraWords': {
						pes: {location: modName, identifier: 'group.pes', initial: 'Performance Entry Sheet'},
						PesHeaderFk: {location: modName, identifier: 'entityPES', initial: 'PES No.'},
						PesValueOc: {location: modName, identifier: 'entityValueOc', initial: 'Value(OC)'},
						PesValue: {location: modName, identifier: 'entityValue', initial: 'Value'},
						PesVatOc: {location: modName, identifier: 'entityVATOc', initial: 'VAT(OC)'},
						PesVat: {location: modName, identifier: 'entityVAT', initial: 'VAT'}
					}
				},
				'overloads': {
					'pesheaderfk': {
						navigator: {
							moduleName: 'procurement.pes'
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-invoice-pes-lookup',
							'options': {
								'filterKey': 'prc-invoice-pes-header-filter'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-invoice-pes-lookup',
								'lookupOptions': {
									'filterKey': 'prc-invoice-pes-header-filter'
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvoicePes',
								displayMember: 'Code'
							}
						},
						'mandatory': true
					},
					'pesvalueoc': {
						readonly: true
					},
					'pesvalue': {
						readonly: true
					},
					'pesvatoc': {
						readonly: true
					},
					'pesvat': {
						readonly: true
					}
				},
				'addition': {
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'PesHeaderFk',
							displayMember: 'Description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription'
						},
						{
							lookupDisplayColumn: true,
							field: 'PesHeaderFk',
							displayMember: 'StatusDescriptionInfo.Translated',
							name: 'Status',
							imageSelector: 'platformStatusIconService',
							name$tr$: 'cloud.common.entityStatus',
							width: 100
						},
						{
							lookupDisplayColumn: true,
							field: 'PesHeaderFk',
							lookupDomain: 'date',
							displayMember: 'DocumentDate',
							name: 'Document Date',
							name$tr$: 'procurement.invoice.entityDocumentDate',
							width: 100
						},
						{
							lookupDisplayColumn: true,
							field: 'PesHeaderFk',
							lookupDomain: 'date',
							displayMember: 'DateDelivered',
							name: 'Deliver Date',
							name$tr$: 'procurement.invoice.entityDateDelivered',
							width: 100
						},
						{
							lookupDisplayColumn: true,
							field: 'PesHeaderFk',
							displayMember: 'ControllingUnitCode',
							name: 'Controlling Unit Code',
							name$tr$: 'cloud.common.entityControllingUnitCode',
							width: 100
						},
						{
							lookupDisplayColumn: true,
							field: 'PesHeaderFk',
							displayMember: 'ControllingUnitDescriptionInfo.Translated',
							name: 'Controlling Unit Description',
							'name$tr$': 'cloud.common.entityControllingUnitDesc',
							width: 100
						}, {
							lookupDisplayColumn: true,
							field: 'PesHeaderFk',
							displayMember: 'PrcStructureCode',
							name: 'Structure Code',
							name$tr$: 'cloud.common.entityStructureCode',
							width: 100
						}, {
							lookupDisplayColumn: true,
							field: 'PesHeaderFk',
							displayMember: 'PrcStructureDescriptionInfo.Translated',
							name: 'Structure Description',
							'name$tr$': 'cloud.common.entityStructureDescription',
							width: 100
						},
						{
							'formatter': 'money',
							'field': 'ValueGross',
							'name': 'Value Gross',
							'name$tr$': 'procurement.common.valueGross',
							'width': 150
						}, {
							'formatter': 'money',
							'field': 'ValueOcGross',
							'name': 'Value Gross (OC)',
							'name$tr$': 'procurement.common.valueOcGross',
							'width': 150
						}
					],
					detail: [
						{
							readonly: true,
							lookupDisplayColumn: true,
							model: 'PesHeaderFk',
							label: 'Description',
							label$tr$: 'cloud.common.entityDescription',
							'options': {
								'displayMember': 'Description'
							}
						},
						{
							readonly: true,
							lookupDisplayColumn: true,
							model: 'PesHeaderFk',
							label: 'Status',
							label$tr$: 'cloud.common.entityStatus',
							'options': {
								'lookupKey': 'prc-invoice-pes-header-pesheaderfk',
								'displayMember': 'StatusDescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						},
						{
							readonly: true,
							lookupDisplayColumn: true,
							model: 'PesHeaderFk',
							lookupDomain: 'date',
							label: 'Document Date',
							label$tr$: 'procurement.invoice.entityDocumentDate',
							'options': {
								'displayMember': 'DocumentDate',
								formatter: 'dateutc'
							}
						},
						{
							readonly: true,
							lookupDisplayColumn: true,
							model: 'PesHeaderFk',
							lookupDomain: 'date',
							label: 'Deliver Date',
							label$tr$: 'procurement.invoice.entityDateDelivered',
							'options': {
								'displayMember': 'DateDelivered',
								formatter: 'dateutc'
							}
						},
						{
							lookupDisplayColumn: true,
							'type': 'directive',
							'directive': 'platform-composite-input',
							'label$tr$': 'cloud.common.entityControllingUnit',
							'model': 'PesHeaderFk',// use for validator
							'options': {
								'rows': [{
									readonly: true,
									'model': 'PesHeaderFk',
									'type': 'directive',
									'directive': 'procurement-invoice-pes-lookup',
									'options': {
										'displayMember': 'ControllingUnitCode'
									},
									'cssLayout': 'md-4 lg-4'
								}, {
									readonly: true,
									'model': 'PesHeaderFk',
									'type': 'directive',
									'directive': 'procurement-invoice-pes-lookup',
									'options': {
										'displayMember': 'ControllingUnitDescriptionInfo.Translated'
									},
									'cssLayout': 'md-8 lg-8'
								}]
							}
						},
						{
							lookupDisplayColumn: true,
							'type': 'directive',
							'directive': 'platform-composite-input',
							'label$tr$': 'basics.common.entityPrcStructureFk',
							'model': 'PesHeaderFk',// use for validator
							'options': {
								'rows': [{
									readonly: true,
									'model': 'PesHeaderFk',
									'type': 'directive',
									'directive': 'procurement-invoice-pes-lookup',
									'options': {
										'displayMember': 'PrcStructureCode'
									},
									'cssLayout': 'md-4 lg-4'
								}, {
									readonly: true,
									'model': 'PesHeaderFk',
									'type': 'directive',
									'directive': 'procurement-invoice-pes-lookup',
									'options': {
										'displayMember': 'PrcStructureDescriptionInfo.Translated'
									},
									'cssLayout': 'md-8 lg-8'
								}]
							}
						},
						{
							afterId: 'pesvatoc',
							rid: 'valueGross',
							gid: 'pes',
							model: 'ValueGross',
							label: 'Value (Gross)',
							label$tr$: 'procurement.common.valueGross',
							type: 'decimal',
							readonly: true,
							options: {
								decimalPlaces: 2
							}
						}, {
							afterId: 'valueGross',
							rid: 'valueOcGross',
							gid: 'pes',
							model: 'ValueOcGross',
							label: 'Value (Gross OC)',
							label$tr$: 'procurement.common.valueOcGross',
							type: 'decimal',
							readonly: true,
							options: {
								decimalPlaces: 2
							}
						}
					]
				}
			};

		}]);

	angular.module(modName).factory('procurementInvoicePESUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoicePesLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'Inv2PESDto',
					moduleSubModule: 'Procurement.Invoice'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
})();
