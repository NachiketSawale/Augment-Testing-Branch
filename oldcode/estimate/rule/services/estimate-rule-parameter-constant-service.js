(function (angular) {
	'use strict';
	let moduleName='estimate.rule';
	angular.module(moduleName).constant('estimateRuleParameterConstant',{
		Decimal2: 1,
		Boolean: 2,
		Text:3,
		TextFormula:4
	});
})(angular);
