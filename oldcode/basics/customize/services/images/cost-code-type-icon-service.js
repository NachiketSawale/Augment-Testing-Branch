/**
 * Created by Michael Alisch on 12/08/2015.
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
	angular.module(moduleName).service('basicsCustomizeCostCodeIconService', BasicsCustomizeCostCodeIconService);

	BasicsCustomizeCostCodeIconService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeCostCodeIconService(platformIconBasisService) {
		
		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/type-icons.svg#ico-ccode%%index%%');

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, 'basics.customize.ccode01'),
			platformIconBasisService.createUrlIconWithId(2, 'basics.customize.ccode02'),
			platformIconBasisService.createUrlIconWithId(3, 'basics.customize.ccode03'),
			platformIconBasisService.createUrlIconWithId(4, 'basics.customize.ccode04')
		];

		platformIconBasisService.extend(icons, this);
	}
})();
