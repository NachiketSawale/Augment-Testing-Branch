/**
 * Created by shen on 6/9/2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardWorkListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic card work entities.
	 **/

	angular.module(moduleName).controller('logisticCardWorkListController', LogisticCardWorkListController);

	LogisticCardWorkListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardWorkListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fc5cb34f5ec74473bdd9de8083d61037');
	}
})(angular);