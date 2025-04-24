/**
 * Created by leo on 18.08.2015.
 */
(function () {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).value('projectMainCostGroupCatalogAssignmentColumns', {
		getStandardConfigForListView: function (basicsLookupdataConfigGenerator, costGroupCatalogValidator, isProjectCatalogValidator, projectMainCostGroupCatalogAssignmentValidationService) {
			function getBoolean(prop, propName, propNameTr, validator, readonly) {
				return {
					id: prop.toLowerCase(),
					field: prop,
					name: propName,
					name$tr$: 'basics.customize.' + propNameTr,
					formatter: 'boolean',
					editor: 'boolean',
					readonly: !!readonly,
					validator: validator
				};
			}

			function getCostGroupLookup(prop, propName, propNameTr, basicsLookupdataConfigGenerator, validator) {
				var conf = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
					dataServiceName: 'basicCostGroupCatalogByLineItemContextLookupDataService',
					enableCache: true,
					filterKey: 'lineItemContext-filter'
				});

				return {
					id: prop.toLowerCase(),
					field: prop,
					name: propName,
					name$tr$: 'basics.customize.' + propNameTr,
					editor: 'lookup',
					formatter: 'lookup',
					editorOptions: conf.editorOptions,
					formatterOptions: conf.formatterOptions,
					readonly: false,
					validator: validator
				};
			}

			return {
				columns: [
					getBoolean('IsProjectCatalog', 'Is Project', 'isProjectCatalog', isProjectCatalogValidator),
					getCostGroupLookup('CostGroupCatalogFk', 'Cost Group Catalog', 'costGroupCatalog', basicsLookupdataConfigGenerator, costGroupCatalogValidator),
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						domain: 'code',
						readonly: true,
						formatter: 'code',
						editor: 'code',
						validator: projectMainCostGroupCatalogAssignmentValidationService.validateCode
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						editor: 'translation',
						readonly: false
					},
					{
						id: 'sorting',
						field: 'Sorting',
						name: 'Sorting',
						name$tr$: 'cloud.common.entitySorting',
						domain: 'integer',
						formatter: 'integer',
						editor: 'integer'
					},
					getBoolean('IsBoQ', 'Is BoQ', 'isBoQ', projectMainCostGroupCatalogAssignmentValidationService.validateIsBoQ),
					getBoolean('IsEstimate', 'Is Estimate', 'isestimate', projectMainCostGroupCatalogAssignmentValidationService.validateIsEstimate),
					getBoolean('IsConstructionSystem', 'Is Construction System', 'isliccos', projectMainCostGroupCatalogAssignmentValidationService.validateIsConstructionSystem),
					getBoolean('IsProcurement', 'Is Procurement', 'isProcurement', projectMainCostGroupCatalogAssignmentValidationService.validateIsProcurement),
					getBoolean('IsEngineering', 'Is Engineering', 'isEngineering', projectMainCostGroupCatalogAssignmentValidationService.validateIsEngineering),
					getBoolean('IsProductionSystem', 'Is Production System', 'isProductionSystem', projectMainCostGroupCatalogAssignmentValidationService.validateIsProductionSystem),
					getBoolean('IsModel', 'Is Model', 'isModel', projectMainCostGroupCatalogAssignmentValidationService.validateIsModel),
					getBoolean('IsQuantityTakeOff', 'Is Quantity Take Off', 'isQuantityTakeOff', projectMainCostGroupCatalogAssignmentValidationService.validateIsQuantityTakeOff),
					getBoolean('IsControlling', 'Is Controlling', 'isControlling', projectMainCostGroupCatalogAssignmentValidationService.validateIsControlling),
					getBoolean('IsDefect', 'Is Defect', 'isDefect', projectMainCostGroupCatalogAssignmentValidationService.validateIsDefect),
					getCostGroupLookup('SourceCostGroupCatalogFk', 'Source Cost Group Catalog', 'sourceCostGroupCatalog', basicsLookupdataConfigGenerator)
				]
			};
		}
	});

	/**
	 * @ngdoc controller
	 * @name projectMainCostGroupCatalogAssignmentGridController
	 * @function
	 *
	 * @description
	 * controller for the group selection tree
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainCostGroupCatalogAssignmentGridController', ProjectMainCostGroupCatalogAssignmentGridController);

	ProjectMainCostGroupCatalogAssignmentGridController.$inject = ['$timeout', '$scope', 'platformGridAPI', 'platformTranslateService',
		'basicsLookupdataConfigGenerator', 'projectMainCostGroupCatalogAssignmentDataService', 'projectMainCostGroupCatalogAssignmentColumns',
		'projectMainCostGroupCatalogConfigurationService', 'projectMainCostGroupCatalogAssignmentValidationService'];

	function ProjectMainCostGroupCatalogAssignmentGridController($timeout, $scope, platformGridAPI, platformTranslateService,
	  basicsLookupdataConfigGenerator, projectMainCostGroupCatalogAssignmentDataService, projectMainCostGroupCatalogAssignmentColumns,
	  projectMainCostGroupCatalogConfigurationService, projectMainCostGroupCatalogAssignmentValidationService) {

		$scope.gridTriggersSelectionChange = false;

		// grid's id === container's uuid
		$scope.gridId = '4a8e880107c448bf9aa4baedd32973c0';

		$scope.gridData = {
			state: $scope.gridId
		};
		$scope.AssignmentsListCounter = projectMainCostGroupCatalogAssignmentDataService.getAssignments().length;

		function updateItemList() {
			platformGridAPI.items.data($scope.gridId, projectMainCostGroupCatalogAssignmentDataService.getAssignments());
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
						projectMainCostGroupCatalogAssignmentDataService.createItem();
					},
					disabled: !projectMainCostGroupCatalogAssignmentDataService.canCreate()
				},
				{
					id: 'delete',
					sort: 10,
					caption: 'cloud.common.taskBarDeleteRecord',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-delete',
					fn: function () {
						projectMainCostGroupCatalogAssignmentDataService.deleteItem();
						updateItemList();
					},
					disabled: !projectMainCostGroupCatalogAssignmentDataService.canDelete()
				}
			]
		};

		function updateSelectedInAssignment() {
			var selectedEntity = platformGridAPI.rows.selection({
				gridId: $scope.gridId,
				wantsArray: false
			});
			projectMainCostGroupCatalogAssignmentDataService.setSelected(selectedEntity);
		}


		$scope.tools.update = function updateTools () {
			$scope.tools.version += 1;
		};

		function updateTools() {
			angular.forEach($scope.tools.items, function (item) {
				if (item.id === 'create') {
					item.disabled = !projectMainCostGroupCatalogAssignmentDataService.canCreate();
				}

				if (item.id === 'delete') {
					item.disabled = !projectMainCostGroupCatalogAssignmentDataService.canDelete();
				}
			});
			$scope.tools.update();
			platformGridAPI.grids.refresh($scope.gridId, true);
		}

		var settings = projectMainCostGroupCatalogAssignmentColumns.getStandardConfigForListView(basicsLookupdataConfigGenerator,
			projectMainCostGroupCatalogAssignmentDataService.validateCostGroupCatalogFk,
			projectMainCostGroupCatalogAssignmentDataService.validateIsProjectCatalog,
			projectMainCostGroupCatalogAssignmentValidationService);

		if (!settings.isTranslated) {
			platformTranslateService.translateGridConfig(settings.columns);
			settings.isTranslated = true;
		}

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			var grid = {
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

		function onSelectedRowsChanged(){
			updateSelectedInAssignment();
			updateTools();
		}
		function onCellModified() {
			projectMainCostGroupCatalogConfigurationService.readonlyRuntimeProcessor(null,true);
		}
		function onItemCountChanged() {
			if($scope.AssignmentsListCounter !== projectMainCostGroupCatalogAssignmentDataService.getAssignments().length) {
				projectMainCostGroupCatalogConfigurationService.readonlyRuntimeProcessor(null,true);
			}
		}

		function onEntityCreated(entity) {
			platformGridAPI.rows.add({gridId: $scope.gridId, item: entity});
			platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, entity);
		}

		function onRefreshEntity(entity) {
			platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: entity});
		}

		projectMainCostGroupCatalogAssignmentDataService.registerEntityCreated(onEntityCreated);
		projectMainCostGroupCatalogAssignmentDataService.registerEditableChanged(updateTools);
		projectMainCostGroupCatalogAssignmentDataService.registerProjectCatalogEnabledChanged(onRefreshEntity);

		var gridListener = $scope.$watch(function () {
			return $scope.gridCtrl !== undefined;
		}, function () {
			$timeout(function () {
				updateItemList();
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);
				platformGridAPI.events.register($scope.gridId, 'onItemCountChanged', onItemCountChanged);

				gridListener();
			}, 10);
		});



		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);
			platformGridAPI.events.unregister($scope.gridId, 'onItemCountChanged', onItemCountChanged);
			projectMainCostGroupCatalogAssignmentDataService.unregisterEntityCreated(onEntityCreated);
			projectMainCostGroupCatalogAssignmentDataService.unregisterEditableChanged(updateTools);
			projectMainCostGroupCatalogAssignmentDataService.unregisterProjectCatalogEnabledChanged(onRefreshEntity);
		});
	}
})();