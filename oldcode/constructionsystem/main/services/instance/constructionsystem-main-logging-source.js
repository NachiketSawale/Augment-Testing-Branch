/**
 * Created by wui on 1/22/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).constant('constructionsystemMainLoggingSource', {
		scheduler: 0,
		Evaluation: 1,
		Calculation: 2,
		Script: 3,
		TwoQ: 4,
		ApplyLineItemToEstimate: 5,
		AssignObject: 6
	});

})(angular);