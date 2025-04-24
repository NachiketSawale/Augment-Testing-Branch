/**
 * Created by anl on 21/2/2023.
 */

(() => {
	'use strict';

	/* global angular, Slick, moment */
	const moduleName = 'productionplanning.product';

	angular.module(moduleName).factory('ppsProductAssignContractToDispatchNoteService', AssignContractToDispatchNoteService);

	AssignContractToDispatchNoteService.$inject = [
		'_', 'globals', '$q', '$http',
		'platformGridAPI',
		'logisticDispatchingRecordUIConfigurationService',
		'logisticDispatchingHeaderUIConfigurationService',
		'salesContractConfigurationService'];

	function AssignContractToDispatchNoteService(
		_, globals, $q, $http,
		platformGridAPI,
		DispatchingRecordUI,
		DispatchingHeaderUI,
		SalesContractUI) {

		let service = {};
		let scope = {};
		let dispatchRecordData = {};

		let dispatchHeaders, dispatchRecords, orderHeaders;
		let header2RecordIds, header2ContractIds;

		let result = {};

		const getDispatchHeaderConfig = () => {
			const columns = angular.copy(DispatchingHeaderUI.getStandardConfigForListView().columns);
			purifyColumn(columns);
			const uuid = '3bdd7e79545e4b41acbed60d13f4c086';
			return {
				id: uuid,
				state: uuid,
				columns: columns,
				options: {
					indicator: true,
					editable: false,
					idProperty: 'Id',
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				lazyInit: true,
				tools: {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [{
						id: 't111',
						sort: 111,
						caption: 'cloud.common.gridlayout',
						iconClass: 'tlb-icons ico-settings',
						type: 'item',
						fn: () => { // (id,cfg,arg)
							platformGridAPI.configuration.openConfigDialog(uuid).then(() => {});
						}
					}]
				}
			};
		};

		const getDispatchRecordConfig = () => {
			const columns = angular.copy(DispatchingRecordUI.getStandardConfigForListView().columns);
			purifyColumn(columns);
			const uuid = '6f38ebf69dbb4b6396ebd41c69149c33';
			return {
				id: uuid,
				state: uuid,
				columns: columns,
				options: {
					indicator: true,
					editable: false,
					idProperty: 'Id',
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				lazyInit: true,
				tools: {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [{
						id: 't111',
						sort: 111,
						caption: 'cloud.common.gridlayout',
						iconClass: 'tlb-icons ico-settings',
						type: 'item',
						fn: () => {
							platformGridAPI.configuration.openConfigDialog(uuid).then(() => {});
						}
					}]
				}
			};
		};
		const getOrderHeaderConfig = () => {
			const uuid = 'e0ee5e12246045598504ba51eede653c';
			let columns = angular.copy(SalesContractUI.getStandardConfigForListView().columns);
			purifyColumn(columns);
			columns = [{
				id: 'marker',
				name: 'Filter',
				name$tr$: 'platform.gridMarkerHeader',
				toolTip: 'Filter',
				toolTip$tr$: 'platform.gridMarkerHeader',
				field: 'IsMarked',
				width: 40,
				minWidth: 40,
				resizable: true,
				sortable: false,
				formatter: 'marker',
				pinned: true,
				editor: 'marker'
			}].concat(columns);
			return {
				id: uuid,
				state: uuid,
				columns: columns,
				options: {
					indicator: true,
					editable: false,
					idProperty: 'Id',
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				lazyInit: true,
				tools: {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [{
						id: 't111',
						sort: 111,
						caption: 'cloud.common.gridlayout',
						iconClass: 'tlb-icons ico-settings',
						type: 'item',
						fn: () => {
							platformGridAPI.configuration.openConfigDialog(uuid).then(() => {});
						}
					}]
				}
			};
		};

		const purifyColumn = (columns) => {
			_.forEach(columns, function (o) {
				o.editor = null;
				o.navigator = null;
			});
		};

		const processDate = (items, fields) => {
			_.forEach(items, (item) => {
				_.forEach(fields, function (field) {
					if (_.get(item, field)) {
						_.set(item, field, moment.utc(_.get(item, field)));
					}
				});
			});
		};

		const processData = (dispatchHeaders, dispatchRecords, orderHeaders) => {
			processDate(dispatchHeaders, ['DocumentDate', 'EffectiveDate']);
			processDate(dispatchRecords, ['DateEffective', 'DateEffectiveFallBack']);
			processDate(orderHeaders, ['DateEffective', 'OrderDate']);
			initMarked();
		};

		const fetchData = (dispatchRecordData) => {
			// {DispatchRecordId: [DispatchHeaderIds ...]}
			let deferred = $q.defer();
			$http.post(globals.webApiBaseUrl + 'productionplanning/product/workflow/getdispatchdata', dispatchRecordData)
				.then(function (response) {
					deferred.resolve(response);
				});
			return deferred.promise;
		};

		const setGridItems = (data, grid) => {
			if (grid) {
				grid.dataView.setItems(data);
				resetSelection(grid);
			}
		};

		const getSelected = (grid) => {
			if (grid.dataView && grid.instance) {
				let shownConstracts = grid.dataView.getRows();
				let selectedPositions = grid.instance.getSelectedRows();
				return shownConstracts[selectedPositions[0]];
			}
			return null;
		};

		const setSelected = (dispatchHeaderId, targetId, grid) => {
			if (grid.dataView && grid.instance) {
				let shownConstracts = grid.dataView.getRows();

				let position = -1;
				for (let i = 0; i < shownConstracts.length; i++) {
					if (shownConstracts[i].Id === targetId) {
						position = i;
						break;
					}
				}
				grid.instance.setSelectedRows([position]);
				grid.instance.resetActiveCell();
				platformGridAPI.grids.refresh(grid.state, true);
			}
		};

		const resetSelection = (grid) => {
			grid.instance.setSelectedRows([-1]);
			grid.instance.resetActiveCell();
			platformGridAPI.grids.refresh(grid.state, true);
		};

		const getFilteredItems = (selectedHeader, NAME) => {
			if (selectedHeader) {
				let targetIds = [];
				let copiedContract = [];
				switch (NAME) {
					case 'RECORD':
						targetIds = header2RecordIds[selectedHeader.Id];
						return _.filter(dispatchRecords, (record) => {
							return targetIds.indexOf(record.Id) !== -1;
						});
					case 'CONTRACT':
						targetIds = header2ContractIds[selectedHeader.Id];
						copiedContract = angular.copy(orderHeaders);
						return _.filter(copiedContract, (contract) => {
							return targetIds.indexOf(contract.Id) !== -1;
						});
				}
			}
			return [];
		};

		const initResult = () => {
			_.forEach(dispatchHeaders, (header) => {
				result[header.Id] = [];
			});
		};

		const initMarked = (contracts, selectedHeader) => {
			if (selectedHeader) {
				contracts = contracts ? contracts : orderHeaders;
				let markedContactId = -1;
				if (selectedHeader.Id && result[selectedHeader.Id].length > 0) {
					markedContactId = result[selectedHeader.Id][0];
				}

				_.forEach(contracts, (contract) => {
					contract.IsMarked = markedContactId > 0 && markedContactId === contract.Id;
					if (contract.IsMarked) {
						setSelected(selectedHeader.Id, contract.Id, scope.gridOptions.orderHeaderGrid);
					}
				});
			}
		};

		service.initial = ($scope) => {
			scope = $scope;

			let dispatchHeaderCfg = getDispatchHeaderConfig();
			let dispatchRecordCfg = getDispatchRecordConfig();
			let orderHeaderCfg = getOrderHeaderConfig();
			platformGridAPI.grids.config(dispatchHeaderCfg);
			platformGridAPI.grids.config(dispatchRecordCfg);
			platformGridAPI.grids.config(orderHeaderCfg);
			scope.gridOptions = {
				dispatchHeaderGrid: dispatchHeaderCfg,
				dispatchRecordGrid: dispatchRecordCfg,
				orderHeaderGrid: orderHeaderCfg
			};
		};

		service.onInitialized = () => {
			dispatchRecordData = scope.dialog.modalOptions.dataItem.DispatchRecordData;
			scope.isLoading = true;
			fetchData(dispatchRecordData).then(function (response) {
				if (response && response.data && response.data !== -1) {
					processData(response.data.DispatchHeaders, response.data.DispatchRecords, response.data.OrderHeaders);

					dispatchHeaders = response.data.DispatchHeaders;
					dispatchRecords = response.data.DispatchRecords;
					orderHeaders = response.data.OrderHeaders;
					header2RecordIds = response.data.HeaderToRecordIds;
					header2ContractIds = response.data.HeaderToContractIds;

					setGridItems(dispatchHeaders, scope.gridOptions.dispatchHeaderGrid);
					initResult();
					scope.isLoading = false;
				}
			});
		};

		service.onDispatchHeaderChanged = () => {
			let selectedHeader = getSelected(scope.gridOptions.dispatchHeaderGrid);
			let filteredRecords = getFilteredItems(selectedHeader, 'RECORD');
			setGridItems(filteredRecords, scope.gridOptions.dispatchRecordGrid);

			let filteredContracts = getFilteredItems(selectedHeader, 'CONTRACT');
			setGridItems(filteredContracts, scope.gridOptions.orderHeaderGrid);
			initMarked(filteredContracts, selectedHeader);
		};

		service.handleMarkersChanged = (selectedContract) => {
			let selectedHeader = getSelected(scope.gridOptions.dispatchHeaderGrid);

			result[selectedHeader.Id] = selectedContract.IsMarked ? [selectedContract.Id] : [];

			scope.dialog.modalOptions.value = result;
		};

		return service;
	}
})();