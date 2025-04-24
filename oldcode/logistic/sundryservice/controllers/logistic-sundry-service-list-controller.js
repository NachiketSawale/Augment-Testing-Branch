/**
 * Created by baf on 02.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServiceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic sundryService  entities.
	 **/

	angular.module(moduleName).controller('logisticSundryServiceListController', LogisticSundryServiceListController);

	LogisticSundryServiceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSundryServiceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3c3df5cc678f4ee4a2184555c39854c3');
	}
})(angular);