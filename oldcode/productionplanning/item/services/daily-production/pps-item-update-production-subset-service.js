/**
 * Created by anl on 21/02/2022.
 */

(function (angular) {
	'use strict';
	/* global angular, Slick, globals, _, moment */

	let moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemUpdateProductionSubsetService', UpdateProductionSubsetService);

	UpdateProductionSubsetService.$inject = [
		'$q',
		'$interval',
		'$translate',
		'platformGridAPI',
		'platformTranslateService',
		'productionplanningItemDailyProductionUIStandardService',
		'cloudCommonGridService',
		'platformRuntimeDataService',
		'ppsItemConstantValues'
	];

	function UpdateProductionSubsetService(
		$q,
		$interval,
		$translate,
		platformGridAPI,
		platformTranslateService,
		uiStandardService,
		cloudCommonGridService,
		platformRuntimeDataService,
		ppsItemConstantValues
	) {
		let service = {};

		let scope = {};

		let resolvedData = [];

		let originFlatterData = [];

		const initData = (data, dialogFor) => {
			let flatData = [];
			flatData = cloudCommonGridService.flatten(data, flatData, 'ChildItems');
			_.forEach(flatData, (subSet) => {
				let tokens = subSet.PlannedStart.split('/');
				subSet.PlannedStart = moment.utc(tokens[2] + '-' + tokens[1] + '-' + tokens[0]);
			});

			if (dialogFor === 1) {
				resolvedData = data;
			} else if (dialogFor === 2 || dialogFor === 3) {
				let readonlyFields = [{
					field: 'Supplier',
					readonly: true
				}, {
					field: 'PlanQty',
					readonly: true
				}, {
					field: 'FullyCovered',
					readonly: true
				}, {
					field: 'IsAssigned',
					readonly: true
				}];

				_.forEach(flatData, (subSet) => {
					if (dialogFor === 2 && subSet.DataType !== 'Plan' ||
						(dialogFor === 3 && subSet.DataTypeId !== ppsItemConstantValues.values.LockedTypeId)) {
						platformRuntimeDataService.readonly(subSet, readonlyFields);
					} else if ((dialogFor === 2 && subSet.DataType === 'Plan') ||
					(dialogFor === 3 && subSet.DataTypeId === ppsItemConstantValues.values.LockedTypeId)) {
						platformRuntimeDataService.readonly(subSet, [{field: 'FullyCovered', readonly: true}, {field: 'IsAssigned', readonly: true}]);
					}
				});

				resolvedData = _.filter(flatData, (subSet) => {
					return (dialogFor === 2 && subSet.DataType === 'Plan') || (subSet.DataTypeId === ppsItemConstantValues.values.LockedTypeId && dialogFor === 3);
				});
			}
		};

		const initGrid = (data, dialogFor) => {
			return {
				id: 'aedb4bae0efb41bfbca68db11e7a386d',
				columns: initColumns(dialogFor),
				data: data,
				lazyInit: true,
				options: {
					indicator: true,
					editable: true,
					idProperty: 'Id',
					tree: true,
					parentProp: 'ParentFk',
					childProp: 'ChildItems',
					hierarchyEnabled: true,
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				state: 'aedb4bae0efb41bfbca68db11e7a386d'
			};
		};

		const initColumns = (dialogFor) => {
			let columns = angular.copy(uiStandardService.getStandardConfigForListView().columns);

			let index = 1;
			_.forEach(columns, (column) => {
				column.width = 100;
				column.sorting = index++;
				if (column.field === 'PlanQty') {
					column.editor = 'decimal';
				}
				if (column.field === 'Supplier' && (dialogFor === 2 || dialogFor === 3)) {
					column.editor = 'lookup';
					column.editorOptions.lookupOptions.filterKey = 'pps-daily-supplier-filter';
					column.editorOptions.lookupOptions.processDataKey = 'FromPPSItemDailyProduction';
					column.editorOptions.directive = 'basics-site-site-x-lookup';
				}
				if (column.field === 'FullyCovered' && dialogFor === 3) {
					column.editor = 'boolean';
				}
			});
			if (dialogFor === 3) {
				columns.push({
					afterId: 'datetime',
					id: 'Code',
					field: 'Code',
					name: 'Code',
					formatter: 'code',
					width: 100,
					sorting: 1,
					name$tr$: 'cloud.common.entityCode'
				});
			}
			return columns;
		};

		service.init = ($scope, data, dialogFor) => {
			scope = $scope;
			resolvedData = originFlatterData = [];
			originFlatterData = _.cloneDeep(cloudCommonGridService.flatten(data, originFlatterData, 'ChildItems'));
			initData(data, dialogFor);

			scope.result = resolvedData;

			let treeGrid = initGrid(data, dialogFor);

			platformGridAPI.grids.config(treeGrid);
			scope.gridOptions = treeGrid;

			$interval(() => {
				platformGridAPI.items.data(scope.gridOptions.state, data);
				platformGridAPI.grids.refresh(scope.gridOptions.state, true);
			}, 1000, 1);

		};

		service.fieldChanged = (item, field) => {
			//State: 1 -- Update, 2 -- Create
			let target = _.find(scope.result, (subset) => {
				return subset.Id === item.Id && subset.State === 0;
			});
			if (target) {
				target.State = 1;
			}
			if (field === 'FullyCovered' || field === 'IsAssigned') {
				let originItem = _.find(originFlatterData, (origin) => {
					return origin.Id === item.Id;
				});
				item.UpdateStatus = originItem.FullyCovered !== item.FullyCovered || originItem.IsAssigned !== item.IsAssigned;
			}
		};

		service.getResult = () => {
			return scope.result;
		};

		service.getSelected = () => {
			return scope.entity;
		};

		return service;
	}

})(angular);