/**
 * Created by wed on 6/25/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).directive('cosGroupHeaderContainer', cosGroupHeaderContainer);

	cosGroupHeaderContainer.$inject = [
		'_',
		'$http',
		'$timeout',
		'platformGridAPI',
		'cloudCommonGridService',
		'basicsLookupdataParentChildGridDataService',
		'constructionSystemMainHeaderService',
		'platformDataServiceSelectionExtension'
	];

	function cosGroupHeaderContainer(_, $http, $timeout, platformGridAPI, cloudCommonGridService, basicsLookupdataParentChildGridDataService, childDataService, platformDataServiceSelectionExtension) {
		var options = {
				parent: {
					uuid: 'fef05077bfc2417f87d6c7f2a6d46218',
					httpRead: {
						route: globals.webApiBaseUrl + 'constructionsystem/master/group/',
						endRead: 'tree',
						usePostForRead: false
					},
					presenter: {
						tree: {
							parentProp: 'CosGroupFk',
							childProp: 'GroupChildren',
							showChildrenItems: true
						}
					},
					columns: [
						{
							id: 'description',
							field: 'DescriptionInfo',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'translation',
							readonly: true,
							width: 150
						},
						{
							id: 'code',
							field: 'Code',
							name: 'Code',
							name$tr$: 'cloud.common.entityCode',
							formatter: 'code',
							readonly: true,
							width: 150
						}
					],
					dataProcessor: [
						{
							processItem: function (entity) {
								if (entity.HasChildren) {
									entity.image = 'ico-folder-assemblies';
								}
							}
						}
					],
					lazyInit: false
				}
			}, searchOptions = {
				searchValue: ''
			};

		// create service
		var parentDataService = basicsLookupdataParentChildGridDataService.createDataService({
			role: 'parent',
			key: options.parent.key,
			presenter: options.parent.presenter,
			httpRead: options.parent.httpRead,
			dataProcessor: _.isArray(options.parent.dataProcessor) ? options.parent.dataProcessor : []
		});

		parentDataService.clear = function clear() {
			// overrid clear function,make sure loaded data was stored.
		};
		parentDataService.isLoaded = false;

		options.parent.dataService = parentDataService;

		function controller(scope, keyCodes, $translate, estimateProjectRateBookConfigDataService) {
			scope.options = options;

			scope.searchOptions = {
				search: search,
				onSearchInputKeyDown: onSearchInputKeyDown,
				searchValue: searchOptions.searchValue
			};

			scope.gridOptions = {
				parent: {
					dataService: parentDataService,
					uuid: scope.options.parent.uuid,
					gridData: {
						state: scope.options.parent.uuid
					},
					columns: scope.options.parent.columns,
					lazyInit: scope.options.parent.lazyInit
				}
			};


			parentDataService.registerSelectionChanged(onParentSelectionChanged);
			parentDataService.listLoaded.register(loaded);

			if (!parentDataService.isLoaded) {
				// filter by ratebook
				estimateProjectRateBookConfigDataService.initData().then(function () {
					var filterIds= estimateProjectRateBookConfigDataService.getFilterIds(2);
					if(filterIds && filterIds.length > 0) {
						// load data and then set data to grid
						loadData(parentDataService).then(function (result) {
							parentDataService.itemTree = _.isArray(result.data) ? result.data : [];
							parentDataService.setFilteredIds(filterIds);
							var treeData = parentDataService.getFilteredTree();
							parentDataService.itemTree = treeData;
							platformGridAPI.items.data(scope.gridOptions.parent.uuid, treeData);
							parentDataService.listLoaded.fire();
						});
					}
					else{
						parentDataService.load();
					}
				});

			}

			function loadData(service) {
				var url = service.httpRead.route + service.httpRead.endRead;
				var method = service.httpRead.usePostForRead;
				service.loadListStart.fire();
				var param;
				if (_.isFunction(service.httpRead.getRequestParam)) {
					param = service.httpRead.getRequestParam();
				}
				if (method) {
					return $http.post(url, param ? param : {});
				} else {
					url = param ? url + param : url;
					return $http.get(url);
				}
			}

			var gridListener = scope.$watch(function () {
				return scope.gridCtrl !== undefined;
			}, function () {
				$timeout(function () {
					parentDataService.listLoaded.fire();
					updateSelection();
					gridListener();
				}, 10);
			});

			scope.$on('$destroy', function () {
				parentDataService.unregisterSelectionChanged(onParentSelectionChanged);
				parentDataService.listLoaded.unregister(loaded);
				estimateProjectRateBookConfigDataService.clearData();
				parentDataService.isLoaded = false;
			});

			function updateSelection() {
				var dataServSel = parentDataService.getSelected();
				if (platformDataServiceSelectionExtension.isSelection(dataServSel)) {
					platformGridAPI.rows.selection({
						gridId: scope.gridOptions.parent.uuid,
						rows: [dataServSel]
					});
				}
			}

			function loaded() {
				// load headers of default groups on page loaded.
				// loadDefaultGroupHeaders();
				parentDataService.isLoaded = true;
				platformGridAPI.grids.skeletonLoading('f740181acaf54db8ad5fd19fc8aef02b', false);
			}

			/* function loadDefaultGroupHeaders() {
				var tree = parentDataService.getTree(), flattList = getFlattList(tree), defaultItems = getDefaultItems(flattList);
				var defaultFlatt = getFlattList(defaultItems), groupValues = getGroupPrimaryKeyValues(defaultFlatt);
				loadChildren({groupValues: groupValues});
			} */

			function getFlattList(tree) {
				return cloudCommonGridService.flatten(tree, [], 'GroupChildren');
			}

			/* function getDefaultItems(flattList) {
				return _.filter(flattList, function (item) {
					return item.IsDefault;
				});
			} */

			function getGroupPrimaryKeyValues(list) {
				return _.map(list, function (item) {
					return item.Id;
				});
			}

			function search(searchValue) {
				searchOptions.searchValue = searchValue;
				loadChildren({searchValue: searchValue});
				parentDataService.setSelected(null);
				parentDataService.listLoaded.fire();
			}

			function loadChildren(filterData) {
				childDataService.setFilterData(filterData);
				childDataService.load();
			}

			function onSearchInputKeyDown($event, searchValue) {
				if (event.keyCode === keyCodes.ENTER || scope.instantSearch) {
					search(searchValue);
				}
			}

			function onParentSelectionChanged() {
				var selectedItem = parentDataService.getSelected();
				if (selectedItem !== null) {
					var flattList = getFlattList([selectedItem]), groupValues = getGroupPrimaryKeyValues(flattList);
					loadChildren({groupValues: groupValues});
				}
			}
		}

		return {
			restrict: 'A',
			// scope: {},
			controller: ['$scope', 'keyCodes', '$translate', 'estimateProjectRateBookConfigDataService', controller],
			link: function (scope) {

				function refreshGridSize() {
					platformGridAPI.grids.resize('fef05077bfc2417f87d6c7f2a6d46218');
					platformGridAPI.grids.resize('c4b443d6036e46739bc748d10cda2892');
				}

				var splitter = angular.element('#cosGroupHeaderSplitter').data('kendoSplitter');// element.closest('.k-splitter').data('kendoSplitter');
				if (splitter) {
					splitter.bind('layoutChange', refreshGridSize);
				}

				scope.$on('$destroy', function () {
					if (splitter) {
						splitter.unbind('layoutChange', refreshGridSize);
					}
				});
			}
		};
	}

})(angular);