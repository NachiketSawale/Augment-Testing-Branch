/**
 * Created by chlai on 2025/01/24
 */
(function () {

	'use strict';
	var moduleName = 'resource.type';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceTypeAlternativeResTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of alternative res type entities
	 **/
	angModule.controller('resourceTypeAlternativeResTypeListController', ResourceTypeAlternativeResTypeListController);

	ResourceTypeAlternativeResTypeListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceTypeAlternativeResTypeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '626a87698fef4e69bff848173b424519');
	}
})();