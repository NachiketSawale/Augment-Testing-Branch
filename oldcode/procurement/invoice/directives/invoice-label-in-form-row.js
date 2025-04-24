( function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.invoice').directive('procurementInvoiceLabelInFormRow', ['$translate',
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