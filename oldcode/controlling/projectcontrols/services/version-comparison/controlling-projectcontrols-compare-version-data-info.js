/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	'use strict';

	let moduleName = 'controlling.projectcontrols';
	angular.module(moduleName).factory('controllingProjectcontrolsCompareDataInfo', [
		'controllingProjectcontrolsVersionDataInfoFactory',
		function (controllingProjectcontrolsVersionDataInfoFactory) {
			return controllingProjectcontrolsVersionDataInfoFactory.createComparisonData();
		}]);
})(angular);