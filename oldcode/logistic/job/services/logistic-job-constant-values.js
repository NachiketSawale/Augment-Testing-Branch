(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobConstantValues
	 * @function
	 *
	 * @description
	 * logisticJobConstantValues provides definitions and constants frequently used in logistic Job module
	 */
	angular.module(moduleName).value('logisticJobConstantValues', {
		schemes: {
			job: {typeName: 'JobDto', moduleSubModule: 'Logistic.Job'},
			jobTask: {typeName: 'JobTaskDto', moduleSubModule: 'Logistic.Job'},
			plantAllocation: {typeName: 'JobPlantAllocationDto', moduleSubModule: 'Logistic.Job'},
			plantLocation: {typeName: 'PlantAllocVDto', moduleSubModule: 'Resource.Equipment'},
			sundryServicePrice: {typeName: 'LogisticSundryServicePriceDto', moduleSubModule: 'Logistic.Job'}
		},
		uuid: {
			container: {
				jobList: '11091450f3e94dc7ae58cbb563dfecad',
				jobDetail: 'b0e4433e826b44c69f422d42e9788e49',
				jobTaskList: 'd7891ba1840c4b82959112b06d70afab',
				jobTaskDetail: '0d5b4fcb1a204c9ab52e75bec5561bde',
				plantAllocationList: '432068179c654b419d3d42d7153d10f8',
				plantAllocationDetail: 'f683b9900aa54c5db4eb359a1ab85115',
				plantLocationList: '036e468f170041568771dcef1a4708e0',
				plantLocationDetails: '2ffdfe986c504939857e1171b8a10610',
				sundryServicePriceList: 'd7891ba1840c4b82959112b06d70afab',
				sundryServicePriceDetail: '0d5b4fcb1a204c9ab52e75bec5561bde',
				jobDocument: '20e85d49386d410c85988b42e384759f',
				equipmentCatPrice:'361273dab16942fa97c7c51b43b9d361',
				materialCatPrice: '01f5e790a9e9416da8f7c4171e9ece5d',
				material: '36d8fdec018141e6b4b3a450425849b0',
				materialPriceCond: '89bf60f70caf4d6db646a941b632e40b',
				materialRate: '19ee8d84d00c4b9d936713e302ae49f0',
				plantPrice: 'e8ceec4dc6d54974a27159588c65962d',
				remark: 'c28c50fa5c7f4be3bb0f44b175a1e1a0',
				addressRemark: 'ca4314096bea4206a6423df7b0864c7a',
				deliveryAddressBlob: 'c70abb89e2f04eadaf3f5e044e6b3ed6',
				projectDocument: '4EAA47C530984B87853C6F2E4E4FC67E',
				jobTaskArticle: '0a4b9b45b59445c9b536b1d20fb40be8',
				formData: '49ba3aa8e7ad11ebba800242ac130004'
			}
		},
		jobTaskType: {
			contract: 1,
			invoice: 2
		},
		rubricId: 35
	});
})(angular);
