(function (angular) {
	'use strict';
	var moduleName = 'basics.workflow';

	angular.module(moduleName).directive('basicsWorkflowModuleMultiSelect1', ['_', '$q', '$templateCache', '$compile', 'multiSelectAction',
		function (_, $q, $templateCache, $compile, multiSelectAction) {
			return {
				restrict: 'EA',
				require: 'ngModel',
				scope: {
					options: '=',
					Model: '='
				},
				link: linker
			};

			function linker(scope, element, attr, ctrl) {
				var scopeId = scope.$id;
				scope.options.id = scopeId;
				var options = scope.options;
				var parent = getOkParent();
				var okFn = parent.onOk;
				parent.onOk = function () {
					var selectedItems = multiSelectAction.getSelectedItems(scopeId);
					ctrl.$setViewValue(selectedItems ? selectedItems.items : []);
					okFn();
				};

				function getOkParent() {
					var parent = scope.$parent;
					while(parent)
					{
						if (parent && parent.isModalDialog && !parent.$parent.isModalDialog)
						{
							return parent;
						}
						parent = parent.$parent;
					}
					return parent;
				}

				var content = $templateCache.get('basics.workflow/multi-select.html');
				var modelName = 'model' + scopeId;
				content = content.replace('##model##', modelName);
				element.append($compile(content)(scope));

				ctrl.$render = function () {
					var items = multiSelectAction.setItems(options);
					var viewValue = ctrl.$viewValue;
					if (viewValue) {
						scope[modelName] = viewValue;
						var ddItems = [];
						_.forEach(viewValue, function (value) {
							var ddItem = _.find(items, {value: value});
							if (ddItem) {
								ddItems.push(ddItem);
							}
						});
						multiSelectAction.setSelectedItems(scopeId, ddItems);
					}
				};

				adjustStyle(scope, element);
			}

			function adjustStyle(scope, element) {
				var multipleContainer = element.find('.multiple-container');
				var totalWidth = 0;

				function adjust() {
					if (totalWidth === 0) {
						totalWidth = multipleContainer.width();
					}
					multipleContainer.css({
						width: totalWidth
					});
				}

				scope.$watch(function () {
					return element.find('.multiple-item').length;
				}, function () {
					setTimeout(adjust);
				});
			}
		}]);

	angular.module(moduleName).directive('basicsWorkflowModuleMultiSelect', ['_', '$q',
		'BasicsLookupdataLookupDirectiveDefinition', 'multiSelectAction',
		function (_, $q, BasicsLookupdataLookupDirectiveDefinition, multiSelectAction) {
			var parentId = 0;
			var defaults = {
				lookupType: 'multiSelect',
				valueMember: 'Id',
				displayMember: 'name',
				multipleSelection: true,
				showClearButton: true,
				events: [{
					name: 'onEditValueChanged',
					handler: function (e, args) {
						parentId = this ? this.$parent.$parent.options.id : parentId;
						multiSelectAction.setSelectedItems(parentId, args.selectedItems);
					}
				}]
			};
			var parent = {};
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function (options, scope) {
						parent = scope.$parent.$parent;
						parentId = parent.options.id;
						var items = multiSelectAction.getItems(parentId);
						return $q.when(items);
					},
					getItemByKey: function (value, options, scope) {
						parent = scope.$parent.$parent;
						parentId = parent.options.id;
						var items = multiSelectAction.getItems(parentId);
						var setting = _.find(items, function (item) {
							return item.value === value;
						});
						return setting;
					}
				}
			});
		}
	]);
})(angular);
