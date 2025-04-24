/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	'use strict';

	let moduleName = 'controlling.projectcontrols';
	angular.module(moduleName).constant('projectControlsComparisonVersionType', {
		VersionA: 1,
		VersionB: 2,
		VersionDiffer : 3
	});
})(angular);