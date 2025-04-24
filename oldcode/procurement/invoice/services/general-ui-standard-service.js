(function () {
	'use strict';
	var modName = 'procurement.invoice',
		cloudCommonModule = 'cloud.common',
		procurementCommonModule = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(modName).factory('procurementInvoiceGeneralLayout', ['$injector','procurementInvoiceGeneralDataService', function($injector,dataService) {
		return {
			'fid': 'procurement.invoice.general.detail',
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
				'extraModules': [procurementCommonModule],
				'extraWords': {
					PrcGeneralstypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'entityType'},
					ControllingUnitFk: {
						location: cloudCommonModule,
						identifier: 'entityControllingUnitCode',
						initial: 'entityControllingUnitCode'
					},
					TaxCodeFk: {location: cloudCommonModule, identifier: 'entityTaxCode', initial: 'entityTaxCode'},
					ValueType: {
						location: procurementCommonModule,
						identifier: 'generalsValueType',
						initial: 'generalsValueType'
					},
					Value: {location: procurementCommonModule, identifier: 'generalsValue', initial: 'generalsValue'},
					CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'comment'}
				}
			},
			'overloads': {
				'prcgeneralstypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-procurementstructure-prc-generals-type-combobox',
						'options': {
							descriptionMember: 'DescriptionInfo.Translated',
							filterKey: 'procurement-invoice-generals-type-lookup'
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-procurementstructure-prc-generals-type-combobox',
							lookupOptions: {filterKey: 'procurement-invoice-generals-type-lookup'}
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
								filterKey: 'inv-generals-controlling-unit-filter',
								showClearButton: true,
								considerPlanningElement: true,
								selectableCallback: function (dataItem) {
									return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, dataService);
								}
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								filterKey: 'inv-generals-controlling-unit-filter',
								showClearButton: true,
								considerPlanningElement: true,
								selectableCallback: function (dataItem) {
									return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, dataService);
								}
							},
							lookupDirective: 'controlling-structure-dialog-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ControllingUnit',
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
	angular.module(modName).factory('procurementInvoiceGeneralUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceGeneralLayout', 'platformSchemaService', 'platformUIStandardExtentService', 'basicsLookupdataLookupDescriptorService', '$translate',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService, basicsLookupdataLookupDescriptorService, $translate) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvGeneralsDto',
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
})();
