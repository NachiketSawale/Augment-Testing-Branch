/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName='estimate.common';
	angular.module(moduleName).constant('estimateCommonAssemblyType', {
		MasterAssembly: 1,
		ProjectAssembly: 2,
		PlantAssembly: 3,
		ProjectPlantAssembly: 4
	});
})(angular);