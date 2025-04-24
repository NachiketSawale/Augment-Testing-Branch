(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementConstantValues
	 * @function
	 *
	 * @description
	 * logisticSettlementConstantValues provides constants used in settlement client development
	 */
	angular.module(moduleName).value('logisticSettlementConstantValues', {
		schemes: {
			billingSchema: {typeName: 'SettlementBillingSchemaDto', moduleSubModule: 'Logistic.Settlement'},
			item: {typeName: 'SettlementItemDto', moduleSubModule: 'Logistic.Settlement'},
			settlement: {typeName: 'SettlementDto', moduleSubModule: 'Logistic.Settlement'},
			transaction: {typeName: 'SettlementTransactionDto', moduleSubModule: 'Logistic.Settlement'},
			validation: {typeName: 'SettlementValidationDto', moduleSubModule: 'Logistic.Settlement'},
			batch: {typeName: 'SettlementBatchDto', moduleSubModule: 'Logistic.Settlement'},
			batchvalidation: {typeName: 'SettlementBatchValidationDto', moduleSubModule: 'Logistic.Settlement'},
			settledProjectChangeItem: {typeName: 'SettledProjectChangeItemVDto', moduleSubModule: 'Logistic.Settlement'},
			postedDispHeaderNotSettled: {typeName: 'PostedDNNotReadySettlVDto', moduleSubModule: 'Logistic.Settlement'},
			settlementClaim: {typeName: 'SettlementClaimDto', moduleSubModule: 'Logistic.Settlement'},
			jobsWithNegativeQuantityForBulk: {typeName: 'BulkNegativeLocationsVDto', moduleSubModule: 'Logistic.Settlement'},
			settlementStructV: {typeName: 'SettlementStructVDto', moduleSubModule: 'Logistic.Settlement'}
		},
		uuid: {
			container: {
				billingSchemaList: 'ba266dee53274c009f78307f98dbfcbc',
				billingSchemaDetail: '40b035b436d0442bb069bafc41c2e868',
				formattedText01: 'b2e8f2664b684862a796698a7235305f',
				formattedText02: 'f17f6ae7602b4f8d976c0376ab3f7b27',
				formattedText03: '27c61887696745768368bd15f437eb1b',
				formattedText04: '6c8e98371244440e83b70eb6649633e2',
				formattedText05: 'f8e4363d6ec845cf86b0fce9655430f6',
				formattedText06: 'b787937d61474c7280aee33f6f054500',
				itemList: '83b83e9c1f704f74bf28f721435b7f93',
				itemDetail: '9b6d9118e5bc486b816323c36d7626cb',
				settlementList: 'f766b788850241e9a338eb411dafbd79',
				settlementDetail: 'cc74b0044501457194046d47ca7dc2de',
				transactionList: '5c40f34757a140a4956fd60da1072129',
				transactionDetail: '58d2195480fc44de9744010f06c9a978',
				validationList: 'aebd263b496149239676a52a48c94be3',
				validationDetail: '953e98ce9064458f873465b10d75533a',
				batchList: '54eb41757bff45f7b6c1941aceb2bdd8',
				batchDetail: 'fc7ebafbccd14a0f89b6445cf8041d69',
				batchValidationList: '2a2dace70a434dbbb8a3f1d654923ad6',
				batchValidationDetail: '46ca8d13fd514512b56421c72101040a',
				settledProjectChangeItemList: 'ea37b111284c4677a604858d5f2ad879',
				settledProjectChangeItemDetail: 'dc216817f171472c92aae78e2c183608',
				postedDispHeaderUnsettledList: '1d2c5ecb849942d38f9e8d298706340d',
				postedDispHeaderUnsettledDetail:'ce8e55f36f5b490b870527018d2f8548',
				settlementClaimList: '87a661f5906040119174d4b07af402d1',
				settlementClaimDetail: 'fa0cca4e53254044afd41b0fac1fd664',
				jobsWithNegativeQuantityForBulkList: '100f2401c73242f39947767bdca3cb7b',
				jobsWithNegativeQuantityForBulkDetail: '88e30a234fe64bbc9b51563a4e4d5ce7',
				settlementStructure: 'c0e4879759da417087be9e4a4f418458'
			}
		},
		types: {
			item: {
				bulkPlantHire: 3,
				costCode: 8,
				fabricatedProduct: 9,
				materialNonStock: 6,
				materialStock: 5,
				plantHire: 2,
				plantTimeSheets: 4,
				resource: 7,
				sundryService: 1
			}
		},
		settledbytypes:{
			ControllingUnit: 1,
			Customer: 2,
			Plant: 3,
			None: 4
		}
	});
})(angular);
