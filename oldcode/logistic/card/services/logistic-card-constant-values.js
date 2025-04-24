/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc service
	 * @name logisticCardConstantValues
	 * @function
	 *
	 * @description
	 * logisticCardConstantValues provides definitions and constants frequently used in logistic card module
	 */
	angular.module(moduleName).value('logisticCardConstantValues', {
		schemes: {
			card: {typeName: 'JobCardDto', moduleSubModule: 'Logistic.Card'},
			activity: {typeName: 'JobCardActivityDto', moduleSubModule: 'Logistic.Card'},
			record: {typeName: 'JobCardRecordDto', moduleSubModule: 'Logistic.Card'},
			carddocument: {typeName: 'JobCardDocumentDto', moduleSubModule: 'Logistic.Card'},
			work: { typeName: 'JobCardWorkDto', moduleSubModule: 'Logistic.Card' },
			cardactivityclerk: { typeName: 'JobCardActClerkDto', moduleSubModule: 'Logistic.Card' },
			plantCompatibleMaterial: { typeName: 'PlantCompatibleMaterialDto', moduleSubModule: 'Resource.Equipment' },
			plantLocation: { typeName: 'JobPlantAllocationDto', moduleSubModule: 'Logistic.Job' }
		},
		uuid: {
			container: {
				cardList: '05fd352d74ef4f5aa179d259e056c367',
				cardDetails: 'b3cd04f14e0d4c37a17255d3315f2e0e',
				activityList: '8a2db2fa260e476a8928c2a56791b277',
				activityDetails: 'c3354dae2f434cd183862f01c2bb039b',
				recordList: '1e6832ec58314f4bb772e0986f110d33',
				recordDetails: '35eb529cbbc04fbaac20073663522425',
				remark: '9bfaa01af6254c799f2b878286395eb7',
				cardDocumentList: '7e1c27a578c1483386e2594f24bab0bc',
				cardDocumentDetails: '4e3220847fe74ca6a726677f31ed9f05',
				cardWorkList:'fc5cb34f5ec74473bdd9de8083d61037',
				cardWorkDetails: '2b6ca1c9b58d48d397d1ae04d3725bb5',
				cardActivityClerkList: 'ecc6bbcf8be84e5e84e6ed2b2a2497a7',
				cardActivityClerkDetails: 'B51C43904B6E4FD8A1A40DBD2830D47D',
				plantCompatibleMaterialList: '47693dc497464c16ba9df74576724959',
				plantCompatibleMaterialDetails: '517e4033147a40bd8e2975297c9443e0',
				plantLocationList:'137f38660a3540918ba4a4bdbe8e9937',
				plantLocationDetails:'774745f45578491b88ed55b9b9d1a6bd'
			}
		},
		types: {
			record: {
				plant: 1,
				material: 2,
				sundryService: 3
			}
		},

		rubricId: 37
	});
})(angular);