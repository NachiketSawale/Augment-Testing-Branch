/**
 * Created by alm on 10/20/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.ticketsystem').directive('ticketSystemShowPrice', ['platformPermissionService',
		function (platformPermissionService) {
			return {
				restrict: 'A',
				replace:false,
				link: function ($scope, elem/* , attrs */) {
					platformPermissionService.loadPermissions(['1dccc95e20e34480b54f0b345002eb59']).then(function () {
						var showPrice = platformPermissionService.hasRead('1dccc95e20e34480b54f0b345002eb59');
						if (!showPrice) {
							elem.text('-.--');
						}
					});
				}
			};
		}
	]);
})(angular);
