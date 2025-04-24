/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName='estimate.main';
	angular.module(moduleName).constant('estimateMainReplaceFunctionType', {
		CostCode : 11,
		ReplaceCostCode : 111,
		ReplaceCostCodeByMaterial : 112,
		ReplaceCostCodeByAssembly : 113,
		Material : 12,
		ReplaceMaterial : 121,
		ReplaceMaterialByCostCode : 122,
		ReplaceMaterialByAssembly : 123,
		Assembly : 13,
		ReplaceAssembly : 131,
		ReplacePlantByPlant : 132,
		ReplaceAssemblyByCostCode: 133,
		ReplaceAssemblyByMaterial: 134,
		Remove : 14,
		RemoveResource : 141,
		EquipmentAssembly : 15,
	});
})(angular);