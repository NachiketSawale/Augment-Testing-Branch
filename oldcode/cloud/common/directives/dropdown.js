(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 * DropDown to select an item from a list
	 */

	angular.module('platform').directive('platformDropDown', ['_','$injector', '$q', function (_, $injector, $q) {

//      var template = '<select class="form-control" data-ng-model="selectedItem" ng-change="ngChange()" data-ng-disabled="controlOptions.disabled || false"  data-ng-options="item[displayMember] for item in items" > \
//                      <option value="" ng-hide="selectedItem">{{ selectedItem[displayMember]  || "no matches" }}</option></select>';

		var template = '<select class="form-control" data-ng-model="selectedItem" data-ng-change="onChange()" data-ng-disabled="controlOptions.disabled || !entity.Id" data-ng-options="item[displayMember] for item in items" >' +
			'<option value="" data-ng-hide="selectedItem">{{selectedItem[displayMember] || "no matches"}}</option></select>';

		return {
			restrict: 'A',
			require:'^ngModel',
			scope: {
				ngModel: '=',
				controlOptions: '=?',
				options: '=?',
				entity: '='
			},
			// templateUrl: globals.appBaseUrl + 'app/templates/simplecombo.html',
			template: template,
			link: link
		};
		function link(scope /*, element, attrs*/) {

			if (!scope.options) {
				scope.options = scope.controlOptions.options ? scope.controlOptions.options : scope.controlOptions;
			}

			if (_.isUndefined(scope.options)) {
				throw new Error('platformDropDown: parameter options|controlOptions undefined!');
			}
			scope.displayMember = scope.options.displayMember;
			scope.valueMember = scope.options.valueMember;
//         below line commented to fix bug in dropdown of modal window: this caused selectedItem undefined everytime when opening modal window
//         scope.selectedItem = {};
			var locateSelectedItem = function () {
				// ngModel is already the selectedItem
				if (angular.isObject(scope.ngModel)) {
					scope.selectedItem = scope.ngModel;
				}
				else {
					// search selectedItem by valueMember
					scope.items.forEach(function (item) {
						if (item[scope.valueMember] === scope.ngModel) {
							scope.selectedItem = item;
						}
					});
				}
			};

			scope.items = [];
			if (angular.isString(scope.options.serviceName)) {    // get items from a service

				var dataService = $injector.get(scope.options.serviceName);
				if (angular.isString(scope.options.serviceDataFunction)) {
					dataService[scope.options.serviceDataFunction]().then(function (data) {
						scope.items = data;
						locateSelectedItem();
					});
				} else {
					// service must contain loadData() and getList() function !
					// todo verify this
					dataService.loadData().then(function () {
						scope.items = dataService.getList();
						locateSelectedItem();
					});
				}
			} else {
				// because ng-model is not already set we postpone this selection behind the directive link cycle
				// discuss with Michael Spreu, >>> pre post link fucntions might be better
				var deffered = $q.defer();
				deffered.resolve(scope.options.items);
				deffered.promise.then(function (data) {
					scope.items = data;
					locateSelectedItem();
				});
			}

			// update ngModel
			scope.$watch('selectedItem', function (selectedItem) {

				if (selectedItem) {
					var modelValue;
					if (angular.isObject(scope.ngModel)) {
						modelValue = scope.selectedItem;
					}
					else {
						modelValue = selectedItem[scope.valueMember];
					}
					scope.ngModel = modelValue;
				}
			}, true);

			// update selectedItem
			scope.$watch('ngModel', function (newValue, oldValue) {
				if (newValue !== oldValue) {
					locateSelectedItem();
				}
			}, true);

			//call platform form change function
			scope.onChange = function () {
				if(_.isFunction(scope.options.change)) {
					scope.options.change(scope.selectedItem, scope.controlOptions.model);
				}
			};
		}
	}]);
})(angular);
