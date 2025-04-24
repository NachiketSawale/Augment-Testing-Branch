/**
 * Created by anl on 18/02/2022.
 */

(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemUpdateProductionSubsetController', UpdateProductionSubsetController);
	UpdateProductionSubsetController.$inject = [
		'$http', '$scope', 'params', '$translate',
		'platformGridAPI',
		'productionplanningItemUpdateProductionSubsetService',
		'cloudCommonGridService',
		'platformModalService',
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDescriptorService',
		'platformPlanningBoardDataService'];

	function UpdateProductionSubsetController(
		$http, $scope, params, $translate,
		platformGridAPI,
		updateProductionSubsetService,
		cloudCommonGridService,
		platformModalService,
		basicsLookupdataLookupFilterService,
		basicsLookupdataLookupDescriptorService,
		platformPlanningBoardDataService) {

		// dialogFor: 1 -- create/update subsets, 2 -- splitUnassign, 3 -- updateSiblingSubSet
		let headerText = '';

		switch (params.dialogFor) {
			case 1:
				headerText = params.update ? $translate.instant('productionplanning.item.dailyProduction.updateSubSet') :
					$translate.instant('productionplanning.item.dailyProduction.createSubSet');
				break;
			case 2:
				headerText = $translate.instant('productionplanning.item.dailyProduction.splitUnassign');
				break;
			case 3:
				headerText = $translate.instant('productionplanning.item.dailyProduction.updateSiblingSubSets');
				break;
		}

		const validData = (result) => {
			let suppliers = _.filter(basicsLookupdataLookupDescriptorService.getData('sitenew'), (site) => {
				return site.SiteTypeFk === 8;
			});
			let res1 = false;
			let res2 = false;

			if (params.dialogFor === 1) {
				return true;
			}

			if (params.dialogFor === 2 || params.dialogFor === 3) {
				let validSubSets = _.filter(result, (data) => {
					return data.Supplier !== null && data.PlanQty !== null && data.PlanQty >= 0;
				});
				res1 = result.length === validSubSets.length;

				let supplierIds = suppliers !== null ? _.map(suppliers, 'Id') : [];
				let correctSuppliers = _.filter(result, (data) => {
					return _.indexOf(supplierIds, data.Supplier) > -1;
				});
				res2 = result.length === correctSuppliers.length;

				if (!res1) {
					platformModalService.showDialog({
						windowClass: 'msgbox',
						iconClass: 'ico-error',
						headerTextKey: $translate.instant('productionplanning.item.dailyProduction.splitUnassign'),
						bodyTextKey: $translate.instant('productionplanning.item.dailyProduction.errorDataMsg')
					});
					return res1;
				}
				if (!res2) {
					platformModalService.showDialog({
						windowClass: 'msgbox',
						iconClass: 'ico-error',
						headerTextKey: $translate.instant('productionplanning.item.dailyProduction.splitUnassign'),
						bodyTextKey: $translate.instant('productionplanning.item.dailyProduction.errorSupplier')
					});
					return res2;
				}
				return res1 && res2;
			}
		};

		$scope.handleOK = () => {
			platformGridAPI.grids.commitAllEdits();
			let result = updateProductionSubsetService.getResult();
			let valid = validData(result);
			if (valid) {
				// conver moment to string for Entity
				_.forEach(result, (subset) => {
					if (typeof (subset.PlannedStart) === 'object') {
						subset.PlannedStart = subset.PlannedStart.format('DD/MM/YYYY');
					}
				});
				$http.post(globals.webApiBaseUrl + 'productionplanning/productionset/dailyproduction/updatesubsets', result).then((response) => {
					if (response.data) {
						if (_.isFunction(params.loadFunc)) {
							params.loadFunc();
							if (platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName('ppsItemDailyPlanningBoardAssignmentService') !== undefined) {
								platformPlanningBoardDataService.getPlanningBoardDataServiceByAssignmentServiceName('ppsItemDailyPlanningBoardAssignmentService').load();
							}

						}
					}
					$scope.$close(false);
				});
			}
		};

		updateProductionSubsetService.init($scope, params.data, params.dialogFor);

		$scope.modalOptions = {
			headerText: headerText,
			cancel: () => {
				return $scope.$close(false);
			}
		};

		const onCellChange = (e, args) => {
			let col = args.grid.getColumns()[args.cell].field;
			updateProductionSubsetService.fieldChanged(args.item, col);
		};

		platformGridAPI.events.register($scope.gridOptions.state, 'onCellChange', onCellChange);
		platformGridAPI.events.register($scope.gridOptions.state, 'onSelectedRowsChanged', onSelectedChanged);

		function onSelectedChanged(e, args){
			var gridId = args.grid.options.id;
			var selected = platformGridAPI.rows.selection({
				gridId: gridId,
				wantsArray: true
			});
			$scope.entity = _.isArray(selected) ? selected[0] : selected;
		}

		var filters = [
			{
				key: 'pps-daily-supplier-filter',
				serverSide: true,
				fn: function (entity) {
					return {
						IsProductionArea: true,
						SiteFk: entity.SiteFk
					};
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		$scope.$on('$destroy', () => {
			platformGridAPI.grids.unregister($scope.gridOptions.state);
			platformGridAPI.events.unregister($scope.gridOptions.state, 'onCellChange', onCellChange);
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
			platformGridAPI.events.unregister($scope.gridOptions.state, 'onSelectedRowsChanged', onSelectedChanged);
		});
	}
})(angular);