(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingConstantValues
	 * @function
	 *
	 * @description
	 * logisticDispatchingCommonLookupDataService provides some lookup data for dispatching record
	 */
	angular.module(moduleName).value('logisticPriceConditionConstantValues', {
		schemes: {
			costCodeRate: {typeName: 'LogisticCostCodeRateDto', moduleSubModule: 'Logistic.PriceCondition'},
			materialCatalogPrice: {typeName: 'LogisticMaterialCatalogPriceDto', moduleSubModule: 'Logistic.PriceCondition'},
			materialPrice: {typeName: 'LogisticMaterialPriceDto', moduleSubModule: 'Logistic.PriceCondition'},
			plantCatalogPrice: {typeName: 'LogisticEquipCatalogPriceDto', moduleSubModule: 'Logistic.PriceCondition'},
			plantPrice: {typeName: 'LogisticPlantPriceDto', moduleSubModule: 'Logistic.PriceCondition'},
			priceCondition: {typeName: 'PriceConditionDto', moduleSubModule: 'Logistic.PriceCondition'},
			priceConditionItem: {typeName: 'PriceConditionItemDto', moduleSubModule: 'Logistic.PriceCondition'},
			sundryServicePrice: {typeName: 'LogisticSundryServicePriceDto', moduleSubModule: 'Logistic.PriceCondition'},
			plantCostCode :{typeName:'PlantCostCodeDto', moduleSubModule:'Logistic.PriceCondition'}
		},
		uuid: {
			container: {
				costCodeRateList: 'e07d54925ba64e7db4928907939e1bda',
				costCodeRateDetails: 'e37b49b2796d4950bd7c54dfaf6cf86a',
				materialCatalogPriceList: 'bd261e0906984702a6d01964ffc58bcc',
				materialCatalogPriceDetails: '00c2aee866bc4607b3824ea4e05700b6',
				materialPriceList: 'ef3955379c4447a3bda9264908229c8b',
				materialPriceDetails: '39f4db632f194d0bb918fc8981f1011e',
				plantCatalogPriceList: 'bc736a161cc248eaad95db451e06b541',
				plantCatalogPriceDetails: '6e88700ea7a54efe805436ee4272ba99',
				plantPriceList: '2934c2d1160447bc860cc5c3897e4d9f',
				plantPriceDetails: 'dc76760660e9466da30b5a7116fc2f52',
				priceConditionList: '5d0e37f033664ce6b0faf2114db0906a',
				priceConditionDetails: '24c4f1aecb6d4a5aa735201177521649',
				priceConditionItemList: 'bc0c1a5bc4dc420d98bd85a0eeac59f4',
				priceConditionItemDetails: '96e91752e0ca46f59eb4b332fb6573b4',
				sundryServicePriceList: '76206e93e60a4f60a71fd0d0961c6da1',
				sundryServicePriceDetails: '9eefecb804a840e0bcefd6825c957374',
				plantCostCodeList:'767c6e762ece45f6bedf133f02e9baa3',
				plantCostCodeDetails:'28e3bcdb271d40f29c2f1a97683dc1ca'
			}
		}
	});
})(angular);
