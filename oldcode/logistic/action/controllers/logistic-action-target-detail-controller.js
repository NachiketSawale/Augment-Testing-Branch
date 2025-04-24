/**
 * Created by Shankar on 20.01.2025
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.action';

	/**
	 * @ngdoc controller
	 * @name logisticActionTargetDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic action target entities.
	 **/
	angular.module(moduleName).controller('logisticActionTargetDetailController', LogisticActionTargetDetailController);

	LogisticActionTargetDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticActionTargetDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ef2e6db7ebc64a6ea3c52bb302b4f02d');
	}

})(angular);

