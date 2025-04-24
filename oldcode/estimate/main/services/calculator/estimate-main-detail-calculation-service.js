/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular){
	/* global math, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainDetailCalculationService', ['$injector', 'estimateMainCommonFeaturesService', 'estimateMainCommonCalculationService', 'platformRuntimeDataService', 'platformDataValidationService',
		function($injector, estimateMainCommonFeaturesService, estimateMainCommonCalculationService, platformRuntimeDataService, platformDataValidationService){

			let service = {};

			let quantityToDetailMapping = {
				Quantity: 'QuantityDetail',
				QuantityFactor1: 'QuantityFactorDetail1',
				QuantityFactor2: 'QuantityFactorDetail2',
				QuantityTarget: 'QuantityTargetDetail',
				WqQuantityTarget: 'WqQuantityTargetDetail',
				ProductivityFactor: 'ProductivityFactorDetail',
				CostFactor1: 'CostFactorDetail1',
				CostFactor2: 'CostFactorDetail2',
				EfficiencyFactor1: 'EfficiencyFactorDetail1',
				EfficiencyFactor2: 'EfficiencyFactorDetail2'
			};

			let quantityDetailToQuantityMapping = _.invert(quantityToDetailMapping);

			function calculateDetails(item, colName, dataService, ignoreCalculateDetail){

				if(!item || !colName || !dataService){
					return;
				}

				// eslint-disable-next-line no-prototype-builtins
				if (quantityDetailToQuantityMapping.hasOwnProperty(colName) && !ignoreCalculateDetail)
				{
					if(item[colName]){
						let hasCalculatedColumn = estimateMainCommonFeaturesService.getHasCalculatedColumn();
						if(hasCalculatedColumn && hasCalculatedColumn === colName){
							estimateMainCommonFeaturesService.clearHasCalculatedColumn();
							return;
						}
						let detailVal = angular.copy(item[colName].toString());

						let estimateMainResourceType = $injector.get('estimateMainResourceType');
						if(item.EstResourceTypeFk === estimateMainResourceType.ComputationalLine){
							detailVal = detailVal.replace(/\s/gi, '');
							// eslint-disable-next-line no-useless-escape
							detailVal = detailVal.replace(/\'.*?\'/gi, '').replace(/{.*?}/gi, '');
						}

						// eslint-disable-next-line no-useless-escape
						detailVal = detailVal.replace(/[`~§!@#$&|=?;:"<>\s{\}\[\]\\]/gi, '');
						detailVal = detailVal.replace(/[,]/gi, '.');
						// eslint-disable-next-line no-useless-escape
						detailVal = detailVal.replace(/\'.*?\'/gi, '').replace(/{.*?}/gi, '');
						// eslint-disable-next-line no-useless-escape
						let list  = detailVal.match(/\b[a-zA-Z]+[\w|\s*-\+\/]*/g);
						let chars = ['sin', 'tan', 'cos', 'ln'];
						let result = _.filter(list, function(li){
							if(chars.indexOf(li) === -1){return li;}
						});

						if(result && !result.length){
							item[quantityDetailToQuantityMapping[colName]] = math.eval(detailVal.replace(/\*\*/g, '^'));
						}else{
							item[quantityDetailToQuantityMapping[colName]] = 1;
						}
					}else{
						item[quantityDetailToQuantityMapping[colName]] = 1;
					}
				}
				// eslint-disable-next-line no-prototype-builtins
				else if(quantityToDetailMapping.hasOwnProperty(colName))
				{
					let value = estimateMainCommonCalculationService.calcuateValueByCulture(item[colName].toString());
					item[quantityToDetailMapping[colName]] = value;
					let validationResult = estimateMainCommonCalculationService.mapCultureValidation(item, value, quantityToDetailMapping[colName], service, dataService, true);
					platformRuntimeDataService.applyValidationResult(validationResult, item, quantityToDetailMapping[colName]);
					platformDataValidationService.finishAsyncValidation(validationResult, item, quantityToDetailMapping[colName], quantityToDetailMapping[colName], null, service, dataService);
				}
			}

			service.calculateDetails = calculateDetails;

			return service;
		}]);

})(angular);
