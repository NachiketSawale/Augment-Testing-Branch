/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName='estimate.main';
	angular.module(moduleName).constant('estimateMainParamStructureConstant',{
		LineItem: 1001,
		EstHeader: 1010,
		Project:1011,
		BoQs:1,
		BasicCusizmeParam:1021,
		ActivitySchedule:2,
		Location:3,
		Controllingunits:4,
		ProcurementStructure:5,
		CostGroup1:6,
		CostGroup2:7,
		CostGroup3:8,
		CostGroup4:9,
		CostGroup5:10,
		ProjectCostGroup1:11,
		ProjectCostGroup2:12,
		ProjectCostGroup3:13,
		ProjectCostGroup4:14,
		ProjectCostGroup5:15,
		AssemblyCategoryStructure:16,
		BasCostGroup:20,
		EnterpriseCostGroup:17,
		ProjectCostGroup:18,
		ProjectParam: 3001,
		GlobalParam:3002,
		RuleParameter :3003

	});
	angular.module(moduleName).constant('estMainParamItemNames',[
		'EstBoq',
		'EstActivity',
		'EstPrjLocation',
		'EstCtu',
		'EstPrcStructure',
		'EstAssemblyCat',
		'EstCostGrp',
		'EstLineItems',
		'EstHeader']);
})(angular);
