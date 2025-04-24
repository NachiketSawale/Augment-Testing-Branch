/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';

	let moduleName = 'project.material';

	angular.module(moduleName).controller('projectMaterialUpdateEstimatePriceRelatedAssemblyDialogController', ['$scope', '$injector', '$translate', 'projectMaterialMainService',
		function ($scope, $injector, $translate, projectMaterialMainService) {

			let doNotAskAgain = false;
			$scope.doNotShowAgain = false;
			$scope.modalTitle = $translate.instant('project.material.updateRelatedAssemblyTitle');

			$scope.onClick = function (flag) {
				if(doNotAskAgain){
					projectMaterialMainService.disableUpdatePrompt();
				}

				$scope.$close({update: flag});
			};

			$scope.onChange = function (flag) {
				doNotAskAgain = flag;
			};

			$scope.dialog = {};
			$scope.dialog.cancel = function () {
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {

			});

		}]);
})(angular);
