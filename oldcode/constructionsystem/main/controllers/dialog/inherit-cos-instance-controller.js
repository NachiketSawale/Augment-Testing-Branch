/**
 * Created by wui on 6/24/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).controller('cosMainInheritInstanceController', ['$scope', '$translate',
		function ($scope, $translate) {

			$scope.ok = function () {

			};

			$scope.modalOptions.headerText = $translate.instant('constructionsystem.main.inheritCosInstance.wizardTitle');
			$scope.modalOptions.cancel = function() {
				$scope.$close(false);
			};
		}
	]);

})(angular);