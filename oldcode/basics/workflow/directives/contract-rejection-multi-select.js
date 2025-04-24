(function (angular) {
	'use strict';
	let moduleName = 'basics.workflow';

	angular.module(moduleName).directive('contractRejectionMultiSelectContainer', ['_', '$q', '$templateCache', '$compile', 'multiSelectAction',
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
				let scopeId = scope.$id;
				scope.options.id = scopeId;
				multiSelectAction.contractRejectScopeId = scopeId;

				let options = scope.options;
				let parent = getOkParent();

				function getOkParent() {
					let parent = scope.$parent;
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

				let content = $templateCache.get('basics.workflow/contract-multi-select.html');
				let modelName = 'model' + scopeId;

				ctrl.$render = function () {
					multiSelectAction.clearItemByScopeId(scope.$id);
					scope.options.id = scope.$id;
					options = scope.options;
					let items = multiSelectAction.setItems(options);
					let viewValue = ctrl.$viewValue;
					if (viewValue) {
						scope[modelName] = viewValue;
						let ddItems = [];
						_.forEach(viewValue, function (value) {
							let ddItem = _.find(items, {value: value});
							if (ddItem) {
								ddItems.push(ddItem);
							}
						});
						multiSelectAction.setSelectedItems(scopeId, ddItems);
						content = content.replace('##model##', modelName);
						element.children().remove();
						element.append($compile(content)(scope));
					}
				};

				adjustStyle(scope, element);

				let selectedItemWatch = scope.$watch(function(){
					return multiSelectAction.getSelectedItems(scopeId);
				},function(nextVal){
					parent.onChange(nextVal);
				});

				scope.$on('$destroy', function () {
					selectedItemWatch();
				});
			}

			function adjustStyle(scope, element) {
				let multipleContainer = element.find('.multiple-container');
				let totalWidth = 0;

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

	angular.module(moduleName).directive('contractRejectionMultiSelect', ['_', '$q', 'BasicsLookupdataLookupDirectiveDefinition', 'multiSelectAction',
		function (_, $q, BasicsLookupDataLookupDirectiveDefinition, multiSelectAction) {
			let parentId = 0;
			let defaults = {
				lookupType: 'multiSelect',
				valueMember: 'Id',
				displayMember: 'name',
				multipleSelection: true,
				showClearButton: true,
				disableDataCaching:true,
				selectableCallback : function(dataItem, entity, settings){
					let selectedItemIds = settings.dataProvider.getSelectedItemsByScopeId(multiSelectAction.contractRejectScopeId);
					let allItems = settings.dataProvider.getItemsByScopeId(multiSelectAction.contractRejectScopeId);
					let isNotValid = false;
					if(allItems.length>1){
						// If all is selected then other roles should not be selected
						isNotValid = selectedItemIds.items.includes(allItems[0].Id);

						// if any other role is selected then all should not be selected
						if (selectedItemIds.items.length > 0 && !selectedItemIds.items.includes(allItems[0].Id)) {
							isNotValid = allItems[0].Id === dataItem.Id;
						}
					}

					return !isNotValid;
				},
				events: [{
					name: 'onEditValueChanged',
					handler: function (e, args) {
						parentId = this ? this.$parent.$parent.options.id : parentId;
						multiSelectAction.clearSelectedItemsByScopeId(parentId);
						multiSelectAction.setSelectedItems(parentId, args.selectedItems);
					}
				}]
			};
			let parent = {};
			return new BasicsLookupDataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function (options, scope) {
						parent = scope.$parent.$parent;
						parentId = parent.options.id;
						let items = multiSelectAction.getItems(parentId);
						return $q.when(items);
					},
					getItemByKey: function (value, options, scope) {
						parent = scope.$parent.$parent;
						parentId = parent.options.id;
						let items = multiSelectAction.getItems(parentId);
						return _.find(items, function (item) {
							return item.value === value;
						});
					},
					getSelectedItemsByScopeId: function (scopeId) {
						return multiSelectAction.getSelectedItems(scopeId);
					},
					getItemsByScopeId: function (scopeId) {
						return multiSelectAction.getItems(scopeId);
					}
				}
			});
		}
	]);
})(angular);
