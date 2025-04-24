(function () {
	'use strict';
	/*global angular, globals, _*/

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).service('ppsCommonLogPinboardViewConfigService', [
		function () {
			var self = this;
			self.getConfig = function () {
				return {
					entityName: 'Logs',
					lastUrl: globals.webApiBaseUrl + 'productionplanning/common/logreport/last/',
					remainUrl : globals.webApiBaseUrl + 'productionplanning/common/logreport/remain/',
					createUrl: globals.webApiBaseUrl + 'productionplanning/common/log/createcomment/',
					deleteUrl: globals.webApiBaseUrl + 'productionplanning/common/log/deletecomment/',
					dateProp: 'Date'
				};
			};
		}
	]);
})();