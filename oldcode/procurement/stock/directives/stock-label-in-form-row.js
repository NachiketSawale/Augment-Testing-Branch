// eslint-disable-next-line no-redeclare
/* global angular */

( function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	angular.module(moduleName).directive('procurementStockLabelInFormRow', ['$translate',
		function ($translate) {
			return {
				restrict: 'AE',
				scope: false,
				link: function (scope, elem, attrs) {
					var config = !attrs.config || scope.$eval(attrs.config);

					elem.append('<label style="padding: 5px 0 0;">' + $translate.instant(config.options.label) + '</label>');
				}
			};
		}
	]);

})(angular);
