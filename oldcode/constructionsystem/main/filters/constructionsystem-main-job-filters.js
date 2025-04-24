/**
 * Created by wui on 3/24/2016.
 */

(function(angular){
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).filter('constructionsystemMainJobProgressFilter', [
		function() {
			return function (input) {
				return input + '%';
			};
		}
	]);

	angular.module(moduleName).filter('constructionsystemMainJobStateFilter', ['$translate',
		function($translate) {
			return function (input) {
				var output = input;

				switch (input) {
					case 0:
						output = $translate.instant('constructionsystem.main.status.waiting');
						break;
					case 1:
						output = $translate.instant('constructionsystem.main.status.running');
						break;
					case 2:
						output = $translate.instant('constructionsystem.main.status.finished');
						break;
					case 3:
						output = $translate.instant('constructionsystem.main.status.canceling');
						break;
					case 4:
						output = $translate.instant('constructionsystem.main.status.canceled');
						break;
					case 10:
						output = $translate.instant('constructionsystem.main.status.aborted');
						break;
					case 11:
						output = $translate.instant('constructionsystem.main.status.failed');
						break;
				}

				return output;
			};
		}
	]);

})(angular);