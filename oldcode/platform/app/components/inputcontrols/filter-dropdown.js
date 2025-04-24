(function (angular) {
	'use strict';

	angular.module('platform')
		.directive('filterdropdown', ['$timeout', function ($timeout) {
			return {
				restrict: 'AE',
				scope: {
					ngModel: '=',
					onSelectionChanged: '&',
					options: '='
				},
				template: [
					'<div class="dropdown">',
					'<div class="input-group" data-toggle="dropdown" aria-expanded="true">',
					'<input type="text" class="form-control" ng-model="options.selectedItem[options.displayMember]" data-ng-change="contentChanged(selItem)">',
					'<span class="input-group-btn">',
					'<button class="btn btn-default" type="button">Go!</button>',
					'</span>',
					'</div>',
					'<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownmenu1">',
					'<li role="presentation" ng-repeat="item in options.items | filter: selItem[options.displayMember]">',
					'<a role="menuitem" tabindex="-1" ng-click="setItem(item[options.valueMember])">{{item[options.displayMember] }}</a>',
					'</li>',
					'</ul>',
					'</div>'
				].join(''),
				link: function (scope, ele) {

					scope.setItem = function (itemValue, initial) {
						scope.options.selectedItem = scope.selItem = getItem(itemValue);
						if (scope.onSelectionChanged && !initial) {
							scope.onSelectionChanged({item: scope.selItem});
						}
					};

					scope.contentChanged = function (item) {
						if (scope.selItem) {
							scope.options.selectedItem = angular.copy(scope.selItem);
							scope.options.selectedItem.id = -1;
							scope.options.selectedItem.viewName = ele.find('input').val();
						} else {
							scope.options.selectedItem.id = -1;
							scope.options.selectedItem.viewName = ele.find('input').val();
						}
					};

					function getItem(value) {
						for (var i = 0; i < scope.options.items.length; i++) {
							if (scope.options.items[i][scope.options.valueMember] === value) {
								return angular.copy(scope.options.items[i]);
							}
						}
					}

					if (scope.options.selected) {
						$timeout(function () {
							scope.setItem(scope.options.selected, true);
						}, 0);
					}
				}
			};
		}]);
})(angular);