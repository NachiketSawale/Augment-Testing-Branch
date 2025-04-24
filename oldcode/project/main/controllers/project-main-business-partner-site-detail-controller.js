/**
 * Created by baf on 20.09.2022
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainBusinessPartnerSiteDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main businessPartnerSite entities.
	 **/
	angular.module(moduleName).controller('projectMainBusinessPartnerSiteDetailController', ProjectMainBusinessPartnerSiteDetailController);

	ProjectMainBusinessPartnerSiteDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainBusinessPartnerSiteDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'cc4f2574ded745f296fc516a6d1e0c62');
	}

})(angular);