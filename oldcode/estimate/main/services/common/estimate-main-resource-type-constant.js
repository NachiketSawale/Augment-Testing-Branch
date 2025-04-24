/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName='estimate.main';
	angular.module(moduleName).constant('estimateMainResourceType', {
		CostCode: 1,
		Material: 2,
		Plant: 3,
		Assembly: 4,
		SubItem: 5,
		ResResource: 6,
		TextLine: 7,
		InternalTextLine: 8,
		ComputationalLine:10,
		EquipmentAssembly:11,
		PlantDissolved: 12
	});
})(angular);
