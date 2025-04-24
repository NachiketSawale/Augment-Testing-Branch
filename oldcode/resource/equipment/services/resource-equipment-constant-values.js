(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentConstantValues
	 * @function
	 *
	 * @description
	 * resourceEquipmentConstantValues provides definition of values frequently used in plant development
	 */
	angular.module(moduleName).value('resourceEquipmentConstantValues', {
		schemes: {
			businessPartner: {typeName: 'BusinessPartnerDto', moduleSubModule: 'Resource.Equipment'},
			compatibleMaterial: { typeName: 'PlantCompatibleMaterialDto', moduleSubModule: 'Resource.Equipment' },
			contractProcurement: { typeName: 'PlantProcurementContractVDto', moduleSubModule: 'Resource.Equipment' },
			controllingUnit: {typeName: 'Plant2ControllingUnitDto', moduleSubModule: 'Resource.Equipment'},
			fixedAsset: {typeName: 'PlantFixedAssetDto', moduleSubModule: 'Resource.Equipment'},
			meterReading: {typeName: 'PlantMeterReadingDto', moduleSubModule: 'Resource.Equipment'},
			plant: {typeName: 'EquipmentPlantDto', moduleSubModule: 'Resource.Equipment'},
			plantAccessory: {typeName: 'PlantAccessoryDto', moduleSubModule: 'Resource.Equipment'},
			plantAllocation: {typeName: 'PlantAllocVDto', moduleSubModule: 'Resource.Equipment'},
			plantAssignment: {typeName: 'PlantAssignmentDto', moduleSubModule: 'Resource.Equipment'},
			plantMaintenanceView : {typeName: 'PlantMaintenanceVDto', moduleSubModule: 'Resource.Equipment'},
			plantCatalogCalc: {typeName: 'PlantEurolistDto', moduleSubModule: 'Resource.Equipment'},
			plantComponent: {typeName: 'PlantComponentDto', moduleSubModule: 'Resource.Equipment'},
			plantDocument: {typeName: 'PlantDocumentDto', moduleSubModule: 'Resource.Equipment'},
			plantMaintenance: {typeName: 'MaintenanceDto', moduleSubModule: 'Resource.Equipment'},
			plantPicture: {typeName: 'PlantPictureDto', moduleSubModule: 'Resource.Equipment'},
			plantPrices: {typeName: 'PlantPricelistDto', moduleSubModule: 'Resource.Equipment'},
			plantCertificate: {typeName: 'CertificatedPlantDto', moduleSubModule: 'Resource.Equipment'},
			plantCostV: {typeName: 'PlantCostVDto', moduleSubModule: 'Resource.Equipment'},
			plantComponentMaintSchema: {typeName: 'PlantComponentMaintSchemaDto', moduleSubModule: 'Resource.Equipment'},
			plant2Clerk: {typeName: 'Plant2ClerkDto', moduleSubModule: 'Resource.Equipment'},
			plant2EstimatePriceList: {typeName: 'Plant2EstimatePriceListDto', moduleSubModule: 'Resource.Equipment'},
			plantWarranty: {typeName: 'PlantWarrantyDto', moduleSubModule: 'Resource.Equipment'},
			specificValues: {typeName: 'PlantSpecificValueDto', moduleSubModule: 'Resource.Equipment'},
			bulkPlantOwner: {typeName: 'BulkPlantOwnerDto', moduleSubModule: 'Resource.Equipment'}
		},
		uuid: {
			container: {
				businessPartnerList: 'c84bcfcbcb3f41eca885db0e9a08f179',
				businessPartnerDetails: '442c8df8e82346ae942d9c50fc495bb7',
				compatibleMaterialList: '26b70d12f6134c08af7f3b173dd76c37',
				compatibleMaterialDetails: '47488ebd7e73436ab9ae9ba7acfc6cec',
				contractProcurementList: '213a828ef4e94991a8210e161fc17cba',
				contractProcurementDetails: 'd2015e219c124e6cbdb1134dffa062b2',
				controllingUnitList: '1ae4a9f6b86b4b3f964dab760767219f',
				controllingUnitDetails: 'ce5585bb21744dbab053f24f49c07bc2',
				fixedAssetList: 'b46a50394062485b9c0f5ddabf9a1b01',
				fixedAssetDetails: 'e85c0d0ed4dd46f2b36f55e9ba8376da',
				meterReadingList: '0c898f4872c244e599379151ebd8830f',
				meterReadingDetails: '4e5a48e1ff614608841430ce1a19101c',
				plantList: 'b71b610f564c40ed81dfe5d853bf5fe8',
				plantDetails: '14744d2f5e004676abfefd1329b6beff',
				plantAccessoryList: 'c8814c5d27b54f60827f48112dc1fc57',
				plantAccessoryDetails: 'd5a69c4da56845f2b5420016f4fc0de3',
				plantAllocationList: '7d12068f91774d119268f8c79e018385',
				plantAllocationDetails: '4ab67f61ff25460e9d8fb982e36fd031',
				plantAssignmentList: 'dd49d6ac8e844f50b8411e50e31caea8',
				plantAssignmentDetails: 'dd1bbd6ab5c949d998665092a5c583d9',
				plantCatalogCalcList: 'c779f23a59854b0c9c9960044319d8a4',
				plantCatalogCalcDetails: '2dd482ff9dd043209388b267dd278a83',
				plantComponentList: '9f4ef6e2ff6d403fbb24f760c0c5fb70',
				plantComponentDetails: '5f0e8f1e8d5142b099cc5fb4aabd26fa',
				plantDocumentList: 'f0e92216d80d4f9892c0d591cfd93a06',
				plantDocumentDetails: 'b364e4d2d3e7438cacfb320e3c8e93d9',
				plantLocationList: '7e44180e839c44fa98189a3481bb8087',
				plantLocationDetails: 'ca37d6c1dadb4c0387c94a86070e36ad',
				plantMaintenanceList: 'af1dcf780b1b49c48857b990b455ac3c',
				plantMaintenanceDetails: '76ea5f472fa14838915bad3b76e64f43',
				plantPictureList: 'eebaa9c4e6c747b3b6fb477d8e285d69',
				plantPricesList: '2e0de4514e1e4873b5c650edbe6f2c41',
				plantPricesDetails: '2d915e6ca9db4c4ba1d03bb09c3aea0e',
				plantCertificationList: '6182b7c0ed6e498492dbe88e061f3457',
				plantCertificationDetails: 'c53907e3aa1c42c0b1222d233a63f825',
				plantCostVList: 'c827ac51271d40b2af1ad364afe7c10c',
				plantCostVDetails: '4ed827706c314183bdef73c70c1ac05e',
				plantComponentMaintSchemaList: 'adacb904781511eabc550242ac130003',
				plantComponentMaintSchemaDetail: 'adacbb70781511eabc550242ac130003',
				plantPlantLocation2List: 'f1dcfde01b2b4be89d6e26d3525742e6',
				plantPlantLocation2Detail: 'c234c2ab9544405da857b5b9b73a5740',
				plantPoolJobPlantLocationList: '657218995049421ea0ed688bf0b4eb2e',
				plantPoolJobPlantLocationDetail: '41533c9ee59e442f958fc26f9ff16ef7',
				Plant2ClerkList:'38f8b5920cb411ec82a80242ac130003',
				Plant2ClerkDetail:'51b816720cb411ec82a80242ac130003',
				plant2EstimatePriceListList: '341542acb5594af784726a65fba10dbc',
				plant2EstimatePriceListDetails: '968ff95930cc46e0946d043a4ec08ddc',
				plantComponentWarrantyList: '9552282e659b480c8e3b3a2338861377',
				plantComponentWarrantyDetails: '6e2f6cdff8244bc5a7bda75cc1983b35',
				sourceCatalogRecord1: '00d61b7a655d47448292f819b321d6a1',
				sourceCatalogRecord2: '4a924a0f6cf14d408f1ca859bb21ee11',
				specificValuesList:'7318154aabd6471d9b99a6a8a376cfe7',
				specificValuesDetails:'cb30d921aa5e4d3cb897e944b4d95de2',
				bulkPlantOwnerList: '5a0fe583fb6d477cb60ac090fd742e9b',
				bulkPlantOwnerDetails: 'f1b17cf6415e4d4e91a1038e27053f1c'
			}
		},
		rubricId: 30
	});
})(angular);
