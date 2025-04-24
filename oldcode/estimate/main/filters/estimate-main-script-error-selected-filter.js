/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular){
	'use strict';

	let moduleName = 'estimate.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).filter('estimateMainScriptErrorSelectedFilter',[function() {
		return function (input) {
			return input ? 'active' : '';
		};
	}]);

})(angular);
