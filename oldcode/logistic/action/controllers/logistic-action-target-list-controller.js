/**
 * Created by Shankar on 17.01.2025
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.action';

	/**
	 * @ngdoc controller
	 * @name logisticActionTargetListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of action target entities.
	 **/

	angular.module(moduleName).controller('logisticActionTargetListController', LogisticActionTargetListController);

	LogisticActionTargetListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticActionTargetListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5c3ad742e6704c3599bf8099f304a938');
	}
})(angular);