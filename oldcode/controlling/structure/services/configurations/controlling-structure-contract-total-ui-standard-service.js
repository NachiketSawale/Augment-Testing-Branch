/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureContractTotalLayout',[function () {
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
						'dateordered', 'datereported', 'datecanceled', 'datedelivery', 'datecallofffrom', 'datecalloffto', 'confirmationdate', 'datepenalty', 'dateeffective', 'executionstart', 'executionend', 'validfrom', 'validto'
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
						moduleName: 'procurement.contract',
						registerService: 'procurementContractHeaderDataService'
					},
					'detail': {
						'type': 'directive',
						'directive': 'prc-con-header-dialog'
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'prc-con-header-dialog'
						},
						width: 150,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ConHeaderView',
							displayMember: 'Code',
							navigator: {
								moduleName: 'procurement.contract'
							}
						}
					}
				},
				'statusfk': {
					readonly: true,
					'grid': {
						'editor': '',
						'editorOptions': null,
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'ConStatus',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'procurement-contract-header-status-combobox',
						'options': {
							readOnly: true
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
				'dateordered': {
					readonly: true
				},
				'datereported': {
					readonly: true
				},
				'datecanceled': {
					readonly: true
				},
				'datedelivery': {
					readonly: true
				},
				'datecallofffrom': {
					readonly: true
				},
				'datecalloffto': {
					readonly: true
				},
				// 'datequotation': {
				//    readonly: true
				// },
				'confirmationdate': {
					readonly: true
				},
				'datepenalty': {
					readonly: true
				},
				'dateeffective': {
					readonly: true
				},
				'executionstart': {
					readonly: true
				},
				'executionend': {
					readonly: true
				},
				'validfrom': {
					readonly: true
				},
				'validto': {
					readonly: true
				}
			}
		};
	}]);

	angular.module(moduleName).factory('controllingStructureContractTotalUIStandardService',
		['controllingStructureContractTotalLayout','platformUIStandardConfigService', 'platformSchemaService', 'controllingStructureTranslationService',
			function (layout,platformUIStandardConfigService, platformSchemaService, translationService) {

				var BaseService = platformUIStandardConfigService,
					domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'ConControllingTotalDto',
						moduleSubModule: 'Procurement.Contract'
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