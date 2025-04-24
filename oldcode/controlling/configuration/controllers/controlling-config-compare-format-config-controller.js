/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'controlling.configuration';

	angular.module(moduleName).controller('controllingConfigCompareFormatConfigController', [
		'_',
		'$timeout',
		'$scope',
		'$translate',
		'platformModalService',
		'platformGridAPI',
		'platformGridControllerService',
		'controllingConfigCompareFormatConfigDataService',
		'controllingConfigVersionCompareDetailDialogDataService',
		function (
			_,
			$timeout,
			$scope,
			$translate,
			platformModalService,
			platformGridAPI,
			platformGridControllerService,
			controllingConfigCompareFormatConfigDataService,
			compareDetailDialogDataService
		){
			$scope.gridId = '75b8d6ca47ae4b5aaaa01ace712450c8';

			$scope.modalOptions.headerText = $translate.instant('controlling.configuration.compareConditionFormattingConfig');

			let gridConfig = {
				columns: [],
				type: 'CompareFormatConfig',
				skipPermissionCheck: true,
				grouping: false,
				enableColumnReorder: false,
				enableConfigSave: false
			};
			let dataService = controllingConfigCompareFormatConfigDataService.getService();
			let columns = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'conditionScript',
								field: 'Script',
								name: 'Condition',
								name$tr$: 'controlling.configuration.condition',
								editor: 'description',
								formatter: function (row, cell, value, columnDef, dataContext) {
									let rs;
									let errorMsg = '';

									// can not be empty
									if (_.isEmpty(value)) {
										errorMsg = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {
											fieldName: $translate.instant('controlling.configuration.compareConditionFormatterCondition')
										}
										);
										rs = '<div class="invalid-cell" title="' + errorMsg + '">' + value + '</div>';
									}
									else if (dataService.validateReduplicateField(dataContext)) {
										errorMsg = $translate.instant('controlling.configuration.repeatedCondition');
										rs = '<div class="invalid-cell" title="' + errorMsg + '">' + value + '</div>';
									}
									else {
										rs = value;
									}

									dataContext.hasErrors = errorMsg !== '';

									return rs;
								},
								width: 250,
								searchable: true,
								validator: function (item, value, field) {
									item[field] = value;

									let list = _.filter(dataService.getList(), (i)=> item.Id !== i.Id && i.hasErrors);

									if(list.length === 0){
										return;
									}

									_.forEach(list, (i)=>{
										platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: i});
									});
								}
							},
							{
								id: 'conditionFormat',
								field: 'Style',
								name: 'Format',
								name$tr$: 'controlling.configuration.format',
								width: 250,
								searchable: true
							}
						]
					};
				}
			};

			dataService.readonly = compareDetailDialogDataService.readonly;

			let toolbarItems = [
				{
					id: 'create',
					sort: 20,
					caption: 'cloud.common.taskBarNewRecord',
					iconClass: 'tlb-icons ico-rec-new',
					type: 'item',
					fn: function () {
						dataService.createItem();
					},
					disabled: function (){
						return dataService.readonly;
					}
				},
				{
					id: 'delete',
					sort: 30,
					caption: 'cloud.common.taskBarDeleteRecord',
					iconClass: 'tlb-icons ico-rec-delete',
					type: 'item',
					fn: function () {
						dataService.deleteItem(dataService.getSelected());
					},
					disabled: function (){
						return dataService.readonly;
					}
				},
				{
					id: 't109',
					sort: 40,
					caption: $translate.instant('controlling.configuration.aboutTheConditions'),
					type: 'item',
					iconClass: 'tlb-icons ico-question',
					fn: function() {
						let dialogScope = $scope.$new(true);
						dialogScope.onOK = function () {
							this.$close({isOK: true, data: {}});
						};
						return platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'controlling.configuration/templates/comparison-format-explain.html',
							backdrop: false,
							width: '640px',
							scope: dialogScope
						});
					}
				},
				{
					id: 'd3',
					sort: 60,
					type: 'divider'
				}
			];

			$scope.onContentResized = function () {};
			$scope.setTools = function (tools) {
				tools.items = toolbarItems;
				$scope.tools = tools;
				$scope.tools.update = function () {
				};
			};

			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}

			$scope.sampleText = $translate.instant('controlling.configuration.sampleText');
			$scope.styleHandle = {
				setEditorStyle: function () {},

				// call this method from directive
				updateStyleCallback: function (currentStyle) {
					if(dataService.readonly){
						return;
					}
					dataService.getSelected().Style = currentStyle;
					dataService.gridRefresh();
				}
			};

			$scope.onOK = function () {
				let formatter = {};
				let itemList = dataService.getList();
				_.forEach(itemList, function (item) {
					formatter[item.Script] = item.Style;
				});

				let formatterJson = angular.toJson(formatter);
				formatterJson = formatterJson === '{}' ? '' : formatterJson;
				$scope.$close({isOK: true, data: formatterJson});
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close({isOK: false});
			};

			platformGridControllerService.initListController($scope, columns, dataService, null, gridConfig);
			dataService.gridId = $scope.gridId;
			dataService.conditionalFormat = $scope.$parent.modalOptions.conditionalFormat;

			$timeout(function () {
				platformGridAPI.grids.resize($scope.gridId);
				dataService.load();

				// set the first row's style into directive
				dataService.registerSelectionChanged(onSelectedChange);

				let currentItem = _.head(dataService.getList());
				if (currentItem && Object.getOwnPropertyNames(currentItem).length > 0) {
					$scope.styleHandle.initStyle = currentItem.Style;
					dataService.setSelected(currentItem);
				}
			});

			$scope.hasErrors = function checkForErrors() {
				return  dataService.hasAnyError() || $scope.isLoading || dataService.readonly;
			};

			function onSelectedChange() {
				if (!dataService.getSelected()) {
					let currentItem = _.head(dataService.getList());
					dataService.setSelected(currentItem);
					return;
				}
				let currentStyle = dataService.getSelected().Style;
				$scope.styleHandle.setEditorStyle(currentStyle);
			}

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(onSelectedChange);
			});
		}
	]);

})(angular);