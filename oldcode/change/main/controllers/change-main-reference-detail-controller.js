/**
 * Created by baf on 08.05.2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name changeMainReferenceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of change main reference entities.
	 **/
	angular.module(moduleName).controller('changeMainReferenceDetailController', ChangeMainReferenceDetailController);

	ChangeMainReferenceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ChangeMainReferenceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b2940bc5315343558f45dfa6fbbc90ab');
	}

})(angular);