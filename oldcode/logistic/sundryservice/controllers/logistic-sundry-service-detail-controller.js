/**
 * Created by baf on 02.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServiceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic sundryService  entities.
	 **/
	angular.module(moduleName).controller('logisticSundryServiceDetailController', LogisticSundryServiceDetailController);

	LogisticSundryServiceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSundryServiceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3e8ef5f3b7c741f486e60dd2bb1c564c');
	}

})(angular);