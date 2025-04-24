/**
 * Created by henkel on 29.09.2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingNoteDeliveryDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic dispatching note entities.
	 **/
	angular.module(moduleName).controller('logisticDispatchingNoteDeliveryDetailController', LogisticDispatchingNoteDeliveryDetailController);

	LogisticDispatchingNoteDeliveryDetailController.$inject = ['$scope', 'platformContainerControllerService', 'logisticDispatchingConstantValues'];

	function LogisticDispatchingNoteDeliveryDetailController($scope, platformContainerControllerService, logisticDispatchingConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, logisticDispatchingConstantValues.uuid.container.dispatchNoteDeliveryDetails);
	}

})(angular);