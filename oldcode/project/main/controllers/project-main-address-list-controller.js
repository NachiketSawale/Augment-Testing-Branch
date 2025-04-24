/**
 * Created by balkanci on 17.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainAddressListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main address entities.
	 **/

	angular.module(moduleName).controller('projectMainAddressListController', ProjectMainAddressListController);

	ProjectMainAddressListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainAddressListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '130eb724690c429aa4e359ed0c53115b');
	}
})(angular);