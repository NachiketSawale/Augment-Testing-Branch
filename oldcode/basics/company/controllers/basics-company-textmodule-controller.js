/**
 * Created by henkel on 15.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsCompanyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Company entities.
	 **/
	angModule.controller('basicsCompanyTextModuleController', BasicsCompanyTextModuleController);

	BasicsCompanyTextModuleController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyTextModuleController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'E94283E1A1764BD1AEF87344095773FA');
	}
})();