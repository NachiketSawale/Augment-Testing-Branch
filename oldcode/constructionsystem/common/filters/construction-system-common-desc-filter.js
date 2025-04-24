/**
 * Created by wui on 3/14/2017.
 */

(function(angular){
	'use strict';

	/* jshint -W072 */
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).filter('constructionSystemCommonDescFilter',[function(){
		var maxLength = 80;

		return function (input) {
			var output = '';

			if (angular.isString(input)) {
				output = input.trim();
			}

			if (output.length > maxLength) {
				// if value is long text, make sub string for better performance.
				output = output.trim().substring(0, maxLength) + '...';
			}

			if (output.startsWith('<')) {
				output = '...';
			}

			// conflict with html tag
			return output.replace(/</gm, '[').replace(/>/gm, ']');
		};
	}]);
})(angular);