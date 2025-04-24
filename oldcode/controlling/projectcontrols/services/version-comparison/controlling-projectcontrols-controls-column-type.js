/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	'use strict';

	let moduleName = 'controlling.projectcontrols';
	angular.module(moduleName).constant('projectControlsColumnType', {
		CTC: 1,
		CAC: 2,
		CAC_METHOD: 3,
		SAC: 4,
		WCF: 5,
		BCF: 6,
		CACWC: 7,
		CACBC: 8,
		CUSTOM_FORMULA: 9,
		CUSTOM_FACTOR: 10
	});
})(angular);