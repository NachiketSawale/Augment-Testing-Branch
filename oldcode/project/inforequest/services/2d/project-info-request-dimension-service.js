(function (angular) {
	'use strict';

	var moduleName = 'project.inforequest';

	angular.module(moduleName).factory('projectInfoRequestDimensionService', [
		'modelWdeViewerDimensionServiceFactory',
		'projectInfoRequestDataService',
		function (modelWdeViewerDimensionServiceFactory,
			projectInfoRequestDataService) {
			var options = {
				readonly: true,
				objectUsageContract: 'Project.InfoRequest.ObjectUsage',
				headerService: projectInfoRequestDataService,
				mapHeaderId: function (header) {
					return {
						Id: header.Id
					};
				}
			};

			return modelWdeViewerDimensionServiceFactory.create(options);
		}
	]);

	angular.module(moduleName).factory('projectInfoRequestIgeDimensionService', [
		'modelWdeViewerIgeDimensionServiceFactory',
		'projectInfoRequestDataService',
		function (modelWdeViewerDimensionServiceFactory,
				  projectInfoRequestDataService) {
			var options = {
				readonly: true,
				objectUsageContract: 'Project.InfoRequest.ObjectUsage',
				headerService: projectInfoRequestDataService,
				mapHeaderId: function (header) {
					return {
						Id: header.Id
					};
				}
			};

			return modelWdeViewerDimensionServiceFactory.create(options);
		}
	]);

})(angular);
