/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'project.droppoints';

	/**
	 * @ngdoc controller
	 * @name projectDropPointsDropPointArticlesListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of droppointarticles entities.
	 **/

	angular.module(moduleName).controller('projectDropPointsDropPointArticlesListController', ProjectDropPointsDropPointArticlesListController);

	ProjectDropPointsDropPointArticlesListController.$inject = [
		'$scope', 'platformContainerControllerService', 'projectDropPointsDropPointDataService'
	];

	function ProjectDropPointsDropPointArticlesListController(
		$scope, platformContainerControllerService, projectDropPointsDropPointDataService
	) {
		platformContainerControllerService.initController($scope, moduleName, '0b2fbc87a2c644a8b84c1fac7174b06b');
		function onDropPointSelectionChanged() {
			$scope.updateButtons({ disableCreate: false, disableDelete: false });
		}
		projectDropPointsDropPointDataService.registerSelectionChanged(onDropPointSelectionChanged);
		$scope.$on('$destroy', function () {
			projectDropPointsDropPointDataService.unRegisterSelectionChanged(onDropPointSelectionChanged);
		});
	}
})(angular);