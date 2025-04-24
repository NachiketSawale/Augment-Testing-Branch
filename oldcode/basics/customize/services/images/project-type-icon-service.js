/**
 * Created by Frank Baedeker on 24/09/2021.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeProjectTypeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeProjectTypeIconService', BasicsCustomizeProjectTypeIconService);

	BasicsCustomizeProjectTypeIconService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeProjectTypeIconService(platformIconBasisService) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/%%replace%%');

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, 'basics.customize.prjTypeRunProject', 'control-icons.svg#ico-prj-type-project'),
			platformIconBasisService.createUrlIconWithId(2, 'basics.customize.prjTypeRunPartProject', 'control-icons.svg#ico-prj-type-part'),
			platformIconBasisService.createUrlIconWithId(3, 'basics.customize.prjTypeRunSubProject', 'control-icons.svg#ico-prj-type-sub'),
			platformIconBasisService.createUrlIconWithId(4, 'basics.customize.prjType5dProject', 'control-icons.svg#ico-prj-type-5d'),
			platformIconBasisService.createUrlIconWithId(5, 'basics.customize.prjTypeCloudProject', 'control-icons.svg#ico-prj-type-cloud'),
			platformIconBasisService.createUrlIconWithId(6, 'basics.customize.prjTypeProjectAlternative', 'control-icons.svg#ico-prj-type-alternative')
		];

		platformIconBasisService.extend(icons, this);
	}
})();