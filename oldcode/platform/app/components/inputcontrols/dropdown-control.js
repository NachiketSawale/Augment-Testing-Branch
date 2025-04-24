/*
 Usage: <dropdownctrl ng-model="model" options="options" on-selection-changed="changeEvent(value)"></dropdownctrl>
 attributes:
 ng-model: 			the angular data model. could be an item of the options.items array like: options.items[0] for the first item
 options: 			contains an object with an array of items to be populated
 options = {
 displayMember: 'description',
 valueMember: 'Id',
 serviceName: 'serviceName',
 serviceMethod: 'serviceMethod',
 items: [
 {Id: 101, description: 'mm'},
 {Id: 102, description: 'cm'},
 {Id: 103, description: 'm'},
 {Id: 104, description: 'km'}
 ]
 }
 displayMember: The property which will be displayed
 valueMember: the property which will be used as value
 serviceName: the service which will be used to populate data
 serviceMethod: the service method name which will be used to populate data
 items: the item collection if no service will be used to populate the data
 readonly: 			set the control to editable or readonly
 */

(function () {
	'use strict';

	angular.module('platform')
		.directive('dropdownctrl', ['$compile', '$timeout', '$injector', function ($compile, $timeout, $injector) {

			return {
				restrict: 'E',
				require: '^ngModel',
				scope: {
					ngModel: '=',
					options: '=',
					onSelectionChanged: '&'
				},
				link: function (scope, elem, attrs, ctrl) {
					var template = '<select ng-model="ngModel" ng-disabled="@@readonly@@" ng-options="a[options.displayMember] for a in options.items track by a[options.valueMember]" ng-change="onChange()" class="form-control"></select>';

					if (angular.isString(scope.options.serviceName)) {
						var service = $injector.get(scope.options.serviceName);
						if (angular.isString(scope.options.serviceMethod)) {
							service[scope.options.serviceMethod]().then(function (data) {
								scope.options.items = data;
							});
						} else {
							service.loadData().then(function () {
								scope.options.items = service.getList();
							});
						}
					}
					template = template.replace('@@readonly@@', attrs.readonly);
					var linkFn = $compile(template);
					var content = linkFn(scope);
					elem.replaceWith(content);

					$timeout(function () {
						ctrl.$setViewValue(scope.ngModel);
						ctrl.$render();
					}, 0);

					scope.onChange = function () {
						scope.onSelectionChanged({item: scope.ngModel});
					};
				}
			};
		}]);
})();