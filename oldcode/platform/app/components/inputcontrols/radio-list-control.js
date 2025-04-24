/*
 Usage:
 <radiolistctrl options="options" on-selection-changed="changedEvent(value)" readonly="readonly"></radiolistctrl>
 attributes:
 ng-model: The angular data model
 options: object containing the items collection in the radioButtons property
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
 };
 displayMember: the property which will be displayed
 valueMember: the property which will be used as value
 serviceName: the service which will be used to populate data
 serviceMethod: the service method name which will be used to populate data
 items: array containing the items to populate the control if no service should be used
 onSelectionChanged: event is fired on radio button click
 readonly: sets the control editable or readonly
 */

(function (angular) {
	'use strict';

	angular.module('platform')
		.directive('radiolistctrl', ['$injector', '$timeout', function ($injector, $timeout) {
			return {
				restrict: 'EA',
				require: '^ngModel',
				scope: {
					ngModel: '=',
					options: '=',
					onSelectionChanged: '&',
					readonly: '='
				},
				template: [
					'<div ng-repeat="item in options.items" class="radio {{item[options.cssMember]}}">',
					'<label title="{{ options.tooltipMember ? item[options.tooltipMember] : item.tooltip }}" for="{{item[options.valueMember]}}">' +
					'<input type="radio" id="{{item[options.valueMember]}}" ng-model="ngModel" ng-value="{{item[options.valueMember]}}" name="radioGroup" ng-click="optionChanged(item[options.valueMember])" ng-disabled="readonly">',
					'{{item[options.displayMember]}}</label></div>'
				].join(''),
				link: function (scope, elem, attrs, ctrl) {
					elem.addClass('radio-list');

					if (angular.isString(scope.options.cssClass)) {
						elem.addClass(scope.options.cssClass);
					}

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

					$timeout(function () {
						ctrl.$setViewValue(scope.ngModel);
						ctrl.$render();
					}, 0);

					scope.optionChanged = function (item) {
						scope.onSelectionChanged({value: item});
					};
				}
			};
		}])
		.directive('simpleradioControl', function () {
			var templateHtml = function () {
				return '<div class="radio spaceToUp" ng-repeat="(key, option) in options.valueList">' +
					'<label><input type="radio" name="{{option.name}}" ng-value="option.value" ng-model="$parent.ngModel" ng-required="options.required" />' +
					'{{option.title}}</label>' +
					'</div>';
			};

			return {
				scope: {options: '=', ngModel: '='},
				require: 'ngModel',
				restrict: 'E',
				template: templateHtml
			};
		});
})(angular);