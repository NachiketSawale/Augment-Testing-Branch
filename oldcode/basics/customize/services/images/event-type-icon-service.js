/**
 * Created by Michael Alisch on 12/08/2015.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeEventIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeEventIconService', BasicsCustomizeEventIconService);

	BasicsCustomizeEventIconService.$inject = ['_', 'platformIconBasisService'];

	function BasicsCustomizeEventIconService(_, platformIconBasisService) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/type-icons.svg#ico-event%%index%%');

		var icons = [];
		for (var i = 1; i <= 40; i++) {
			icons.push(platformIconBasisService.createUrlIconWithId(i, 'basics.customize.type' + _.padStart(i, 2, '0')));
		}

		platformIconBasisService.extend(icons, this);
	}
})();
