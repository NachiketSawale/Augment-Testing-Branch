(function (angular) {
	'use strict';
	var modName = 'procurement.common',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('procurementCommonGeneralsLayout',['$injector', 'procurementContextService', function($injector,moduleContext) {

		return {
			'fid': 'procurement.common.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['prcgeneralstypefk', 'controllingunitfk', 'taxcodefk', 'valuetype', 'value', 'commenttext']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': [modName],
				'extraWords': {
					PrcGeneralstypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'entityType'},
					ControllingUnitFk: {
						location: cloudCommonModule,
						identifier: 'entityControllingUnitCode',
						initial: 'entityControllingUnitCode'
					},
					TaxCodeFk: {location: cloudCommonModule, identifier: 'entityTaxCode', initial: 'entityTaxCode'},
					ValueType: {location: modName, identifier: 'generalsValueType', initial: 'generalsValueType'},
					Value: {location: modName, identifier: 'generalsValue', initial: 'generalsValue'},
					CommentText: {location: cloudCommonModule, identifier: 'comment', initial: 'comment'}
				}
			},
			'overloads': {
				'prcgeneralstypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-procurementstructure-prc-generals-type-combobox',
						'options': {
							descriptionMember: 'DescriptionInfo.Translated',
							filterKey: 'procurement-common-generals-type-lookup'
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-procurementstructure-prc-generals-type-combobox',
							lookupOptions: {filterKey: 'procurement-common-generals-type-lookup'}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcGeneralsType',
							displayMember: 'DescriptionInfo.Translated'
						},
						width: 100
					}
				},
				'controllingunitfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'controlling-structure-dialog-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'prc-generals-controlling-unit-filter',
								showClearButton: true,
								considerPlanningElement: true,
								selectableCallback: function (dataItem) {
									var procurementCommonGeneralsDataService = $injector.get('procurementCommonGeneralsDataService');
									var generalsDataService = procurementCommonGeneralsDataService.getService(moduleContext.getMainService());
									return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, generalsDataService);
								}
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								filterKey: 'prc-generals-controlling-unit-filter',
								showClearButton: true,
								considerPlanningElement: true,
								selectableCallback: function (dataItem) {
									var procurementCommonGeneralsDataService = $injector.get('procurementCommonGeneralsDataService');
									var generalsDataService = procurementCommonGeneralsDataService.getService(moduleContext.getMainService());
									return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, generalsDataService);
								}
							},
							directive: 'controlling-structure-dialog-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Controllingunit',
							displayMember: 'Code'
						},
						width: 130
					}
				},
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
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'basics-master-data-context-tax-code-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'TaxCode',
							displayMember: 'Code'
						},
						width: 100
					}
				},
				'valuetype': {
					readonly: true,
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'generalsvaluetype',
							displayMember: 'Description'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'procurement-common-generals-value-type-combobox',
						'options': {
							descriptionMember: 'Description'
						}
					}
				},
				'value': {
					'mandatory': true
				},
				'commenttext': {
					'mandatory': true
				}

			},
			'addition': {
				'grid': [{
					'lookupDisplayColumn': true,
					'field': 'ControllingUnitFk',
					'displayMember': 'DescriptionInfo.Translated',
					'name$tr$': 'cloud.common.entityControllingUnitDesc',
					'width': 150
				}, {
					'lookupDisplayColumn': true,
					'field': 'TaxCodeFk',
					'displayMember': 'DescriptionInfo.Translated',
					'name$tr$': 'cloud.common.entityTaxCodeDescription',
					'width': 150
				}]
			}

		};
	}]);

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modName).factory('procurementCommonGeneralsUIStandardService',
		['$translate', 'platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonGeneralsLayout', 'platformSchemaService', 'platformUIStandardExtentService', 'basicsLookupdataLookupDescriptorService',
			function ($translate, platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService, basicsLookupdataLookupDescriptorService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcGeneralsDto',
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

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function () {
					return angular.copy(basicGetStandardConfigForDetailView());
				};

				basicsLookupdataLookupDescriptorService.attachData({
					generalsvaluetype: [
						{
							Id: 0,
							Name: 'amount',
							Description: $translate.instant('cloud.common.entityAmount')
						},
						{
							Id: 1,
							Name: 'percent',
							Description: $translate.instant('cloud.common.entityPercent')
						}
					]
				});

				return service;
			}
		]);
})(angular);
