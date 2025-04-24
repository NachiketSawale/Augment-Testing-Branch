/**
 * Created by shen on 3/22/2023
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsProjectGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics company ProjectGroup entities.
	 **/

	angular.module(moduleName).controller('basicsProjectGroupListController', BasicsProjectGroupListController);

	BasicsProjectGroupListController.$inject = ['$scope', '$translate', 'projectGroupProjectGroupDataService', 'platformContainerControllerService'];

	function BasicsProjectGroupListController($scope, $translate, projectGroupProjectGroupDataService,platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5f2c8f5b4d24470f8ff69e81a129f5b8');
	}
})(angular);