/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	var LayoutEditorDirective = function ($templateCache, viewService, _, layoutEditorService) {
		var paneConfigs = [];
		var directive = {};
		var currentPanes = {};
		var currentLayoutName = '';
		var currentViews;// = getViews();
		var dropDownValueChanged = new Platform.Messenger();

		function getViews() {
			return _.cloneDeep(viewService.getAllViews());
		}

		function isViewUsedInLayout(aSelectedView) {
			return _.find(currentPanes, {no: aSelectedView.viewNo}) ? true : false;
		}

		function getViewObjectById(viewId) {
			return _.find(currentViews, {id: viewId});
		}

		function getObjectValueByKey(obj, key) {
			return _.find(obj, function (item) {
				return item.name === key;
			});
		}

		function createPaneConfigs(subviews) {
			if (angular.isArray(subviews)) {
				var viewObject = null;
				_.each(subviews, function (subview) {
					if (angular.isArray(subview.content)) {
						_.each(subview.content, function (content) {
							if (content.length > 0) {
								viewObject = getViewObjectById(content);
								if (viewObject) {
									let shortcut = '-';
									if (subview.shortcuts) {
										shortcut = subview.shortcuts[viewObject.id] ? subview.shortcuts[viewObject.id] : '-';
									}
									viewObject.shortcut = shortcut;
									viewObject.isHidden = true;
									addView(subview.pane, viewObject);
								}
							}
						});
					} else {
						if (subview.content && subview.content.length > 0) {
							viewObject = getViewObjectById(subview.content);
							if (viewObject) {
								let shortcut = '-';
								if (subview.shortcuts) {
									shortcut = subview.shortcuts[viewObject.id] ? subview.shortcuts[viewObject.id] : '-';
								}
								viewObject.shortcut = shortcut;
								viewObject.isHidden = true;
								addView(subview.pane, viewObject);
							}
						}
					}
				});
			}
		}

		var addView = function (paneName, viewToAdd) {
			// determine the paneNumber by its name
			var paneNumber = getObjectValueByKey(currentPanes, paneName).no;

			// remove view if already configured in another paneConfig, this is needed because the amount of panes in an layout can differ.
			_.each(paneConfigs, function (paneConfig) {
				_.remove(paneConfig.views, function (view) {
					return view.uuid === viewToAdd.uuid;
				});
			});

			// find the paneConfiguration for the right paneNumber
			var paneConfig = _.find(paneConfigs, function (paneConfig) {
				return paneConfig.viewNo === paneNumber;
			});

			// create a new paneConfig if necessary
			if (!paneConfig) {
				paneConfig = {viewNo: paneNumber, views: []};
				paneConfigs.push(paneConfig);
			}
			paneConfig.views.push(viewToAdd);
			layoutEditorService.setSelectedConfig(paneConfigs, currentLayoutName, currentPanes);
		};

		directive.restrict = 'A';
		directive.template = $templateCache.get('layout-editor-content.html');
		directive.scope = false;
		directive.compile = function () {
			return {
				pre: function (scope) {
					var editorLayout = viewService.getDefaultLayout().config.editor;
					layoutEditorService.updateShortcutList();

					currentPanes = editorLayout.paneNames;
					currentLayoutName = viewService.getDefaultLayout().layoutName;
					scope.activeTemplate = editorLayout.template;

					var currentLayout = viewService.getCurrentLayout();

					if (currentLayout && viewService.inEditMode) {
						createPaneConfigs(currentLayout.subviews);
					}
				},
				post: function (scope) {

					function getLayout(layoutName) {
						var layout = viewService.getDefaultLayout(layoutName);

						if (layout) {
							currentLayoutName = layoutName;
							return layout.config.editor.template;
						}
						console.warn('layout: ' + layoutName + ' was not found');
						layout = viewService.getDefaultLayout();
						currentLayoutName = viewService.getDefaultLayout().layoutName;
						return layout.config.editor.template;
					}

					function updatedPanes(layoutName) {
						var panes = viewService.getDefaultLayout(layoutName).config.editor.paneNames;

						if (!panes) {
							return viewService.getDefaultLayout().config.editor.paneNames;
						}
						return panes;
					}

					function updateScope(layoutName) {
						scope.activeTemplate = getLayout(layoutName);
						currentPanes = updatedPanes(layoutName);
						layoutEditorService.setSelectedConfig(paneConfigs, layoutName, currentPanes);
						updateSelected();
					}

					function changeVisibilityForViewItems(view, bool) {
						var views = view.views;

						for (var i = 0; i < views.length; i++) {
							views[i].isHidden = bool;
						}
					}

					function updateSelected() {
						_.forEach(paneConfigs, function (selectedView) {
							if (isViewUsedInLayout(selectedView)) {
								changeVisibilityForViewItems(selectedView, true);
							} else {
								changeVisibilityForViewItems(selectedView, false);
							}
						});
					}

					function cleanUp() {
						currentPanes = [];
						paneConfigs = [];
						currentViews = null;
					}

					var LayoutMenuItem = function layoutMenuItem(id, caption) {
						this.id = id;
						this.caption = caption;
						this.type = 'radio';
						this.cssClass = 'item layout-icons ico-' + id;
						this.value = id;
						this.fn = function () {
							updateScope(this.id);
						};
					};

					scope.layoutBar = {
						showImages: true,
						showTitles: true,
						cssClass: 'layout-bar',
						items: [{
							caption: 'radio group caption',
							type: 'sublist',
							list: {
								cssClass: 'radio-group',
								activeValue: '',
								showTitles: true,
								items: [
									new LayoutMenuItem('layout0', 'Layout 0'),
									new LayoutMenuItem('layout1', 'Layout 1'),
									new LayoutMenuItem('layout2', 'Layout 2'),
									new LayoutMenuItem('layout3', 'Layout 3'),
									new LayoutMenuItem('layout4', 'Layout 4'),
									new LayoutMenuItem('layout5', 'Layout 5'),
									new LayoutMenuItem('layout24', 'Layout 24'),
									new LayoutMenuItem('layout25', 'Layout 25'),
									new LayoutMenuItem('layout6', 'Layout 6'),
									new LayoutMenuItem('layout7', 'Layout 7'),
									new LayoutMenuItem('layout8', 'Layout 8'),
									new LayoutMenuItem('layout9', 'Layout 9'),
									new LayoutMenuItem('layout10', 'Layout 10'),
									new LayoutMenuItem('layout11', 'Layout 11'),
									new LayoutMenuItem('layout12', 'Layout 12'),
									new LayoutMenuItem('layout13', 'Layout 13'),
									new LayoutMenuItem('layout14', 'Layout 14'),
									new LayoutMenuItem('layout15', 'Layout 15'),
									new LayoutMenuItem('layout16', 'Layout 16'),
									new LayoutMenuItem('layout17', 'Layout 17'),
									new LayoutMenuItem('layout18', 'Layout 18'),
									new LayoutMenuItem('layout19', 'Layout 19'),
									new LayoutMenuItem('layout20', 'Layout 20'),
									new LayoutMenuItem('layout21', 'Layout 21'),
									new LayoutMenuItem('layout22', 'Layout 22'),
									new LayoutMenuItem('layout23', 'Layout 23'),
									new LayoutMenuItem('layout26','Layout 26'),
									new LayoutMenuItem('layout27','Layout 27'),
									new LayoutMenuItem('layout28','Layout 28'),
									new LayoutMenuItem('layout29','Layout 29'),
									new LayoutMenuItem('layout30','Layout 30'),
									new LayoutMenuItem('layout31','Layout 31')
								]
							}
						}]
					};

					var unregister = [scope.$on('$destroy', function () {
						cleanUp();

						_.over(unregister)();
						unregister = null;
					})];

					scope.layoutBar.items[0].list.activeValue = viewService.getDefaultLayout().layoutName;
				}
			};
		};

		directive.controller = ['$scope', '$translate', '_', function ($scope, $translate, _) {
			var vm = this;

			vm.addSelectedView = addView;

			vm.setShortcut = function (paneName, viewId, shortcut) {
				const paneNumber = getObjectValueByKey(currentPanes, paneName).no;

				const paneConfig = _.find(paneConfigs, function (paneConfig) {
					return paneConfig.viewNo === paneNumber;
				});

				if (paneConfig) {
					let result = _.find(paneConfig.views, function (view) {
						if (view.uuid === viewId) {
							return true;
						}
					});
					if(result) {
						result.shortcut = shortcut;
					}
				}
			};

			vm.removeView = function (paneName, viewToRemove) {

				if (!viewToRemove.uuid) {
					return;
				}

				var paneNumber = getObjectValueByKey(currentPanes, paneName).no;

				var paneConfig = _.find(paneConfigs, function (paneConfig) {
					return paneConfig.viewNo === paneNumber;
				});

				if (paneConfig) {
					_.remove(paneConfig.views, function (view) {
						return view.uuid === viewToRemove.uuid;
					});
				}
			};

			vm.registerOndropDownValueChanged = function (fn) {
				dropDownValueChanged.register(fn);
			};

			vm.unregisterOndropDownValueChanged = function (fn) {
				dropDownValueChanged.unregister(fn);
			};

			vm.valueChanged = function () {
				dropDownValueChanged.fire();
			};

			vm.getSelectedViews = function (paneName) {
				var viewObject = getObjectValueByKey(currentPanes, paneName);
				var paneConfig = _.find(paneConfigs, function (paneConfig) {
					return paneConfig.viewNo === _.get(viewObject, 'no');
				});
				return paneConfig ? paneConfig.views : [];
			};

			if (!currentViews) {
				currentViews = getViews();
				for (var i = 0; i < currentViews.length; i++) {
					currentViews[i].title = currentViews[i].title ? $translate.instant(currentViews[i].title) : 'No description available. User Container-Id: ' + currentViews[i].dependentDataId;
				}
				currentViews = _.sortBy(currentViews, function (view) {
					return view.title.toLowerCase();
				});
			}

			vm.items = currentViews;

			vm.getUnselectedViews = function () {
				return _.filter(vm.items, function (item) {
					return !item.isHidden;
				});
			};

			vm.resetItems = function () {
				vm.items = getViews();
			};

			var unregister = [$scope.$on('$destroy', function () {
				vm.resetItems();

				_.over(unregister)();
				unregister = null;
			})];

			return vm;

		}];
		directive.controllerAs = 'editorContentCtrl';
		return directive;
	};

	angular.module('platform').directive('layoutEditorContent', ['$templateCache', 'mainViewService', '_', 'layoutEditorService', LayoutEditorDirective]);

})(angular);
