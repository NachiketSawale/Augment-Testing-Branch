/**
 * Created by baf on 2023/02/21
 */
(function () {
	'use strict';
	const moduleName = 'logistic.job';

	angular.module(moduleName).value('logisticJobPlantAllocationFilterItemKindColumns', {
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
				let param = {lookupName: 'basics.customize.plantkind', options: { required: true }};
				let conf = basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid(param);

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
	angular.module(moduleName).controller('logisticJobPlantAllocationFilterItemKindGridController', LogisticJobPlantAllocationFilterItemKindGridController);

	LogisticJobPlantAllocationFilterItemKindGridController.$inject = ['_', '$timeout', '$scope', 'platformGridAPI', 'platformTranslateService',
		'basicsLookupdataConfigGenerator', 'logisticJobPlantAllocationFilterItemKindDataService', 'logisticJobPlantAllocationFilterItemKindColumns'];

	function LogisticJobPlantAllocationFilterItemKindGridController(_, $timeout, $scope, platformGridAPI, platformTranslateService,
		basicsLookupdataConfigGenerator, logisticJobPlantAllocationFilterItemKindDataService, logisticJobPlantAllocationFilterItemKindColumns) {

		$scope.gridTriggersSelectionChange = false;
		let callUpdateItemList = true;

		// grid's id === container's uuid
		$scope.gridId = 'fb5c0550c64c452293cf5c3573e96724';

		$scope.gridData = {
			state: $scope.gridId
		};

		function updateItemList() {
			if(callUpdateItemList) {
				platformGridAPI.items.data($scope.gridId, logisticJobPlantAllocationFilterItemKindDataService.provideFilterItems());
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
						logisticJobPlantAllocationFilterItemKindDataService.createFilterItem();
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
							logisticJobPlantAllocationFilterItemKindDataService.deleteFilterItems(selectedEntities);
							updateItemList();
						}
					}
				}
			]
		};

		let settings = logisticJobPlantAllocationFilterItemKindColumns.getStandardConfigForListView(basicsLookupdataConfigGenerator);

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

		logisticJobPlantAllocationFilterItemKindDataService.registerEntityCreated(onEntityCreated);

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

			logisticJobPlantAllocationFilterItemKindDataService.unregisterEntityCreated(onEntityCreated);
		});
	}
})();