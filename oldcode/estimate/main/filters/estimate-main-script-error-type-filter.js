/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular){
	'use strict';

	let moduleName = 'estimate.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).filter('estimateMainScriptErrorTypeFilter',[function() {
		return function (input) {
			let output = '';

			switch (input) {
				case 1:
					output = 'tlb-icons ico-error';
					break;
				case 2:
					output = 'tlb-icons ico-warning';
					break;
				case 3:
					output = 'tlb-icons ico-info';
					break;
			}

			return output;
		};
	}]);

})(angular);
