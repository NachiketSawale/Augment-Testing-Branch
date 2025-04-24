(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.ticketsystem').directive('ticketSystemOrderRequestList',
		['$translate',
			function ($translate) {
				return {
					restrict: 'A',
					scope: {
						orderOption: '=',
						orderList: '='
					},
					templateUrl: globals.appBaseUrl + 'procurement.ticketsystem/templates/order-request-row.html',
					link: function ($scope) {
						$scope.htmlTranslate = {
							quantity: $translate.instant('procurement.ticketsystem.orderRequest.quantity'),
							price: $translate.instant('procurement.ticketsystem.orderRequest.price'),
							clerk: $translate.instant('procurement.ticketsystem.orderRequest.clerk'),
							status: $translate.instant('procurement.ticketsystem.orderRequest.status'),
							subTotal:$translate.instant('procurement.ticketsystem.htmlTranslate.subTotal')
						};
					}
				};
			}]);
})(angular);