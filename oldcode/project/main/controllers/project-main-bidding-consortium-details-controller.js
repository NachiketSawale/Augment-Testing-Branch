/**
 * Created by baf on 29.06.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainBiddingConsortiumDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main biddingConsortium entities.
	 **/
	angular.module(moduleName).controller('projectMainBiddingConsortiumDetailController', ProjectMainBiddingConsortiumDetailController);

	ProjectMainBiddingConsortiumDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainBiddingConsortiumDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2b0b2115f71e4d30af1a8ee3c244b6dd');
	}

})(angular);