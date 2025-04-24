/**
 * Created by chk on 10/17/2016.
 */
(function(angular){
	'use strict';

	/* jshint -W072 */
	var moduleName = 'constructionsystem.common';
	angular.module(moduleName).filter('constructionSystemScriptTypeFilter',[function(){
		return function (input){
			var output = '';
			switch (input){
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