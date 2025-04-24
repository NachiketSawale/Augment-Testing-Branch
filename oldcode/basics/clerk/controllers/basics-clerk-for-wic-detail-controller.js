/**
 * Created by baf on 15.05.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForWicDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics clerk forWic entities.
	 **/
	angular.module(moduleName).controller('basicsClerkForWicDetailController', BasicsClerkForWicDetailController);

	BasicsClerkForWicDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkForWicDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6042e0bf1d66478da8042b3a207d77bf');
	}

})(angular);