(function(angular) {
	'use strict';

	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemCopyProjectLocationService', copyPrjLocationService);

	copyPrjLocationService.$inject = ['_', 'globals', '$q', '$http', '$injector',
		'platformGridAPI', 'platformLayoutHelperService', 'platformTranslateService'];

	function copyPrjLocationService(_, globals, $q, $http, $injector,
		platformGridAPI, platformLayoutHelperService, platformTranslateService) {
		let service = {};
		let scope = {};

		let getLocationConfig = function() {
			const uuid = '426d8b46a9b7404c8b808def2dfceff8';
			return {
				id: uuid,
				state: uuid,
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						width: 100,
						sortable: true,
						type: 'code',
						editor: 'code'
					},
					{
						id: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription',
						width: 120,
						sortable: true,
						editor: 'description'
					},
					{
						id: 'quantity',
						formatter: 'decimal',
						field: 'Quantity',
						name: 'Quantity',
						name$tr$: 'cloud.common.entityQuantity',
						editor: 'decimal',
						width: 100,
						sortable: true
					},
					{
						id: 'quantityPercent',
						formatter: 'decimal',
						field: 'QuantityPercent',
						name: 'QuantityPercent',
						name$tr$: 'productionplanning.item.selectProjectLocation.quantityPercent',
						editor: 'decimal',
						width: 100,
						sortable: true
					},
					{
						id: 'sorting',
						formatter: 'integer',
						field: 'Sorting',
						name: 'Sorting',
						name$tr$: 'cloud.common.entitySorting',
						editor: 'integer',
						width: 70,
						sortable: true
					}
				],
				lazyInit: true,
				options: {
					indicator: true,
					editable: false,
					idProperty: 'Id',
					tree: true,
					parentProp: 'LocationParentFk',
					childProp: 'Locations',
					multiSelect: false,
					hierarchyEnabled: true,
					skipPermissionCheck: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				tools: {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't7',
							sort: 60,
							caption: 'cloud.common.toolbarCollapse',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse',
							fn: function collapseSelected() {
								platformGridAPI.rows.collapseAllSubNodes(uuid);
							}
						},
						{
							id: 't8',
							sort: 70,
							caption: 'cloud.common.toolbarExpand',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand',
							fn: function expandSelected() {
								platformGridAPI.rows.expandAllSubNodes(uuid);
							}
						},
						{
							id: 't9',
							sort: 80,
							caption: 'cloud.common.toolbarCollapseAll',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse-all',
							fn: function collapseAll() {
								platformGridAPI.rows.collapseAllNodes(uuid);
							}
						},
						{
							id: 't10',
							sort: 90,
							caption: 'cloud.common.toolbarExpandAll',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand-all',
							fn: function expandAll() {
								platformGridAPI.rows.expandAllNodes(uuid);
							}
						}
					]
				}
			};
		};

		let getFormConfig = function(scope) {
			return {
				fid: 'productionplanning.item.copyprojectlocation',
				showGrouping: false,
				skipPermissionsCheck: true,
				groups: [{
					gid: 'baseGroup',
				}],
				rows: [
					_.assign(platformLayoutHelperService.provideProjectLookupOverload().detail,
						{
							gid: 'baseGroup',
							rid: 'project',
							label: 'Project',
							label$tr$: 'productionplanning.common.prjProjectFk',
							model: 'ProjectId',
							sortOrder: 1,
							visible: true,
							change: function(entity) {
								scope.dialog.modalOptions.value.projectId = entity.ProjectId;
								resetGrid();

								if (entity.ProjectId) {
									getPrjLocationsByProjectId(entity.ProjectId)
										.then(function(response) {
											if (response && response.data) {
												setGridItems(response.data);
											}
										});
								}
							}
						})
				]
			};
		};

		service.initial = function($scope) {
			scope = $scope;

			let formConfig = getFormConfig(scope);
			scope.formOptions = {
				configure: platformTranslateService.translateFormConfig(formConfig),
				entity: {}
			};

			let locationConfig = getLocationConfig();
			platformGridAPI.grids.config(locationConfig);
			scope.gridOptions = {
				locationGrid: locationConfig
			};

			scope.dialog.modalOptions.value.getSelectedLocationId = function() {
				let gridInstance = scope.gridOptions.locationGrid.instance;
				if (gridInstance) {
					let index = gridInstance.getSelectedRows();
					let selected = gridInstance.getDataItem(index[0]);
					return selected ? selected.Id : null;
				}
				return null;
			};
		};

		service.onInitialized = function() {
			let projectId = scope.dialog.modalOptions.dataItem.ProjectId;
			let projectLocationId = scope.dialog.modalOptions.dataItem.ProjectLocationId;
			if (projectLocationId) {
				getProjectFkOfPrjLocation(projectLocationId).then(function (response) {
					if (response && response.data && response.data !== -1) {
						projectId = response.data;
						scope.formOptions.entity = { ProjectId: projectId };
						scope.dialog.modalOptions.value.projectId = projectId;
						getPrjLocationsByProjectId(projectId).then(function (response) {
							if (response && response.data) {
								setGridItems(response.data);
								setSelectedPrjLocation(projectLocationId);
							}
						});
					}
				});
			} else if (projectId) {
				scope.formOptions.entity = { ProjectId: projectId };
				scope.dialog.modalOptions.value.projectId = projectId;
				getPrjLocationsByProjectId(projectId).then(function (response) {
					if (response && response.data) {
						setGridItems(response.data);
						setSelectedPrjLocation(projectLocationId);
					}
				});
			}
		};

		function resetGrid() {
			setGridItems([]);
		}

		function setGridItems(data) {
			setLocationImage(data);
			scope.gridOptions.locationGrid.dataView.setItems(data);
		}

		function setSelectedPrjLocation(prjLocationId) {
			if (prjLocationId) {
				let gridInstance = scope.gridOptions.locationGrid.instance;
				let gridData = gridInstance.getData();
				let selectedRow = gridData.getRowById(prjLocationId);
				gridInstance.setSelectedRows([selectedRow]);
			}
		}

		function setLocationImage(dataList) {
			let projectLocationMainImageProcessor = $injector.get('projectLocationMainImageProcessor');
			let cloudCommonGridService = $injector.get('cloudCommonGridService');

			let flatList = [];
			cloudCommonGridService.flatten(dataList, flatList, 'Locations');

			flatList.forEach(function(item) {
				projectLocationMainImageProcessor.processItem(item);
			});
		}

		function getPrjLocationsByProjectId(projectId) {
			let deferred = $q.defer();
			$http.get(globals.webApiBaseUrl + 'project/location/tree?projectId=' + projectId)
				.then(function (response) {
					deferred.resolve(response);
				});
			return deferred.promise;
		}

		function getProjectFkOfPrjLocation(prjLocationId) {
			let deferred = $q.defer();
			$http.get(globals.webApiBaseUrl + 'productionplanning/item/getprojectfkofprjlocation?mainItemId=' + prjLocationId)
				.then(function (response) {
					deferred.resolve(response);
				});
			return deferred.promise;
		}

		return service;
	}
})(angular);