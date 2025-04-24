/**
 * Created by sandu on 07.06.2016.
 */
(function () {

	'use strict';
	var moduleName = 'usermanagement.user';

	/**
	 * @ngdoc service
	 * @name usermanagementUserSyncIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('usermanagementUserSyncIconService', UsermanagementUserSyncIconService);

	UsermanagementUserSyncIconService.$inject = ['platformIconBasisService'];

	function UsermanagementUserSyncIconService(platformIconBasisService) {

		platformIconBasisService.setBasicPath('');

		var icons = [
			platformIconBasisService.createCssIconWithId(1, null, 'status-icons ico-status02'),
			platformIconBasisService.createCssIconWithId(2, null, 'status-icons ico-status41')
		];

		platformIconBasisService.extend(icons, this);
	}
})();
