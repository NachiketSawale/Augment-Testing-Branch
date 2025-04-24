(function () {
	'use strict';
	/*global angular*/

	const moduleName = 'productionplanning.strandpattern';
	angular.module(moduleName).factory('productionplanningStrandpatternPhotoService', ['globals', 'productionplanningStrandpatternDataService', 'platformFileUtilServiceFactory',

		function (globals, strandpatternMainService, platformFileUtilServiceFactory) {

			var config = {
				deleteUrl: globals.webApiBaseUrl + 'productionplanning/strandpattern/blob/delete',
				importUrl: globals.webApiBaseUrl + 'productionplanning/strandpattern/blob/create',
				getUrl: globals.webApiBaseUrl + 'productionplanning/strandpattern/blob/export',
				fileFkName: 'BasBlobsFk',
				dtoName: 'EntityDto'
			};
			return platformFileUtilServiceFactory.getFileService(config, strandpatternMainService);
		}]);
})();