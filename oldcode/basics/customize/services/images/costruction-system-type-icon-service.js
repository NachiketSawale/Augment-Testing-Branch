/**
 * Created by Frank Baedeker on 29/04/2016.
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
	angular.module(moduleName).service('basicsCustomizeConstructionIconService', BasicsCustomizeConstructionIconService);

	BasicsCustomizeConstructionIconService.$inject = ['_', 'platformIconBasisService'];

	function BasicsCustomizeConstructionIconService(_, platformIconBasisService) {
		
		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/type-icons.svg#ico-construction%%index%%');

		var icons = [];

		for(var i=1; i<=65; ++i)
		{
			icons.push(platformIconBasisService.createUrlIconWithId(i, 'basics.customize.construction' + _.padStart(i, 2, '0')));
		}

		platformIconBasisService.extend(icons, this);
	}
})();
