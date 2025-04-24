/**
 * Created by wui on 3/10/2016.
 */

(function(angular){
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).filter('constructionsystemMasterScriptErrorSelectedFilter',[function() {
		return function (input) {
			return input ? 'active' : '';
		};
	}]);

})(angular);