/**
 * Created by Shankar on 20.01.2025
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.action';

	/**
	 * @ngdoc controller
	 * @name logisticActionItemTemplatesDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic action list type entities.
	 **/
	angular.module(moduleName).controller('logisticActionItemTemplatesDetailController', LogisticActionItemTemplatesDetailController);

	LogisticActionItemTemplatesDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticActionItemTemplatesDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c31f04d209cb40d9825f68cbfe09daaa');
	}

})(angular);

