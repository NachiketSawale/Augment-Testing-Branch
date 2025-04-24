/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainDeleteLineItemDialogController', ['$scope', '$injector', '$translate', 'estimateMainService',
		function ($scope, $injector, $translate, estimateMainService) {

			let doNotAsk = false;
			$scope.doNotAsk = estimateMainService.getDeleteDialogFlag();
			$scope.modalTitle = $translate.instant('estimate.main.confirmDeleteTitle');

			$scope.onOK = function () {
				estimateMainService.setDeleteDialogFlag(doNotAsk);
				$scope.$close({ok: true});
			};

			$scope.onCancel = function () {
				$scope.$close({});
			};

			$scope.onChange = function (flag) {
				doNotAsk = flag;
			};

			$scope.onClose = function () {
				$scope.$close(false);
			};

			$scope.dialog = {};
			$scope.dialog.cancel = function () {
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {

			});

		}]);
})(angular);
