(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeResourcePartTypeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeResourcePartTypeIconService', BasicsCustomizeResourcePartTypeIconService);

	BasicsCustomizeResourcePartTypeIconService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeResourcePartTypeIconService(platformIconBasisService) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/%%replace%%');

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, 'basics.customize.equipment', 'app-small-icons.svg#ico-equipment'),
			platformIconBasisService.createUrlIconWithId(2, 'basics.customize.employee', 'app-small-icons.svg#ico-employee')
		];

		platformIconBasisService.extend(icons, this);
	}
})();