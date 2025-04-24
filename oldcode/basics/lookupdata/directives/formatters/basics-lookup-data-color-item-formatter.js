(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsLookupDataColorItemFormatter', ['platformObjectHelper',

		function (platformObjectHelper) {

			var service = {};

			service.formatter = function (value, dataItem, displayValue, settings) {
				var formattedResult = displayValue;
				if (dataItem && platformObjectHelper.isSet(dataItem.Color) && settings && settings.filter && settings.filter.customIntegerProperty && settings.filter.field && settings.filter.field.toLowerCase() === 'color') {
					var color = _.padStart(dataItem.Color.toString(16), 7, '#000000');
					formattedResult = '<button type="button" class="btn btn-default btn-colorpicker" style="background-color:' + color + ';margin-right:2px"></button>' + displayValue;
				}
				return formattedResult;
			};
			return service;

		}]);
})(angular);


