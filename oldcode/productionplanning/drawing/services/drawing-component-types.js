/**
 * Created by zwz on 5/15/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).constant('drawingComponentTypes', {
		Material: 1,
		CostCode: 2,
		Product: 5,
		properties:{
			1: {
				directive: 'basics-material-material-lookup',
				lookupType: 'MaterialCommodity',
				displayMember: 'Code',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				materialGroupPropertyName: 'GroupCode',
				materialCatalogPropertyName: 'CatalogCode'
			},
			2:{
				directive: 'basics-cost-codes-lookup',
				lookupType: 'costcode',
				displayMember: 'Code',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				version: 3
			}
		},
		lookupInfo:{
			1: {
				column: 'MdcMaterialFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-material-material-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						version: 3
					},
					formatterOptions: {
						lookupType: 'MaterialCommodity',
						displayMember: 'Code'
					}
				},
			},
			2: {
				column: 'MdcCostCodeFk',
				lookup: {
					directive: 'basics-cost-codes-lookup',
					options: {
						lookupDirective: 'basics-cost-codes-lookup',
						descriptionMember: 'DescriptionInfo.Translated',
						version: 3
					},
					formatterOptions: {
						lookupType: 'costcode',
						displayMember: 'Code',
						version: 3
					}
				},
			},
			5: {
				column: 'PpsProductOriginFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'productionplanning-common-product-lookup-new',
						descriptionMember: 'DescriptionInfo.Translated',
						version: 3
					},
					formatterOptions: {
						lookupType: 'CommonProduct',
						displayMember: 'Code',
						version: 3
					}
				},
			},
		}
	});
})(angular);

