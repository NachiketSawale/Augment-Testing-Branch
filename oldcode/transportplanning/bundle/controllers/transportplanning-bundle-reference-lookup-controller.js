/**
 * Created by waz on 7/2/2018.
 */
(function (angular) {
	'use strict';
	/*global _*/

	var moduleName = 'transportplanning.bundle';

	angular.module(moduleName).controller('transportplanningBundleReferenceLookupController', BundleReferenceLookupController);
	BundleReferenceLookupController.$inject = [
		'$scope',
		'$injector',
		'$modalInstance',
		'$options',
		'platformGridAPI',
		'PlatformMessenger',
		'basicsLookupdataLookupViewService',
		'transportplanningBundleLookupControllerService',
		'$translate'];

	function BundleReferenceLookupController(
		$scope,
		$injector,
		$modalInstance,
		$options,
		platformGridAPI,
		PlatformMessenger,
		basicsLookupdataLookupViewService,
		controllerService,
		$translate) {

		var gridId = 'aff3f99f4d274b89855a186a262f4276';
		var newCheckedItems = [];
		var newUncheckedItems = [];
		var assignedBundleIds = [];

		function init() {
			assignedBundleIds = $options.assignedBundles;
			initScope($scope);
			$scope.notCreateDataProvider = true;// data provider has created in initScope($scope)
			controllerService.initController($scope, $modalInstance);
			$scope.settings.gridOptions = {
				multiSelect: true
			};
			$scope.onSelectedItemsChanged = new PlatformMessenger();
			$scope.onSelectedItemsChanged.register($options.onOk ? function () {
				$options.onOk.apply(this, arguments);
				$scope.close();
			} : applySelection);

			$scope.modalOptions = {
				headerText: $translate.instant($scope.settings.title),
				cancel: close
			};

			platformGridAPI.events.register(gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.register(gridId, 'onRowsChanged', onRowsChanged);

			function close() {
				$scope.$close(false);
				platformGridAPI.events.unregister(gridId, 'onCellChange', onCellChange);
				platformGridAPI.events.unregister(gridId, 'onRowsChanged', onRowsChanged);
			}
		}

		function onCellChange(e, args){
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'Checked') {
				var selectedBundles = getSelectedItem(gridId);
				var checkedBundles = _.filter(selectedBundles, function (bundle) {
					return bundle.Checked;
				});
				var uncheckedBundles = _.filter(selectedBundles, function (bundle) {
					return !bundle.Checked;
				});
				updateCheckedBundles(checkedBundles, uncheckedBundles);
				updateOkBtnState();
			}
		}

		function updateCheckedBundles(checkedBundles, uncheckedBundles){
			var newCheckedIds = _.map(newCheckedItems, 'Id');
			var newUnCheckedIds = _.map(newUncheckedItems, 'Id');
			if(checkedBundles && checkedBundles.length > 0) {
				_.forEach(checkedBundles, function(b){
					if(newCheckedIds.indexOf(b.Id) === -1){
						newCheckedItems.push(b);
					}
				});
			}
			if (uncheckedBundles && uncheckedBundles.length > 0){
				_.forEach(uncheckedBundles, function(b){
					if(newCheckedIds.indexOf(b.Id) > -1){
						newCheckedItems.splice(newCheckedIds.indexOf(b.Id), 1);
					}
					if(assignedBundleIds.indexOf(b.Id) > -1 && newUnCheckedIds.indexOf(b.Id) === -1){
						newUncheckedItems.push(b);
					}
				});
			}
		}

		function updateOkBtnState() {
			$scope.disableOkButton = !hasCheckedItems();
			if ($scope.$root) {
				$scope.$root.safeApply();
			} else {
				$scope.$apply();
			}
		}

		function hasCheckedItems() {
			return newCheckedItems.length > 0 || assignedBundleIds.length > 0;
		}

		function onRowsChanged(){
			var listed = platformGridAPI.rows.getRows(gridId);
			var checkedIds = _.map(newCheckedItems, 'Id');
			var uncheckedIds = _.map(newUncheckedItems, 'Id');
			_.forEach(listed, function(bundle){
				if(checkedIds.length > 0 && checkedIds.indexOf(bundle.Id) > -1 && !(uncheckedIds.length > 0 && uncheckedIds.indexOf(bundle.Id) > -1)){
					bundle.Checked = true;
				}
				if(assignedBundleIds.length > 0 && assignedBundleIds.indexOf(bundle.Id) > -1 && !(uncheckedIds.length > 0 && uncheckedIds.indexOf(bundle.Id) > -1)){
					bundle.Checked = true;
				}
			});
			listed = _.orderBy(listed, ['Checked'], ['asc']);
			platformGridAPI.rows.getRows(gridId);
			var bundleGrid = platformGridAPI.grids.element('id', gridId);
			if (bundleGrid && bundleGrid.dataView) {
				bundleGrid.dataView.setItems(listed);
			}
			updateOkBtnState();
		}

		function getSelectedItem(gridId) {
			var selected = platformGridAPI.rows.selection({
				gridId: gridId,
				wantsArray: true
			});
			return selected;
		}

		function getDateByDateshiftMode(parent, propName) {
			var date = _.get(parent, propName, null);
			if (!_.isNil(parent) && Object.prototype.hasOwnProperty.call(parent,'DateshiftMode')) {
				var dateshiftMode = parent.DateshiftMode;
				if (dateshiftMode === 0) { // Ignore Bounds
					date = null;
				}
			}
			return date;
		}

		function initScope($scope) {
			var furtherFilter = {plannedDeliveryTime : $options.plannedDeliveryTime};
			var targetService = getService($options.targetDataService);
			if (targetService && targetService.parentService) {
				furtherFilter.addMoreFilterFn = function (request) {
					var parentItem = targetService.parentService().getSelected();
					request.EarliestStart = getDateByDateshiftMode(parentItem, 'PlannedStart');
					request.LatestFinish = getDateByDateshiftMode(parentItem, 'PlannedFinish');
				};
			}
			$scope.options = controllerService.createLookupConfig(furtherFilter);
			$scope.options.defaultFilter = function (request) {
				var projectId, siteId;
				// history issue to use targetDataService
				if (targetService && targetService.parentService) {
					var parentItem = targetService.parentService().getSelected();
					projectId = parentItem.ProjectFk;
					siteId = parentItem.SiteFk;
					request.EarliestStart = getDateByDateshiftMode(parentItem, 'PlannedStart');
					request.LatestFinish = getDateByDateshiftMode(parentItem, 'PlannedFinish');
				}
				request.siteId = $options.siteId ? $options.siteId : siteId;
				request.jobId = $options.jobId;

				let preSelectedProjectId = $options.projectId ? $options.projectId : projectId;
				let preSelectedJob = $injector.get('logisticJobDialogLookupPagingExtensionDataService').getSelected();
				request.projectId = preSelectedJob !== null ? preSelectedJob.ProjectFk : preSelectedProjectId;

				request.notAssignedFlags = {
					notAssignedToReq: true,
					notAssignedToPkg: true,
					notShipped: true,
					onlyBeforeDelivery: true
				};

				request.plannedDeliveryTime = $options.plannedDeliveryTime;

				if (!_.isNil($options.notAssignedFlags)) {
					_.each(['notAssignedToReq', 'notAssignedToPkg', 'notShipped', 'onlyBeforeDelivery'], function (field) {
						request.notAssignedFlags[field] = !_.isNil($options.notAssignedFlags[field]) ? $options.notAssignedFlags[field] : true;
					});
				}

				$scope.options.dataProvider.assignedBundles = $options.assignedBundles;
				// remark: for case of bundles of TrsRequisition, in the corresponding assign-bundles dialog,
				// we should not change value of project filter by job filter, so we add a flag property 'notChangeProjectByJob' to judge it.(zwz 2019/7/22)
				if ($options.referenceProperty === 'TrsRequisitionFk') {
					$scope.options.dataService.notChangeProjectByJob = true;
				}

				return request;
			};
			$scope.options.selectableCallback = function () {
				return hasCheckedItems();
			};
			_.forEach($options.rows, function (rowConfig) {
				var row = _.find($scope.options.detailConfig.rows, {rid: rowConfig.id});
				row.readonly = rowConfig.readonly;
			});
			$scope.settings = createDialogSettings($scope.options);
		}

		function createDialogSettings(config) {
			var settings = {};
			basicsLookupdataLookupViewService.config('input-base', settings);

			var bundleColumns = [{
				editor: 'boolean',
				field: 'Checked',
				formatter: 'boolean',
				id: 'checked',
				width: 80,
				pinned: true,
				sortable: true,
				headerChkbox: false,
				name$tr$: 'cloud.common.entitySelected'
			}];
			bundleColumns = bundleColumns.concat(config.columns);

			var searchSettings = {
				lookupType: config.lookupType,
				initialSearchValue: '',
				eagerSearch: false,
				idProperty: 'Id',
				disableDataCaching: true,
				inputSearchMembers: ['SearchPattern']
			};
			var uiSettings = {
				width: '600px',
				height: '500px',
				minWidth: '470px',
				title: config.title
			};
			var gridOptions = {
				gridId: config.uuid,
				uuid: config.uuid,
				idProperty: config.idProperty,
				lazyInit: false,
				columns: bundleColumns
			};
			_.merge(settings, searchSettings, uiSettings, gridOptions);
			return settings;
		}

		function applySelection(e, result) {
			// handle onDblClick event, when user double click in the grid without any checked bundle, keep dialog opened
			if (!hasCheckedItems()) {
				return;
			}

			if (newCheckedItems && newCheckedItems.length > 0) {
				getService($options.targetDataService)
					.createReferences(newCheckedItems, $options.referenceProperty, $options.getReferencePropertyValue());
			}

			if (newUncheckedItems && newUncheckedItems.length > 0) {
				getService($options.targetDataService).setSelectedEntities(newUncheckedItems);
				getService($options.targetDataService).deleteItem();
			}

			$scope.close();
		}

		function getService(service) {
			return _.isString(service) ? $injector.get(service) : service;
		}

		init();
	}
})(angular);