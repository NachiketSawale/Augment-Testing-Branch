(function () {
	'use strict';
	var modName = 'basics.procurementstructure', cloudCommonModule = 'cloud.common';
	angular.module(modName)
		.factory('basicsProcurementTaxCodeLayout',['basicsLookupdataConfigGenerator',
			function (basicsLookupdataConfigGenerator) {

				return {
					fid: 'basics.procurementstructure.taxcodedetailform',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					'groups': [
						{
							gid: 'basicData',
							attributes: ['mdcledgercontextfk', 'mdctaxcodefk', 'mdcsalestaxgroupfk','commenttext']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							'MdcLedgerContextFk': {location: modName, identifier: 'entityLedgerContextFk', initial: 'Ledger Context'},
							'MdcTaxCodeFk': {location: cloudCommonModule, identifier: 'entityTaxCode', initial: 'Tax Code'},
							'MdcSalesTaxGroupFk': {'location': modName, 'identifier': 'entityMdcSalesTaxGroup', 'initial': 'Sales Tax Group'},
							'CommentText': {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
						}
					},
					overloads: {
						'mdcledgercontextfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-prc-structure-ledger-context-combo-box'
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'LedgerContext',
									displayMember: 'Description'
								},
								editor: 'lookup',
								editorOptions: {
									'directive': 'basics-prc-structure-ledger-context-combo-box'
								},
								width: 120
							}
						},
						'mdctaxcodefk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-tax-code-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'taxCodeByLedgerContext-filter',
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupField: 'TaxCodeFk',
									filterKey: 'taxCodeByLedgerContext-filter',
									lookupOptions: {
										filterKey: 'taxCodeByLedgerContext-filter',
										showClearButton: true
									},
									directive: 'basics-tax-code-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'TaxCode',
									displayMember: 'Code'
								}
							}
						},
						'mdcsalestaxgroupfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomSalesTaxGroupLookupDataService',
								desMember: 'DescriptionInfo.Translated',
								enableCache: true,
								showClearButton: true,
							   filterKey: 'saleTaxCodeByLedgerContext-filter'
							})
				   	},
					'addition': {
						'grid': [{
							'lookupDisplayColumn': true,
							'field': 'MdcTaxCodeFk',
							'displayMember': 'DescriptionInfo.Translated',
							 'name$tr$': 'cloud.common.entityTaxCodeDescription',
							'width': 150
						 }]
					}
				};

			}])
		.factory('basicsProcurementStructureTaxCodeUIStandardService',
			['platformUIStandardConfigService', 'basicsProcurementstructureTranslationService',
				'basicsProcurementTaxCodeLayout', 'platformSchemaService','platformUIStandardExtentService',

				function (platformUIStandardConfigService, translationService, layout, platformSchemaService,platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcStructureTaxDto',
						moduleSubModule: 'Basics.ProcurementStructure'
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