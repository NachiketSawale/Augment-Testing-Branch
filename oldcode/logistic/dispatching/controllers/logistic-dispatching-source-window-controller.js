/**
 * Created by baf on 2108-08-29.
 */
(function () {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingSourceWindowController
	 * @function
	 *
	 * @description
	 **/
	angular.module(moduleName).controller('logisticDispatchingSourceWindowController', LogisticDispatchingSourceWindowController);

	LogisticDispatchingSourceWindowController.$inject = ['$scope', 'logisticDispatchingSourceWindowControllerService'];

	function LogisticDispatchingSourceWindowController($scope, logisticDispatchingSourceWindowControllerService) {

		var uuid = $scope.getContainerUUID();
		logisticDispatchingSourceWindowControllerService.initSourceFilterController($scope, uuid);
	}
})();