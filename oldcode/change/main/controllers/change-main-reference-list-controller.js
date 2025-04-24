/**
 * Created by baf on 08.05.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name changeMainReferenceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of change main reference entities.
	 **/

	angular.module(moduleName).controller('changeMainReferenceListController', ChangeMainReferenceListController);

	ChangeMainReferenceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ChangeMainReferenceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2dc8ccd98e704c9096d4819f2bbd49ea');
	}
})(angular);