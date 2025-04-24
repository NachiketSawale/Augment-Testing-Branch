/**
 * Created by nitsche on 21.10.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'project.group';

	/**
	 * @ngdoc controller
	 * @name projectGroupProjectGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Project Group ProjectGroup entities.
	 **/

	angular.module(moduleName).controller('projectGroupProjectGroupListController', ProjectGroupProjectGroupListController);

	ProjectGroupProjectGroupListController.$inject = ['$scope', '$translate', 'projectGroupProjectGroupDataService', 'platformContainerControllerService'];

	function ProjectGroupProjectGroupListController($scope, $translate, projectGroupProjectGroupDataService, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5f2c8f5b4d24470f8ff69e81a129f5b8');

		var tools = [{
			id: 'createAutoIntegrated',
			sort: 25,
			caption: $translate.instant('project.group.createAutoIntegratedGroup'),
			type: 'item',
			cssClass: 'tlb-icons ico-add-extend',
			fn: function() {
				return projectGroupProjectGroupDataService.createAutoIntegratedRoot();
			},
			disabled: function () {
				return projectGroupProjectGroupDataService.isCreateAutoGenerationDisabled();
			}
		}];

		$scope.addTools(tools);
	}
})(angular);