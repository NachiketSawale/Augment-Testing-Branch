/**
 * Created by sandu on 14.04.2016.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name BasicsConfigReportGroupIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsConfigReportGroupIconService', BasicsConfigReportGroupIconService);

	BasicsConfigReportGroupIconService.$inject = ['platformIconBasisService'];

	function BasicsConfigReportGroupIconService(pibs) {

		var icons = [],
			totalIcon = 20; // Currently there are so many pictures.

		pibs.setBasicPath('report-icons ico-report%%index%%');

		for(var i = 1; i <= totalIcon; i++) {
			icons.push(pibs.createCssIcon('Report' + i));
		}

		pibs.extend(icons, this);
	}
})();