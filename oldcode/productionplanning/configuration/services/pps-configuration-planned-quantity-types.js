/**
 * Created by zwz on 9/26/2022.
 */

(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.configuration';
	angular.module(moduleName).constant('ppsConfigurationPlannedQuantityTypes', {
		Userdefined: 1,
		Material: 2,
		CostCode: 3,
		Property: 4,
		Characteristic: 5,
		FormulaParameter: 6
	});
})(angular);

