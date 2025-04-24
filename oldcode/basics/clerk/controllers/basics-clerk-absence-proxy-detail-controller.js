/**
 * Created by leo on 11.11.2015.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc controller
	 * @name basicsClerkGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsClerkAbsenceProxyDetailController', BasicsClerkAbsenceProxyDetailController);

	BasicsClerkAbsenceProxyDetailController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsClerkAbsenceProxyDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dcb1b0d146af4bec84d574de19a9f01b','basicsClerkTranslationService');
	}
})(angular);