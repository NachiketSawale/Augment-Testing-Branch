(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCustomizeWageGroupProcessor
	 * @function
	 *
	 * @description
	 * The basicsCustomizeWageGroupProcessor set the type property documentation readonly
	 */

	angular.module('basics.customize').service('basicsCustomizeWageGroupProcessor', BasicsCustomizeWageGroupProcessor);

	BasicsCustomizeWageGroupProcessor.$inject = ['platformRuntimeDataService'];

	function BasicsCustomizeWageGroupProcessor(platformRuntimeDataService) {

		this.processItem = function processItem(wageGroup) {
			if (wageGroup) {
				const surcharge = 2;
				const additionalCost = 3;
				const fields = [{ field: 'DbFormIndexTypeFk', readonly: wageGroup.WageRateTypeFk != surcharge && wageGroup.WageRateTypeFk != additionalCost }];

				platformRuntimeDataService.readonly(wageGroup, fields);
			}
		};
	}

})(angular);