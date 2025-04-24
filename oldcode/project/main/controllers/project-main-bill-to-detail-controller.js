/**
 * Created by baf on 15.05.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainBillToDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main billTo entities.
	 **/
	angular.module(moduleName).controller('projectMainBillToDetailController', ProjectMainBillToDetailController);

	ProjectMainBillToDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainBillToDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0cd910bacc8b4bacac0d4a5bf5cf2319');
	}

})(angular);