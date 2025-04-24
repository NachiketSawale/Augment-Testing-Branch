(function (angular) {
	'use strict';
	var moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonConditionConstantValues
	 * @function
	 *
	 * @description
	 */
	angular.module(moduleName).value('basicsCommonConstantValues', {
		configDetailType: {
			quantity: 1,
			unitRate: 2,
			amounts: 3
		},
		roundingMethod: {
			standard: 1,
			roundUp: 2,
			roundDown: 3
		},
		roundTo: {
			digitsBeforeDecimalPoint: 1,
			digitsAfterDecimalPoint: 2,
			significantPlaces: 3
		}
	});

})(angular);
