/**
 * Created by anl on 8/27/2018.
 */

(function (angular) {
	'use strict';
	/* global moment _ */
	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).controller('productionplanningActivitySynchronizeController', ActivitySynchronizeController);

	ActivitySynchronizeController.$inject = ['$scope', '$translate', '$q', '$http', 'keyCodes',
		'productionpalnningActivitySynchronizeWizardService',
		'platformGridAPI',
		'platformModalService'];

	function ActivitySynchronizeController($scope, $translate, $q, $http, keyCodes,
										   synchronizeWizardService,
										   platformGridAPI,
										   platformModalService) {

		var grid, activityGridConfig, mntActivityFormOptions, psdActivityFormOptions, module, synList, searchList;
		var MntActivityModule = 'Mounting-Activity';

		function setActivityDetail(selectedItem) {
			if (module === MntActivityModule) {
				//west
				$scope.westFormOptions.entity.MntActualStart = selectedItem.MntActualStart !== null ? moment.utc(selectedItem.MntActualStart) : null;
				$scope.westFormOptions.entity.MntActualFinish = selectedItem.MntActualFinish !== null ? moment.utc(selectedItem.MntActualFinish) : null;
				$scope.westFormOptions.entity.MntPlannedStart = moment.utc(selectedItem.MntPlannedStart);
				$scope.westFormOptions.entity.MntPlannedFinish = moment.utc(selectedItem.MntPlannedFinish);
				$scope.westFormOptions.entity.MntEarliestFinish = moment.utc(selectedItem.MntEarliestFinish);
				$scope.westFormOptions.entity.MntEarliestStart = moment.utc(selectedItem.MntEarliestStart);
				$scope.westFormOptions.entity.MntLatestStart = moment.utc(selectedItem.MntLatestStart);
				$scope.westFormOptions.entity.MntLatestFinish = moment.utc(selectedItem.MntLatestFinish);
				$scope.westFormOptions.entity.MntLocationFk = selectedItem.MntLocationFk;
				$scope.westFormOptions.entity.MntMdcControllingUnitFk = selectedItem.MntControllingUnitFk;
				$scope.westFormOptions.entity.MntCalendarFk = selectedItem.MntCalendarFk;
				//east
				$scope.eastFormOptions.entity.PsdActualStart = selectedItem.PsdActualStart !== null ? moment.utc(selectedItem.PsdActualStart) : null;
				$scope.eastFormOptions.entity.PsdActualFinish = selectedItem.PsdActualFinish !== null ? moment.utc(selectedItem.PsdActualFinish) : null;
				$scope.eastFormOptions.entity.PsdPlannedStart = moment.utc(selectedItem.PsdPlannedStart);
				$scope.eastFormOptions.entity.PsdPlannedFinish = selectedItem.PsdPlannedFinish !== null ? moment.utc(selectedItem.PsdPlannedFinish) : null;
				$scope.eastFormOptions.entity.PsdEarliestFinish = selectedItem.PsdEarliestFinish !== null ? moment.utc(selectedItem.PsdEarliestFinish) : null;
				$scope.eastFormOptions.entity.PsdEarliestStart = selectedItem.PsdEarliestStart !== null ? moment.utc(selectedItem.PsdEarliestStart) : null;
				$scope.eastFormOptions.entity.PsdLatestStart = selectedItem.PsdLatestStart !== null ? moment.utc(selectedItem.PsdLatestStart) : null;
				$scope.eastFormOptions.entity.PsdLatestFinish = selectedItem.PsdLatestFinish !== null ? moment.utc(selectedItem.PsdLatestFinish) : null;
				$scope.eastFormOptions.entity.PsdLocationFk = selectedItem.PsdLocationFk;
				$scope.eastFormOptions.entity.PsdControllingUnitFk = selectedItem.PsdControllingUnitFk;
				$scope.eastFormOptions.entity.PsdCalendarFk = selectedItem.PsdCalendarFk;
			}
			else {
				//west
				$scope.westFormOptions.entity.PsdActualStart = selectedItem.PsdActualStart !== null ? moment.utc(selectedItem.PsdActualStart) : null;
				$scope.westFormOptions.entity.PsdActualFinish = selectedItem.PsdActualFinish !== null ? moment.utc(selectedItem.PsdActualFinish) : null;
				$scope.westFormOptions.entity.PsdPlannedStart = moment.utc(selectedItem.PsdPlannedStart);
				$scope.westFormOptions.entity.PsdPlannedFinish = selectedItem.PsdPlannedFinish !== null ? moment.utc(selectedItem.PsdPlannedFinish) : null;
				$scope.westFormOptions.entity.PsdEarliestFinish = selectedItem.PsdEarliestFinish !== null ? moment.utc(selectedItem.PsdEarliestFinish) : null;
				$scope.westFormOptions.entity.PsdEarliestStart = selectedItem.PsdEarliestStart !== null ? moment.utc(selectedItem.PsdEarliestStart) : null;
				$scope.westFormOptions.entity.PsdLatestStart = selectedItem.PsdLatestStart !== null ? moment.utc(selectedItem.PsdLatestStart) : null;
				$scope.westFormOptions.entity.PsdLatestFinish = selectedItem.PsdLatestFinish !== null ? moment.utc(selectedItem.PsdLatestFinish) : null;
				$scope.westFormOptions.entity.PsdLocationFk = selectedItem.PsdLocationFk;
				$scope.westFormOptions.entity.PsdControllingUnitFk = selectedItem.PsdControllingUnitFk;
				$scope.westFormOptions.entity.PsdCalendarFk = selectedItem.PsdCalendarFk;
				//east
				$scope.eastFormOptions.entity.MntActualStart = selectedItem.MntActualStart !== null ? moment.utc(selectedItem.MntActualStart) : null;
				$scope.eastFormOptions.entity.MntActualFinish = selectedItem.MntActualFinish !== null ? moment.utc(selectedItem.MntActualFinish) : null;
				$scope.eastFormOptions.entity.MntPlannedStart = moment.utc(selectedItem.MntPlannedStart);
				$scope.eastFormOptions.entity.MntPlannedFinish = moment.utc(selectedItem.MntPlannedFinish);
				$scope.eastFormOptions.entity.MntEarliestFinish = moment.utc(selectedItem.MntEarliestFinish);
				$scope.eastFormOptions.entity.MntEarliestStart = moment.utc(selectedItem.MntEarliestStart);
				$scope.eastFormOptions.entity.MntLatestStart = moment.utc(selectedItem.MntLatestStart);
				$scope.eastFormOptions.entity.MntLatestFinish = moment.utc(selectedItem.MntLatestFinish);
				$scope.eastFormOptions.entity.MntLocationFk = selectedItem.MntLocationFk;
				$scope.eastFormOptions.entity.MntControllingunitFk = selectedItem.MntControllingUnitFk;
				$scope.eastFormOptions.entity.MntCalendarFk = selectedItem.MntCalendarFk;
			}
		}

		function selectedItemChanged() {
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});
			if(selected) {
				setActivityDetail(selected);
			}
		}

		function updateSelectedSynActivity(westEntity) {
			var selectedRow = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});
			var result = validateSelectedItem($scope.westFormOptions.entity);
			if (result) {
				if (module === MntActivityModule) {
					selectedRow.MntActualStart = westEntity.MntActualStart;
					selectedRow.MntActualFinish = westEntity.MntActualFinish;
					selectedRow.MntPlannedStart = westEntity.MntPlannedStart;
					selectedRow.MntPlannedFinish = westEntity.MntPlannedFinish;
					selectedRow.MntEarliestFinish = westEntity.MntEarliestFinish;
					selectedRow.MntEarliestStart = westEntity.MntEarliestStart;
					selectedRow.MntLatestStart = westEntity.MntLatestStart;
					selectedRow.MntLatestFinish = westEntity.MntLatestFinish;
					selectedRow.MntLocationFk = westEntity.MntLocationFk;
					selectedRow.MntMdcControllingunitFk = westEntity.MntControllingUnitFk;
					selectedRow.MntCalendarFk = westEntity.MntCalendarFk;
				}
				else {
					selectedRow.PsdActualStart = westEntity.PsdActualStart;
					selectedRow.PsdActualFinish = westEntity.PsdActualFinish;
					selectedRow.PsdPlannedStart = westEntity.PsdPlannedStart;
					selectedRow.PsdPlannedFinish = westEntity.PsdPlannedFinish;
					selectedRow.PsdEarliestFinish = westEntity.PsdEarliestFinish;
					selectedRow.PsdEarliestStart = westEntity.PsdEarliestStart;
					selectedRow.PsdLatestStart = westEntity.PsdLatestStart;
					selectedRow.PsdLatestFinish = westEntity.PsdLatestFinish;
					selectedRow.PsdLocationFk = westEntity.PsdLocationFk;
					selectedRow.PsdMdcControllingunitFk = westEntity.PsdMdcControllingunitFk;
					selectedRow.PsdCalendarFk = westEntity.PsdCalendarFk;
				}
			} else {
				platformModalService.showDialog({
					headerTextKey: module + ' Detail Error',
					bodyTextKey: module + ' has invalid data',
					iconClass: 'ico-error'
				});
				selectedRow.Synchronize = false;
			}
		}

		function onCellChange(e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'Synchronize' && args.item.Synchronize) {
				var result = validateSelectedItem($scope.westFormOptions.entity);
				if (!result) {
					platformModalService.showDialog({
						headerTextKey: module + ' Detail Error',
						bodyTextKey: module + ' has invalid data',
						iconClass: 'ico-error'
					});
					args.item.Synchronize = false;
				}
			}
		}

		function validateSelectedItem(westEntity) {
			if (module === MntActivityModule) {
				if (Date.parse(westEntity.MntPlannedFinish) < Date.parse(westEntity.MntPlannedStart) ||
					(Date.parse(westEntity.MntEarliestFinish) < Date.parse(westEntity.MntEarliestStart)) ||
					(Date.parse(westEntity.MntLatestFinish) < Date.parse(westEntity.MntLatestStart))) {
					return false;
				}
			} else {
				if (Date.parse(westEntity.PsdPlannedFinish) < Date.parse(westEntity.PsdPlannedStart) ||
					(Date.parse(westEntity.PsdEarliestFinish) < Date.parse(westEntity.PsdEarliestStart)) ||
					(Date.parse(westEntity.PsdLatestFinish) < Date.parse(westEntity.PsdLatestStart))) {
					return false;
				}
			}
			return true;
		}

		function setSearchList(searchValue){
			//searchList = [];
			var mntCodeResult = _.filter(synList, function (item) {
				return item.MntCode === null ? false : item.MntCode.indexOf(searchValue) >= 0;
			});
			var mntDescriptionResult = _.filter(synList, function (item) {
				return item.MntDescription === null ? false : item.MntDescription.indexOf(searchValue) >= 0;
			});
			var psdCodeResult = _.filter(synList, function (item) {
				return item.PsdCode === null ? false : item.PsdCode.indexOf(searchValue) >= 0;
			});
			var psdDescriptionResult = _.filter(synList, function (item) {
				return item.PsdDescription === null ? false : item.PsdDescription.indexOf(searchValue) >= 0;
			});
			searchList = _.uniq(_.union(mntCodeResult, mntDescriptionResult, psdCodeResult, psdDescriptionResult));
		}

		function resetSelected() {
			//var grid = platformGridAPI.grids.element('id', $scope.gridId);
			if (grid.instance && grid.dataView) {
				grid.instance.resetActiveCell();
				grid.instance.setSelectedRows([]);
				grid.instance.invalidate();
			}
		}

		function search(searchValue){
			if (searchValue === '' || !searchValue) {
				grid.dataView.setItems(synList);
			}
			else {
				setSearchList(searchValue);
				grid.dataView.setItems(searchList);
			}
		}

		function initDialog() {
			activityGridConfig = _.clone(synchronizeWizardService.getActivityGridConfig());
			mntActivityFormOptions = _.clone(synchronizeWizardService.getMntActivityConfig());
			psdActivityFormOptions = _.clone(synchronizeWizardService.getPsdActivityConfig());
			module = synchronizeWizardService.getCurrentModule();
			synList = synchronizeWizardService.getData();

			if (module === MntActivityModule) {
				$scope.westFormOptions = mntActivityFormOptions;
				$scope.eastFormOptions = psdActivityFormOptions;
			} else {
				$scope.westFormOptions = psdActivityFormOptions;
				$scope.eastFormOptions = mntActivityFormOptions;
			}

			$scope.modalOptions = {};
			if (module === MntActivityModule) {
				$scope.gridId = 'a284aab1df314d89b89d1b46b051560d';
			}
			else {
				$scope.gridId = '0d68f7e520b64ff3bff0b5ef080398e4';
			}

			$scope.gridData = {
				config: {
					columns: activityGridConfig.columns,
					data: synList,
					id: $scope.gridId,
					lazyInit: true,
					options: {
						indicator: true,
						editable: true,
						idProperty: 'Id',
						iconClass: '',
						skipPermissionCheck: true
					}
				},
				state: $scope.gridId
			};

			angular.extend($scope.modalOptions, {});
			angular.extend($scope, {
				uiConfig: {
					westTitle: $scope.westFormOptions.title,
					eastTitle: $scope.eastFormOptions.title,
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					synchronizeButtonText: $translate.instant('basics.common.button.refresh'),
					dialogTitle: 'Synchronize Activity'
				}
			});

			angular.extend($scope.westFormOptions.configure, {
				skipPermissionCheck: true,
				change: updateSelectedSynActivity
			});

			var gridInfo = platformGridAPI.grids.element('id', $scope.gridId);
			if(gridInfo){
				gridInfo.config = $scope.gridData.config;
				grid = gridInfo;
			}else{
				platformGridAPI.grids.config($scope.gridData.config);
				grid = platformGridAPI.grids.element('id', $scope.gridId);
			}
		}

		$scope.onCancel = function () {
			$scope.$dismiss('cancel');
		};
		$scope.onOk = function () {
			// var grid = platformGridAPI.grids.element('id', $scope.gridId);
			//var data = grid.dataView.getRows();
			var request = {Activities: synList, Type: module};
			var url = globals.webApiBaseUrl + 'productionplanning/activity/wizard/synactivity';
			$http.post(url, request).then(function () {
				//selectedItems = response.data;

				$scope.onCancel();
			});
		};

		$scope.getContainerUUID = function () {
			return $scope.gridId;
		};


		$scope.onSearchInputKeydown = function (event, searchValue) {
			if (event.keyCode === keyCodes.ENTER) {
				$scope.search(searchValue);
			}
		};

		$scope.search = search;


		initDialog();
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', selectedItemChanged);
		platformGridAPI.events.register($scope.gridId, 'onRowCountChanged', resetSelected);


		$scope.$on('$destroy', function () {
			$scope.onCancel();
			$scope.westFormOptions.entity = null;
			$scope.eastFormOptions.entity = null;

			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', selectedItemChanged);
			platformGridAPI.events.unregister($scope.gridId, 'onRowCountChanged', resetSelected);
			//platformGridAPI.grids.unregister($scope.gridId);
		});
	}
})(angular);