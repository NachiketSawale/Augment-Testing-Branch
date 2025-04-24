/**
 * Created by chi on 5/15/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerMainEvaluationPermissionDescriptor', businessPartnerMainEvaluationPermissionDescriptor);

	businessPartnerMainEvaluationPermissionDescriptor.$inject = ['_'];

	function businessPartnerMainEvaluationPermissionDescriptor(_) {
		var service = {};

		var permissionDic = [
			{name: 'EVAL', permission: '953895e120714ab4b6d7283c2fc50e14'},
			{name: 'EVALGROUP', permission: 'e65064d4b4e2466aa043941a50ac3ba7'},
			{name: 'EVALCLERK', permission: '2902e129fa9c4c2d9e3f8cd1bfa6b7d8'},
			{name: 'EVALGROUPCLERK', permission: '7fdae404c0164283a7f0ffc8a5fcbf01'},
			{name: 'EVALSUBGROUPCLERK', permission: 'ccdb79b7bba44c808e1173e1385554fa'},
			{name: 'EVALITEM', permission: '26262220fe874ea1bc218229c1f96114'}
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