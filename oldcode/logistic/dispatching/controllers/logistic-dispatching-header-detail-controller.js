/**
 * Created by baf on 29.01.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingHeaderDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatch header entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchingHeaderDetailController', LogisticDispatchHeaderDetailController);

	LogisticDispatchHeaderDetailController.$inject = [
		'$scope', 'platformContainerControllerService', 'logisticDispatchingConstantValues'
	];

	function LogisticDispatchHeaderDetailController(
		$scope, platformContainerControllerService, logisticDispatchingConstantValues
	) {
		platformContainerControllerService.initController($scope, moduleName, logisticDispatchingConstantValues.uuid.container.headerDetails);
	}

})(angular);