(function () {
	'use strict';
	// placeholder pattern for templates. Example: {{id}}
	var phBinding = /{{.*?}}/g;
	var phBinding$$ = /\$\$.*\$\$/g; // added 11.Jun.2015 @rei
	// placeholder for items in the grouped template
	var phItems = /##items##/g;

	/**
	 *
	 * @param scope
	 * @param cs
	 * @returns {*|Object}
	 */
	function makeChildScopewithClean(scope, cs) {
		if (cs) {
			cs.$destroy();
		}
		return scope.$new();
	}

	/**
	 * @jsdoc function
	 * @name addItems
	 * @function
	 * @methodOf
	 * @description
	 * @param {Array} markUp - The mark up for the items.
	 * @param {Array} items - The items to render.
	 * @param {string} itemTemplate - Template for one item.
	 * @param {boolean} dollarBinding - determines whether
	 * @param $sanitize
	 * @param _
	 * @returns {Array} markUp - Result of the replace.
	 */
	function addItems(markUp, items, itemTemplate, dollarBinding, $sanitize, _) {
		var bindings = dollarBinding ? itemTemplate.match(phBinding$$) : itemTemplate.match(phBinding);
		var tempItem = '';

		for (var i = 0; i < items.length; i++) {
			tempItem = itemTemplate;

			for (var b = 0; b < bindings.length; b++) {
				var prop = bindings[b].substring(2, bindings[b].length - 2);
				let value = _.result(items[i], prop, '');

				if (angular.isFunction(value)) {
					value = value();
				}
				value = _.isString(value) ? $sanitize(value) : value;
				tempItem = tempItem.replace(bindings[b], value);
			}
			markUp.push(tempItem);
		}

		return markUp;
	}

	/**
	 * @ngdoc function
	 * @name itemListDirective
	 * @function
	 * @methodOf
	 * @description
	 * @param _
	 * @param $sanitize
	 * @param {object} $compile - The angular service.
	 * @returns {object} A list directive.
	 */
	function itemListDirective(_, $sanitize, $compile) {
		return {
			restrict: 'A',
			scope: {
				list: '=',
				itemTemplate: '=',
				clickFn: '=',
				dollarbinding: '=', // if true we use $$item$$ as palceholder instead of {{item}}
			},
			link: function (scope, elem) {
				var childscope;
				var watchCollection = scope.$watchCollection(
					function () {
						return scope.list;
					},
					function (newValue) {
						if (newValue) {
							var markUp = [];
							addItems(markUp, newValue, scope.itemTemplate, scope.dollarbinding, $sanitize, _);
							elem.children().remove();
							childscope = makeChildScopewithClean(scope, childscope);

							elem.append(angular.element($compile(angular.element(markUp.join('')))(childscope)));
						}
					}
				);

				scope.$on('$destroy', function () {
					watchCollection();
				});
			},
		};
	}

	/**
	 * @ngdoc function
	 * @name groupedItemListDirective
	 * @function
	 * @methodOf
	 * @description
	 * @param {object} $compile - The angular service.
	 * @param {object} _ - Wrapper for underscore / lowdash
	 * @param $sanitize
	 * @param $rootScope
	 * @param cloudDesktopSidebarService
	 * @param cloudDesktopSidebarSettingsService
	 * @returns {object} A list directive.
	 */
	function groupedItemListDirective(_, $sanitize, $compile, $rootScope, cloudDesktopSidebarService, cloudDesktopSidebarSettingsService) {
		return {
			restrict: 'A',
			scope: {
				groupedList: '=',
				groupedListCfg: '=?',
				itemTemplate: '=',
				groupTemplate: '=',
				clickFn: '=',
				childProperty: '=',
				keyProperty: '=',
				dollarbinding: '=', // if true we use $$item$$ as placeholder instead of {{item}},
				sidebarId: '=',
				name: '='
			},
			link: function (scope, elem) {
				let sidebarId = cloudDesktopSidebarService.getSidebarIds()[scope.sidebarId];
				let pinnedGroup = {
					id: 10000,
					name: 'Pinned',
					icon: 'btn control-icons ico-pin',
					visible: true,
					iconClass: 'ico-up',
					sorting: 0,
					[scope.name]: [],
					count: 2
				};
				scope.itemPinnedarray = [];
				let watchOriginalData = scope.$watch('groupedList', function (newValue, oldValue) {
					if((oldValue.length === 0 && newValue.length > 0) || oldValue.length !== newValue.length)
					{
						init();
					}
					else if(oldValue.length !== 0 && newValue.length !== 0 ) {
						refresh();
					}
				}, true);

				function init() {
					if(scope.groupedList.length > 0 && $rootScope.currentModule) {
						cloudDesktopSidebarSettingsService.getSettings($rootScope.currentModule, sidebarId).then(function (result) {
							if(!result) {
								return;
							}
							let data = result.filter((item) => {
								return item.sidebarId === sidebarId;
							});
							if(data && data.length > 0)
							{
								if (data[0].expandedGroups) {
									scope.groupedList.forEach((listItem) => {
										if(data[0].expandedGroups.includes(listItem.id)) {
											listItem.visible = true;
										}
										else {
											listItem.visible = false;
										}
									});
								}

								if ((data[0].pinnedSidebarElements.length !== 0 || data[0].pinnedSidebarElements.length !== null)) {
									if (scope.groupedList.length > 0) {
										scope.pinnedItemId = data[0].pinnedSidebarElements;
										data[0].pinnedSidebarElements.forEach((item) => {
											pin(item);
										});
										if (data[0].expandedGroups && data[0].expandedGroups.includes(pinnedGroup.id)) {
											scope.groupedList[0].visible = true;
											scope.groupedList[0].iconClass = 'ico-up';
										} else {
											if (scope.groupedList[0].id === pinnedGroup.id) {
												scope.groupedList[0].visible = false;
												scope.groupedList[0].iconClass = 'ico-down';
											}
										}
									}
								}
							}
							refresh();
						});
					}
				}

				scope.pinnedItemId = [];
				let expandedGroupArr = [];

				if (_.isUndefined(scope.groupedListCfg)) {
					scope.groupedListCfg = {};
				}

				scope.pinItemId = [];
				scope.pinnedItem = function (id) {
					let isPinned = scope.pinItemId.includes(id) || scope.pinnedItemId.includes(id);
					if (isPinned) {
						unpin(id);
						let index1 = scope.pinnedItemId.indexOf(id);
						scope.pinnedItemId.splice(index1, 1);
					} else {
						scope.pinnedItemId.push(id);
						pin(id);
					}
				};

				function refresh() {
					var markUp = [];
					var groupMarkUp = [];
					var itemsMarkUp = [];
					for (var i = 0; i < scope.groupedList.length; i++) {
						itemsMarkUp.length = 0;
						groupMarkUp.length = 0;
						addItems(groupMarkUp, [scope.groupedList[i]], scope.groupTemplate, scope.dollarbinding, $sanitize, _);
						if (scope.groupedList[i].visible) {
							addItems(itemsMarkUp, scope.groupedList[i][scope.childProperty], scope.itemTemplate, scope.dollarbinding, $sanitize, _);
							markUp.push(groupMarkUp.join('').replace(phItems, itemsMarkUp.join('')));
						} else {
							markUp.push(groupMarkUp.join('').replace(phItems, ''));
						}
					}
					elem.children().remove();
					elem.append(angular.element($compile(angular.element(markUp.join('')))(scope)));
				}

				scope.expandedGroups = [];
				scope.invert = function (groupKey) {
					var group = _.find(scope.groupedList, _.set({}, scope.keyProperty || 'key', groupKey));
					group.visible = !group.visible;
					if (group.id === 10000) {
						pinnedGroup.iconClass = group.visible ? 'ico-up' : 'ico-down';
					}
					refresh();
				};

				var watchCollection = scope.$watchCollection(function () {
					return scope.groupedList;
				}, refresh);

				scope.$on('$stateChangeStart', function (event, toState, toParams, fromState/* , fromParams */) {
					if(sidebarId && !toParams.tab && !fromState.isDesktop) {
						scope.groupedList.forEach((item) => {
							if (item.visible && !expandedGroupArr.includes(item.id)) {
								expandedGroupArr.push(item.id);
							}
						});
						let urlPath = fromState.url.split('/');
						if (urlPath[0] === '^') {
							cloudDesktopSidebarSettingsService.saveSidebarSetting(urlPath[1] + '.' + urlPath[2], sidebarId, scope.pinnedItemId, expandedGroupArr);
						}
					}
				});

				scope.$on('$destroy', function () {
					watchCollection();
					watchOriginalData();
				});

				function pin(id) {
					scope.groupedList.filter(function (item) {
						if(item.id !== 10000) {
							item[scope.name].forEach(function (itemChild) {
								if ((itemChild.w2GId && itemChild.w2GId === id) || itemChild.id === id)  {
									if(!pinnedGroup[scope.name].find(item => (item.w2GId && item.w2GId === id) || item.id === id)) {
										let pinnedObj = angular.copy(itemChild);
										pinnedGroup[scope.name].push(pinnedObj);
									}
									itemChild.hide = true;
									itemChild.pinned = true;
								}
							});
							let pinnedCount = item[scope.name].filter(obj => { return obj.pinned;}).length;
							item.hide = pinnedCount === item[scope.name].length;
						}
					});
					if (pinnedGroup[scope.name].length > 0) {
						let pinnedItemGroup = scope.groupedList.find (item => item.id === 10000);
						if(!pinnedItemGroup) {
							scope.groupedList.unshift(pinnedGroup);
						}
					}
					refresh();
				}

				function unpin(id) {
					scope.groupedList[0][scope.name].forEach((item, i) => {
						if ((item.w2GId && item.w2GId === id) || item.id === id) {
							scope.groupedList[0][scope.name].splice(i, 1);
						}
					});
					scope.groupedList.filter(function (item) {
						let found = false;
						item[scope.name].forEach(function (itemChild) {
							if ((itemChild.w2GId && itemChild.w2GId === id) || itemChild.id === id) {
								itemChild.hide = false;
								itemChild.pinned = false;
								found = true;
							}
							if(found) {
								item.hide = false;
							}
						});
					});
					if (scope.groupedList[0][scope.name].length === 0) {
						scope.groupedList.splice(0, 1);
					}
					refresh();
				}
				init();
			}
		};
	}
	angular.module('platform').directive('platformItemListDirective', ['_', '$sanitize', '$compile', itemListDirective]);
	angular.module('platform').directive('platformGroupedItemListDirective', ['_', '$sanitize', '$compile', '$rootScope', 'cloudDesktopSidebarService', 'cloudDesktopSidebarSettingsService', groupedItemListDirective]);
})();
