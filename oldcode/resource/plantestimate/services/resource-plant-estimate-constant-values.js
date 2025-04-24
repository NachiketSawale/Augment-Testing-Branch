/**
 * Created by baf on 01.08.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.plantestimate';
	const resourceEquipmentModule = 'Resource.Equipment';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateConstantValues
	 * @function
	 *
	 * @description
	 * resourcePlantEstimateConstantValues provides definitions and constants frequently used in resource plant module
	 */
	angular.module(moduleName).value('resourcePlantEstimateConstantValues', {
		schemes: {
			plant: {typeName: 'EquipmentPlantDto', moduleSubModule: resourceEquipmentModule},
			plantAccessory: {typeName: 'PlantAccessoryDto', moduleSubModule: resourceEquipmentModule},
			plantAssignment: {typeName: 'PlantAssignmentDto', moduleSubModule: resourceEquipmentModule},
			plantCatalogCalc: {typeName: 'PlantEurolistDto', moduleSubModule: resourceEquipmentModule},
			plantCompatibleMaterial: { typeName: 'PlantCompatibleMaterialDto', moduleSubModule: resourceEquipmentModule },
			plantCostV: {typeName: 'PlantCostVDto', moduleSubModule: resourceEquipmentModule},
			plantEstimatePriceList: {typeName: 'Plant2EstimatePriceListDto', moduleSubModule: resourceEquipmentModule},
			plantPrices: {typeName: 'PlantPricelistDto', moduleSubModule: resourceEquipmentModule},
			specificValue: {typeName: 'PlantSpecificValueDto', moduleSubModule: resourceEquipmentModule}
		},
		uuid: {
			container: {
				plantList: 'b71b610f564c40ed81dfe5d853bf5fe8',
				plantDetails: '14744d2f5e004676abfefd1329b6beff',
				plantAccessoryList: 'c8814c5d27b54f60827f48112dc1fc57',
				plantAccessoryDetails: 'd5a69c4da56845f2b5420016f4fc0de3',
				plantAssignmentList: 'dd49d6ac8e844f50b8411e50e31caea8',
				plantAssignmentDetails: 'dd1bbd6ab5c949d998665092a5c583d9',
				plantCatalogCalcList: 'c779f23a59854b0c9c9960044319d8a4',
				plantCatalogCalcDetails: '2dd482ff9dd043209388b267dd278a83',
				plantCompatibleMaterialList: '26b70d12f6134c08af7f3b173dd76c37',
				plantCompatibleMaterialDetails: '47488ebd7e73436ab9ae9ba7acfc6cec',
				plantEstimatePriceListList: '341542acb5594af784726a65fba10dbc',
				plantEstimatePriceListDetails: '968ff95930cc46e0946d043a4ec08ddc',
				plantPricesList: '2e0de4514e1e4873b5c650edbe6f2c41',
				plantPricesDetails: '2d915e6ca9db4c4ba1d03bb09c3aea0e',
				sourceCatalogRecord1: '00d61b7a655d47448292f819b321d6a1',
				sourceCatalogRecord2: '4a924a0f6cf14d408f1ca859bb21ee11',
				specificValueList:'7318154aabd6471d9b99a6a8a376cfe7',
				specificValueDetails:'cb30d921aa5e4d3cb897e944b4d95de2'
			}
		}
	});
})(angular);
