/**
 * Created by wuj on 8/19/2015.
 */
(function () {
	'use strict';
	var modName = 'procurement.package';

	angular.module(modName).factory('procurementPackagePackage2HeaderLayout',
		function () {
			return {
				'fid': 'procurement.package.package2header.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['description', 'commenttext', 'reqheaderfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'reqheaderfk': {
						'readonly': true,
						navigator : {
							moduleName: 'procurement.requisition',
							registerService: 'procurementRequisitionHeaderDataService'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'procurement-common-req-header-lookup-view-dialog',
								descriptionMember: 'Description'
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ReqHeaderLookupView',
								displayMember: 'Code'
							}
						}
					}
				},
				'addition': {
					'grid': [
						{
							'lookupDisplayColumn': true,
							'field': 'ReqHeaderFk',
							'id': 'reqheaderdescription',
							'displayMember': 'Description',
							'name$tr$': 'procurement.package.entityReqDescription',
							'width': 125
						},
						{
							'lookupDisplayColumn': true,
							'id': 'reqheaderdaterequired',
							'field': 'ReqHeaderFk',
							'displayMember': 'DateRequired',
							'name$tr$': 'procurement.package.entityReqRequired',
							'lookupDomain':'dateutc',
							'width': 125
						},
						{
							'lookupDisplayColumn': true,
							'id': 'reqheaderstatus',
							'field': 'ReqHeaderFk',
							'name$tr$': 'procurement.package.entityReqState',
							'width': 125,
							'formatterOptions': {
								'lookupType': 'reqheaderlookupview',
								'imageSelector': 'platformStatusIconService',
								'displayMember': 'StatusInfo.Translated'
							}
						}, {
							'afterId': 'reqheaderstatus',
							'id': 'configuration',
							'field': 'PrcHeaderEntity.ConfigurationFk',
							'name': 'Configuration',
							'name$tr$': 'procurement.package.entityConfiguration',
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PrcConfiguration', 'displayMember': 'DescriptionInfo.Translated'},
							'width': 135,
							'grouping': {
								'title': 'procurement.package.entityConfiguration',
								'getter': 'PrcHeaderEntity.ConfigurationFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						},{
							'afterId': 'configuration',
							navigator: {
								moduleName: 'basics.procurementstructure'
								// registerService: 'basicsProcurementStructureService'
							},
							'id': 'structure',
							'field': 'PrcHeaderEntity.StructureFk',
							'name$tr$': 'basics.common.entityPrcStructureFk',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-procurementstructure-structure-dialog',
								'lookupOptions': {'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'prcstructure',
								'displayMember': 'Code'
							},
							'grouping': {
								'title': 'cloud.common.entityStructureCode',
								'getter': 'PrcHeaderEntity.StructureFk',
								'aggregators': [],
								'aggregateCollapsed': true
							},
							'width': 100
						}, {
							'afterId': 'structure',
							'id': 'structureDescription',
							'field': 'PrcHeaderEntity.StructureFk',
							'name$tr$': 'cloud.common.entityStructureDescription',
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'prcstructure',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 150
						}, {
							'afterId': 'structureDescription',
							'id': 'strategy',
							'field': 'PrcHeaderEntity.StrategyFk',
							'name': 'Strategy',
							'name$tr$': 'procurement.requisition.headerGrid.reqheaderStrategy',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-common-strategy-combobox',
								'lookupOptions': {'filterKey': 'prc-package-package2header-strategy-filter'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'prcconfig2strategy', 'displayMember': 'Description'},
							'width': 85,
							'grouping': {
								'title': 'procurement.requisition.headerGrid.reqheaderStrategy',
								'getter': 'PrcHeaderEntity.StrategyFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}

					],
					'detail': [
						{
							'afterId': 'ReqHeaderDescription',
							'gid': 'basicData',
							'rid': 'ReqHeaderDateRequired',
							'id': 'ReqHeaderDateRequired',
							'label': 'Date Required',
							'label$tr$': 'procurement.package.entityReqRequired',
							'type': 'directive',
							'model': 'ReqHeaderFk',
							'directive': 'procurement-common-req-header-lookup-view-dialog',
							'options': {
								displayMember: 'DateRequired',
								formatter:'dateutc',
								readOnly: true
							}
						}, {
							'afterId': 'ReqHeaderDateRequired',
							'gid': 'basicData',
							'rid': 'ReqHeaderStatus',
							'id': 'ReqHeaderStatus',
							'label': 'Status',
							'label$tr$': 'procurement.package.entityReqState',
							'type': 'directive',
							'model': 'ReqHeaderFk',
							'directive': 'procurement-common-req-header-lookup-view-dialog',
							'options': {
								displayMember: 'StatusInfo.Translated',
								imageSelector: 'platformStatusIconService',
								readOnly: true
							}
						}, {
							'afterId': 'ReqHeaderStatus',
							'gid': 'basicData',
							'rid': 'PrcHeaderEntity.ConfigurationFk',
							'label': 'Configuration',
							'label$tr$': 'procurement.package.entityConfiguration',
							'type': 'directive',
							'model': 'PrcHeaderEntity.ConfigurationFk',
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								'filterKey': 'prc-package-package2header-configuration-filter',
								readOnly: true
							}
						}, {
							'afterId': 'PrcHeaderEntity.ConfigurationFk',
							'gid': 'basicData',
							'rid': 'PrcHeaderEntity.StrategyFk',
							'label': 'Strategy',
							'label$tr$': 'cloud.common.EntityStrategy',
							'type': 'directive',
							'model': 'PrcHeaderEntity.StrategyFk',
							'directive': 'procurement-common-strategy-combobox',
							'options': {'filterKey': 'prc-package-package2header-strategy-filter'}
						}, {
							'afterId': 'PrcHeaderEntity.StrategyFk',
							'gid': 'basicData',
							'rid': 'PrcHeaderEntity.StructureFk',
							'label': 'Procurement Structure',
							'label$tr$': 'basics.common.entityPrcStructureFk',
							'model': 'PrcHeaderEntity.StructureFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionField: 'StructureDescription',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					]
				}
			};
		});

	angular.module(modName).factory('procurementPackagePackage2HeaderUIStandardService',
		['platformUIStandardConfigService', 'procurementPackageTranslationService', 'procurementPackagePackage2HeaderLayout', 'platformSchemaService', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcPackage2HeaderDto',
					moduleSubModule: 'Procurement.Package'
				});

				if (domainSchema) {
					if (domainSchema.properties) {
						domainSchema.properties['PrcHeaderEntity.StrategyFk'] = { domain: 'integer' };
					}
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