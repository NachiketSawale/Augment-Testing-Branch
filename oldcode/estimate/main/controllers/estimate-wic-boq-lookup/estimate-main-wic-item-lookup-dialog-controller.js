/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc controller
     * @name boqMainLookupController
     * @function
     *
     * @description
     * Controller for the tree boq lookup view.
     **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainWicItemLookupDialogController', [
		'$scope', '$translate',
		function ($scope, $translate) {
			let headerText = 'estimate.main.lookupAssignWicItem';

			$scope.gridDataWicBoqId = $scope.gridId;
			$scope.gridDataWicBoq = {
				state: $scope.gridDataWicBoqId
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
