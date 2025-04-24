/**
 * Created by baf on 2023/02/21
 */
(function () {
	'use strict';
	const moduleName = 'logistic.job';

	angular.module(moduleName).value('logisticJobPlantAllocationFilterItemGroupColumns', {
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

			function getPlantLocationFilterValueLookup() {
				let conf = {
					editor: 'lookup',
					editorOptions: {
						directive: 'resource-equipment-group-lookup-dialog',
						lookupOptions: {
							additionalColumns: true,
							showClearButton: true,
							addGridColumns: [{
								id: 'description',
								field: 'DescriptionInfo',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'translation',
								readonly: true,
							}]
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'equipmentGroup',
						displayMember: 'Code',
						version: 3
					}
				};

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
					getPlantLocationFilterValueLookup()
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
	angular.module(moduleName).controller('logisticJobPlantAllocationFilterItemGroupGridController', LogisticJobPlantAllocationFilterItemGroupGridController);

	LogisticJobPlantAllocationFilterItemGroupGridController.$inject = ['_', '$timeout', '$scope', 'platformGridAPI', 'platformTranslateService',
		'basicsLookupdataConfigGenerator', 'logisticJobPlantAllocationFilterItemGroupDataService', 'logisticJobPlantAllocationFilterItemGroupColumns'];

	function LogisticJobPlantAllocationFilterItemGroupGridController(_, $timeout, $scope, platformGridAPI, platformTranslateService,
		basicsLookupdataConfigGenerator, logisticJobPlantAllocationFilterItemGroupDataService, logisticJobPlantAllocationFilterItemGroupColumns) {

		$scope.gridTriggersSelectionChange = false;
		let callUpdateItemList = true;

		// grid's id === container's uuid
		$scope.gridId = '4a8e880107c448bf9aa4baedd32973c0';

		$scope.gridData = {
			state: $scope.gridId
		};

		function updateItemList() {
			if(callUpdateItemList) {
				platformGridAPI.items.data($scope.gridId, logisticJobPlantAllocationFilterItemGroupDataService.provideFilterItems());
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
						logisticJobPlantAllocationFilterItemGroupDataService.createFilterItem();
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
							logisticJobPlantAllocationFilterItemGroupDataService.deleteFilterItems(selectedEntities);
							updateItemList();
						}
					}
				}
			]
		};

		let settings = logisticJobPlantAllocationFilterItemGroupColumns.getStandardConfigForListView(basicsLookupdataConfigGenerator);

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

		logisticJobPlantAllocationFilterItemGroupDataService.registerEntityCreated(onEntityCreated);

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

			logisticJobPlantAllocationFilterItemGroupDataService.unregisterEntityCreated(onEntityCreated);
		});
	}
})();