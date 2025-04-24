/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkForWicListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics clerk forWic entities.
	 **/

	angular.module(moduleName).controller('basicsClerkForWicListController', BasicsClerkForWicListController);

	BasicsClerkForWicListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsClerkForWicListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9f5b6cfd39114a25b04b7ea69ef0ddc7');
	}
})(angular);