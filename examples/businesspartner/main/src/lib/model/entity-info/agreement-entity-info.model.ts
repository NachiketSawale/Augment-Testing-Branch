import { AgreementDataService } from '../../services/agreement-data.service';
import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IAgreementEntity } from '@libs/businesspartner/interfaces';

export const AGREEMENT_ENTITY_INFO = EntityInfo.create<IAgreementEntity>({
	grid: {
		title: {
			text: 'Relation',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.agreementsContainerTitle',
		},
		containerUuid: '9c8641a6e04b406d8481fb404ee7d85e'
	},
	form: {
		title: {
			text: 'Relation Detail',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.agreementDetailContainerTitle',
		},
		containerUuid: '20616d61a4a048029721c68bebd8f64c',
	},
	// eslint-disable-next-line strict
	dataService: (ctx) => ctx.injector.get(AgreementDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'AgreementDto' },
	permissionUuid: '9c8641a6e04b406d8481fb404ee7d85e',
	layoutConfiguration: {
		groups: [
			{ gid: 'basicData', attributes: ['AgreementTypeFk', 'Description', 'ReferenceDate', 'Reference', 'CommentText','Remark', 'ValidFrom', 'ValidTo', 'DocumentTypeFk', 'DocumentName', 'DocumentDate', 'OriginFileName']},
			{ 'gid': 'userDefined', 'attributes': ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'] },
		],
		overloads: {
			AgreementTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideBpAgreementTypeLookupOverload(true),
			DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
				AgreementTypeFk: { key: 'bpagreementtype'},
				ReferenceDate: { key: 'entityReferenceDate'},
				DocumentTypeFk: { key: 'documentType'},
				DocumentName: { key: 'documentName'},
				DocumentDate: { key: 'documentDate'}
			}),
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
				Remark: { key: 'entityRemark'},
				Description: {key: 'entityDescription'},
				Reference: {key: 'entityReference'},
				CommentText: {key: 'entityCommentText'},
				ValidFrom: {key: 'entityValidFrom'},
				ValidTo: {key: 'entityValidTo'},
				OriginFileName: {key: 'documentOriginFileName'},
				UserDefined1: { key: 'entityUserDefined', params: { p_0: '1' }},
				UserDefined2: { key: 'entityUserDefined', params: { p_0: '2' }},
				UserDefined3: { key: 'entityUserDefined', params: { p_0: '3' }},
				UserDefined4: { key: 'entityUserDefined', params: { p_0: '4' }},
				UserDefined5: { key: 'entityUserDefined', params: { p_0: '5' }},
			})
		}
	}
});