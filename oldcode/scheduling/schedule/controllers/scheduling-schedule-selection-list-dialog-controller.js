(function () {
	'use strict';
	/* global _ */
	let moduleName = 'scheduling.schedule';
	/**
	 * @ngdoc controller
	 * @name schedulingScheduleSelectionListDialogController
	 * @function
	 *
	 * @description
	 * Controller for schedule copy during Deep Copy Project
	 **/
	angular.module(moduleName).controller('schedulingScheduleSelectionListDialogController',
		['$scope',
			'$timeout',
			'$injector',
			'platformGridAPI',
			'platformCreateUuid',
			'schedulingScheduleListDialogService',
			'schedulingScheduleListConfigDialogService',
			'platformGridControllerService',
			'platformToolbarBtnService',
			'projectMainCopyEntityService',
			'basicsCommonHeaderColumnCheckboxControllerService',

			function (
				$scope,
				$timeout,
				$injector,
				platformGridAPI,
				platformCreateUuid,
				schedulingScheduleListDialogService,
				schedulingScheduleListConfigDialogService,
				platformGridControllerService,
				platformToolbarBtnService,
				projectMainCopyEntityService,
				basicsCommonHeaderColumnCheckboxControllerService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					enableDraggableGroupBy: false,
					skipPermissionCheck: true,
					cellChangeCallBack: function (arg) {
						return updateParentScope(arg.item, arg.item.IsChecked);
					}
				};

				$scope.gridId = platformCreateUuid();

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.setTools = function () {
				};

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					let entity = $scope.$eval('entity');
					if(entity){
						schedulingScheduleListDialogService.setProject(entity.Project);
						schedulingScheduleListConfigDialogService.setProject(entity.Project);
					}
					schedulingScheduleListDialogService.setDataList(true);
					projectMainCopyEntityService.onOkOrCancelDialog.register(clearDataList);
					platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);

					platformGridControllerService.initListController($scope, schedulingScheduleListConfigDialogService, schedulingScheduleListDialogService, null, myGridConfig);

					basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
					basicsCommonHeaderColumnCheckboxControllerService.init($scope, schedulingScheduleListDialogService, ['IsChecked']);
				}

				$scope.isCheckedValueChange = function isCheckedValueChange() {
					return {apply: true, valid: true, error: ''};
				};

				function updateParentScope(selectItem, newValue) {
					let selectedGridId = $scope.gridId;
					let parentScope = $scope.$parent;
					let rows = parentScope.groups ? parentScope.groups[0].rows : null;
					if (rows) {
						let rowConfig = _.find(rows, {rid: 'copyObject.scheduling.schedule.schedule'});
						if (rowConfig) {
							let allitems = platformGridAPI.items.data(selectedGridId);
							let schedulesTocopy = _.filter(allitems, {IsChecked: true});
							let scheduleIds = schedulesTocopy && schedulesTocopy.length ? _.map(schedulesTocopy, 'Id') : [];
							rowConfig.change($scope.$parent.entity, rowConfig.model, newValue, scheduleIds);
						}
					}
					return {apply: true, valid: true, error: ''};
				}

				function onHeaderCheckboxChange(e) {
					return updateParentScope(null, e.target.checked);
				}

				function clearDataList() {
					schedulingScheduleListDialogService.setDataList(false);
					projectMainCopyEntityService.onOkOrCancelDialog.unregister(clearDataList);
				}

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
				});

				init();
			}]);
})();
