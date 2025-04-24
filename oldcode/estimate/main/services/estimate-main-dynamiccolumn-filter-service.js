/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular){
	'use strict';
	/* global math, _  */
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W061 */ // eval can be harmful

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainDynamicColumnFilterService',['basicsLookupdataLookupDescriptorService', 'estimateMainResourceType',
		function(basicsLookupdataLookupDescriptorService, estimateMainResourceType){

			let service = {};

			service.isCompoundAssembly = function isCompoundAssembly(resource){
				return resource.EstResourceTypeFk === estimateMainResourceType.Assembly && resource.EstAssemblyTypeFk > 0 ? true : false;
			};

			service.filterResources = function filterResources(resources, columnConfigDetails){

				let costCodeIds = {};
				let materialIds = {};

				let estCostCodesList = basicsLookupdataLookupDescriptorService.getData('estcostcodeslist');

				_.forEach(columnConfigDetails, function(item){
					if (item.LineType === 1){
						// eslint-disable-next-line no-prototype-builtins
						if(!costCodeIds.hasOwnProperty(item.MdcCostCodeFk)){
							costCodeIds[item.MdcCostCodeFk] = [];
						}
					}else{
						// eslint-disable-next-line no-prototype-builtins
						if(!materialIds.hasOwnProperty(item.MaterialLineId)){
							materialIds[item.MaterialLineId] = [];
						}
					}
				});

				let resourceList = _.filter(resources, {EstResourceFk : null});

				function traverse(resources){
					_.forEach(resources, function(resource) {

						if(resource.EstResourceTypeFk === estimateMainResourceType.CostCode){
							handleResource(resource);
						}
						else if(resource.EstResourceTypeFk === estimateMainResourceType.Material)
						{
							// eslint-disable-next-line no-prototype-builtins
							if(materialIds.hasOwnProperty(resource.ColumnId)){
								materialIds[resource.ColumnId].push(resource);
							}else{
								// get the root costcode of the material and judge it
								handleResource(resource);
							}
						}else if(angular.isArray(resource.EstResources) && resource.EstResources.length > 0 && !service.isCompoundAssembly(resource)){
							traverse(resource.EstResources);
						}
					});
				}

				traverse(resourceList);

				let filterService = {};

				filterService.getResourceByMaterial = function getResourceByMaterial(materialLineId){
					return materialIds[materialLineId] || [];
				};

				filterService.getResourceByCostCode = function getResourceByCostCode(mdcCostCodeFk){
					return costCodeIds[mdcCostCodeFk] || [];
				};

				return filterService;

				function handleResource(resource){

					let costCodeId = resource.MdcCostCodeFk;

					let found = false;

					// eslint-disable-next-line no-prototype-builtins
					if(costCodeIds.hasOwnProperty(resource.MdcCostCodeFk)){

						costCodeIds[resource.MdcCostCodeFk].push(resource);

						return;
					}

					while (costCodeId !== null && found === false){

						let currencyCostCode = _.find(estCostCodesList, { Id : costCodeId});

						if(currencyCostCode && currencyCostCode.CostCodeParentFk){

							// eslint-disable-next-line no-prototype-builtins
							if(costCodeIds.hasOwnProperty(currencyCostCode.CostCodeParentFk)){

								costCodeIds[currencyCostCode.CostCodeParentFk].push(resource);

								found = true;
							}else{

								costCodeId = currencyCostCode.CostCodeParentFk;
							}

						}else{
							break;
						}
					}
				}
			};

			service.calculateDetailValue = function calculateDetailValue(detailString){
				let detailVal = angular.copy(detailString.toString());
				// eslint-disable-next-line no-useless-escape
				detailVal = detailVal.replace(/[`~§!@#$%^&|=?;:'"<>\s\{\}\[\]\\\/]/gi, '');
				detailVal = detailVal.replace(/[,]/gi, '.');
				// eslint-disable-next-line no-useless-escape
				let list  = detailVal.match(/\b[a-zA-Z]+[\w|\s*-\+\/]*/g);
				let chars = ['sin', 'tan', 'cos', 'ln'];
				let result = _.filter(list, function(li){
					if(chars.indexOf(li) === -1){return li;}
				});

				let value;
				if(result && !result.length){
					value = math.eval(detailVal);
				}else{
					value = 1;
				}

				if(angular.isUndefined(value) || value === null){
					value = 0;
				}

				return value;
			};

			let detailColumns = [
				'QuantityDetail',
				'QuantityFactorDetail1',
				'QuantityFactorDetail2',
				'QuantityTargetDetail',
				'ProductivityFactorDetail',
				'CostFactorDetail1',
				'CostFactorDetail2',
				'EfficiencyFactorDetail1',
				'EfficiencyFactorDetail2'
			];

			service.getTheRelateField = function getTheRelateField(columnName){

				if(detailColumns.indexOf(columnName) > -1){

					let union = service.getMap2DetailUnion();

					// eslint-disable-next-line no-prototype-builtins
					if(union.hasOwnProperty(columnName)){
						return union[columnName];
					}
				}

				return columnName;

			};

			service.isDetailField = function(fieldName){

				if(detailColumns.indexOf(fieldName) > -1){

					return true;
				}

				return false;
			};

			service.getMap2DetailUnion = function getMap2DetailUnion(){

				let map2Detail = {
					Quantity: 'QuantityDetail',
					QuantityFactor1: 'QuantityFactorDetail1',
					QuantityFactor2: 'QuantityFactorDetail2',
					QuantityTarget: 'QuantityTargetDetail',
					ProductivityFactor: 'ProductivityFactorDetail',
					CostFactor1: 'CostFactorDetail1',
					CostFactor2: 'CostFactorDetail2',
					EfficiencyFactor1: 'EfficiencyFactorDetail1',
					EfficiencyFactor2: 'EfficiencyFactorDetail2'
				};

				return angular.extend({}, _.invert(map2Detail), map2Detail);

			};

			return service;
		}]);
})(angular);
