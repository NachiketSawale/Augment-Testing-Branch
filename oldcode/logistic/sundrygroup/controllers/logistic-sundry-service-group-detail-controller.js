/**
 * Created by baf on 05.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServiceGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic sundrygroup  entities.
	 **/
	angular.module(moduleName).controller('logisticSundryServiceGroupDetailController', LogisticSundryServiceGroupDetailController);

	LogisticSundryServiceGroupDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSundryServiceGroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5702f80f88aa494db2bddec1d42c05d9');
	}

})(angular);