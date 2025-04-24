/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource project  entities.
	 **/

	angular.module(moduleName).controller('resourceProjectListController', ResourceProjectListController);

	ResourceProjectListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceProjectListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '93a0b617befc42e5bd09df407abb2e17');
	}
})(angular);