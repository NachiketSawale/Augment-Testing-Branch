(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.common';

	/**
	 * @ngdoc service
	 * @name timekeepingCommonConditionConstantValues
	 * @function
	 *
	 * @description
	 * timekeepingRecordingConditionConstantValues provides definitions and constants frequently used in timekeeping recording module
	 */
	angular.module(moduleName).value('timekeepingCommonConstantValues', {
		rubricId: 94,
		/**
		 * This constant describes the rounding method
		 */
		roundingMethod: {
			standard: 1,
			roundUp: 2,
			roundDown: 3
		},
		/**
		 * This constant describes the round-to modes
		 */
		roundTo: {
			digitsBeforeDecimalPoint: 1,
			digitsAfterDecimalPoint: 2,
			significantPlaces: 3
		}
	});

})(angular);
