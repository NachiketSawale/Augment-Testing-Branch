/**
 * Created by Frank Baedeker on 10/03/2017.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeCostCodeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeSiteTypeIconService', BasicsCustomizeSiteTypeIconService);

	BasicsCustomizeSiteTypeIconService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeSiteTypeIconService(platformIconBasisService) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/type-icons.svg#ico-facilities-%%index%%');

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, 'basics.customize.facility01'),
			platformIconBasisService.createUrlIconWithId(2, 'basics.customize.facility02'),
			platformIconBasisService.createUrlIconWithId(3, 'basics.customize.facility03'),
			platformIconBasisService.createUrlIconWithId(4, 'basics.customize.facility04'),
			platformIconBasisService.createUrlIconWithId(5, 'basics.customize.facility05'),
			platformIconBasisService.createUrlIconWithId(6, 'basics.customize.facility06'),
			platformIconBasisService.createUrlIconWithId(7, 'basics.customize.facility07'),
			platformIconBasisService.createUrlIconWithId(8, 'basics.customize.facility08')
		];

		platformIconBasisService.extend(icons, this);
	}
})();
