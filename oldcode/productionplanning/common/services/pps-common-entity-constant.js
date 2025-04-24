/**
 * Created by zwz on 7/1/2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).constant('ppsEntityConstant', {
		'MountingActivity': 1,
		'TransportRoute': 2,
		'MountingRequisition': 3,
		'EngineeringTask': 5,
		'TransportRequisition': 6,
		'TransportBundle': 7,
		'TransportPackage': 8,
		'MountingReport': 9,
		'TransportWaypoint': 10,
		'PPSHeader': 11,
		'PPSItem': 12,
		'PPSProduct': 13,
		'ProductDescription': 14,
		'PPSProductionSet': 15,
		'GenericEvent': 16,
		'FabricationUnit': 17,
		'EngineeringDrawing': 18,
		'EngineeringTask2Clerk': 19,
		'PPSProductionSubSet': 20,
	});
})(angular);

