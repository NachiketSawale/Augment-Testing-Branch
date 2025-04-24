(function (angular){
	'use strict';

	let moduleName = 'controlling.configuration';

	angular.module(moduleName).constant('formulaType', {
		CTC: 1,
		CAC: 2,
		CAC_M: 3,
		SAC: 4,
		WCF: 5,
		BCF: 6,
		CAC_WC: 7,
		CAC_BC: 8,
		CUST_FORMULA: 9,
		CUST_FACTOR: 10
	});

	angular.module(moduleName).factory('contrConfigFormulaTypeHelper',['formulaType', function (formulaType){

		let service = {};

		service.isCAC = function isCAC(typeId){
			return typeId === formulaType.CAC;
		};

		service.isCac_m = function isCac_m(typeId){
			return typeId === formulaType.CAC_M;
		};

		service.isFactorType = function isFactorType(typeId){
			return typeId === formulaType.SAC || typeId === formulaType.WCF || typeId === formulaType.BCF || typeId === formulaType.CUST_FACTOR;
		};

		service.isCustFactor = function isCustFactor(typeId){
			return typeId === formulaType.CUST_FACTOR;
		};

		service.isCustomType = function isCustomType(typeId){
			return typeId === formulaType.CUST_FORMULA || typeId === formulaType.CUST_FACTOR;
		};

		service.canReplaceInDetail =function canReplaceInDetail(typeId){
			return !service.isCAC(typeId) && !service.isFactorType(typeId);
		};

		service.isDefaultEditable = function isDefaultEditable(typeId){
			return service.isCac_m(typeId) || service.isSac(typeId);
		};

		service.isSac = function isSac(typeId){
			return typeId === formulaType.SAC;
		};

		service.isWcfOrBcf = function isWcfOrBcf(typeId){
			return typeId === formulaType.WCF || typeId === formulaType.BCF;
		};

		service.canBeNew = function canBeNew(typeId){
			return !service.isCAC(typeId) && typeId !== formulaType.BCF && typeId !== formulaType.WCF;
		};

		return service;

	}]);

})(angular);