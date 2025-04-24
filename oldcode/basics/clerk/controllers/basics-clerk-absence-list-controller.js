/**
 * Created by baf on 09.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkAbsenceListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of clerk absence entities.
	 **/
	angular.module(moduleName).controller('basicsClerkAbsenceListController', BasicsClerkAbsenceListController);

	BasicsClerkAbsenceListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsClerkAbsenceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'DDE598002BBF4A2D96C82DC927E3E578');
	}
})();