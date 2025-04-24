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
	 * Controller for the  detail view of clerk group entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsClerkGroupDetailController', BasicsClerkGroupDetailController);

	BasicsClerkGroupDetailController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsClerkGroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '008843fcaa8246faa41f620a0742b3ae','basicsClerkTranslationService');
	}
})(angular);