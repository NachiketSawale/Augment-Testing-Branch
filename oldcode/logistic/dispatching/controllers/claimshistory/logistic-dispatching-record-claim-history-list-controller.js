/**
 * Created by shen on 9/18/2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRecordClaimHistoryListController
	 * @function
	 *
	 * @description
	 * 
	 **/

	angular.module(moduleName).controller('logisticDispatchingRecordClaimHistoryListController', LogisticDispatchingRecordClaimHistoryListController);

	LogisticDispatchingRecordClaimHistoryListController.$inject = ['$scope', 'platformContainerControllerService','logisticDispatchingContainerInformationService', 'logisticDispatchingRecordClaimHistoryContainerService', '$injector'];

	function LogisticDispatchingRecordClaimHistoryListController($scope, platformContainerControllerService, logisticDispatchingContainerInformationService, logisticDispatchingRecordClaimHistoryContainerService, $injector) {
		let containerUid = $scope.getContentValue('uuid');

		if(!logisticDispatchingContainerInformationService.hasDynamic(containerUid)) {
			logisticDispatchingRecordClaimHistoryContainerService.prepareGridConfig(containerUid, $scope, logisticDispatchingContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);