/*
 usage:
 <dropdown-btn option="option" ng-model="selectedItem" on-selection-changed="test1(item)">
 </dropdown-btn>

 $scope.option = {
 displayMember: 'lastname',
 valueMember: 'Id',
 items: [
 {Id: 101, lastname: 'Helmut'},
 {Id: 102, lastname: 'dimi'},
 {Id: 103, lastname: 'Dimi3'},
 {Id: 104, lastname: 'Dimi4'}
 ],
 selected:'101'
 };
 */

(function () {
	'use strict';

	angular.module('platform')
		.directive('platformDropdownBtn', ['$timeout', '$templateCache', function ($timeout, $templateCache) {
			return {
				restrict: 'AE',

				scope: {
					ngModel: '=',
					options1: '=',
					onSelectionChanged: '&',
					onSelectionCleared: '&',
					onRemoveDropdown: '&'
				},
				template: $templateCache.get('layout-DropDownBtn.html'),
				link: function (scope, element) {
					if (scope.ngModel) {
						scope.selectedItem = scope.ngModel;
					}

					var watchUnregister = scope.$watch('selectedItem', function (newValue, oldvalue) {
						if (newValue !== oldvalue) {
							scope.ngModel = scope.selectedItem;
						}
					});

					scope.clearSelection = function () {
						if (scope.onSelectionCleared) {
							scope.onSelectionCleared({item: scope.selectedItem});
						}
						scope.selectedItem = {};
						scope.options1.selected = null;
					};

					scope.removeDropdown = function () {

						if (scope.onRemoveDropdown) {
							scope.onRemoveDropdown(scope.option);
						}
						scope.clearSelection();
					};

					scope.isSelected = function () {
						return scope.selectedItem ? true : false;
					};
					scope.setItem = function (itemValue, initial) {
						var prevItem = scope.selectedItem;
						scope.selectedItem = getItem(itemValue);
						if (scope.onSelectionChanged && !initial) {
							scope.onSelectionChanged({item: scope.selectedItem, prevItem: prevItem});

						}
						scope.options1.selected = itemValue;
					};

					function getItem(value) {
						for (var i = 0; i < scope.options1.items.length; i++) {
							if (scope.options1.items[i][scope.options1.valueMember] === value) {
								return scope.options1.items[i];
							}
						}
					}

					if (scope.options1.selected) {
						$timeout(function () {
							scope.setItem(scope.options1.selected, true);
						}, 0);
					}

					// unregister
					element.on('$destroy', function () {
						watchUnregister();
					});
				}
			};
		}]);
})();