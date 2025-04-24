(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeModelObjectTextureIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeModelObjectTextureIconService', BasicsCustomizeModelObjectTextureIconService);

	BasicsCustomizeModelObjectTextureIconService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeModelObjectTextureIconService(platformIconBasisService) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/%%replace%%');

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, 'basics.customize.2dqtotexcrosshatch', 'tlb-icons.svg#ico-2dqto-texcrosshatch'),
			platformIconBasisService.createUrlIconWithId(2, 'basics.customize.2dqtotexdiamonds', 'tlb-icons.svg#ico-2dqto-texdiamonds'),
			platformIconBasisService.createUrlIconWithId(3, 'basics.customize.2dqtotexhorizontal', 'tlb-icons.svg#ico-2dqto-texhorizontal'),
			platformIconBasisService.createUrlIconWithId(4, 'basics.customize.2dqtotexvertical', 'tlb-icons.svg#ico-2dqto-texvertical'),
			platformIconBasisService.createUrlIconWithId(5, 'basics.customize.2dqtotexslantleft', 'tlb-icons.svg#ico-2dqto-texslantleft'),
			platformIconBasisService.createUrlIconWithId(6, 'basics.customize.2dqtotexslantright', 'tlb-icons.svg#ico-2dqto-texslantright'),
			platformIconBasisService.createUrlIconWithId(7, 'basics.customize.2dqtotexsolid', 'tlb-icons.svg#ico-2dqto-texsolid')
		];

		platformIconBasisService.extend(icons, this);
	}
})();
