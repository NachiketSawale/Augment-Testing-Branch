(function (angular) {

	'use strict';
	var modName = 'resource.equipment';
	angular.module(modName).service('resourceEquipmentPinBoardConfigService', ['globals', function (globals) {
		var self = this;
		self.getConfig = function () {
			return {
				lastUrl: globals.webApiBaseUrl + 'resource/equipment/comments/last',
				remainUrl: globals.webApiBaseUrl + 'resource/equipment/comments/remain',
				createUrl: globals.webApiBaseUrl + 'resource/equipment/comments/createComment',
				deleteUrl: globals.webApiBaseUrl + 'resource/equipment/comments/deleteComment',
				columns: [
					{
						id: 'indicator',
						field: 'ClerkFk'
					},
					{
						id: 'header',
						field: 'ClerkFk'
					},
					{
						id: 'body',
						field: 'Specification'
					},
					{
						id: 'date',
						field: 'InsertedAt'
					}
				],
				entityName: 'Comments',
				dateProp: 'InsertedAt',
				saveParentBefore: true
			};
		};
	}
	]);
})(angular);
