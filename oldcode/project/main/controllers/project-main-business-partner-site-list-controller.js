/**
 * Created by baf on 20.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainBusinessPartnerSiteListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main businessPartnerSite entities.
	 **/

	angular.module(moduleName).controller('projectMainBusinessPartnerSiteListController', ProjectMainBusinessPartnerSiteListController);

	ProjectMainBusinessPartnerSiteListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainBusinessPartnerSiteListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fdedb62839b849ddb8cddf717d561e9d');
	}
})(angular);