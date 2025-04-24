(function () {
	/* global globals */
	'use strict';
	var moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name platformPriorityIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('platformPriorityIconService', PlatformPriorityIconService);

	PlatformPriorityIconService.$inject = ['platformIconBasisService', '$translate'];

	function PlatformPriorityIconService(platformIconBasisService, $translate) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-prio%%index%%');

		var transString = $translate.instant('number');

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, transString + '01'),
			platformIconBasisService.createUrlIconWithId(2, transString + '02'),
			platformIconBasisService.createUrlIconWithId(3, transString + '03'),
			platformIconBasisService.createUrlIconWithId(4, transString + '04'),
			platformIconBasisService.createUrlIconWithId(5, transString + '05'),
			platformIconBasisService.createUrlIconWithId(6, transString + '06'),
			platformIconBasisService.createUrlIconWithId(7, transString + '07'),
			platformIconBasisService.createUrlIconWithId(8, transString + '08'),
			platformIconBasisService.createUrlIconWithId(9, transString + '09'),
			platformIconBasisService.createUrlIconWithId(10, transString + '10')
		];

		platformIconBasisService.extend(icons, this);
	}
})();
