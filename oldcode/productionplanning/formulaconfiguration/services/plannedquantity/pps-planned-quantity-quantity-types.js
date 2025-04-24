(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.formulaconfiguration';
	/**
	 * @ngdoc service
	 * @name ppsPlannedQuantityQuantityTypes
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).constant('ppsPlannedQuantityQuantityTypes', {
		Userdefined:1,
		Material: 2,
		CostCode:3,
		Property:4,
		Characteristic: 5,
		FormulaParameter: 6,
		Accounting: 7,
		OnormImport: 8,
		IronImport:9,
		lookupInfo: {
			2: {
				column: 'MdcMaterialFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-material-material-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					formatterOptions: {
						lookupType: 'MaterialCommodity',
						displayMember: 'Code'
					}
				}
			},
			3: {
				column: 'MdcCostCodeFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-cost-codes-lookup',
						descriptionMember: 'Code'
					},
					formatterOptions: {
						lookupType: 'costcode',
						displayMember: 'Code',
						version: 3,
					}
				}
			},
			4:{
				column: 'Property',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'pps-planned-quantity-property-lookup',
						descriptionMember: 'Translation'
					},
					formatterOptions: {
						lookupType: 'ProductDescriptionProperties',
						displayMember: 'Translation'
					}
				}
			}
		}
	});
})(angular);