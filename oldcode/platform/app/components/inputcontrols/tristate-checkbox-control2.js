/*
 Usage:
 <input type="checkbox" tristatechk2 data-child-list="itemList" data-property="isVisible"
 data-ng-model="visibility" ng-click="refreshGrid()">

 attributes:
 data-child-list:    list of items which will be bound outside of this directive to a checkbox list for example.
 data-property:      property of the item which will be watched on change
 data-ng-model:      the model for this directive
 ng-click:           event to be executed on click

 // in controller
 $scope.itemList = [
 {Id: 0, name: 'apples', isVisible: true},
 {Id: 1, name: 'bananas', isVisible: false},
 {Id: 1, name: 'pies', isVisible: true},
 ];
 // binding this array to the directive and setting the data-property to the isVisible property of each item
 // will result in a tri-state checkbox which is set by the changes of the items or can set the items by changing the check status of the directive
 // the three different states are: true, false, 'unknown'
 */

(function (angular) {
	'use strict';

	angular.module('platform')
		.directive('tristatechk2', ['platformObjectHelper', function (platformObjectHelper) {
			return {
				scope: true,
				require: '?ngModel',
				link: function (scope, element, attrs, modelCtrl) {
					var childList = attrs.childList;
					var property = attrs.property;

					element.bind('change', function () {
						scope.$apply(function () {
							var isChecked = element.prop('checked');

							angular.forEach(scope.$eval(childList), function (child) {
								// child[property] = isChecked;
								platformObjectHelper.setValue(child, property, isChecked);
							});
						});
					});

					// Watch the children for changes
					var watchUnregister = scope.$watch(childList, function (newValue) {
						var hasChecked = false;
						var hasUnchecked = false;

						angular.forEach(newValue, function (child) {
							var check = platformObjectHelper.getValue(child, property);
							if (check) {
								hasChecked = true;
							} else {
								hasUnchecked = true;
							}
						});

						// Determine which state to put the checkbox in
						if (hasChecked && hasUnchecked) {
							element.prop('checked', false);
							element.prop('indeterminate', true);
							if (modelCtrl) {
								modelCtrl.$setViewValue(false);
							}
						} else {
							element.prop('checked', hasChecked);
							element.prop('indeterminate', false);
							if (modelCtrl) {
								modelCtrl.$setViewValue(hasChecked);
							}
						}
					}, true);

					// unregister
					element.on('$destroy', function () {
						watchUnregister();
					});
				}
			};
		}]);

})(angular);