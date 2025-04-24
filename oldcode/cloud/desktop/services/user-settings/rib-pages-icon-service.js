(function () {
	'use strict';
	var moduleName = 'cloud.desktop';

	/**
	 * @ngdoc service
	 * @name cloudDesktopRibPagesIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('cloudDesktopRibPagesIconService', cloudDesktopRibPagesIconService);

	cloudDesktopRibPagesIconService.$inject = ['platformIconBasisService'];

	function cloudDesktopRibPagesIconService(platformIconBasisService) {
		var self = {};
		var icons = [];
		platformIconBasisService.setBasicPath('app-icons %%replace%%');
		icons.push(platformIconBasisService.createCssIconWithId(true, undefined, 'ico-rib-logo'));
		icons.push(platformIconBasisService.createCssIconWithId(false, undefined, ''));

		platformIconBasisService.extend(icons, self, 'rib');

		return self;
	}
})();
