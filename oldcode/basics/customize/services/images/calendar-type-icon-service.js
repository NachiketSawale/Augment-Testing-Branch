/**
 * Created by Michael Alisch on 12/08/2015.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeCalendarTypeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeCalendarTypeIconService', BasicsCustomizeCalendarTypeIconService);

	BasicsCustomizeCalendarTypeIconService.$inject = ['_', 'platformIconBasisService'];

	function BasicsCustomizeCalendarTypeIconService(_, platformIconBasisService) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/type-icons.svg#ico-calendar-type%%index%%');

		var icons = [];
		for (var i = 1; i <= 2; i++) {
			icons.push(platformIconBasisService.createUrlIconWithId(i, 'basics.customize.calendartype' + _.padStart(i, 2, '0')));
		}

		platformIconBasisService.extend(icons, this);
	}
})();
