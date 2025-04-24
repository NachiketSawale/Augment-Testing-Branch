(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';

	/**
	 * @ngdoc service
	 * @name projectInfoRequestConstantValues
	 * @function
	 *
	 * @description
	 * logisticDispatchingCommonLookupDataService provides some lookup data for dispatching record
	 */
	angular.module(moduleName).value('projectInfoRequestConstantValues', {
		schemes: {
			infoRequest: { typeName: 'InfoRequestDto', moduleSubModule: 'project.inforequest' },
			requestContribution: { typeName: 'RequestContributionDto', moduleSubModule: 'project.inforequest' },
			requestRelevant: { typeName: 'RequestRelevantToDto', moduleSubModule: 'project.inforequest' },
			infoRequest2External: { typeName: 'InfoRequest2ExternalDto', moduleSubModule: 'project.inforequest' },
			requestReference: { typeName: 'InfoRequestReferenceDto', moduleSubModule: 'Project.InfoRequest' },
			infoRequestChange: { typeName: 'ChangeDto', moduleSubModule: 'project.inforequest' },
			infoRequestDefect: { typeName: 'DfmDefectDto', moduleSubModule: 'project.inforequest' },
		},
		uuid: {
			container: {
				infoRequestList: '281de48b068c443c9b7c62a7f51ac45f',
				infoRequestDetail: '8b9c47c94f0b4077beaaab998c399048',
				requestContributionList: '21d18723fae447ef9f1e00f4c323e61a',
				requestRelevantList: '55f24a16454c4b8ab9fbf2e4fe2e90e6',
				requestRelevantDetail: 'a5779e8fa1d543febfdf92832d44a9e8',
				infoRequest2ExternalList: '52a1f2237b1f476995cc9e78b79e9a68',
				infoRequest2ExternalDetail: 'a22ab80151dc4a8f8f0914cc2e550811',
				mainModelInfoList: 'da5481eabd71482dbca12c4260eec5bf',
				mainModelInfoDetail: '086b1d0b9d4e4bc6a80ffddaa668ada7',
				mainViewerLegendList: '3b5c28631ef44bb293ee05475a9a9513',
				mainViewerLegendDetail: 'd12461a0826a45f1ab76f53203b48ec6',
				requestReferenceList: '251358b08bbf48cdb9ed586711fbabb1',
				requestReferenceDetail: '6a7b8a7849e74634afc484437d30ab60',
				infoRequestChangeList: 'e4d3d8b0003644d49277d2283714b396',
				infoRequestDefectList: '535602d9d4ac4955b280670b0414406e',

			}
		},
		record: {
			type: {
				rfi: 1,
			}
		},
		permissionUuid: {
			rfi: '281de48b068c443c9b7c62a7f51ac45f'

		},
		rubricId: 39
	});
})(angular);

