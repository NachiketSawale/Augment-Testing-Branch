/**
 * Created by chk on 2/22/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).filter('commonJobProgressFilter', [
		function() {
			return function (input) {
				return input + '%';
			};
		}
	]);

	angular.module(moduleName).filter('commonJobStateFilter', [
		function() {
			return function (input) {
				var output = input;

				switch (input) {
					case 0:
						output = 'Waiting';
						break;
					case 1:
						output = 'Starting';
						break;
					case 2:
						output = 'Running';
						break;
					case 3:
						output = 'Stopped';
						break;
					case 4:
					case 7:
						output = 'Finished';
						break;
					case 5:
						output = 'Repetitive';
						break;
					case 6:
						output = 'Stopping';
						break;
					/*case 7:
						output = 'Historized';
						break;*/
				}

				return output;
			};
		}
	]);

})(angular);