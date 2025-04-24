(function () {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of scheduling elements.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('schedulingMainActivityListController', SchedulingMainActivityListController);

	SchedulingMainActivityListController.$inject = [
		'_', '$scope', '$timeout', 'platformGridControllerService', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService', 'basicsLookupdataLookupDescriptorService', 'schedulingMainService', 'schedulingMainHammockDataService',
		'schedulingMainDueDateService', 'schedulingMainHammockAllService', 'schedulingMainRelationshipService', 'platformPermissionService', 'platformContextMenuItems'
	];

	function SchedulingMainActivityListController(
		_, $scope, $timeout, platformGridControllerService, platformContainerControllerService, platformContainerCreateDeleteButtonService, basicsLookupdataLookupDescriptorService, schedulingMainService, schedulingMainHammockDataService,
		schedulingMainDueDateService, schedulingMainHammockAllService, schedulingMainRelationshipService, platformPermissionService, platformContextMenuItems) {
		basicsLookupdataLookupDescriptorService.updateData('activityfk', schedulingMainService.getList());

		platformContainerControllerService.initController($scope, 'scheduling.main', '13120439D96C47369C5C24A2DF29238D');

		var containerScope = $scope.$parent;
		while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
			containerScope = containerScope.$parent;
		}

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 'ac',
					caption: 'scheduling.main.activityChain',
					type: 'item',
					iconClass: 'control-icons ico-link-activities-relationship',
					fn: schedulingMainRelationshipService.addRelationships,
					disabled: function () {
						// Permission check
						var condition1 = !platformPermissionService.hasCreate(containerScope.getContainerUUID().toLowerCase());
						// we need at least two activity items selected
						var condition2 = false;// !schedulingMainService.getSelectedEntities() || schedulingMainService.getSelectedEntities().length < 2; // we wait until multiselection  selection changed event is provided

						return condition1 || condition2;
					}
				},
				{
					id: 't1',
					caption: 'scheduling.main.changeActivityType',
					type: 'item',
					iconClass: 'tlb-icons ico-task-to-hammock',
					fn: schedulingMainService.changeActivityType,
					disabled: function () {
						// Permission check
						if (_.get(schedulingMainService.getSelected(),'IsReadOnly') === true) {
							return true;
						}
						if (!platformPermissionService.hasWrite(containerScope.getContainerUUID().toLowerCase())) {
							return true;
						}
						return schedulingMainService.toolbarEnabled();
					}
				},
				Object.assign({
					id: 't11',
					caption: 'cloud.common.toolbarNewByContext',
					type: 'item',
					iconClass: 'tlb-icons ico-new',
					fn: schedulingMainService.insertNewTask,
					disabled: function () {
						// Permission check
						if (!platformPermissionService.hasCreate(containerScope.getContainerUUID().toLowerCase())) {
							return true;
						}
						return !schedulingMainService.canCreate();
					}
				}, platformContextMenuItems.setContextGroupNew()),
			]
		});

		platformGridControllerService.pushToGridSettingsMenu($scope, schedulingMainService.getSettingsButtonConfig(), 'scheduling.main.settings');

		function updateStateOfToolBarButtons() {
			platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig, schedulingMainService);
			if ($scope.tools) {
				$scope.tools.update();
			}
		}

		schedulingMainHammockAllService.registerCallBackOnCreation(updateStateOfToolBarButtons);
		schedulingMainService.registerUpdateToolBar(updateStateOfToolBarButtons);

		schedulingMainService.registerSelectionChanged(updateStateOfToolBarButtons);

		function onDueDateChanged() {
			if ($scope.tools) {
				$scope.tools.update();
			}

			$timeout(function () {
				$scope.$apply();
			});
		}

		schedulingMainDueDateService.registerDueDateChanged(onDueDateChanged);

		function getStatusBarPerformanceDate() {
			return [{
				id: 'reportingDate',
				type: 'text',
				align: 'right',
				disabled: false,
				cssClass: '',
				toolTip: '',
				visible: true,
				ellipsis: true,
				value: schedulingMainDueDateService.buildStatusBar()
			}];
		}

		if (_.isFunction($scope.getUiAddOns)) {
			var sb = $scope.getUiAddOns().getStatusBar();
			sb.addFields(getStatusBarPerformanceDate());
		}
		var updateStatusBarReportingDate = function () {
			if (_.isFunction($scope.getUiAddOns)) {
				var sb = $scope.getUiAddOns().getStatusBar();
				sb.updateFields(getStatusBarPerformanceDate());
			}
		};
		schedulingMainDueDateService.registerDueDateChanged(updateStatusBarReportingDate);

		$scope.$on('$destroy', function () {
			schedulingMainDueDateService.unregisterDueDateChanged(updateStatusBarReportingDate);
			schedulingMainDueDateService.unregisterDueDateChanged(onDueDateChanged);
			schedulingMainHammockAllService.unRegisterCallBackOnCreation(updateStateOfToolBarButtons);
			schedulingMainService.unregisterUpdateToolBar(updateStateOfToolBarButtons);
		});
	}

})();
