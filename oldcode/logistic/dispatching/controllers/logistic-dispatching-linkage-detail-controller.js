/**
 * Created by baf on 21.09.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingLinkageDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatching linkage entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchingLinkageDetailController', LogisticDispatchingLinkageDetailController);

	LogisticDispatchingLinkageDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticDispatchingLinkageDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c69c924b42d24ad9a82e1c15e6d97f02');
	}

})(angular);