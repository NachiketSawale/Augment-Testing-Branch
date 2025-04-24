/**
 * Created by lav on 6/27/2019.
 */
(function () {
	'use strict';
	const moduleName = 'basics.common';
	angular.module(moduleName).service('basicsCommonToolbarExtensionService', ['platformToolbarBtnService', 'platformGridAPI', '_', function (platformToolbarBtnService, platformGridAPI, _) {

		/**
		 * @ngdoc function
		 * @name insertBefore
		 * @function
		 * @methodOf basicsCommonToolbarExtensionService
		 * @description insert the toolbar(s) before target item
		 * @param {Object}    scope    The scope of controller
		 * @param {Object}    toolbarItem    The toolbar item(s) which will be inserted
		 * @param {String} targetId    The id of the item which insert before
		 */
		function insertBefore(scope, toolbarItem, targetId) {
			insert(scope, toolbarItem, targetId);
		}

		/**
		 * @ngdoc function
		 * @name insertAfter
		 * @function
		 * @methodOf basicsCommonToolbarExtensionService
		 * @description insert the toolbar(s) before target item
		 * @param {Object}    scope    The scope of controller
		 * @param {Object}    toolbarItem    The toolbar item(s) which will be inserted
		 * @param {String} targetId    The id of the item which insert after
		 */
		function insertAfter(scope, toolbarItem, targetId) {
			insert(scope, toolbarItem, targetId, 1);
		}

		function insert(scope, toolbarItem, targetId, interval) {
			interval = interval || 0;
			if (scope && toolbarItem) {
				const unWatch = scope.$watch('tools', function () {
					if (scope.tools && scope.tools.items) {
						const toolbarItems = _.isArray(toolbarItem) ? toolbarItem : [toolbarItem];
						let index = _.findIndex(scope.tools.items, {id: targetId});
						index = index < 0 ? 0 : index;
						let overflowItem = scope.tools.items.find(item => item.type === 'overflow-btn');
						_.forEach(toolbarItems.reverse(), function (item) {
							scope.tools.items.splice(index + interval, 0, item);
							if (overflowItem) {
								overflowItem.list.items.splice(index + interval, 0, item);
							}
						});
						// If targetId == -1, means remove create and delete btns
						if (targetId === -1) {
							const createBtnIndex = _.findIndex(scope.tools.items, function (item) {
								return item.id === 'create';
							});
							scope.tools.items.splice(createBtnIndex, 2);
							const deleteBtnIndex = _.findIndex(scope.tools.items, function (item) {
								return item.id === 'delete';
							});
							scope.tools.items.splice(deleteBtnIndex, 2);
						}
					}
				});
				scope.$on('$destroy', function () {
					unWatch();
				});
			}
		}

		function addBtn(scope, toolbarItems, includes, excludes) {
			toolbarItems = toolbarItems || scope.tools.items;
			if (canShow('G', includes, excludes)) {
				platformToolbarBtnService.addGroupingBtn(scope, toolbarItems);
			}
			if (canShow('P', includes, excludes)) {
				platformToolbarBtnService.addPrintBtn(scope, toolbarItems);
			}
			// override to bug fixed
			if (canShow('SA', includes, excludes)) {
				platformToolbarBtnService.addSearchAllBtn(scope, toolbarItems);
				toolbarItems[toolbarItems.length - 1].fn = function () {
					platformGridAPI.filters.showSearch(scope.gridId, this.value, false);
					if (this.value) {
						const searchColBtn = _.find(toolbarItems, {id: 'gridSearchColumn'});
						if (searchColBtn) {
							searchColBtn.value = false;
						}
						platformGridAPI.filters.showColumnSearch(scope.gridId, false, true);
					}
				};
			}
			if (canShow('SC', includes, excludes)) {
				platformToolbarBtnService.addSearchColumnBtn(scope, toolbarItems);
				toolbarItems[toolbarItems.length - 1].fn = function () {
					platformGridAPI.filters.showColumnSearch(scope.gridId, this.value, false);
					if (this.value) {
						const searchAllBtn = _.find(toolbarItems, {id: 'gridSearchAll'});
						if (searchAllBtn) {
							searchAllBtn.value = false;
						}
						platformGridAPI.filters.showSearch(scope.gridId, false, true);
					}
				};
			}
			if (canShow('L', includes, excludes)) {
				platformToolbarBtnService.addLayoutBtn(scope, toolbarItems);
			}
		}

		function canShow(value, includes, excludes) {
			if (includes && !includes.includes(value)) {
				return false;
			}
			return !(excludes && excludes.includes(value));

		}

		return {
			'insertBefore': insertBefore,
			'insertAfter': insertAfter,
			'addBtn': addBtn
		};
	}]);
})();