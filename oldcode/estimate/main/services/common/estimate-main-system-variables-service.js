/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName='estimate.main';
	angular.module(moduleName).factory('estimateMainSystemVariablesHelperService',  ['_', function (_){
		const defaultData = [
			{
				VarType: 'System',
				Code: '_WQQuantity',
				Description: 'WQ Quantity',
			},
			{
				VarType: 'System',
				Code: '_AQQuantity',
				Description: 'AQ Quantity',
			},
			{
				VarType: 'System',
				Code: '_TotalQuantity',
				Description: 'Total Quantity',
			}
		];

		let service = {};

		service.getList = function (){
			return defaultData;
		};

		service.getCodes = function (){
			return _.map(defaultData, 'Code');
		};

		service.getTargetCodeByFieldName = function (field){
			return  (field === 'QuantityTarget' || field === 'QuantityTargetDetail') ? '_AQQuantity'
				: (field === 'WqQuantityTarget' || field === 'WqQuantityTargetDetail') ? '_WQQuantity'
					:  '_TotalQuantity';
		};

		service.getUsingDetailColumns = function (){
			return ['QuantityDetail','QuantityFactorDetail1','QuantityFactorDetail2','ProductivityFactorDetail','CostFactorDetail1','CostFactorDetail2','EfficiencyFactorDetail1','EfficiencyFactorDetail2'];
		};

		service.getRelativedColOfDetail = function (detialCol){
			return detialCol === 'QuantityDetail' ? 'Quantity' :
				detialCol === 'QuantityFactorDetail1' ? 'QuantityFactor1' :
					detialCol === 'QuantityFactorDetail2' ? 'QuantityFactor2' :
						detialCol === 'ProductivityFactorDetail' ? 'ProductivityFactor' :
							detialCol === 'CostFactorDetail1' ? 'CostFactor1' :
								detialCol === 'CostFactorDetail2' ? 'CostFactor2' :
									detialCol === 'EfficiencyFactorDetail1' ? 'EfficiencyFactor1' :
										detialCol === 'EfficiencyFactorDetail2' ? 'EfficiencyFactor2' : '';
		};

		return service;
	}]);
})(angular);
