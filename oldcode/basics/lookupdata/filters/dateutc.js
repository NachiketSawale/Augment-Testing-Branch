/**
 * Created by wui on 4/27/2015.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).filter('dateutc',['moment', function(moment) {

		return function (input) {
			return input ? moment(input).format('L') : '';
		};

	}]);

})(angular);
