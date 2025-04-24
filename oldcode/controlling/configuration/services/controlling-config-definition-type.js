/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	let moduleName = 'controlling.configuration';

	angular.module(moduleName).constant('definitionType', {
		COLUMN: 1,
		FORMULA: 2
	});
})(angular);