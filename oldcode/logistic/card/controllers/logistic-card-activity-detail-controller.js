/**
 * Created by baf on 18.03.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardActivityDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic card activity entities.
	 **/
	angular.module(moduleName).controller('logisticCardActivityDetailController', LogisticCardActivityDetailController);

	LogisticCardActivityDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardActivityDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c3354dae2f434cd183862f01c2bb039b');
	}

})(angular);