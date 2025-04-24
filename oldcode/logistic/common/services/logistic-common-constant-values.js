/**
 * Created by leo on 26.03.2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.common';

	/**
	 * @ngdoc service
	 * @name logisticCommonConstantValues
	 * @function
	 *
	 * @description
	 * logisticCommonConstantValues provides definitions and constants frequently used in logistic module
	 */
	angular.module(moduleName).value('logisticCommonConstantValues', {
		type:{
			plant: 1,
			material: 2,
			sundryService: 3
		}
	});
})(angular);
