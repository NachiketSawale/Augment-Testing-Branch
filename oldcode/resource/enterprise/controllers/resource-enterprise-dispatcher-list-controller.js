/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.enterprise';

	/**
	 * @ngdoc controller
	 * @name resourceEnterpriseDispatcherListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource enterprise dispatcher entities.
	 **/

	angular.module(moduleName).controller('resourceEnterpriseDispatcherListController', ResourceEnterpriseDispatcherListController);

	ResourceEnterpriseDispatcherListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEnterpriseDispatcherListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c89773b5e5b342339203a99d29c07c09');
	}
})(angular);