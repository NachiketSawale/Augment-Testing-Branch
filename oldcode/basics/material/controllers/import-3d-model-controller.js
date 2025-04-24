/**
 * Created by wui on 12/21/2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialImport3dModelController',['$scope',
		function ($scope) {
			$scope.file = null;

			$scope.close = function (isOK) {
				$scope.$close({
					isOK: isOK,
					file: $scope.file
				});
			};

			$scope.chooseFile = function () {
				var fileElement = angular.element('<input type="file" />');
				var fileFilter = '.cpixml';

				fileElement.attr('accept', fileFilter);
				fileElement.bind('change', onFileChange);
				fileElement.click();
			};

			function onFileChange(e) {
				if (e.target.files.length) {
					$scope.$apply(function () {
						$scope.file = e.target.files[0];
					});
				}
			}
		}
	]);

})(angular);