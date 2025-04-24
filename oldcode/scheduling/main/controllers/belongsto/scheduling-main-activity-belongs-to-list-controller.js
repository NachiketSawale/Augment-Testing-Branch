(function () {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainActivitiyBelongsToListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a activity in a project
	 **/
	angular.module(moduleName).controller('schedulingMainActivitiyBelongsToListController', SchedulingMainActivitiyBelongsToListController);

	SchedulingMainActivitiyBelongsToListController.$inject = ['_','$translate','$scope','platformModuleNavigationService','platformGridControllerService', 'platformContainerControllerService','schedulingMainContainerInformationService', 'schedulingMainActivityBelongsToContainerService'];

	function SchedulingMainActivitiyBelongsToListController(_,$translate,$scope,platformModuleNavigationService,platformGridControllerService, platformContainerControllerService, schedulingMainContainerInformationService, schedulingMainBelongsToContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if (!schedulingMainContainerInformationService.hasDynamic(containerUid)) {
			schedulingMainBelongsToContainerService.prepareGridConfig(containerUid, $scope, schedulingMainContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
		let tools = [];
		let configue =schedulingMainContainerInformationService.getContainerInfoByGuid(containerUid);
		tools.push({
			id: 't1',
			caption: $translate.instant('scheduling.main.filterVersionEstimate'),
			type: 'check',
			value: configue.dataServiceName.getFilterStatus(),
			iconClass: 'tlb-icons ico-filter-current-version',
			fn: function () {
				configue.dataServiceName.setFilterStatus(this.value);
				configue.dataServiceName.load();
			},
		});

		function toggleCreateButton(disabled) {
			let createButton = _.find($scope.tools.items, {id: 'create'});
			if (createButton) {
				createButton.disabled = disabled;
			}
		}

		configue.dataServiceName.onToggleCreateButton.register(toggleCreateButton);

		platformGridControllerService.addTools(tools);
	}
})();