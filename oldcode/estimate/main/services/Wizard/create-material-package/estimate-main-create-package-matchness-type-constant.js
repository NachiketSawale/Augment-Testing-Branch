/**
 * Created by alm on 9/3/2024
 */
(function (angular) {
	'use strict';

	const moduleName = 'estimate.main';

	angular.module(moduleName).constant('estimateMainCreatePackageMatchnessTypeConstant', {
		New: 1,
		PerfectlyMatched: 2,
		CriteriaMatched: 3,
		UserSpecified: 4
	});
})(angular);
