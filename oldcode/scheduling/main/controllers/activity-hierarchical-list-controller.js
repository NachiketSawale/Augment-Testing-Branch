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

	angular.module(moduleName).controller('schedulingMainActivityHierarchicalListController', SchedulingMainActivityHierarchicalListController);

	SchedulingMainActivityHierarchicalListController.$inject = ['_', '$scope', '$timeout', 'platformGridControllerService', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService', 'basicsLookupdataLookupDescriptorService', 'schedulingLookupActivityTemplateService', 'schedulingMainService', 'platformGridAPI',
		'schedulingMainDueDateService', 'schedulingMainHammockAllService', 'schedulingMainRelationshipService', 'platformPermissionService', 'platformContextMenuItems'];

	function SchedulingMainActivityHierarchicalListController(_, $scope, $timeout, platformGridControllerService, platformContainerControllerService, platformContainerCreateDeleteButtonService, basicsLookupdataLookupDescriptorService, schedulingLookupActivityTemplateService, schedulingMainService, platformGridAPI, schedulingMainDueDateService, schedulingMainHammockAllService, schedulingMainRelationshipService, platformPermissionService, platformContextMenuItems) {

		basicsLookupdataLookupDescriptorService.updateData('activityfk', schedulingMainService.getList());

		schedulingLookupActivityTemplateService.getAllActivityTemplates().then(function (items) {
			basicsLookupdataLookupDescriptorService.updateData('activitytemplatefk', items);
		});

		platformContainerControllerService.initController($scope, moduleName, '0FCBAF8C89AC4493B58695CFA9F104E2');

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
				{
					id: 't12',
					caption: 'scheduling.main.upgradeActivity',
					type: 'item',
					iconClass: 'tlb-icons ico-promote',
					fn: schedulingMainService.upgradeActivity,
					disabled: function () {
						// Permission check
						if (_.get(schedulingMainService.getSelected(),'IsReadOnly') === true) {
							return true;
						}
						if (!platformPermissionService.hasWrite(containerScope.getContainerUUID().toLowerCase())) {
							return true;
						}
						return !schedulingMainService.canUpgradeActivity();
					}
				},
				{
					id: 't13',
					caption: 'scheduling.main.downgradeActivity',
					type: 'item',
					iconClass: 'tlb-icons ico-demote',
					fn: schedulingMainService.downgradeActivity,
					disabled: function () {
						// Permission check
						if (_.get(schedulingMainService.getSelected(),'IsReadOnly') === true) {
							return true;
						}
						if (!platformPermissionService.hasWrite(containerScope.getContainerUUID().toLowerCase())) {
							return true;
						}
						return !schedulingMainService.canDowngradeActivity();
					}
				}
			]
		});

		platformGridControllerService.pushToGridSettingsMenu($scope, schedulingMainService.getSettingsButtonConfig(), 'scheduling.main.settings');

		var updateStateOfToolBarButtons = function updateStateOfToolBarButtons() {
			platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig, schedulingMainService);
			if ($scope.tools) {
				$scope.tools.update();
			}
		};

		function updateList(){
			platformGridAPI.items.data($scope.gridId,schedulingMainService.getTree());
		}
		schedulingMainHammockAllService.registerCallBackOnCreation(updateStateOfToolBarButtons);
		schedulingMainService.registerUpdateToolBar(updateStateOfToolBarButtons);
		schedulingMainService.registerDropped(updateList);

		function onDueDateChanged() {
			if ($scope.tools) {
				$scope.tools.update();
			}

			$timeout(function () {
				$scope.$apply();
			});
		}

		schedulingMainDueDateService.registerDueDateChanged(onDueDateChanged);

		function setRowSelection(item) {
			platformGridAPI.rows.selection({gridId: $scope.gridId, rows: [item]});
		}

		schedulingMainService.upgradeDowngradeActivity.register(setRowSelection);

		function getStatusBarReportingDate() {
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
			sb.addFields(getStatusBarReportingDate());
		}
		var updateStatusBarReportingDate = function () {
			if (_.isFunction($scope.getUiAddOns)) {
				var sb = $scope.getUiAddOns().getStatusBar();
				sb.updateFields(getStatusBarReportingDate());
			}
		};
		schedulingMainDueDateService.registerDueDateChanged(updateStatusBarReportingDate);

		/*
				$rootScope.$on('updateDone', function () {
					updateStateOfToolBarButtons();
				});
		*/
		// schedulingMainService.registerSelectionChanged(updateStateOfToolBarButtons);

		$scope.$on('$destroy', function () {
			schedulingMainDueDateService.unregisterDueDateChanged(updateStatusBarReportingDate);
			schedulingMainDueDateService.unregisterDueDateChanged(onDueDateChanged);
			schedulingMainService.upgradeDowngradeActivity.unregister(setRowSelection);
			schedulingMainHammockAllService.unRegisterCallBackOnCreation(updateStateOfToolBarButtons);
			schedulingMainService.unregisterUpdateToolBar(updateStateOfToolBarButtons);
			schedulingMainService.unregisterDropped(updateList());
		});
	}

})();
