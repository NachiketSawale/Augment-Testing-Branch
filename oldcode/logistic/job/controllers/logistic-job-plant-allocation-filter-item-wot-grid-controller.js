/**
 * Created by baf on 2023/02/21
 */
(function () {
	'use strict';
	const moduleName = 'logistic.job';

	angular.module(moduleName).value('logisticJobPlantAllocationFilterItemWotColumns', {
		getStandardConfigForListView: function (basicsLookupdataConfigGenerator) {
			function getPlantLocationFilterTypeLookup(basicsLookupdataConfigGenerator) {
				var conf = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
					dataServiceName: 'logisticJobPlantLocationFilterTypeDataService',
					enableCache: true
				});

				return {
					id: 'filtertype',
					field: 'FilterType',
					name: 'Filter Type',
					name$tr$: 'logistic.job.plantLocationFilterType',
					formatter: 'lookup',
					formatterOptions: conf.formatterOptions,
					readonly: true
				};
			}

			function getPlantLocationFilterValueLookup(basicsLookupdataConfigGenerator) {
				let conf = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
					dataServiceName: 'resourceWorkOperationTypeLookupDataService'
				});

				return {
					id: 'filtervalue',
					field: 'FilterValue',
					name: 'Filter Value',
					name$tr$: 'logistic.job.plantLocationFilterValue',
					editor: 'lookup',
					formatter: 'lookup',
					editorOptions: conf.editorOptions,
					formatterOptions: conf.formatterOptions,
					readonly: false
				};
			}

			return {
				columns: [
					getPlantLocationFilterTypeLookup(basicsLookupdataConfigGenerator),
					getPlantLocationFilterValueLookup(basicsLookupdataConfigGenerator)
				]
			};
		}
	});

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantAllocationFilterItemGridController
	 * @function
	 *
	 * @description
	 * controller for the group selection tree
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('logisticJobPlantAllocationFilterItemWotGridController', LogisticJobPlantAllocationFilterItemWotGridController);

	LogisticJobPlantAllocationFilterItemWotGridController.$inject = ['_', '$timeout', '$scope', 'platformGridAPI', 'platformTranslateService',
		'basicsLookupdataConfigGenerator', 'logisticJobPlantAllocationFilterItemWotDataService', 'logisticJobPlantAllocationFilterItemWotColumns'];

	function LogisticJobPlantAllocationFilterItemWotGridController(_, $timeout, $scope, platformGridAPI, platformTranslateService,
		basicsLookupdataConfigGenerator, logisticJobPlantAllocationFilterItemWotDataService, logisticJobPlantAllocationFilterItemWotColumns) {

		$scope.gridTriggersSelectionChange = false;
		let callUpdateItemList = true;

		// grid's id === container's uuid
		$scope.gridId = 'aa99674280ed4972bfa43594491e1c16';

		$scope.gridData = {
			state: $scope.gridId
		};

		function updateItemList() {
			if(callUpdateItemList) {
				platformGridAPI.items.data($scope.gridId, logisticJobPlantAllocationFilterItemWotDataService.provideFilterItems());
			}
		}

		// Define standard toolbar Icons and their function on the scope
		$scope.tools = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			version: 1,
			items: [
				{
					id: 'create',
					sort: 0,
					caption: 'cloud.common.taskBarNewRecord',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-new',
					fn: function () {
						logisticJobPlantAllocationFilterItemWotDataService.createFilterItem();
					}
				},
				{
					id: 'delete',
					sort: 10,
					caption: 'cloud.common.taskBarDeleteRecord',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-delete',
					fn: function () {
						let selectedEntities = platformGridAPI.rows.selection({
							gridId: $scope.gridId,
							wantsArray: true
						});
						if(!_.isNil(selectedEntities) && selectedEntities.length > 0) {
							logisticJobPlantAllocationFilterItemWotDataService.deleteFilterItems(selectedEntities);
							updateItemList();
						}
					}
				}
			]
		};

		let settings = logisticJobPlantAllocationFilterItemWotColumns.getStandardConfigForListView(basicsLookupdataConfigGenerator);

		if (!settings.isTranslated) {
			platformTranslateService.translateGridConfig(settings.columns);
			settings.isTranslated = true;
		}

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			let grid = {
				columns: angular.copy(settings.columns),
				data: [],
				id: $scope.gridId,
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'Id',
					iconClass: '',
					editorLock: new Slick.EditorLock()
				}
			};

			platformGridAPI.grids.config(grid);
		}

		function onEntityCreated(entity) {
			platformGridAPI.rows.add({gridId: $scope.gridId, item: entity});
			platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, entity);
		}

		logisticJobPlantAllocationFilterItemWotDataService.registerEntityCreated(onEntityCreated);

		var gridListener = $scope.$watch(function () {
			return $scope.gridCtrl !== undefined;
		}, function () {
			$timeout(function () {
				updateItemList();

				gridListener();
			}, 10);
		});

		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}

			logisticJobPlantAllocationFilterItemWotDataService.unregisterEntityCreated(onEntityCreated);
		});
	}
})();