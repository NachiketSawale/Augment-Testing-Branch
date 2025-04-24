(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 * Combobox to select an item from a list
	 */

	// OBSOLET - use platformDropDown instead !

	angular.module('platform').directive('platformSimpleCombo', ['$injector', function ($injector) {

		var template = '<select class="form-control" data-ng-model="selectedItem" data-ng-options="item[displayMember] for item in items"> \
                      <option value="" ng-hide="selectedItem">{{ selectedItem[displayMember]  || "no matches" }}</option></select>';

		return {

			restrict: 'A',

			scope: {
				ngModel: '=',
				controlOptions: '=',
				entity: '='
			},

			// templateUrl: globals.appBaseUrl + 'app/templates/simplecombo.html',
			template: template,

			link: link

		};

		function link(scope/*, element, attrs*/) {

			if (angular.isUndefined(scope.controlOptions)) {
				throw new Error('platformSimpleCombo : parameter controlOptions is undefined !');
			}

			scope.options = scope.controlOptions.options;
			scope.displayMember = scope.options.displayMember;
			scope.valueMember = scope.options.valueMember;

			scope.selectedItem = {};
			var locateSelectedItem = function () {

				// ngModel is already the selectedItem
				if (angular.isObject(scope.ngModel)) {
					scope.selectedItem = scope.ngModel;
				} else {
					// search selectedItem by valueMember
					for (var i = 0, len = scope.items.length; i < len; i++) {
						if (scope.items[i][scope.valueMember] === scope.ngModel) {
							scope.selectedItem = scope.items[i];
							break;
						}
					}
				}
			};

			scope.items = [];
			if (angular.isString(scope.options.serviceName)) {    // get items from a service

				var dataService = $injector.get(scope.options.serviceName);
				// service must contain loadData() and getList() function !
				// todo verify this
				dataService.loadData().then(function () {
					scope.items = dataService.getList();
					locateSelectedItem();
				});
			} else {
				scope.items = scope.options.items;
				locateSelectedItem();
			}

			// update ngModel
			scope.$watch('selectedItem', function (selectedItem) {

				if (selectedItem) {
					var modelValue;
					if (angular.isObject(scope.ngModel)) {
						modelValue = scope.selectedItem;
					} else {
						modelValue = selectedItem[scope.valueMember];
					}
					scope.ngModel = modelValue;
				}
			}, true);

			// update selectedItem
			scope.$watch('ngModel', function (newValue, oldValue) {
				if (newValue !== oldValue) {
					locateSelectedItem();
					// scope.$apply;
				}
			});

		}

	}]);

})(angular);
