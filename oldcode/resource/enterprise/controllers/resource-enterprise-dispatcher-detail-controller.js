/**
 * Created by baf on 05.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.enterprise';

	/**
	 * @ngdoc controller
	 * @name resourceEnterpriseDispatcherDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource enterprise dispatcher entities.
	 **/
	angular.module(moduleName).controller('resourceEnterpriseDispatcherDetailController', ResourceEnterpriseDispatcherDetailController);

	ResourceEnterpriseDispatcherDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEnterpriseDispatcherDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7a783576fd3344c5a0d420060a323b3a');
	}

})(angular);