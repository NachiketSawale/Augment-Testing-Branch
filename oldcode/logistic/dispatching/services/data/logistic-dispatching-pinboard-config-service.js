(function (angular) {

	'use strict';
	var modName = 'logistic.dispatching';
	angular.module(modName).service('logisticDispatchingPinBoardConfigService', ['globals', function (globals) {
		var self = this;
		self.getConfig = function () {
			return {
				lastUrl: globals.webApiBaseUrl + 'logistic/dispatching/comments/last',
				remainUrl: globals.webApiBaseUrl + 'logistic/dispatching/comments/remain',
				createUrl: globals.webApiBaseUrl + 'logistic/dispatching/comments/createComment',
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
				saveParentBefore: true,
				PKey1: 'CompanyFk'
			};
		};
	}
	]);
})(angular);
