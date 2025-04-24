/**
 * Created by jes on 2/10/2017.
 */

(function (angular, globals) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsLookupdataParentChildGridDataService', basicsLookupdataParentChildGridDataService);

	basicsLookupdataParentChildGridDataService.$inject = [
		'_',
		'$q',
		'$http',
		'PlatformMessenger'
	];

	function basicsLookupdataParentChildGridDataService(
		_,
		$q,
		$http,
		PlatformMessenger
	) {
		var service = {};

		service.createDataService = createService;

		return service;

		function createService(options) {
			var service = {
				options: {},
				role: options.role,
				httpRead: options.httpRead,
				dataProcessor: options.dataProcessor,
				selectedItem: null,
				selectionChanged: new PlatformMessenger(),
				listLoaded: new PlatformMessenger(),
				loadListStart: new PlatformMessenger()
			};

			// default key property of item
			service.options.key = getDefault(options.key, 'Id');
			// default presenter is a list
			service.presenter = getDefault(options.presenter, { list: {} });

			service.clear = clear(service);
			service.getSelected = getSelected(service);
			service.setSelected = setSelected(service);
			service.refresh = refresh(service);
			service.useItemFilter = useItemFilter(service);
			service.setFilteredIds = setFilteredIds(service);
			service.goToFirst = goToFirst(service);

			service.registerListLoaded = register(service.listLoaded);
			service.unregisterListLoaded = unregister(service.listLoaded);
			service.registerLoadListStart = register(service.loadListStart);
			service.registerSelectionChanged = register(service.selectionChanged);
			service.unregisterLoadListStart = register(service.loadListStart);
			service.unregisterSelectionChanged = unregister(service.selectionChanged);

			if (options.role === 'parent') {
				if (service.presenter.tree) {
					// when click a node, show the its items and its descendant's items
					// to used this feature, you need to implement an api that take an
					// array of parent ids as parameter
					service.options.showChildrenItems = getDefault(service.presenter.tree.showChildrenItems, true);
				}
				service.load = load(service);
			} else {
				service.options.parentFk = options.parentFk;
				service.options.filterParent = getDefault(options.filterParent, true);
				// default options for show all search in child grid
				service.options.showAllSearchResult = getDefault(options.showAllSearchResult, true);
				// objects of the cache
				// e.g. { parentId: 54, list: [] } the list can be flat or tree list
				service.cache = [];
				service.load = loadChildren(service);
				service.search = search(service);
				service.unLoadSubItems = unLoadSubItems(service);
				service.isSearchResult = false;
			}

			if (service.presenter.list) {
				service.itemList = [];
				service.setList = setList(service);
				service.getList = getList(service);
				service.getFilteredList = getFilteredList(service);
			} else {
				service.itemTree = [];
				service.setTree = setTree(service);
				service.getTree = getTree(service);
				service.getFilteredTree = getFilteredTree(service);
				service.collectDescendantFieldValue = collectDescendantFieldValue(service);
			}

			return service;
		}

		function setFilteredIds(service) {
			return function (ids) {
				service.filteredIds = _.isArray(ids) ? ids : [];
			};
		}

		function useItemFilter(service) {
			return function (use) {
				service.enableFilter = use;
			};
		}

		function setList(service) {
			return function(items) {
				if (_.isArray(items)) {
					service.setSelected(null);
					service.itemList = items;
					service.listLoaded.fire();
				}
			};
		}

		function getList(service) {
			return function () {
				return service.itemList;
			};
		}

		function getFilteredList(service) {
			return function () {
				return _.filter(service.getList(), function (item) {
					return _.includes(service.filteredIds, item[service.options.key]);
				});
			};
		}

		function setTree(service) {
			return function (items) {
				if (_.isArray(items)) {
					service.setSelected(null);
					service.itemTree = items;
					service.listLoaded.fire();
				}
			};
		}

		function getTree(service) {
			return function () {
				return service.itemTree;
			};
		}

		function getFilteredTree(service) {
			return function () {
				return _.chain(service.getTree())
					.cloneDeep()
					.map(function (node) {
						return filterTreeByKeys(node, service.presenter.tree.childProp, service.filteredIds, service);
					})
					.filter(function (node) {
						return node !== null;
					})
					.value();
			};
		}

		function clear(service) {
			return function () {
				if (service.presenter.list) {
					service.itemList.length = 0;
				} else {
					service.itemTree.length = 0;
				}
				if (_.isArray(service.cache)) {
					service.cache.length = 0;
				}
				if (_.isArray(service.filteredIds)) {
					service.filteredIds.length = 0;
				}
				service.useItemFilter(false);
				service.isSearchResult = false;
				service.selectedItem = null;
				service.listLoaded.fire();
			};
		}

		function unLoadSubItems(service) {
			return function () {
				if (service.presenter.list) {
					service.itemList.length = 0;
				} else {
					service.itemTree.length = 0;
				}
				service.selectedItem = null;
				service.listLoaded.fire();
			};
		}

		function refresh(service) {
			return function () {
				service.clear();
				service.load();
			};
		}

		function getSelected(service) {
			return function () {
				return service.selectedItem;
			};
		}

		function setSelected(service) {
			return function (item) {
				if (item !== undefined){
					service.selectedItem = item;
					service.selectionChanged.fire('selectionChanged', item);
				}
			};
		}

		function goToFirst(service) {
			return function () {
				var first;
				if (service.presenter.list) {
					first = _.first(service.isSearchResult ? service.getFilteredList() : service.getList());
				} else {
					first = _.first(service.isSearchResult ? service.getFilteredTree() : service.getTree());
				}
				if (first) {
					service.setSelected(first);
				}
			};
		}

		function register(messenger) {
			return function (func) {
				messenger.register(func);
			};
		}

		function unregister(messenger) {
			return function (func) {
				messenger.unregister(func);
			};
		}

		function handleReadSucceeded(service, data, parentItem) {
			var items = _.isArray(data) ? data : [];
			processItems(service, items);
			if (service.presenter.tree) {
				service.itemTree = items;
			} else {
				service.itemList = items;
			}
			if (service.role === 'child') {
				if (service.parentService.options.showChildrenItems) {
					addToCache2(parentItem, data, service);
				} else {
					addToCache(parentItem[service.parentService.options.key], data, service);
				}
			}
			service.listLoaded.fire();
		}

		function processItems(service, items) {
			var temp  = [];
			if (service.presenter.tree) {
				temp = flattenTrees(items, service.presenter.tree.childProp);
			} else {
				temp = items;
			}

			_.forEach(temp, function (item) {
				_.forEach(service.dataProcessor, function (proc) {
					proc.processItem(item);
				});
			});
		}

		function loadChildren(service) {
			return function (event, parentItem) {
				if (!parentItem) { return; }
				service.loadListStart.fire();
				var cache = _.find(service.cache, {parentId: parentItem[service.parentService.options.key]});
				if (cache) {
					if (service.presenter.tree) {
						service.itemTree = _.clone(cache.list);
					} else {
						service.itemList = _.clone(cache.list);
					}
					service.listLoaded.fire();
				} else if (service.parentService.enableFilter) {
					service.listLoaded.fire(); // make the loading indicator disappear
				} else {
					if (service.isSearchResult) {
						service.listLoaded.fire(); // make the loading indicator disappear
						return $q.when([]);
					} else {
						var url = service.httpRead.route + service.httpRead.endRead;
						var param = service.httpRead.getRequestParam(parentItem, service.parentService);
						if (service.httpRead.usePostForRead) {
							return $http.post(url, param).then(function (res) {
								handleReadSucceeded(service, res.data, parentItem);
							});
						} else {
							url += param;
							return $http.get(url).then(function (res) {
								handleReadSucceeded(service, res.data, parentItem);
							});
						}
					}
				}
			};
		}

		function addToCache(id, items, service) {
			if (!_.some(service.cache, function (e) {return e.parentId === id;})) {
				service.cache.push({
					parentId: id,
					list: _.clone(items)
				});
			}
		}

		function addToCache2(parentItem, items, childService) {
			var childProp = childService.parentService.presenter.tree.childProp;
			if (parentItem) {
				var groupIds = groupTreeIds(parentItem, childProp, childService.parentService);
				_.forEach(groupIds, function (ids, key) {
					var id = parseInt(key);
					var list = [];
					_.forEach(ids, function (id) {
						list = _.union(list, _.filter(items, function (item) {
							return item[childService.options.parentFk] === id;
						}));
					});
					var cache = _.find(childService.cache, {parentId: id});
					if (cache) {
						cache.list = list;
					} else {
						childService.cache.push({
							parentId: id,
							list: list
						});
					}
				});
			}

			function groupTreeIds(node, childProp, service) {
				var group = {};
				if (_.isArray(node[childProp]) && node[childProp].length > 0) {
					var allchildIds = [node[service.options.key]];
					_.forEach(node[childProp], function () {
						var ids = childService.parentService.collectDescendantFieldValue(node);
						allchildIds = _.union(allchildIds, ids);
					});
					group[node[service.options.key]] = allchildIds;
					_.forEach(node[childProp], function (child) {
						group = _.assign(group, groupTreeIds(child, childProp, service));
					});
				} else {
					group[node[service.options.key]] = [node[service.options.key]];
				}
				return group;
			}
		}

		function load(service) {

			var url = service.httpRead.route + service.httpRead.endRead;
			return function () {
				var method = service.httpRead.usePostForRead;
				service.loadListStart.fire();
				var param;
				if (_.isFunction(service.httpRead.getRequestParam)) {
					param = service.httpRead.getRequestParam();
				}
				if (method) {
					return $http.post(url, param ? param : {}).then(function (res) {
						handleReadSucceeded(service, res.data);
					});
				} else {
					url = param ? url + param : url;
					return $http.get(url).then(function (res) {
						handleReadSucceeded(service, res.data);
					});
				}
			};
		}

		function search(service) {
			return function (searchValue, options) {
				var deferred = $q.defer();
				service.clear();
				service.isSearchResult = true;
				service.parentService.isSearchResult = true;
				if (service.options.filterParent) {
					service.parentService.useItemFilter(true);
				}
				if (_.isFunction(options.searchOptions.getSearchList)) {
					options.searchOptions.getSearchList(searchValue, service).then(function (items) {
						doSomeStuff(items, deferred, service);
					});
				} else {
					var url = globals.webApiBaseUrl + 'basics/lookupdata/master/getsearchlist?lookup=' + options.lookupType;
					if (!searchValue) {
						url = url.replace('getsearchlist', 'getList');
					} else {
						url += '&filtervalue=(#)'.replace('#', options.searchOptions.buildSearchString(searchValue));
					}
					$http.get(url).then(function (res) {
						doSomeStuff(res.data, deferred, service);
					});
				}

				return deferred.promise;

				function doSomeStuff(items, deferred, service) {
					if (_.isArray(items)) {
						processItems(service, items);

						if (service.options.filterParent) {
							service.parentService.filteredIds = _.map(items, function (item) {
								return item[service.options.parentFk];
							});
						}

						if (service.parentService.options.showChildrenItems) {
							var trees = service.parentService.getFilteredTree();
							_.forEach(trees, function (tree) {
								addToCache2(tree, items, service);
							});
						} else {
							var groups = _.groupBy(items, service.options.parentFk);
							_.forEach(groups, function (groupItems, key) {
								var id = parseInt(key);
								id = !isNaN(id) ? id : -1;
								addToCache(id, groupItems, service);
							});
						}

						if (service.options.showAllSearchResult) {
							if (service.presenter.list) {
								service.setList(items);
							} else {
								service.setTree(items);
							}
						} else {
							// one situation: some items of the result set don't have parent
							// solution: if this situation occurs, show these items first,
							// otherwise show the items of the first parent
							var cache = _.find(service.cache, {parentId: -1});
							if (cache) {
								if (service.presenter.list) {
									service.setList(cache.list);
								} else {
									service.setTree(cache.list);
								}
							} else {
								service.parentService.goToFirst();
							}
						}


						service.parentService.listLoaded.fire();
					}
					deferred.resolve(items);
				}
			};
		}

		function collectDescendantFieldValue(service) {
			return function collectIds(node) {
				var childProp = service.presenter.tree.childProp;
				var ids = [];
				ids.push(node[service.options.key]);
				if (_.isArray(node[childProp]) && node[childProp].length > 0) {
					_.forEach(node[childProp], function (child) {
						ids.push(child[service.options.key]);
						ids = _.union(ids, collectIds(child, childProp));
					});
				}
				return ids;
			};
		}

		// this function will modify the structure of node
		function filterTreeByKeys(node, childProp, ids, service) {
			var children = _.isArray(node[childProp]) ? node[childProp] : [];
			if (children.length > 0) {
				node[childProp] = _
					.chain(children)
					.map(function (node) {
						return filterTreeByKeys(node, childProp, ids, service);
					})
					.filter(function (node) {
						return node !== null;
					})
					.value();
				return node[childProp].length > 0 || _.includes(ids, node[service.options.key]) ? node : null;
			} else {
				return _.includes(ids, node[service.options.key]) ? node : null;
			}
		}

		function flattenTree(node, childProp) {
			if (_.isArray(node[childProp]) && node[childProp].length > 0) {
				var n = _.chain(node[childProp])
					.map(function (child) {
						return flattenTree(child, childProp);
					})
					.reduce(function(all, nodes) {
						return _.union(all, nodes);
					})
					.value();
				return _.union([node], node[childProp], n);
			} else {
				return [node];
			}
		}

		function flattenTrees(nodes, childProp) {
			return _.chain(nodes)
				.map(function (node) {
					return flattenTree(node, childProp);
				})
				.reduce(function (all, list) {
					return _.union(all, list);
				})
				.value();
		}

		function getDefault(value, defalutValue) {
			return _.isNil(value) ? defalutValue : value;
		}
	}

})(angular, globals);