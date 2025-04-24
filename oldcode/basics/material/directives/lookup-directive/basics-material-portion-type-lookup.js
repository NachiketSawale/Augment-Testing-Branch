/**
 * $Id: basics-cost-codes-lookup.js 34193 2022-03-31 13:18:41Z henkel $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialPortionTypeLookup',
		['_','BasicsLookupdataLookupDirectiveDefinition', function (_,BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = angular.copy(configOption);

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
		]);

	let configOption = {
		lookupType: 'materialportiontype',
		valueMember: 'Id',
		displayMember: 'ExternalCode',
		version: 3,
		uuid: 'd7a06964680241c1b8edcf5b03356582',
		columns: [
			{
				id: 'ExternalCode',
				field: 'ExternalCode',
				name: 'ExternalCode',
				formatter: 'code',
				width: 70,
				name$tr$: 'cloud.common.entityExternalCode'
			}, {
				id: 'Description',
				field: 'DescriptionInfo.Translated',
				name: 'Description',
				formatter: 'description',
				width: 100,
				name$tr$: 'cloud.common.entityDescription'
			}, {
				id: 'MdcCostCodeFk',
				field: 'MdcCostCodeFk',
				name: 'Cost Code',
				width: 50,
				name$tr$: 'cloud.common.entityCostCode',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'costcode',
					displayMember: 'Code'
				}
			}, {
				id: 'PrcPriceConditionFk',
				field: 'PrcPriceConditionFk',
				name: 'Price Condition',
				formatter: 'lookup',
				width: 70,
				name$tr$: 'cloud.common.entityPriceCondition',
				formatterOptions: {
					lookupType: 'PrcPricecondition',
					displayMember: 'DescriptionInfo.Translated'
				}
			}, {
				id: 'IsEstimatePrice',
				field: 'IsEstimatePrice',
				name: 'Is Estimate Price',
				formatter: 'boolean',
				width: 100,
				name$tr$: 'cloud.common.entityIsEstimatePrice'
			}, {
				id: 'IsDayworkRate',
				field: 'IsDayworkRate',
				name: 'Is Daywork Rate',
				formatter: 'boolean',
				width: 100,
				name$tr$: 'cloud.common.entityIsDayworkRate'
			}, {
				id: 'Sorting',
				formatter: 'integer',
				field: 'Sorting',
				name: 'Sorting',
				name$tr$: 'cloud.common.entitySorting',
				editor: 'integer',
				width: 70,
				sortable: true
			}
		],
		width: 1200,
		height: 800,
		title: {
			name: 'Material Portion Type',
			name$tr$: 'basics.material.portion.materialPortionType'
		}
	};
})(angular);