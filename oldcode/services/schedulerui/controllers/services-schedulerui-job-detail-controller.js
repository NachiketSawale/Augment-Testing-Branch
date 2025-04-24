/**
 * Created by aljami on 18.03.2022.
 */
(function () {

	'use strict';
	const moduleName = 'services.schedulerui';

	/**
	 * @ngdoc controller
	 * @name servicesSchedulerUIJobDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of job entities
	 **/
	angular.module(moduleName).controller('servicesSchedulerUIJobDetailController', servicesSchedulerUIJobDetailController);

	servicesSchedulerUIJobDetailController.$inject = ['$scope', '_', '$translate', 'platformContainerControllerService', 'platformGridAPI', 'servicesSchedulerUIJobDataService'];

	function servicesSchedulerUIJobDetailController($scope, _, $translate, platformContainerControllerService, platformGridAPI, servicesSchedulerUIJobDataService) {

		$scope.gridId = '1587d52539e346e89cffaaea211ab644';
		platformContainerControllerService.initController($scope, moduleName, $scope.gridId, 'servicesScheduleruiTranslationService');

		function onInitialized(){
			let selectedJob = servicesSchedulerUIJobDataService.getSelected();
			if(selectedJob){
				if (_.isUndefined(selectedJob.Parameter)) {
					selectedJob.Parameter = [];
				}
				platformGridAPI.items.data('ec4d55d3ebd94dcf941e536de78aff3c', selectedJob.Parameter);
			}
		}

		platformGridAPI.events.register('ec4d55d3ebd94dcf941e536de78aff3c', 'onInitialized', onInitialized);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister('ec4d55d3ebd94dcf941e536de78aff3c', 'onInitialized', onInitialized);
		});
	}
})();