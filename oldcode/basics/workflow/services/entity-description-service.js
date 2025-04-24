/* globals angular */
(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';

	/** @namespace globals.appBaseUrl */
	function basicWorkflowEntityDescriptionService($http, $q, globals, _) {
		var service = {};

		var entityTypes = [
			'FC9E5D4E93C4483C91E409D63ACDA2B0',
			'27b8a2ee64d2432c90dba8951452e805',
			'A853F0B9E5E840D1B5B1882323C1C8F7',
			'E148524050DA474FBAC64A01CE1D204E',
			'070E74045E8D4EABA5B788D971AF6A5B',
			'C1E35634DC4944DCB429948C769BF889',
			'0D54719184C94DDEB5F725B4FA5922D2',
			'33ccb65b8f1c4667922ebb154b7813c5',
			'19dc66477e0e48ebae6107de4a0df00f',
			'91018790AFF14968B7D63B6150D1C46A',
			'A823312C8CA14F4F9B6FC706FD719AF8',
			'D783BF1331BD4E13AA850872083F35CA',
			'A5CD8D3E02BC4CE2B351BF378BF143E9',
			'4F5DA8EA63E64A8194BDD3D7496CBAE1'//,
			// '1b46c25b052b4e4b9dd464a2ad825518',
			// '7a4174170ef9463b98bfa486dd92b9c4',
			// 'f901bf056b6146a7b9a3e807dc599d70'
		];

		function getPromisses() {
			var promisses = [];
			_.each(entityTypes, function (type) {
				promisses.push(service.getDescription(type));
			});
			return promisses;
		}

		service.getDescription = function getDescription(entityType) {
			return $http({
				method: 'GET',
				url: globals.appBaseUrl + moduleName + '/content/json/entityDescription/' + entityType + '.json'
			});
		};

		service.getEntityDescriptions = function () {
			return $q.all(getPromisses()).then(function (response) {
				var entityDescriptions = {};
				for (var i = 0; i < response.length; i++) {
					entityDescriptions[entityTypes[i]] = response[i].data;
				}
				return entityDescriptions;
			});
		};

		return service;
	}

	basicWorkflowEntityDescriptionService.$inject = ['$http', '$q', 'globals', '_'];

	angular.module(moduleName).factory('basicWorkflowEntityDescriptionService',
		basicWorkflowEntityDescriptionService);

})(angular);
