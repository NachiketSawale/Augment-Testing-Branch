(function (angular) {
	'use strict';

	angular.module('platform').factory('layoutEditorService',
		['_', 'cloudDesktopShortcutService',
			function (_, cloudDesktopShortcutService) {

				var configs = [];
				var service = {};
				var currentLayoutName = '';
				var panes = [];
				var subviews = [];

				const alphaOptions = {
					displayMember: 'character',
					valueMember: 'character',
					selected: null
				};

				service.updateShortcutList = function () {
					alphaOptions.items = cloudDesktopShortcutService.getAlphabetList();
				}

				service.setSelectedConfig = function (config, layoutName, currentPanes) {
					configs = config;
					currentLayoutName = layoutName;
					panes = currentPanes;
				};

				// returns a string or a stringArray :-/
				function getViewsByPaneNo(number) {
					var contentArray = [];
					var shortcutArray = {};
					var config = _.find(configs, {viewNo: number});
					if (!config || config.views.length === 0) {
						return '';
					}
					if (config.views.length === 1) {
						shortcutArray[config.views[0].id] = config.views[0].shortcut;
						return { content: config.views[0].id.toString(), shortcuts: shortcutArray };
					}
					if (config.sorting) {
						_.each(config.sorting, function (sort) {
							_.each(config.views, function (view) {
								if (view.uuid === sort) {
									contentArray.push(view.id.toString());
									if (view.shortcut) {
										shortcutArray[view.id] = view.shortcut;
									}
								}
							});
						});
					} else {
						_.each(config.views, function (view) {
							contentArray.push(view.id.toString());
							if (view.shortcut) {
								shortcutArray[view.id] = view.shortcut;
							}
						});
					}
					return { content: contentArray, shortcuts: shortcutArray };
				}

				service.getSelectedConfig = function () {
					subviews = [];
					_.each(panes, function (pane) {
						let views = getViewsByPaneNo(pane.no);
						subviews.push({shortcuts: views.shortcuts, content: views.content, pane: pane.name});
					});

					return {
						'subviews': subviews,
						'splitterDef': [],
						'baseLayoutId': currentLayoutName
					};
				};

				service.reorderViews = function (paneName, order) {
					var paneObj = _.find(panes, {name: paneName});
					var config = _.find(configs, {viewNo: paneObj.no});

					config.sorting = _.map(order, 'selected');
				};

				service.availableViews = [];

				service.shortcuts = alphaOptions;

				service.updateAvailableViews = function (newList) {
					/*
							Not create a new array-instance.
							This available views is for all the selectboxes in layoutmanager.
						 */
					service.availableViews.length = 0;

					angular.forEach(newList, function (item) {
						service.availableViews.push(item);
					});
				};

				return service;
			}
		]);

})(angular);