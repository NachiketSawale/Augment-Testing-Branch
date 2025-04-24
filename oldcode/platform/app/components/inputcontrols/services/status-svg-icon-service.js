(function () {
	'use strict';
	var moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name platformStatusIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('platformStatusSvgIconService', platformStatusSvgIconService);

	platformStatusSvgIconService.$inject = ['platformIconBasisService', '_'];

	function platformStatusSvgIconService(platformIconBasisService, _) {

		var icons = [],
			totalIcon = 196; // Currently there are so many pictures.

		platformIconBasisService.setBasicPath('status-icons ico-status%%index%%');

		for (var i = 1; i <= totalIcon; i++) {
			// format number to have two digits
			icons.push(platformIconBasisService.createSvgIcon('cloud.common.status' + _.padStart(i, 2, '0')));
		}

		platformIconBasisService.extend(icons, this);
	}
})();
