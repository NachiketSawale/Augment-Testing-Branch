/**
 * Created by baf on 02.09.2014.
 */
(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'scheduling.schedule';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingScheduleListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of schedule entities.
	 **/
	angModule.controller('schedulingScheduleEditListController', SchedulingScheduleEditListController);

	SchedulingScheduleEditListController.$inject = ['$scope','$translate','platformContainerControllerService','platformGridControllerService','schedulingSchedulePresentService','schedulingScheduleEditService','platformModuleNavigationService'];
	function SchedulingScheduleEditListController($scope,$translate, platformContainerControllerService,platformGridControllerService,schedulingSchedulePresentService,schedulingScheduleEditService,naviService) {
		platformContainerControllerService.initController($scope, moduleName, '7447B8DF191C45118F56DD84D25D1B41');
		let navigator = {moduleName: 'scheduling.main', registerService: 'schedullingMainService'};
		let tools = [{
			id: 't11',
			caption: $translate.instant('scheduling.schedule.OpenSchedule'),
			type: 'item',
			iconClass: 'tlb-icons ico-goto',
			fn: function OpenSchedule() {
				// First save current changes via parent service
				schedulingScheduleEditService.prepareGoto().then(()=>{
					let selectedItem = schedulingScheduleEditService.getSelected();
					naviService.navigate(navigator, selectedItem,'Id');
				});
			},
			disabled: function () {
				return _.isEmpty(schedulingScheduleEditService.getSelected()) || !naviService.hasPermissionForModule(navigator.moduleName);
			}
		}];

		platformGridControllerService.addTools(tools);

	}
})();