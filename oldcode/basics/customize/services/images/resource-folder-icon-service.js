/**
 * Created by Frank Baedeker on 24/05/2017.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeResourceFolderIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeResourceFolderIconService', BasicsCustomizeResourceFolderIconService);

	BasicsCustomizeResourceFolderIconService.$inject = ['_', 'platformIconBasisService'];

	function BasicsCustomizeResourceFolderIconService(_, platformIconBasisService) {
		
		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/type-icons.svg#ico-resource-folder%%index%%');

		var icons = [];

		for(var i=1; i<=17; ++i)
		{
			icons.push(platformIconBasisService.createUrlIconWithId(i, 'basics.customize.resourcefolder' + _.padStart(i, 2, '0')));
		}

		platformIconBasisService.extend(icons, this);
	}
})();
