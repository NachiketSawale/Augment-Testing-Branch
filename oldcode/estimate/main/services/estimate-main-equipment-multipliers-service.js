/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular){
	'use strict';
	/* global */

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainPlantEstimateMultiplierService',['$injector', '$http', 'estimateMainResourceType',
		function($injector, $http, estimateMainResourceType){
			function updateMultipliersFrmEquipmentEstimate(resource, projectId, isFromEstimate){
				if(!resource){
					return resource;
				}
				let resourceList = [];
				let plantGroupSpecValueIds = [];
				$injector.get('cloudCommonGridService').flatten(resource.EstResources, resourceList, 'EstResources');
				angular.forEach(resourceList, function (res) {
					if(res.EstResourceTypeFk === estimateMainResourceType.CostCode && res.PlantGroupSpecValueFk){
						plantGroupSpecValueIds.push(res.PlantGroupSpecValueFk);
					}
				});
				let data = {
					WorkOperationTypeId : resource.WorkOperationTypeFk,
					LgmJobId : resource.LgmJobFk || null,
					ProjectId : projectId,
					PlantGroupSpecValueIds : plantGroupSpecValueIds,
					EstPlantResource: resource
				}

				let equipmentAssembliesAsOneRecordSystemOption =  isFromEstimate ? $injector.get('estimateMainService').getShowPlantAsOneRecordOption() : false;
				if (equipmentAssembliesAsOneRecordSystemOption && resource.EstResourceTypeFk === estimateMainResourceType.Plant ) {
					return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/recalculateplantassemblytree', data)
						.then(function (response) {
							resource = response.data;
							return resource;
						});
				}
				else {
					return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getplantestimatemultipliers', data)
						.then(function (response) {
							let plantCostInfo = response.data.plantCostInfo || {};
							let quantityMultiplier = response.data.quantityMultiplier;

							_.forEach(resource.EstResources, resourceChildren => {
								if (resourceChildren.EstResourceTypeFk === estimateMainResourceType.Plant || resourceChildren.EstResourceTypeFk === estimateMainResourceType.PlantDissolved) {
									resourceChildren.WorkOperationTypeFk = resource.WorkOperationTypeFk;
								}
							});
							updateMultipliersByWorkOperationType(resource.EstResources, plantCostInfo, quantityMultiplier);
							return resource;
						});
				}
			}

			function updateMultipliersByWorkOperationType(resourceChildren, plantCostInfoList, quantityMultiplier) {
				_.forEach(resourceChildren, resourceChild => {
					if (resourceChild.EstResourceTypeFk === estimateMainResourceType.CostCode && resourceChild.PlantGroupSpecValueFk) {
						const plantCostInfo = _.find(plantCostInfoList, { 'PlantGroupSpecValueFk': resourceChild.PlantGroupSpecValueFk });

						if (plantCostInfo) {
							let result = plantCostInfo.PercentageResult;
							resourceChild.QuantityFactor1 =  (quantityMultiplier ?? 1) * (_.isNull(result) ? 1 : result / 100);
						}
						else{
							resourceChild.QuantityFactor1 =  quantityMultiplier ?? resourceChild.QuantityFactor1;
						}
						resourceChild.QuantityFactorDetail1 = resourceChild.QuantityFactor1.toString();

					} else if (!_.isEmpty(resourceChild.EstResources)) {
						updateMultipliersByWorkOperationType(resourceChild.EstResources, plantCostInfoList, quantityMultiplier);
					}
				});
			}

			return {updateMultipliersFrmEquipmentEstimate : updateMultipliersFrmEquipmentEstimate};
		}]);
})(angular);
