(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingConstantValues
	 * @function
	 *
	 * @description
	 * logisticDispatchingCommonLookupDataService provides some lookup data for dispatching record
	 */
	angular.module(moduleName).value('logisticDispatchingConstantValues', {
		schemes: {
			requisitionItem: { moduleSubModule: 'Logistic.Dispatching', typeName: 'RequisitionItemVDto' },
			header2Requisition: { typeName: 'DispatchHeader2RequisitionDto', moduleSubModule: 'Logistic.Dispatching' },
			dispatchNoteSettled: { typeName: 'DispatchNoteSettledVDto', moduleSubModule: 'Logistic.Dispatching' },
			dispatchRecordLoadingInfo: { typeName: 'DispatchRecordLoadingInfoVDto', moduleSubModule: 'Logistic.Dispatching' },
			dispatchNoteTotalWeight: { typeName: 'DispatchNoteTotalWeightVDto', moduleSubModule: 'Logistic.Dispatching' },
			noteDelivery: {typeName: 'DispatchNoteDeliveryDto', moduleSubModule: 'Logistic.Dispatching'}
		},
		uuid: {
			container: {
				header2RequisitionList: '5b0a0644da9245058c4ab36d46f418fc',
				header2RequisitionDetails: '4757ca2faa614e59934611e2193cae95',
				headerList : 'ccd5c52d5e4d45b4aba1a3f53d1f6b6a',
				headerDetails: '28414b3c79034bda912b932190054920',
				recordList : '2aba47e0b663449e8cd86d5e6258e417',
				recordDetails: '029196d1c6e54602847114fa1f1ddccd',
				requisitionItemList: '4262b2464d744610ad69a30f4ee182dc',
				requisitionItemDetails: 'fbec00a620c24d96ac392a3a260a314f',
				documentList : '8905e348c2d44a1fa31f1e69f380adec',
				documentDetails: '71571ef0220e480ca04797f054fde1f2',
				dispatchNoteSettledList: 'e71d60628bda47aa87290aa609fbd1ef',
				dispatchNoteSettledDetails: 'c08a0c8e08f24cd2bc8db520d277e4dc',
				dispatchNoteTotalWeightList: '037f3f5b216e445f94d7f388296b04c9',
				dispatchNoteTotalWeightDetails: '6bc53b650de7400f8565366b862274c9',
				dispatchRecordLoadingInfoList: '642ef917134447A097bd7aec8f59979e',
				dispatchRecordLoadingInfoDetails: 'da4c7efade4f4713bb323e8bae7a20a8',
				dispatchNoteDeliveryList: 'a0b755b3d58140bb81660ec5d31b0904',
				dispatchNoteDeliveryDetails: '2721620dec7f4c64bd5641dabc87b4b4',
			}
		},
		record: {
			type: {
				resource: 1,
				plant: 2,
				material: 3,
				sundryService: 4,
				costCode: 5,
				fabricatedProduct: 6,
				loadingCost: 7,
				loadingCostForBilling: 8,
				smallTool: 9
			},
			calculation: {
				procurementStructure: 1
			}
		},
		permissionUuid: {
			records: '2aba47e0b663449e8cd86d5e6258e417',
			documents: '8905e348c2d44a1fa31f1e69f380adec',
			characteristics: '626f2e46f5a8436f8e94d6660fffa5e6',
			comments: 'f68370052d6a4c0fbf47594012cd764c',
			header2Requisition: '5b0a0644da9245058c4ab36d46f418fc',
			dispatchNoteSettled: 'e71d60628bda47aa87290aa609fbd1ef',
			dispatchRecordLoadingInfo: '642ef917134447A097bd7aec8f59979e',
			dispatchWeightInfo: '037f3f5b216e445f94d7f388296b04c9'
		},
		rubricId: 34,
	});
})(angular);

