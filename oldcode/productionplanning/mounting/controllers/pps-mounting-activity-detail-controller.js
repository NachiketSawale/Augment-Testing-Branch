/**
 * Created by anl on 8/9/2017.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingActivityDetailController', ActivityDetailController);

	ActivityDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningMountingContainerInformationService',
		'productionplanningActivityActivityContainerService',
		'productionplanningMountingRequisitionDataService'];

	function ActivityDetailController($scope, platformContainerControllerService,
									  mountingContainerInformationService,
									  activityContainerService,
									  mntRequisitionDataService) {

		var containerUid = $scope.getContentValue('uuid');
		var originLayout = '3f4268ef496c4878ac95b92e9cce4220';
		var initConfig =
		{
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!mountingContainerInformationService.hasDynamic()) {
			activityContainerService.prepareGridConfig(containerUid, mountingContainerInformationService,
				initConfig, mntRequisitionDataService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var dynamicActivityDataService = mountingContainerInformationService.getContainerInfoByGuid(containerUid).dataServiceName;

		dynamicActivityDataService.registerFilter();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			dynamicActivityDataService.unregisterFilter();
		});
	}
})(angular);