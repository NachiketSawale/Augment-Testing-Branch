/**
 * Created by baf on 30.01.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRecordDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatching record entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchingRecordSuperiorDetailController', LogisticDispatchingRecordDetailController);

	LogisticDispatchingRecordDetailController.$inject = ['$scope', 'platformContainerControllerService', 'logisticDispatchingRecordDataService'];

	function LogisticDispatchingRecordDetailController($scope, platformContainerControllerService, logisticDispatchingRecordDataService) {

		$scope.showMaterial = false;
		$scope.showDefault = !$scope.showMaterial;
		var defineGrid = function() {
			var selectItem = logisticDispatchingRecordDataService.getSelected();
			$scope.showMaterial = (logisticDispatchingRecordDataService.isSelection(selectItem) && selectItem.RecordTypeFk === 3);
			$scope.showDefault = !$scope.showMaterial;
		};

		defineGrid();
		logisticDispatchingRecordDataService.registerSelectionChanged(defineGrid);
	}

})(angular);