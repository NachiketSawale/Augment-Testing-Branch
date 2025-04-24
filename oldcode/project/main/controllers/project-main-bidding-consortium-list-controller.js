/**
 * Created by baf on 29.06.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainBiddingConsortiumListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main biddingConsortium entities.
	 **/

	angular.module(moduleName).controller('projectMainBiddingConsortiumListController', ProjectMainBiddingConsortiumListController);

	ProjectMainBiddingConsortiumListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainBiddingConsortiumListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '08fbf6f22fe04a619eb91ec02b35c54e');
	}
})(angular);