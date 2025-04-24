/**
 * Created by chm on 6/9/2015.
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsBillingSchemaRubricCategoryImageProcessor
	 * @function
	 *
	 * @description
	 * The basicsBillingSchemaRubricCategoryImageProcessor deal with image related to rubric and rubric category.
	 */

	angular.module('basics.billingschema').factory('basicsBillingSchemaRubricCategoryImageProcessor', [function () {

		var service = {};
		service.processItem = function processItem(item) {
			if (!item.ParentFk) {
				switch (item.RubricId) {
					case 4: item.image = 'ico-rubric-customer-quote'; break;
					case 5: item.image = 'ico-rubric-order'; break;
					case 7: item.image = 'ico-rubric-customer-billing'; break;
					case 25: item.image = 'ico-rubric-supplier-quote'; break;
					case 26: item.image = 'ico-rubric-contracts'; break;
					case 27: item.image = 'ico-rubric-pes'; break;
					case 28: item.image = 'ico-rubric-invoice-rec'; break;
					default :break;
				}
			}
			else {
				item.image = 'ico-rubric-category';
			}
		};

		return service;
	}]);
})(angular);