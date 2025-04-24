/**
 * Created by shen on 9/18/2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordClaimHistoryDetailController
	 *
	 */
	angular.module(moduleName).controller('logisticDispatchingRecordClaimHistoryDetailController', LogisticDispatchingRecordClaimHistoryDetailController);

	LogisticDispatchingRecordClaimHistoryDetailController.$inject = ['$scope', 'platformContainerControllerService','logisticDispatchingContainerInformationService', 'logisticDispatchingRecordClaimHistoryContainerService'];

	function LogisticDispatchingRecordClaimHistoryDetailController($scope, platformContainerControllerService, logisticDispatchingContainerInformationService, logisticDispatchingRecordClaimHistoryContainerService) {
		let containerUid = $scope.getContentValue('uuid');

		if(!logisticDispatchingContainerInformationService.hasDynamic(containerUid)) {
			logisticDispatchingRecordClaimHistoryContainerService.prepareDetailConfig(containerUid, $scope, logisticDispatchingContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})(angular);
