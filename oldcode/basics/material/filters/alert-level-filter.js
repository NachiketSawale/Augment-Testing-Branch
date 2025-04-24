/**
 * Created by wui on 10/11/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).filter('basicsMaterialAlertLevelFilter', [
		function() {
			return function (level) {
				var style = 'alert';

				switch (level) {
					case 1:
						style += ' alert-info';
						break;
					case 2:
						style += ' alert-warning';
						break;
					case 3:
						style += ' alert-danger';
						break;
				}

				return style;
			};
		}
	]);

})(angular);