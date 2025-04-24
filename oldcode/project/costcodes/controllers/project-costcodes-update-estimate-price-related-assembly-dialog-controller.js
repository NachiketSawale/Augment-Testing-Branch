/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';

	let moduleName = 'project.costcodes';

	angular.module(moduleName).controller('projectCostcodesUpdateEstimatePriceRelatedAssemblyDialogController', ['$scope', '$injector', '$translate', 'projectCostCodesMainService',
		function ($scope, $injector, $translate, projectCostCodesMainService) {

			let doNotAskAgain = false;
			$scope.doNotShowAgain = false;
			$scope.modalTitle = $translate.instant('project.costcodes.updateRelatedAssemblyTitle');

			$scope.onClick = function (flag) {
				if(doNotAskAgain){
					projectCostCodesMainService.disableUpdatePrompt();
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
