/**
 * Created by henkel on 29/09/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingNoteDeliveryListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of note delivery  entities.
	 **/

	angular.module(moduleName).controller('logisticDispatchingNoteDeliveryListController', LogisticDispatchingNoteDeliveryListController);

	LogisticDispatchingNoteDeliveryListController.$inject = ['$scope', 'platformContainerControllerService', 'logisticDispatchingConstantValues'];

	function LogisticDispatchingNoteDeliveryListController($scope, platformContainerControllerService, logisticDispatchingConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, logisticDispatchingConstantValues.uuid.container.dispatchNoteDeliveryList);
	}
})(angular);