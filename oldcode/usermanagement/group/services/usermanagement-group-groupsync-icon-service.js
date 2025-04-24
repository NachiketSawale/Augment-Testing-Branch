/**
 * Created by sandu on 09.06.2016.
 */
(function () {

	'use strict';
	var moduleName = 'usermanagement.group';

	/**
	 * @ngdoc service
	 * @name usermanagementGroupSyncIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('usermanagementGroupSyncIconService', UsermanagementGroupSyncIconService);

	UsermanagementGroupSyncIconService.$inject = ['platformIconBasisService'];

	function UsermanagementGroupSyncIconService(platformIconBasisService) {

		platformIconBasisService.setBasicPath('');

		var icons = [
			platformIconBasisService.createCssIconWithId(1,null,'status-icons ico-status02'),
			platformIconBasisService.createCssIconWithId(2,null,'status-icons ico-status41')
		];

		platformIconBasisService.extend(icons, this);
	}
})();