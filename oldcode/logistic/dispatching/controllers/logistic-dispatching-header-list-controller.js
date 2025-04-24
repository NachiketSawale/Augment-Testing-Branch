/**
 * Created by baf on 29.01.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingHeaderListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic dispatch header entities.
	 **/

	angular.module(moduleName).controller('logisticDispatchingHeaderListController', LogisticDispatchHeaderListController);

	LogisticDispatchHeaderListController.$inject = [
		'$scope', 'platformContainerControllerService', 'platformGridControllerService', 'logisticDispatchingHeaderDataService',
		'logisticDispatchingConstantValues'
	];

	function LogisticDispatchHeaderListController(
		$scope, platformContainerControllerService, platformGridControllerService, logisticDispatchingHeaderDataService,
		logisticDispatchingConstantValues
	) {
		let containerUuid = logisticDispatchingConstantValues.uuid.container.headerList;
		platformContainerControllerService.initController($scope, moduleName, containerUuid);
		platformGridControllerService.pushToGridSettingsMenu($scope, logisticDispatchingHeaderDataService.getDefaultButtonConfig(containerUuid));
		$scope.addTools([
			{
				id: 'createCopy',
				caption: 'logistic.dispatching.toolbarNewByCopy',
				type: 'item',
				iconClass: 'tlb-icons ico-rec-new-copy',
				fn: logisticDispatchingHeaderDataService.createItemFromSelected,
				permission: '#c'
	}
		]);
	}
})(angular);