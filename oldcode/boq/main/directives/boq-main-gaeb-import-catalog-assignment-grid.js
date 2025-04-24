/**
 * Created by reimer on 20.03.2017.
 */

(function () {

	/* global */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name
	 * @requires
	 * @description
	 */
	angular.module('boq.main').directive('boqMainGaebImportCatalogAssignmentGrid',
		['platformGridAPI',
			'basicsLookupdataLookupFilterService',
			'platformRuntimeDataService',
			'boqMainCatalogAssignCatalogLookupService',
			'boqMainCatalogAssignCostgroupLookupService',
			function (platformGridAPI,
				basicsLookupdataLookupFilterService,
				platformRuntimeDataService,
				boqMainCatalogAssignCatalogLookupService,
				boqMainCatalogAssignCostgroupLookupService) {

				var controller = ['$scope', function ($scope) {

					var gridColumns = [
						{
							id: 'CtlgName',
							field: 'CtlgName',
							name: 'GAEB Catalog Name',
							name$tr$: 'boq.main.CtlgName',
							editor: null,
							readonly: true,
							formatter: 'description',
							width: 120
						},
						{
							id: 'CtlgType',
							field: 'CtlgType',
							name: 'GAEB Catalog Type',
							name$tr$: 'boq.main.CtlgType',
							editor: null,
							readonly: true,
							formatter: 'description',
							width: 120
						},

						{
							id: 'BoqCatalogFk',
							field: 'BoqCatalogFk',
							name: 'Structure',
							name$tr$: 'boq.main.costgroupcatcode',
							editor: 'lookup',
							editorOptions: {
								directive: 'boq-main-catalog-assign-catalog-combobox',
								lookupOptions: {
									showClearButton: true,
									projectId: $scope.ngModel.ProjectId,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												if (args.selectedItem) {
													args.entity.BoqCatalogFk = args.selectedItem.Id;
													setupEntity(args.entity);
												}
											}
										}
									]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'boqMainCatalogAssignCatalogLookup',
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Translated'
							},
							width: 120
						},

						{
							id: 'BasCostgroupCatFk',
							field: 'BasCostgroupCatFk',
							name: 'Cost Group',
							name$tr$: 'boq.main.costgroupgroupcode',
							editor: 'lookup',
							editorOptions: {
								directive: 'boq-main-catalog-assign-costgroup-combobox',
								lookupOptions: {
									showClearButton: true,
									projectId: $scope.ngModel.ProjectId,
									showLicCatalogsOnly: false,
									addNewItem: true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												if (args.selectedItem) {
													// args.entity.IsProjectCatalog = args.selectedItem.IsProjectCatalog;
													args.entity.IsNewCatalog = args.selectedItem.IsNewItem;
													if (!args.entity.IsNewCatalog) {
														args.entity.CostGroupCatalogDescription = args.selectedItem.DescriptionInfo.Description;
														args.entity.CostGroupCatalogCode = args.selectedItem.Code;
													}
													setupEntity(args.entity);
												}
											}
										}
									]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'boqMainCatalogAssignCostgroupLookup',
								valueMember: 'Id',
								displayMember: 'Code'
							},
							width: 120
						},

						{
							id: 'CostGroupCatalogCode',
							field: 'CostGroupCatalogCode',
							name: 'New Catalog Code',
							name$tr$: 'boq.main.newcostgroupcatcode',
							editor: 'description',
							readonly: true,
							formatter: 'description',
							width: 120
						},
						{
							id: 'CostGroupCatalogDescription',
							field: 'CostGroupCatalogDescription',
							name: 'Catalog Description',
							name$tr$: 'boq.main.newcostgroupcatDescr',
							editor: 'description',
							readonly: true,
							formatter: 'description',
							width: 150
						},
						{
							id: 'CatalogAssignmentMode',
							field: 'CatalogAssignmentMode',
							name: 'Assignment Mode',
							name$tr$: 'boq.main.CatalogAssignmentMode',
							editor: 'lookup',
							editorOptions: {
								directive: 'boq-main-catalog-assignment-mode-combobox',
								lookupOptions: {
									showClearButton: false
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'boqMainCatalogAssignmentMode',
								displayMember: 'Description'
							},
							width: 150
						}

					];

					$scope.gridId = '6f378badd6724fda8a3c2b95d3068011';

					$scope.gridData = {
						state: $scope.gridId
					};

					if (!platformGridAPI.grids.exist($scope.gridId)) {
						var grid = {
							data: [],
							columns: gridColumns,
							id: $scope.gridId,
							options: {
								tree: false,
								indicator: true,
								iconClass: '',
								idProperty: 'CtlgID',
								enableDraggableGroupBy: false
							},
							lazyInit: true,
							enableConfigSave: false
						};
						platformGridAPI.grids.config(grid);
					}

					var boqHasProjectRef = $scope.ngModel.ProjectId !== 0;  // default
					var filters = [{
						key: 'gaeb-catalog-filter',
						fn: function (item) {
							return boqHasProjectRef ? true : item.HasProjectRef === false;
						}
					}];
					basicsLookupdataLookupFilterService.registerFilter(filters);

					var init = function () {
						angular.forEach($scope.ngModel.Catalogs, function (entity) {
							setupEntity(entity);
						});
						platformGridAPI.items.data($scope.gridId, $scope.ngModel.Catalogs);

						boqMainCatalogAssignCostgroupLookupService.setSelectedProjectId($scope.ngModel.ProjectId);
					};
					init();

					function setupEntity(entity) {
						var canSelectCostGroup = boqMainCatalogAssignCatalogLookupService.isCostGroup(entity.BoqCatalogFk);
						if (!canSelectCostGroup) {
							entity.BasCostgroupCatFk = null;
							entity.CostGroupCatalogCode = null;
							entity.CostGroupCatalogDescription = null;
						}
						platformRuntimeDataService.readonly(entity, [
							{field: 'BasCostgroupCatFk', readonly: !canSelectCostGroup},
							{field: 'CostGroupCatalogCode', readonly: !entity.IsNewCatalog || !canSelectCostGroup},
							{field: 'CostGroupCatalogDescription', readonly: !entity.IsNewCatalog || !canSelectCostGroup}
						]);
					}

					$scope.$on('$destroy', function () {
						basicsLookupdataLookupFilterService.unregisterFilter(filters);
						boqMainCatalogAssignCostgroupLookupService.clearData();
						if (platformGridAPI.grids.exist($scope.gridId)) {
							platformGridAPI.grids.unregister($scope.gridId);
						}
					});

				}];

				var template =
					'<div class="flex-box flex-column" style="height: 150px;"> <div data-platform-grid class="subview-container" data-data="gridData"></div> </div>';

				return {

					restrict: 'A',

					scope: {
						ngModel: '='
					},

					template: template,

					controller: controller

				};

			}]);

})();
