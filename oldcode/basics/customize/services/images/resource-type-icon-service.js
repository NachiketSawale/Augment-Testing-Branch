/**
 * Created by Frank Baedeker on 24/05/2017.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeResourceTypeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeResourceTypeIconService', BasicsCustomizeResourceTypeIconService);

	BasicsCustomizeResourceTypeIconService.$inject = ['_', 'platformIconBasisService'];

	function BasicsCustomizeResourceTypeIconService(_, platformIconBasisService) {
		
		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/type-icons.svg#ico-resource%%index%%');

		var icons = [];

		for(var i=1; i<=30; ++i)
		{
			icons.push(platformIconBasisService.createUrlIconWithId(i, 'basics.customize.resourcetype' + _.padStart(i, 2, '0')));
		}

		platformIconBasisService.extend(icons, this);
	}
})();
