/**
 * Created by wui on 3/10/2016.
 */

(function(angular){
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).filter('constructionsystemMasterScriptErrorTypeFilter',[function() {
		return function (input) {
			var output = '';

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