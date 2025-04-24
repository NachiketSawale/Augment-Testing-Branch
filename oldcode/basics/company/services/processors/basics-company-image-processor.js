/**
 * Created by henkel on 26.11.2014.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCompanyImageProcessor
	 * @function
	 *
	 * @description
	 * The basicsCompanyImageProcessor adds path to images for companies depending on there type.
	 */

	angular.module('basics.company').factory('basicsCompanyImageProcessor', [ function () {

		var service = {};

		service.processItem = function processItem(company) {
			if(company) {
				switch (company.CompanyTypeFk) {
					case 1: // This is a company
						company.image = 'ico-comp-businessunit';
						break;
					case 2: // This is a group
						company.image = 'ico-comp-root';
						break;
					case 3: // This is a profit center
						company.image = 'ico-comp-profitcenter';
						break;
					default://Assume it is a business unit
						company.image = 'ico-comp-root';
						break;
				}
			}
		};
		return service;

	}]);
})(angular);