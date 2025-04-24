(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	var moduleName = 'procurement.common';
	/**
	 * @ngdoc service
	 * @name basicsCommonConditionConstantValues
	 * @function
	 *
	 * @description
	 */
	angular.module(moduleName).value('procurementCommonConstantValues', {
		contractRoundingMethod: {
			ForBoq: 1,
			ForPrcItem: 2,
			ForNull: 3
		}
	});
})();
