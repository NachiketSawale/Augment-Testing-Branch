/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructurePesTotalLayout',[function () {
		return {
			fid: 'controlling.structure.total',
			version: '1.0.1',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: [
						'controllingunitcode', 'controllingunitdescription', 'contrcostcodecode', 'contrcostcodedescription', 'headerid', 'headerdescription', 'headertotal', 'itemfilteredtotal', 'statusfk', 'businesspartnerfk',
						'documentdate', 'datedelivered', 'datedeliveredfrom', 'dateeffective'
					]
				}
			],
			overloads: {
				'controllingunitcode' : { readonly: true },
				'controllingunitdescription' : { readonly: true },
				'contrcostcodecode' : { readonly: true },
				'contrcostcodedescription' : { readonly: true },
				'headerdescription' : { readonly: true },
				'headertotal' : { readonly: true },
				'itemfilteredtotal' : { readonly: true },
				'headerid': {
					readonly: true,
					navigator: {
						moduleName: 'procurement.pes'
					},
					'detail': {
						'label$tr$': 'procurement.invoice.header.pes',
						'type': 'directive',
						'directive': 'procurement-invoice-pes-lookup'
					},
					'grid': {
						name$tr$: 'procurement.invoice.header.pes',
						editor: 'lookup',
						editorOptions: {
							directive: 'procurement-invoice-pes-lookup'
						},
						width: 150,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'InvoicePes',
							displayMember: 'Code',
							navigator: {
								moduleName: 'procurement.pes'
							}
						}
					}
				},
				'statusfk': {
					readonly: true,
					'grid': {
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'PesStatus',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService'
						}
					},
					'detail': {
						'type': 'directive',
						'model': 'PesStatusFk',
						'directive': 'procurement-pes-header-status-combobox',
						'options': {
							readOnly: true,
							imageSelector: 'platformStatusIconService'
						}
					}
				},
				'businesspartnerfk': {
					readonly: true,
					mandatory: true,
					navigator: {
						moduleName: 'businesspartner.main'
					},
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'business-partner-main-business-partner-dialog'
							// 'directive': 'filter-business-partner-dialog-lookup'
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'BusinessPartner',
							'displayMember': 'BusinessPartnerName1'
						},
						'width': 150
					},
					'detail': {
						'type': 'directive',
						'directive': 'business-partner-main-business-partner-dialog',
						// 'directive': 'filter-business-partner-dialog-lookup',
						'options': {
							'displayMember': 'BusinessPartnerName1'
						}
					}
				},
				'documentdate': {readonly:true},
				'datedelivered': {readonly:true},
				'datedeliveredfrom': {readonly:true},
				'dateeffective': {readonly:true}
			}
		};
	}]);

	angular.module(moduleName).factory('controllingStructurePesTotalUIStandardService',
		['controllingStructurePesTotalLayout','platformUIStandardConfigService', 'platformSchemaService', 'controllingStructureTranslationService',
			function (layout,platformUIStandardConfigService, platformSchemaService, translationService) {

				var BaseService = platformUIStandardConfigService,
					domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PesControllingTotalDto',
						moduleSubModule: 'Procurement.Pes'
					});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new UIStandardService(layout, domainSchema, translationService);
			}]);
})();