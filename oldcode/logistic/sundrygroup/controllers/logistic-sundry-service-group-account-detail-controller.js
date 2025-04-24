/**
 * Created by baf on 05.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServiceGroupAccountDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic sundryServiceGroup account entities.
	 **/
	angular.module(moduleName).controller('logisticSundryServiceGroupAccountDetailController', LogisticSundryServiceGroupAccountDetailController);

	LogisticSundryServiceGroupAccountDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSundryServiceGroupAccountDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6ffe2a8357dd4782b8d9abea6680326e');
	}

})(angular);