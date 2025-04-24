(function (angular) {

	'use strict';
	var modName = 'logistic.job';
	angular.module(modName).service('logisticJobPinBoardConfigService', ['globals', function (globals) {
		var self = this;
		self.getConfig = function () {
			return {
				lastUrl: globals.webApiBaseUrl + 'logistic/job/comments/last',
				remainUrl: globals.webApiBaseUrl + 'logistic/job/comments/remain',
				createUrl: globals.webApiBaseUrl + 'logistic/job/comments/createComment',
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
