/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServiceGroupController
	 * @function
	 *
	 * @description
	 * List controller of logistic sundry service group entities.
	 **/

	angular.module(moduleName).controller('logisticSundryServiceGroupListController', LogisticSundryServiceGroupListController);

	LogisticSundryServiceGroupListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSundryServiceGroupListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c89773b5e5b342339203a99d29c07c09');
	}

})(angular);