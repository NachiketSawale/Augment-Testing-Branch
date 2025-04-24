/**
 * Created by benny on 12.06.2017.
 */
(function () {
	/* global Slick, _ */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 @ngdoc controller
	 * @name boqMainCatalogAssignDetailsController
	 * @function
	 *
	 * @description
	 * Controller for the boq catalog assign Details view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('boqMainCatalogAssignDetailsController',
		['$rootScope', '$scope', '$timeout', 'boqMainTranslationService', 'platformGridAPI', 'platformCreateUuid', 'platformRuntimeDataService', 'basicsLookupdataConfigGenerator', 'boqMainCatalogAssignDetailsService',
			'boqMainCatalogAssignCatalogLookupService',
			'basicsLookupdataLookupFilterService',
			'boqMainCatalogAssignCostgroupLookupService',
			function ($rootScope, $scope, $timeout, boqMainTranslationService, platformGridAPI, platformCreateUuid, platformRuntimeDataService, basicsLookupdataConfigGenerator, boqMainCatalogAssignDetailsService,
				boqMainCatalogAssignCatalogLookupService,
				filterService,
				boqMainCatalogAssignCostgroupLookupService) {

				var gridColumns = [
					{
						id: 'CtlgName',
						field: 'GaebName',
						name: 'GAEB Catalog Name',
						name$tr$: 'boq.main.CtlgName',
						editor: 'description',
						readonly: false,
						formatter: 'description',
						width: 120
					},
					{
						id: 'CtlgType',
						field: 'GaebId',
						name: 'GAEB Catalog Type',
						name$tr$: 'boq.main.CtlgType',
						editor: 'lookup',
						editorOptions: {
							directive: 'boq-main-catalog-assignment-gaeb-type-combobox',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'boqMainCatalogAssignmentGaebType',
							dataServiceName: 'boqCatalogAssignGaebLookupDataService',
							displayMember: 'Description'
						},
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
								projectId: boqMainCatalogAssignDetailsService.getProjectId(),
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											var readonly = boqMainCatalogAssignDetailsService.getPropertiesReadOnly();
											if (args.selectedItem) {
												if (args.selectedItem.Id !== 15) {
													// Reset possibly set properties only valid when Id is 15,
													// i.e. the structure is set to project cost groups
													args.entity.Code = '';
													args.entity.DescriptionsInfo = null;
													args.entity.CatalogSourceFk = null;
												}

												platformRuntimeDataService.readonly(args.entity, [
													{field: 'Code', readonly: readonly || args.selectedItem.Id !== 15},
													{field: 'DescriptionInfo', readonly: readonly || args.selectedItem.Id !== 15},
													{field: 'CatalogSourceFk', readonly: readonly || args.selectedItem.Id !== 15}
												]);
											}
										}
									}
								]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'boqMainCatalogAssignCatalogLookup',
							// dataServiceName: 'boqMainCatalogAssignCatalogLookupService',
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
								projectId: boqMainCatalogAssignDetailsService.getProjectId(),
								lineItemContextId: boqMainCatalogAssignCostgroupLookupService.getLineItemContextId(),
								showLicCatalogsOnly: false,
								addNewItem: false,
								disableDataCaching: true,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if (args.selectedItem) {
												angular.noop();
											}
										}
									}
								]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'boqMainCatalogAssignCostgroupLookup',
							// dataServiceName: 'boqMainCatalogAssignCostgroupLookupService',
							valueMember: 'Id',
							displayMember: 'Code'
						},
						width: 120
					},
					{
						id: 'CostGroupCatalogCode',
						field: 'Code',
						name: 'New Catalog Code',
						name$tr$: 'boq.main.newcostgroupcatcode',
						editor: 'description',
						readonly: true,
						formatter: 'description',
						width: 120
					},
					{
						id: 'CostGroupCatalogDescription',
						field: 'DescriptionInfo',
						name: 'Catalog Description',
						name$tr$: 'boq.main.newcostgroupcatDescr',
						editor: 'description',
						readonly: true,
						formatter: 'translation',
						width: 150
					},
					{
						id: 'CatalogSourceFk',
						field: 'CatalogSourceFk',
						name: 'Source Catalog',
						name$tr$: 'boq.main.catalogsourcefk',
						editor: 'lookup',
						editorOptions: {
							directive: 'boq-main-catalog-assign-costgroup-combobox',
							lookupOptions: {
								showClearButton: true,
								showLicCatalogsOnly: true,
								lineItemContextId: boqMainCatalogAssignCostgroupLookupService.getLineItemContextId(),
								addNewItem: false,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if (args.selectedItem) {
												args.entity.DescriptionsInfo = args.selectedItem.DescriptionsInfo;
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
						id: 'CatalogAssignmentMode',
						field: 'SearchMode',
						name: 'Assignment Mode',
						name$tr$: 'boq.main.CatalogAssignmentMode',
						editor: 'lookup',
						editorOptions: {
							directive: 'boq-main-catalog-assignment-mode-combobox',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'boqMainCatalogAssignmentMode',
							dataServiceName: 'boqCatalogAssignModeLookupDataService',
							displayMember: 'Description'
						},
						width: 180
					}

				];

				$scope.gridId = platformCreateUuid();

				var initGridColumns = function () {
					// add translation to the column name
					angular.forEach(gridColumns, function (value) {
						if (angular.isUndefined(value.name$tr$)) {
							value.name$tr$ = moduleName + '.' + value.field;
						}
					});
				};

				initGridColumns();

				function onCellModified(/* e, arg */) {
					var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});

					if (selected) {
						boqMainCatalogAssignDetailsService.setCurrentCatalogDetail(selected);
					}

					boqMainCatalogAssignDetailsService.catalogDetailsModified.fire();
				}

				function onSelectedRowsChanged(/* e, arg */) {
					var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});

					if (selected) {
						boqMainCatalogAssignDetailsService.setCurrentCatalogDetail(_.isArray(selected) ? selected[0] : selected);
						var readOnly = boqMainCatalogAssignDetailsService.getPropertiesReadOnly();
						editTools(!readOnly);
					}
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var gridConfig = {
						data: boqMainCatalogAssignDetailsService.getList(),
						columns: angular.copy(gridColumns),
						id: $scope.gridId,
						lazyInit: true,
						isStaticGrid: true,
						options: {
							tree: false, indicator: true, allowRowDrag: false,
							editable: true,
							asyncEditorLoading: true,
							autoEdit: false,
							enableCellNavigation: true,
							enableColumnReorder: false,
							selectionModel: new Slick.RowSelectionModel(),
							showItemCount: false
						}
					};
					// setCatalogDetailReadOnly(gridConfig.data);
					platformGridAPI.grids.config(gridConfig);
					platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);
					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				} else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.createItem = function () {
					boqMainCatalogAssignDetailsService.createItem();
				};

				$scope.deleteItem = function () {
					boqMainCatalogAssignDetailsService.deleteItem();
				};

				// Define standard toolbar Icons and their function on the scope
				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't1',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: $scope.createItem,
							disabled: true
						},
						{
							id: 't2',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							fn: $scope.deleteItem,
							disabled: true
						}
					]
				};

				$scope.tools.update = function () {
				};

				function updateCatalogDetails() {
					var items = boqMainCatalogAssignDetailsService.getList();
					setCatalogDetailReadOnly(items);
					platformGridAPI.items.data($scope.gridId, items);
				}

				// selected item change event
				function updateSelection(editVal/* , discAllowed */) {
					editTools(editVal);

					var currentCatalogDetails = boqMainCatalogAssignDetailsService.getCurrentCatalogDetail();
					if (angular.isDefined(currentCatalogDetails) && angular.isDefined(currentCatalogDetails.Id)) {
						platformGridAPI.rows.selection({
							gridId: $scope.gridId,
							rows: [currentCatalogDetails]
						});
					}
				}

				// set toolbar items editable or readonly
				function editTools(isEditable) {
					if ($scope.tools && $scope.tools.items) {
						angular.forEach($scope.tools.items, function (item) {
							item.disabled = !isEditable;
							if (item.id === 't2') {
								var currentCatalogDetails = boqMainCatalogAssignDetailsService.getCurrentCatalogDetail();
								// selected item is empty
								item.disabled = item.disabled || !currentCatalogDetails;
							}
						});
					}
				}

				// set all items readonly or editable
				function setReadOnly(items, isReadOnly) {
					var fields = [],
						item = _.isArray(items) ? items[0] : null;

					_.forOwn(item, function (value, key) {
						var field = {field: key, readonly: isReadOnly};
						fields.push(field);
					});

					angular.forEach(items, function (item) {
						if (item && item.Id) {
							platformRuntimeDataService.readonly(item, fields);

							// Take care not to make too much of the fields editable
							if (!isReadOnly) {
								platformRuntimeDataService.readonly(item, [
									{field: 'Code', readonly: item.BoqCatalogFk !== 15},
									{field: 'DescriptionInfo', readonly: item.BoqCatalogFk !== 15},
									{field: 'CatalogSourceFk', readonly: item.BoqCatalogFk !== 15}
								]);
							}
						}
					});

				}

				function setCatalogDetailReadOnly(catalogDetail) {
					var readOnly = boqMainCatalogAssignDetailsService.getPropertiesReadOnly();

					if (angular.isUndefined(catalogDetail) || (catalogDetail === null)) {
						return;
					}
					var strDetails = angular.isArray(catalogDetail) ? catalogDetail : [catalogDetail];
					setReadOnly(strDetails, readOnly);
				}

				$timeout(function () {
					var readOnly = boqMainCatalogAssignDetailsService.getPropertiesReadOnly();
					updateCatalogDetails();
					editTools(!readOnly);
					platformGridAPI.grids.resize($scope.gridId);
				});

				function updatetools() {
					var readOnly = boqMainCatalogAssignDetailsService.getPropertiesReadOnly();
					editTools(!readOnly);
				}

				boqMainCatalogAssignDetailsService.catalogDetailsChanged.register(updateCatalogDetails);
				boqMainCatalogAssignDetailsService.selectedCatalogDetailChanged.register(updateSelection);
				boqMainCatalogAssignDetailsService.editCatalogChanged.register(updatetools);

				boqMainTranslationService.loadTranslations();
				boqMainTranslationService.translateGridConfig(gridColumns);

				$scope.$on('$destroy', function () {
					boqMainCatalogAssignDetailsService.catalogDetailsChanged.unregister(updateCatalogDetails);
					boqMainCatalogAssignDetailsService.selectedCatalogDetailChanged.unregister(updateSelection);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
					// clear cache data in service
					boqMainCatalogAssignDetailsService.clearData();
					boqMainCatalogAssignDetailsService.editCatalogChanged.unregister(updatetools);
					boqMainCatalogAssignCostgroupLookupService.clearData();
					// boqMainCatalogAssignDetailsService.unregisterFilter(); --> since a service is static, the filter will be removed permanently!
				});

			}
		]);
})();