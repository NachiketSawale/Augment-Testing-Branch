(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeResourceRequisitionTypeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeResourceRequisitionTypeIconService', BasicsCustomizeResourceRequisitionTypeIconService);

	BasicsCustomizeResourceRequisitionTypeIconService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeResourceRequisitionTypeIconService(platformIconBasisService) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/%%replace%%');

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, 'basics.customize.reservationtype01', 'type-icons.svg#ico-reservation-type01'),
			platformIconBasisService.createUrlIconWithId(2, 'basics.customize.reservationtype02', 'type-icons.svg#ico-reservation-type02'),
			platformIconBasisService.createUrlIconWithId(3, 'basics.customize.reservationtype03', 'type-icons.svg#ico-reservation-type03'),
			platformIconBasisService.createUrlIconWithId(4, 'basics.customize.reservationtype04', 'type-icons.svg#ico-reservation-type04'),
			platformIconBasisService.createUrlIconWithId(5, 'basics.customize.reservationtype05', 'type-icons.svg#ico-reservation-type05'),
			platformIconBasisService.createUrlIconWithId(6, 'basics.customize.reservationtype06', 'type-icons.svg#ico-reservation-type06'),
			platformIconBasisService.createUrlIconWithId(7, 'basics.customize.reservationtype07', 'type-icons.svg#ico-reservation-type07'),
			platformIconBasisService.createUrlIconWithId(8, 'basics.customize.reservationtype08', 'type-icons.svg#ico-reservation-type08'),
		];

		platformIconBasisService.extend(icons, this);
	}
})();