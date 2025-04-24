(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.formulaconfiguration';
	/**
	 * @ngdoc service
	 * @name ppsPlannedQuantityResourceTypes
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).constant('ppsPlannedQuantityResourceTypes', {
		BoQItem: 1,
		EstLineItem:2,
		EstResource: 3,
		lookupInfo: {
			1: {
				column: 'BoqItemFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'pps-planned-quantity-main-boq-lookup',
						descriptionMember: 'Reference'
					},
					formatterOptions: {
						lookupType: 'PpsBoqItem',
						displayMember: 'Reference'
					}
				}
			},
			2: {
				column: 'EstLineItemFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'pps-planned-quantity-est-line-item-lookup-dialog',
						descriptionMember: 'Code'
					},
					formatterOptions: {
						lookupType: 'estlineitemlookup',
						displayMember: 'Code'
					}
				}
			},
			3: {
				column: 'EstResourceFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'pps-planned-quantity-est-resource-lookup-dialog',
						descriptionMember: 'Code'
					},
					formatterOptions: {
						lookupType: 'estresource4itemassignment',
						displayMember: 'Code'
					}
				}
			}
		}
	});
})(angular);