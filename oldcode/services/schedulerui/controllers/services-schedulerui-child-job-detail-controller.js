/**
 * Created by aljami on 25.03.2022.
 */
(function () {

	'use strict';
	const moduleName = 'services.schedulerui';

	/**
	 * @ngdoc controller
	 * @name servicesSchedulerUIChildJobDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of child job entities
	 **/
	angular.module(moduleName).controller('servicesSchedulerUIChildJobDetailController', servicesSchedulerUIChildJobDetailController);

	servicesSchedulerUIChildJobDetailController.$inject = ['$scope', '_', '$translate', 'platformContainerControllerService', 'platformGridAPI', 'servicesSchedulerUIChildJobDataService'];

	function servicesSchedulerUIChildJobDetailController($scope, _, $translate, platformContainerControllerService, platformGridAPI, servicesSchedulerUIChildJobDataService) {

		$scope.gridId = 'baecfb65369043f4b302449ea35fa49b';
		platformContainerControllerService.initController($scope, moduleName, $scope.gridId, 'servicesScheduleruiTranslationService');

		function onInitialized(){
			let selectedJob = servicesSchedulerUIChildJobDataService.getSelected();
			if(selectedJob){
				if (_.isUndefined(selectedJob.Parameter)) {
					selectedJob.Parameter = [];
				}
				platformGridAPI.items.data('68d4b4898f47498488adb531f715c48e', selectedJob.Parameter);
			}
		}

		platformGridAPI.events.register('68d4b4898f47498488adb531f715c48e', 'onInitialized', onInitialized);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister('68d4b4898f47498488adb531f715c48e', 'onInitialized', onInitialized);
		});
	}
})();