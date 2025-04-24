/**
 * Created by wui on 5/18/2018.
 */

/* jshint -W098 */
/* jshint -W040 */
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).constant('modelWdeViewerTreeViewOptions', {
		childProp: 'subItems',
		textProp: 'text',
		idProp: 'id',
		itemTemplate: ''
	});

	angular.module(moduleName).directive('modelWdeViewerCompileBindHtml', ['$compile',
		function ($compile) {
			return {
				restrict: 'AE',
				link: function (scope, element, attrs) {
					var func = function () {
						return scope.$eval(attrs.modelWdeViewerCompileBindHtml);
					};

					var unwatch = scope.$watch(func, function (newValue) {
						element.html(newValue);
						$compile(element.contents())(scope);
					});

					scope.$on('$destroy', unwatch);
				}
			};
		}
	]);

	angular.module(moduleName).directive('modelWdeViewerTreeView', ['modelWdeViewerTreeViewOptions', '$templateCache',
		function (modelWdeViewerTreeViewOptions, $templateCache) {
			function ItemView(model, parent, indent, options) {
				this.model = model;
				this.parent = parent;
				this.indent = indent;
				this.options = options;
				this.selected = false;

				var children = this.model[this.options.childProp];

				if (angular.isArray(children) && children.length) {
					this.hasChildren = true;
				} else {
					this.hasChildren = false;
				}
			}

			ItemView.prototype.getText = function () {
				return this.model[this.options.textProp];
			};

			ItemView.prototype.getTemplate = function () {
				var self = this, template;

				if (angular.isFunction(self.options.itemTemplate)) {
					template = self.options.itemTemplate(self.model);
				} else {
					template = self.options.itemTemplate;
				}

				return template || self.getText();
			};

			ItemView.prototype.getIndentHtml = function () {
				var html = '';
				var count = 0;
				var indentHtml = $templateCache.get('tree-view-indent.html');

				while (count < this.indent) {
					html += indentHtml;
					count++;
				}

				return html;
			};

			ItemView.prototype.toggle = function () {
				if (this.hasChildren) {
					this.model.expanded = !this.model.expanded;

					if (angular.isFunction(this.options.toggle)) {
						this.options.toggle(this.model);
					}
				}
			};

			ItemView.prototype.select = function () {
				this.model.selected = true;
			};

			ItemView.prototype.cancel = function () {
				this.model.selected = false;
			};

			function controller($scope) {
				var self = this;

				$scope.settings = $.extend({}, modelWdeViewerTreeViewOptions, $scope.options || {}, {
					toggle: function () {
						$scope.viewItems = $scope.ctrl.updateViewItems($scope.items, $scope.settings);
					}
				});

				$scope.viewItems = [];
				$scope.selectedViewItem = null;

				$scope.select = function (viewItem) {
					if ($scope.selectedViewItem) {
						$scope.selectedViewItem.cancel();
					}

					$scope.selectedViewItem = viewItem;
					$scope.selectedViewItem.select();

					if ($scope.selected !== viewItem.model) {
						$scope.selected = viewItem.model;
					}
				};

				self.updateViewItems = updateViewItems;
				self.findViewItem = findViewItem;
				self.selectByModel = selectByModel;
				self.updateView = updateView;

				function updateViewItems(items, options) {
					var result = [];
					var indent = 0;

					if (!angular.isArray(items)) {
						items = [];
					}

					items.forEach(function (item) {
						result.push(new ItemView(item, null, indent, $scope.settings));
						result = result.concat(getSubItems(item, options, indent + 1));
					});

					return result;
				}

				function getSubItems(item, options, indent) {
					var result = [];
					var subItems = item[options.childProp];

					if (item.expanded && angular.isArray(subItems)) {
						subItems.forEach(function (subItem) {
							result.push(new ItemView(subItem, item, indent, $scope.settings));
							result = result.concat(getSubItems(subItem, options, indent + 1));
						});
					}

					return result;
				}

				function findViewItem(model) {
					return _.find($scope.viewItems, {model: model});
				}

				function selectByModel(model) {
					var viewItem = findViewItem(model);

					if (viewItem) {
						$scope.select(viewItem);
					}
				}

				function updateView() {
					$scope.viewItems = updateViewItems($scope.items, $scope.settings);
					selectByModel($scope.selected);
				}
			}

			function link(scope, element) {
				scope.$watchCollection('items', function () {
					scope.ctrl.updateView();
				}, true);

				scope.$watch('selected', function () {
					scope.ctrl.selectByModel(scope.selected);
				});

				scope.$on('update-tree-view', function () {
					scope.ctrl.updateView();
				});
			}

			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/tree-view.html',
				scope: {
					items: '=',
					selected: '=?',
					options: '='
				},
				controllerAs: 'ctrl',
				controller: ['$scope', controller],
				link: link
			};
		}
	]);

})(angular);