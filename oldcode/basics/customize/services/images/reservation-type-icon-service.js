(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeReservationTypeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeReservationTypeIconService', ReservationTypeIconService);

	ReservationTypeIconService.$inject = ['platformIconBasisService', '_'];

	function ReservationTypeIconService(platformIconBasisService, _) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/%%replace%%');
		var icons = [];
		_.times(8, function (i) {
			i = i + 1;
			icons.push(platformIconBasisService.createUrlIconWithId(i, 'basics.customize.reservationtype0' + i, 'type-icons.svg#ico-reservation-type0' + i));
		});

		platformIconBasisService.extend(icons, this);
	}
})();
