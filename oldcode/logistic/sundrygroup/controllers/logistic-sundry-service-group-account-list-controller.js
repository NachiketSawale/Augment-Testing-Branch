/**
 * Created by baf on 05.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServiceGroupAccountListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic sundryServiceGroup account entities.
	 **/

	angular.module(moduleName).controller('logisticSundryServiceGroupAccountListController', LogisticSundryServiceGroupAccountListController);

	LogisticSundryServiceGroupAccountListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSundryServiceGroupAccountListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c2b21e2891ad4162aa6adebc111623d5');
	}
})(angular);