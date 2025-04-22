/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular){
	'use strict';

	var moduleName = 'sales.common';

	angular.module(moduleName).value('salesCommonGeneralsLayout', {
		'fid': 'sales.common.generals',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['generalstypefk', 'controllingunitfk', 'taxcodefk', 'valuetype', 'value', 'commenttext']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'overloads': {
			'generalstypefk': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-procurementstructure-prc-generals-type-combobox',
					'options': {
						descriptionMember: 'DescriptionInfo.Translated',
						filterKey: 'sales-common-generals-type-lookup'
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-procurementstructure-prc-generals-type-combobox',
						lookupOptions: {filterKey: 'sales-common-generals-type-lookup'}
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
						lookupDirective: 'basics-master-data-context-controlling-unit-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							filterKey: '<_will-be-set-by-common-generals-filter-service_>',
							showClearButton: true
						}
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							filterKey: '<_will-be-set-by-common-generals-filter-service_>',
							showClearButton: true
						},
						directive: 'basics-master-data-context-controlling-unit-lookup'
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
	});

})(angular);
