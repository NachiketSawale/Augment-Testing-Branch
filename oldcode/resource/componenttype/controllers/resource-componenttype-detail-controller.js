/**
 * Created by baf on 16.11.2017
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.componenttype';

	/**
	 * @ngdoc controller
	 * @name resourceComponentTypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource componenttype  entities.
	 **/
	angular.module(moduleName).controller('resourceComponentTypeDetailController', ResourceComponentTypeDetailController);

	ResourceComponentTypeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceComponentTypeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e7b2aa01dab8439cae84f3f5258d4e23', 'resourceComponentTypeTranslationService');
	}

})(angular);