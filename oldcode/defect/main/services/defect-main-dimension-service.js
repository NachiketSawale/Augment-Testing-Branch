/**
 * Created by wui on 4/29/2020.
 */
/* global  */
(function (angular) {
	'use strict';

	var moduleName = 'defect.main';

	angular.module(moduleName).factory('defectMainIgeDimensionService', [
		'modelWdeViewerIgeDimensionServiceFactory',
		'defectMainHeaderDataService',
		function (modelWdeViewerDimensionServiceFactory,
			defectMainHeaderDataService) {
			var options = {
				readonly: true,
				objectUsageContract: 'Defect.Main.ObjectUsage',
				headerService: defectMainHeaderDataService,
				mapHeaderId: function (header) {
					return {
						Id: header.Id
					};
				}
			};

			return modelWdeViewerDimensionServiceFactory.create(options);
		}
	]);

	angular.module(moduleName).factory('defectMainDimensionService', [
		'modelWdeViewerDimensionServiceFactory',
		'defectMainHeaderDataService',
		function (modelWdeViewerDimensionServiceFactory,
			defectMainHeaderDataService) {
			var options = {
				readonly: true,
				objectUsageContract: 'Defect.Main.ObjectUsage',
				headerService: defectMainHeaderDataService,
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