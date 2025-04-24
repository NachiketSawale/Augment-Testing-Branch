(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupConstantValues
	 * @function
	 *
	 * @description
	 * resourceEquipmentGroupConstantValues provides definitions of frequently used values
	 */
	angular.module(moduleName).value('resourceEquipmentGroupConstantValues', {
		schemes: {
			group: {typeName: 'EquipmentGroupDto', moduleSubModule: 'Resource.EquipmentGroup'},
			groupAccount: {typeName: 'PlantGroupAccountDto', moduleSubModule: 'Resource.EquipmentGroup'},
			groupControllingUnit: {typeName: 'PlantGroup2ControllingUnitDto', moduleSubModule: 'Resource.EquipmentGroup'},
			groupEurolist: {typeName: 'EquipmentGroupEurolistDto', moduleSubModule: 'Resource.EquipmentGroup'},
			groupPrice: {typeName: 'EquipmentGroupPricelistDto', moduleSubModule: 'Resource.EquipmentGroup'},
			groupWoT: {typeName: 'PlantGroupWoTypeDto', moduleSubModule: 'Resource.EquipmentGroup'},
			plantGroup2CostCode: {typeName: 'PlantGroup2CostCodeDto', moduleSubModule: 'Resource.EquipmentGroup'},
			plantGroup2EstimatePriceList: {typeName: 'PlantGroup2EstimatePriceListDto', moduleSubModule: 'Resource.EquipmentGroup'},
			specificValue: {typeName: 'PlantGroupSpecificValueDto', moduleSubModule: 'Resource.EquipmentGroup'},
			taxCode: {typeName: 'PlantGroupTaxCodeDto', moduleSubModule: 'Resource.EquipmentGroup'},
			compmaintschematemplate: {typeName: 'PlantGroupCompMaintSchemaTemplateDto', moduleSubModule: 'Resource.EquipmentGroup'},
			plantGroupPicture: {typeName: 'PlantGroupPictureDto', moduleSubModule: 'Resource.EquipmentGroup'},
			document: {typeName: 'PlantGroupDocumentDto', moduleSubModule: 'Resource.EquipmentGroup'}
		},
		uuid: {
			container: {
				accountList: '73f7e2eea2a842dca95262d9e8832108',
				accountDetails: 'e3cb4d24a11f4cdfbebd9e9c77ba9978',
				controllingUnitList: '91b78b592b5548cea31092fe04ed94bf',
				controllingUnitDetails: 'a2190511a5de424e9f5514ac574ea0eb',
				eurolistList: 'c686905455cf458fb299c40e0966c5b8',
				eurolistDetails: '9c0779eb4dc7426988ca468f8bde4daa',
				groupList: 'ec561557d8c14da28d7e98aa058acff9',
				groupDetails: '855334f9234246f5840900e646fa0a1e',
				plantLocationList: 'b7ac17787f4748ebb4ab96150dfad8c2',
				plantLocationDetails: '0cb8ebf396d44528bf71fe22325bf401',
				plantGroup2CostCodeList: 'bc1f044294f9419db99e41c2bd14e1bf',
				plantGroup2CostCodeDetails: 'c622ef8ecbe34fea947b6f8b439e3d41',
				plantGroup2EstimatePriceListList: '836f9e2bf22c4aacb210635cfaa32571',
				plantGroup2EstimatePriceListDetails: 'cf168a5f73d3417ebea644f92dff46d3',
				pricelistList: 'aac8d525517c44d794c5ddd7cf406527',
				pricelistDetails: '1b651939c6f74c3699a9ea9391d08db0',
				sourceCatalogRecord1: '9c3870f3319f4e5ca144513e1e79af4a',
				sourceCatalogRecord2: '9f2c76da266a4b66b10a176e7ec59896',
				specificValueList: '20cd31beb1a34ec8b7d300095139221b',
				specificValueDetails: '64181b7641994080b6cf3cbecc12f832',
				taxCodeList: '0d881efb6e4249718bb5a7a84dad8eb1',
				taxCodeDetails: '3bf917481bfe4b0aaa3dd4a39e03508a',
				woTList: 'd7a7913fcf27457eb7db277790b7812e',
				woTDetails: '9355d63a6f0b4b9991f3e1f8532ceb41',
				compmaintschematemplateList: 'f05293aece8811ef9cd20242ac120002',
				compmaintschematemplateDetail: '7de3c969cefe4c5a986e0a809be06d68',
				pictureList: '35f2de73e6a147b2ac6740c09031271d',
				pictureView: '1207232a312f49cfb06367a036811e52',
				documentList: '08addb1b387b4b848cbc4898ebdca385',
				documentDetails: 'f81af0c472c240b6aaec7741cb08a266'
			}
		},
		rubricId: 30,
		groupProperties: {
			Code: 1
		}
	});
})(angular);
