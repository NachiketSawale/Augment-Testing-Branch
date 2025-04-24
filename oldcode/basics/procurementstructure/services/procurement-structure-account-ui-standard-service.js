/**
 * Created by wuj on 3/5/2015.
 */
(function () {
	'use strict';
	var modName = 'basics.procurementstructure', cloudCommonModule = 'cloud.common';
	angular.module(modName)
		.factory('basicsProcurementAccountLayout',
			['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'basics.procurementstructure.account.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['prcaccounttypefk', 'taxcodefk', 'account', 'offsetaccount', 'bascontrollingcatfk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							PrcAccountTypeFk: {
								location: cloudCommonModule,
								identifier: 'entityType',
								initial: 'Type'
							},
							TaxCodeFk: {
								location: cloudCommonModule,
								identifier: 'entityTaxCode',
								initial: 'Tax Code'
							},
							Account: {location: modName, identifier: 'account', initial: 'Account'},
							OffsetAccount: {
								location: modName,
								identifier: 'offsetAccount',
								initial: 'offset Account'
							},
							BasControllingCatFk: {location: modName, identifier: 'controllingCat', initial: 'Controlling Cat'}
						}
					},
					'overloads': {
						'prcaccounttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.procurementstructure.accounttype'),
						'taxcodefk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-master-data-context-tax-code-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'TaxCode',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-master-data-context-tax-code-lookup',
									lookupField: 'TaxCodeFk',
									lookupOptions: {
										showClearButton: true,
										displayMember: 'Code'
									}
								},
								width: 120
							}
						},

						'account': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-procurementstructure-account-lookup',
								'options': {
									regex: '^[\\s\\S]{0,16}$',
									displayMember: 'Code',
									isTextEditable: true,
									showClearButton: true
								}
							},
							'grid': {
								'editor': 'directive',
								'editorOptions': {
									regex: '^[\\s\\S]{0,16}$',
									directive: 'basics-procurementstructure-account-lookup',
									showClearButton: true,
									isTextEditable: true,
									displayMember: 'Code',
									events: [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if (args.entity) {
												if (args.selectedItem) {
													args.entity.BasAccountFk = args.selectedItem.Id;
												}
												else {
													args.entity.BusinessPartnerFk = null;
												}
											}
										}
									}]
								}
							}
						},
						'offsetaccount': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-procurementstructure-account-lookup',
								'options': {
									regex: '^[\\s\\S]{0,16}$',
									displayMember: 'Code',
									isTextEditable: true,
									showClearButton: true
								}
							},
							'grid': {
								'editor': 'directive',
								'editorOptions': {
									regex: '^[\\s\\S]{0,16}$',
									directive: 'basics-procurementstructure-account-lookup',
									showClearButton: true,
									isTextEditable: true,
									displayMember: 'Code',
									events: [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if (args.entity) {
												if (args.selectedItem) {
													args.entity.BasAccountOffsetFk = args.selectedItem.Id;
												}
												else {
													args.entity.BusinessPartnerFk = null;
												}
											}
										}
									}]
								}
							}
						},
						'bascontrollingcatfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.bascontrollingcat')

					},
					'addition': {
						grid: [
							{
								'lookupDisplayColumn': true,
								'field': 'TaxCodeFk',
								'displayMember': 'DescriptionInfo.Translated',
								'name$tr$': 'cloud.common.entityTaxCodeDescription',
								'width': 150
							},
							{
								'field': 'BasAccountDescription',
								'model': 'BasAccountDescription',
								'name': 'Account Description',
								'name$tr$': 'basics.procurementstructure.accountDescription',
								'readonly': true
							},
							{
								'field': 'BasAccountOffsetDescription',
								'model': 'BasAccountOffsetDescription',
								'name': 'Offset Account Description',
								'name$tr$': 'basics.procurementstructure.offsetAccountDescription',
								'readonly': true
							}]
					}
				};
			}])
		.factory('basicsProcurementAccountUIStandardService',
			['platformUIStandardConfigService', 'basicsProcurementstructureTranslationService',
				'basicsProcurementAccountLayout', 'platformSchemaService', 'platformUIStandardExtentService',
				function (platformUIStandardConfigService, translationService,
								  layout, platformSchemaService, platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcStructureAccountDto',
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