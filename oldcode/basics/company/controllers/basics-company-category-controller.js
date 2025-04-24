/**
 * Created by henkel on 15.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc controller
	 * @name basicsCompanyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Company entities.
	 **/
	angular.module(moduleName).controller('basicsCompanyCategoryController', BasicsCompanyCategoryController);

	BasicsCompanyCategoryController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyCategoryController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'D006FFC4E4764CF68E2DF6865DC5F04E');
	}
})();