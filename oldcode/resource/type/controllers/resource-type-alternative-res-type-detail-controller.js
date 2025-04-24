/**
 * Created by chlai on 2025/01/24
 */
(function () {

	'use strict';
	var moduleName = 'resource.type';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceTypeAlternativeResTypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of alternative res type entities
	 **/
	angModule.controller('resourceTypeAlternativeResTypeDetailController', ResourceTypeAlternativeResTypeDetailController);

	ResourceTypeAlternativeResTypeDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceTypeAlternativeResTypeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ddeb7bd64d6c4eceb84dec9b7b0dbe00');
	}
})();