/**
 * Created by chi on 5/10/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).value('businessPartnerMainEvaluationClerkType', {
		EVAL: 1,
		GROUP: 2,
		SUBGROUP: 3
	});
})(angular);