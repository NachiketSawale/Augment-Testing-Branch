/**
 * Created by wuj on 3/4/2015.
 */
(function () {
	'use strict';
	var modName = 'basics.procurementstructure', cloudCommonModule = 'cloud.common';
	var mod = angular.module(modName);

	mod.factory('basicsProcurementConfiguration2GeneralsLayout',
		['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'basics.procurementstructure.configuration2Generals.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['mdcledgercontextfk', 'prcconfigheaderfk', 'prcgeneralstypefk', 'value', 'commenttext']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [],
					'extraWords': {
						MdcLedgerContextFk: {location: modName, identifier: 'entityLedgerContextFk', initial: 'Ledger Context'},
						PrcConfigHeaderFk: {location: modName, identifier: 'configuration', initial: 'Configuration Header'},
						PrcGeneralsTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
						Value: {location: modName, identifier: 'value', initial: 'Value'},
						CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'}
					}
				},
				'overloads': {
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
					'prcconfigheaderfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-procurement-configuration-config-header-combo-box'
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcConfigHeader',
								displayMember: 'DescriptionInfo.Translated'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurement-configuration-config-header-combo-box'
							},
							width: 100
						}
					},
					 'prcgeneralstypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.procurementstructure.generalstype', 'Description',{
						 required: true,
						 field: 'LedgerContextFk',
						 filterKey: 'prc-generals-type-filter',
						 customIntegerProperty: 'MDC_LEDGER_CONTEXT_FK'
					 })

				}
			};
		}]);

	mod.factory('basicsProcurementConfiguration2GeneralsUIStandardService',
		['platformUIStandardConfigService', 'basicsProcurementstructureTranslationService',
			'basicsProcurementConfiguration2GeneralsLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcConfiguration2GeneralsDto',
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

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})();