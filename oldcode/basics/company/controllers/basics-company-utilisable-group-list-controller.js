/**
 * Created by henkel on 15.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsCompanyUtilisableGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Company entities.
	 **/
	angModule.controller('basicsCompanyUtilisableGroupListController', BasicsCompanyUtilisableGroupListController);

	BasicsCompanyUtilisableGroupListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyUtilisableGroupListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a6c699f919384122bcce8540f67602c1');
	}
})();