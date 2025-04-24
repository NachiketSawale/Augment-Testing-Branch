(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectLocationReadonlyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project locations
	 **/
	angular.module(moduleName).controller('projectMainTenderResultListController', ProjectMainTenderResultListController);

	ProjectMainTenderResultListController.$inject = ['$scope','platformContainerControllerService','projectMainTenderResultService'];
	function ProjectMainTenderResultListController($scope, platformContainerControllerService, projectMainTenderResultService) {
		platformContainerControllerService.initController($scope, moduleName, 'd161af4bc60047cc8961e186f889863a');
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: '1',
					caption: 'project.main.entityRankings',
					type: 'item',
					iconClass: 'tlb-icons ico-demote',
					fn: projectMainTenderResultService.updateRankings
				}
			]
		});
	}
})();