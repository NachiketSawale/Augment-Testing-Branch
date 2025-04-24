/**
 * Created by henkel on 15.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsCompanySurchargeController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Company entities.
	 **/
	angModule.controller('basicsCompanySurchargeController', BasicsCompanySurchargeController);

	BasicsCompanySurchargeController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanySurchargeController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '041F24C6D4B34C0B9C56869B2B4D9E46');
	}
})();