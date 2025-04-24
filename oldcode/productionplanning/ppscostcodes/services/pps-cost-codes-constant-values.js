(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.ppscostcodes';

	/**
	 * @ngdoc service
	 * @name ppsCostCodesConstantValues
	 * @function
	 * @description
	 */
	angular.module(moduleName).constant('ppsCostCodesConstantValues', {
		prefix: 'PpsCostCode',
		schemes: {
			mdcCostCode: { typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'},
			ppsCostCode: { typeName: 'PpsCostCodeDto', moduleSubModule: 'ProductionPlanning.PpsCostCodes' },
			costCodeNew: { typeName: 'CostCodeNewDto', moduleSubModule: 'ProductionPlanning.PpsCostCodes' },
		},
		uuid: {
			container: {
				costCodeList: '9ecb6ca039d54c4194c1901ad329e6ab',
				costCodeDetail: 'fad506c0cfc64652b17be82818a14c98',
			}
		},
	});
})(angular);
