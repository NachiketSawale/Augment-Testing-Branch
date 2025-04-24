/**
 * Created by jie on 02/12/2023.
 */
/* global  */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';

	angular.module(moduleName).factory('basicsProcurementStructureIgeDimensionService', [
		'modelWdeViewerIgeDimensionServiceFactory',
		'basicsProcurementStructureService',
		function (modelWdeViewerDimensionServiceFactory,
			basicsProcurementStructureService) {
			var options = {
				readonly: true,
				objectUsageContract: 'Basics.ProcurementStructure.ObjectUsage',
				headerService: basicsProcurementStructureService,
				mapHeaderId: function (header) {
					return {
						Id: header.Id
					};
				}
			};

			return modelWdeViewerDimensionServiceFactory.create(options);
		}
	]);

	angular.module(moduleName).factory('basicsProcurementStructureDimensionService', [
		'modelWdeViewerDimensionServiceFactory',
		'basicsProcurementStructureService',
		function (modelWdeViewerDimensionServiceFactory,
			basicsProcurementStructureService) {
			var options = {
				readonly: true,
				objectUsageContract: 'Basics.ProcurementStructure.ObjectUsage',
				headerService: basicsProcurementStructureService,
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