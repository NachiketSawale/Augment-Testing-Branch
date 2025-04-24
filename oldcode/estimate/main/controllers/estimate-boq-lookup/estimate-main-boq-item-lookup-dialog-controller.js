
(function () {

	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainBoqItemLookupDialogController', [
		'$scope', '$translate',
		function ($scope, $translate) {
			let headerText = 'estimate.main.lookupAssignBoqItem';

			$scope.gridBoqItemId = $scope.gridId;
			$scope.gridDataBoqHeader = {
				state: $scope.gridBoqItemId
			};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				refreshButtonText: $translate.instant('basics.common.button.refresh'),
				headerText: $translate.instant(headerText),
				disableOkButton: true,
				selectedItems: []
			};

			$scope.onClose = onClose;

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			function onClose(result) {
				if (_.isEmpty(result)){
					$scope.$close(false);
				}else{
					$scope.$close(result);
				}
			}
		}]);
})();
