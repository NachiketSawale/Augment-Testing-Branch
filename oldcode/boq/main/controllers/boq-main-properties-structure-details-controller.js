/**
 * Created by joshi on 14.08.2014.
 */
(function () {
	/* global _, Slick */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 @ngdoc controller
	 * @name boqMainStructureDetailsController
	 * @function
	 *
	 * @description
	 * Controller for the Document Properties Structure Details view.
	 */
	/* jshint -W072 */ // function has too many parameters
	angular.module(moduleName).controller('boqMainStructureDetailsController',
		['$scope', 'platformObjectHelper', 'cloudCommonLanguageService', 'boqMainDocPropertiesService', '$timeout', 'boqMainTranslationService', 'platformGridAPI', 'platformCreateUuid', 'platformRuntimeDataService', '$injector', 'boqMainCommonService',
			function ($scope, platformObjectHelper, cloudCommonLanguageService, boqMainDocPropertiesService, $timeout, boqMainTranslationService, platformGridAPI, platformCreateUuid, platformRuntimeDataService, $injector, boqMainCommonService) {

				var gridColumns = [
					{
						id: 'lineTyp',
						field: 'BoqLineTypeFk',
						name: 'Boq Line Type',
						width: 170,
						toolTip: 'LineType list',
						formatter: boqMainDocPropertiesService.strDetailEditorFormatter
					},
					{
						id: 'dec',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						toolTip: 'Description',
						editor: 'directive',
						editorOptions: {
							directive: 'basics-common-translate-cell',
							dataService: 'estimateMainEstTotalsConfigDetailDataService',
							containerDataFunction: 'getContainerData'
						},
						width: 170,
						formatter: 'translation'
					},
					{
						id: 'typ',
						domain: 'select',
						editor: 'select',
						editorOptions: {
							serviceName: 'boqMainStructureDetailsTypeService',
							serviceMethod: 'getTypes',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						formatter: 'select',
						field: 'DataType',
						name: 'Data Type',// t.instant('scheduling.main.chart-settings.template'),
						width: 80,
						toolTip: 'Data Type'
					},
					{
						id: 'length',
						field: 'LengthReference',
						name: 'Length Reference',
						domain: 'integer',
						editor: 'integer',
						width: 100,
						toolTip: 'Length',
						formatter: 'integer'
					},
					{
						id: 'val',
						field: 'StartValue',
						name: 'Start Value',
						domain: 'description',
						editor: 'description',
						width: 80,
						toolTip: 'Start Value',
						formatter: 'description'
					},
					{
						id: 'stepInc',
						field: 'Stepincrement',
						name: 'Step Increment',
						domain: 'integer',
						editor: 'integer',
						width: 100,
						toolTip: 'Increment',
						formatter: 'integer'
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
						boqMainDocPropertiesService.setCurrentStrDetail(selected);
						boqMainDocPropertiesService.setStrDetailAsModified(selected);
						boqMainDocPropertiesService.setModifiedDocProperties(boqMainDocPropertiesService.getSelectedDocProp());
					}
				}
				function onSelectedRowsChanged(e, arg) {
					var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});
					if (selected) {
						boqMainDocPropertiesService.setCurrentStrDetail(_.isArray(selected) ? selected[0] : selected);
						setTranslateInstance(selected);
					}

					var currentItem = boqMainDocPropertiesService.getCurrentStrDetail();
					if (currentItem) {
						var readOnly = boqMainDocPropertiesService.arePropertiesReadOnly(true);
						if (readOnly) {
							editTools(false);
						} else {
							editTools(true);

							// But in the special case of a position or index detail line deactivate the delete button
							if (currentItem.BoqLineTypeFk === 0 || currentItem.BoqLineTypeFk === 10) {
								if (!boqMainDocPropertiesService.getRenumberMode()) {
									angular.forEach($scope.tools.items, function (item) {
										if (item.id === 't2') {
											item.disabled = true;
										}
									});
								}
							}
						}

						setStructureDetailReadOnly(currentItem);
						platformGridAPI.grids.refresh($scope.gridId);
					}
				}

				function onchangedTranslationItem() {
				}

				function setTranslateInstance(instance) {
					var colHeader = [];
					var colLength = [];
					var colDescriptor = [];
					var colField = [];
					var opt = {
						uid: 'estimateMainEstTotalsConfigDetailDataService',
						title: 'Title',
						columns: [
							{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo'
							}]
					};

					if (instance && instance.Id && instance.Id !== 0) {
						angular.forEach(opt.columns, function (col) {
							colHeader.push(col.header);
							colLength.push(col.maxLength || 42);
							colDescriptor.push(platformObjectHelper.getValue(instance, col.field));
							colField.push(col.field);
						});

						cloudCommonLanguageService.setLanguageItem({
							viewIdentifier: opt.uid,
							containerInfoText: opt.title,
							columnHeaderNames: colHeader,
							columnFields: colField,
							languageDescriptorsMaxLen: colLength,
							languageDescriptors: colDescriptor,
							autoSave: true,
							onChanged: onchangedTranslationItem
						});
					}
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var gridConfig = {
						data: boqMainDocPropertiesService.getStructureDetail(),
						columns: angular.copy(gridColumns),
						id: $scope.gridId,
						lazyInit: true,
						options: {
							tree: false, indicator: true, allowRowDrag: false,
							editable: true,
							asyncEditorLoading: true,
							autoEdit: false,
							enableCellNavigation: true,
							enableColumnReorder: false,
							selectionModel: new Slick.RowSelectionModel(),
							showItemCount: false,
						}
					};
					setStructureDetailReadOnly(gridConfig.data);
					platformGridAPI.grids.config(gridConfig);
					platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);
					platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.events.register($scope.gridId, 'onInitialized', updateStructureDetailsGrid);

				} else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.createItem = function () {
					boqMainDocPropertiesService.createItem();
				};

				$scope.deleteItem = function () {
					boqMainDocPropertiesService.deleteStrDetails();
				};

				// Define standard toolbar Icons and their function on the scope
				if (!boqMainDocPropertiesService.getRenumberMode()) {
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
				}

				function updateStructureDetailsGrid() {
					const hideDetails =  boqMainCommonService.isFreeBoqType(boqMainDocPropertiesService.getSelectedDocProp()) ||
															(boqMainCommonService.isGaebBoqType(boqMainDocPropertiesService.getSelectedDocProp()) && !boqMainDocPropertiesService.getSelectedDocProp().EnforceStructure);
					var columns = platformGridAPI.columns.configuration($scope.gridId);
					if (columns) {
						_.forEach(columns.current, function(column) {
							column.hidden = hideDetails;
						});
						platformGridAPI.columns.configuration($scope.gridId, columns.current);
						platformGridAPI.grids.refresh(        $scope.gridId);
					}
					editTools(!boqMainDocPropertiesService.arePropertiesReadOnly(true) && !hideDetails);
				}

				function updateStructureDetails() {
					var items = boqMainDocPropertiesService.getStructureDetail();
					setStructureDetailReadOnly(items);
					items = boqMainDocPropertiesService.setBoqLineType(items);
					platformGridAPI.items.data($scope.gridId, items);

					updateStructureDetailsGrid();
				}

				function updateSelection(editVal, discAllowed) {
					editTools(editVal);

					var currentStrDetails = boqMainDocPropertiesService.getCurrentStrDetail();
					if (angular.isDefined(currentStrDetails) && angular.isDefined(currentStrDetails.Id)) {
						platformGridAPI.rows.selection({
							gridId: $scope.gridId,
							rows: [currentStrDetails]
						});

						allowDiscount(editVal, discAllowed);
					}
				}

				function allowDiscount(editVal, discAllowed) {
					if (!discAllowed) {
						var items = boqMainDocPropertiesService.getStructureDetail();
						setStructureDetailReadOnly(items);
						angular.forEach(items, function (item) {
							item.DiscountAllowed = false;
						});
						boqMainDocPropertiesService.updateAllowedDiscountDetail(items);
					}

					// 'editVal' war mal für einen setReadonly call. Im Moment nicht mehr nötig.
				}

				// set toolbar items editable or readonly
				function editTools(isEditable) {
					if (!boqMainDocPropertiesService.getRenumberMode()) {
						angular.forEach($scope.tools.items, function (item) {
							item.disabled = (isEditable) ? false : true;
						});
					}
				}

				function getStructureDetailFields() {
					var fields = [];

					if ($scope.gridId && platformGridAPI.grids.exist($scope.gridId)) {
						var cols = platformGridAPI.columns.configuration($scope.gridId);

						if (angular.isDefined(cols) && (cols !== null) && cols.current) {
							angular.forEach(cols.current, function (col) {
								if (!_.isEmpty(col.field)) {
									fields.push(col.field);
								}
							});
						}
					}

					return fields;
				}

				function setStructureDetailReadOnly(structureDetail) {
					if (angular.isUndefined(structureDetail) || (structureDetail === null)) {
						return;
					}

					var readOnlyFields = getStructureDetailFields();
					var boqMainCommonService = $injector.get('boqMainCommonService');

					if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null)) {
						let additionalInfo = {}; // Emtpy object that will be filled with additional info
						let readOnly = boqMainDocPropertiesService.arePropertiesReadOnly(true, additionalInfo);
						let fields = _.map(readOnlyFields, function (field) {
							var tmpReadonly = readOnly;
							if (readOnly && (field === 'StartValue' || field === 'Stepincrement') && !additionalInfo.doesHaveMultipleVersionBoqs) {
								var props = boqMainDocPropertiesService.getSelectedDocProp();
								if (props && boqMainCommonService.isGaebBoqType(props) && !boqMainDocPropertiesService.isDefaultStructure()) {
									tmpReadonly = false;
								}
							}

							return {field: field, readonly: tmpReadonly};
						});

						var strDetails = angular.isArray(structureDetail) ? structureDetail : [structureDetail];
						angular.forEach(strDetails, function (strDetail) {
							platformRuntimeDataService.readonly(strDetail, fields);
						});
					}
				}

				$timeout(function () {
					var readOnly = boqMainDocPropertiesService.arePropertiesReadOnly(true);
					editTools(!readOnly);
					platformGridAPI.grids.resize($scope.gridId);
				});

				boqMainDocPropertiesService.structureDetailsChanged.register(updateStructureDetails);
				boqMainDocPropertiesService.selectedStrDetailChanged.register(updateSelection);
				boqMainDocPropertiesService.setAllowedDiscount.register(allowDiscount);

				boqMainTranslationService.loadTranslations();
				boqMainTranslationService.translateGridConfig(gridColumns);

				$scope.$on('$destroy', function () {
					boqMainDocPropertiesService.structureDetailsChanged.unregister(updateStructureDetails);
					boqMainDocPropertiesService.selectedStrDetailChanged.unregister(updateSelection);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.events.unregister($scope.gridId, 'onInitialized', updateStructureDetailsGrid);
					boqMainDocPropertiesService.setAllowedDiscount.unregister(allowDiscount);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
				});
			}
		]);
})();
