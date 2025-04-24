/**
 * Created by pel on 4/24/2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'documents.project';

	angular.module(moduleName).factory('documentProjectPermissionDescriptor', documentProjectPermissionDescriptor);

	documentProjectPermissionDescriptor.$inject = ['_'];

	function documentProjectPermissionDescriptor(_) {
		var service = {};

		var permissionDic = [
			{name: 'DOCUMENTPROJECT', permission: '4eaa47c530984b87853c6f2e4e4fc67e'},
			{name: 'REVISION', permission: '684f4cdc782b495e9e4be8e4a303d693'}
		];

		service.getPermissions = getPermissions;
		service.getPermission = getPermission;
		return service;

		// //////////////////
		function getPermissions() {
			return _.clone(permissionDic);
		}

		function getPermission(name) {
			var permissionObj = _.find(permissionDic, {name: name});
			if (!permissionObj) {
				throw new Error('No such permission.');
			}

			return permissionObj.permission;
		}
	}

})(angular);
