(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).directive('propertyFilterGridDirective', [
		'$translate', 'platformObjectHelper', 'basicsCommonDialogGridControllerService',
		'constructionsystemCommonFilterServiceCache',
		function ($translate, platformObjectHelper, dialogGridControllerService, filterServiceCache) {

			return {
				restrict: 'A',
				scope: false,
				replace: true,
				templateUrl: globals.appBaseUrl + 'constructionsystem.common/templates/property-filter-grid.html',
				controller: ['$scope', '_', controller]
			};

			function controller($scope, _) {
				// get data from parent scope, get the parent servie
				var mainDataService = $scope.parentService;
				$scope.parentServiceName = mainDataService.getServiceName();

				var dataService = filterServiceCache.getService('constructionsystemCommonPropertyFilterGridDataService', $scope.parentServiceName);
				var validateService = filterServiceCache.getService('constructionsystemCommonPropertyFilterValidationService', $scope.parentServiceName);

				// get data from parent scope, model id may be null,
				// null is not limit the property key by the model,
				// and show all the property.
				// var currentModelId = $scope.currentModelId;

				var gridConfig = {
					uuid: $scope.gridUUID,
					initCalled: false,
					columns: [],
					grouping: false
				};

				var columnDef = {
					getStandardConfigForListView: function () {
						return {
							addValidationAutomatically: true,
							columns: [
								{
									id: 'propertyname',
									field: 'PropertyId',
									name: 'Property Id',
									name$tr$: 'constructionsystem.master.entityPropertyName',
									width: 200,
									editor: 'lookup',
									editorOptions: {
										directive: 'construction-system-common-model-object-property-combobox',
										lookupOptions: {
											lookupType: 'CosPropertyKeyLookup',
											displayMember: 'PropertyName'
										}
									},
									searchable: true,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'CosPropertyKeyLookup',
										displayMember: 'PropertyName'
									}
								},
								{
									id: 'valuetype',
									field: 'ValueType',
									name: 'Value Type',
									name$tr$: 'model.main.propertyValueType',
									width: 150,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'constructionsystemCommonPropertyValueTypeService',
										displayMember: 'description'
									},
									searchable: true
								},
								{
									id: 'operation',
									field: 'Operation',
									name: 'Operator',
									name$tr$: 'constructionsystem.common.filterGrid.operator',
									width: 120,
									searchable: true,
									editor: 'lookup',
									editorOptions: {
										directive: 'property-filter-operation-combobox',
										lookupOptions: {
											lookupType: 'CosPropertyFilterOperation',
											displayMember: 'Description',
											valueMember: 'Id',
											filter: function (item, lookupItem) {
												if (lookupItem.OpType === 1) {
													return true;
												}
												if (item.ValueType) {
													var opForValueType = Math.pow(2, item.ValueType);
													return (lookupItem.OpType & opForValueType) === opForValueType;
												}
												return false;
											}
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'CosPropertyFilterOperation',
										displayMember: 'Description',
										valueMember: 'Id'
									}

								},
								{
									id: 'propertyvalue',
									field: 'PropertyValue',
									name: 'Value',
									name$tr$: 'constructionsystem.master.entityValue',
									width: 150,
									formatter: 'dynamic',
									editor: 'dynamic',
									domain: function (item) {
										var domain;
										switch (item.ValueType) {
											case 1:
												domain = 'comment';
												break;
											case 2:
												domain = 'decimal';
												break;
											case 3:
												domain = 'integer';
												break;
											case 4:
												domain = 'boolean';
												break;
											case 5:
												domain = 'datetime';
												break;
											default:
												domain = 'comment';
												break;
										}
										return domain;
									}
								}
							]
						};
					}
				};


				var toolbarItems = [
					{
						id: 'create',
						sort: 20,
						caption: 'cloud.common.taskBarNewRecord',
						iconClass: 'tlb-icons ico-rec-new',
						type: 'item',
						fn: function () {
							dataService.createItem();
						},
						disabled: function () {
							return !$scope.searchOptions.active;
						}
					},
					{
						id: 'delete',
						sort: 30,
						caption: 'cloud.common.taskBarDeleteRecord',
						iconClass: 'tlb-icons ico-rec-delete',
						type: 'item',
						fn: function () {
							dataService.deleteItem();
						},
						disabled: function () {
							return !$scope.searchOptions.active || !dataService.hasSelection();
						}
					},
					{
						id: 'd3',
						sort: 60,
						type: 'divider'
					}
				];

				$scope.$watch('searchOptions.active', function (newValue) {
					$scope.showInfoOverlay = !newValue;
				});

				$scope.setTools = function (tools) {
					var searchItems = _.filter(tools.items, function (item) {
						return item.iconClass === 'tlb-icons ico-search' ||
							item.iconClass === 'tlb-icons ico-search-all' ||
							item.iconClass === 'tlb-icons ico-search-column';
					});
					var settingItems = _.filter(tools.items, function (item) {
						return item.iconClass === 'tlb-icons ico-settings';
					});
					tools.items = [];
					if(searchItems){
						angular.forEach(searchItems,function (item) {
							tools.items.push(item);
						});
					}

					if(settingItems){
						angular.forEach(settingItems,function (item) {
							tools.items.push(item);
						});
					}

					tools.items = toolbarItems.concat(tools.items);

					// get filter toolbars
					var filterToolBar = _.filter($scope.tools.items, function (item) {
						return item.id === 'filter' || item.id === 'execute';
					});
					if (filterToolBar && filterToolBar.length > 0) {
						tools.items.push({
							id: 'd0',
							type: 'divider'
						});
						angular.forEach(filterToolBar, function (tb) {
							tools.items.push(tb);
						});
					}

					$scope.tools.items = tools.items;
				};

				dialogGridControllerService.initListController($scope, columnDef, dataService, validateService, gridConfig);

			}
		}
	]);
})(angular);
