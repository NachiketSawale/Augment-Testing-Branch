/**
 * Created by balkanci on 26.06.2015.
 */
(function (angular) {

	'use strict';
	angular.module('basics.company').factory('basicsCompanyNumberImageProcessor', [ function () {

		var service = {};

		service.processItem = function processItem(number) {
			if(number) {
				switch (number.Type) {
					case 'Rubric':
						number.image = 'ico-rubric';
						break;
					case 'RubricCategory':
						number.image = 'ico-rubric-category';
						break;
					case 'RubricIndex':
						number.image = 'ico-rubric-cat-index';
						break;
				}
			}
		};
		return service;

	}]);
})(angular);
