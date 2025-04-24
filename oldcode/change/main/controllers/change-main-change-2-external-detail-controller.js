/**
 * Created by nitsche on 21.08.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name changeMainChange2ExternalDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of change main  entities.
	 **/
	angular.module(moduleName).controller('changeMainChange2ExternalDetailController', changeMainChange2ExternalDetailController);

	changeMainChange2ExternalDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function changeMainChange2ExternalDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '96a52c46f02f41018ced9434094b0497');
	}

})(angular);