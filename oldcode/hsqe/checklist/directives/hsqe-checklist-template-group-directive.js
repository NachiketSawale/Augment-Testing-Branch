(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'hsqe.checklist';

	angular.module(moduleName).directive('hsqeChecklistTemplateGroupContainer', hsqeChecklistTemplateGroupContainer);

	hsqeChecklistTemplateGroupContainer.$inject = [
		'_',
		'$http',
		'$timeout',
		'platformGridAPI',
		'cloudCommonGridService',
		'basicsLookupdataParentChildGridDataService',
		'hsqeCheckListTemplateDataService',
		'platformDataServiceSelectionExtension'
	];

	function hsqeChecklistTemplateGroupContainer(_, $http, $timeout, platformGridAPI, cloudCommonGridService, basicsLookupdataParentChildGridDataService, childDataService, platformDataServiceSelectionExtension) {
		var options = {
				parent: {
					uuid: '406c41a9897543fc93a25c0116813696',
					httpRead: {
						route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/group/',
						endRead: 'grouptree'
					},
					presenter: {
						tree: {
							parentProp: 'HsqCheckListGroupFk',
							childProp: 'HsqChecklistgroupChildren',
							showChildrenItems: true
						}
					},
					columns: [
						{
							id: 'code',
							field: 'Code',
							name: 'Code',
							name$tr$: 'cloud.common.entityCode',
							formatter: 'code',
							readonly: true,
							width: 150
						},
						{
							id: 'description',
							field: 'DescriptionInfo',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'translation',
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

		function controller(scope, keyCodes) {
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
				/*
				//filter by ratebook
				projectMainRateBookConfigDataService.initData().then(function () {
					var filterIds = projectMainRateBookConfigDataService.getFilterIds(2);
					if (filterIds && filterIds.length > 0) {
						//load data and then set data to grid
						loadData(parentDataService).then(function (result) {
							parentDataService.itemTree = _.isArray(result.data) ? result.data : [];
							parentDataService.setFilteredIds(filterIds);
							var treeData = parentDataService.getFilteredTree();
							parentDataService.itemTree = treeData;
							platformGridAPI.items.data(scope.gridOptions.parent.uuid, treeData);
							parentDataService.listLoaded.fire();
						});
					} else {
						parentDataService.load();
					}
				}); */
				parentDataService.load();

			}
			/*
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
			*/
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
				parentDataService.isLoaded = true;
			}

			function getFlattList(tree) {
				return cloudCommonGridService.flatten(tree, [], 'HsqChecklistgroupChildren');
			}

			function getGroupPrimaryKeyValues(list) {
				return _.map(list, function (item) {
					return item.Id;
				});
			}

			function search(searchValue) {
				searchOptions.searchValue = searchValue;
				loadChildren({searchValue: searchValue});
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
			controller: ['$scope', 'keyCodes', '$translate', controller],
			link: function (scope) {

				function refreshGridSize() {
					platformGridAPI.grids.resize('406c41a9897543fc93a25c0116813696');
					platformGridAPI.grids.resize('aa3d3230b7ac4380a72d95d6c0599112');
				}

				var splitter = angular.element('#hsqeCheckListTemplateGroupSplitter').data('kendoSplitter');// element.closest('.k-splitter').data('kendoSplitter');
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