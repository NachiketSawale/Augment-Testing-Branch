/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ICertificateEntity } from '@libs/resource/interfaces';
import { ResourceCertificateDataService } from '../services/resource-certificate-data.service';


export const RESOURCE_CERTIFICATE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICertificateEntity> ({
	grid: {
		title: {key:'resource.certificate' + '.certificateListTitle'},
	},
	form: {
		title: {key:'resource.certificate' + '.certificateDetailTitle' },
		containerUuid:'424d4d840861440489a0bfdfc71d04a1'
	},
	dataService: (ctx) => ctx.injector.get(ResourceCertificateDataService),
	dtoSchemeId: { moduleSubModule: 'Resource.Certificate', typeName: 'CertificateDto' },
	permissionUuid: 'ddfd93ac951e42f0bb947a847121a79a',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['CertificateTypeFk','CertificateStatusFk','ValidFrom','ValidTo','Comment','Remark','ClerkFk',/*,'BusinessPartnerFk','ContactFk','SupplierFk',*/
					'UserDefinedText01','UserDefinedText02','UserDefinedText03','UserDefinedText04','UserDefinedText05','UserDefinedDate01','UserDefinedDate02'
					,'UserDefinedDate03','UserDefinedDate04','UserDefinedDate05','UserDefinedNumber01','UserDefinedNumber02','UserDefinedNumber03','UserDefinedNumber04','UserDefinedNumber05'],
			}
		],
		overloads: {
			CertificateTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCertificateTypeLookupOverload(true),
			CertificateStatusFk: BasicsSharedCustomizeLookupOverloadProvider.providePlantCertificateStatusLookupOverload(true),
			ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				CertificateTypeFk: {key: 'entityType'},
				CertificateStatusFk: {key: 'entityStatus'},
				ValidFrom: {key: 'entityValidFrom'},
				ValidTo: {key: 'entityValidTo'},
				/*BusinessPartnerFk: {key: 'entityBusinessPartner'}
				 SupplierFk: {key: 'entitySupplier'}, */
			}),
			...prefixAllTranslationKeys('resource.certificate.', {
				Comment: {key: 'entityComment'},
				Remark: {key: 'entityRemark'},
				UserDefinedText01: {key: 'entityUserDefinedText01'},
				UserDefinedText02: {key: 'entityUserDefinedText02'},
				UserDefinedText03: {key: 'entityUserDefinedText03'},
				UserDefinedText04: {key: 'entityUserDefinedText04'},
				UserDefinedText05: {key: 'entityUserDefinedText05'},
				UserDefinedDate01: {key: 'entityUserDefinedDate01'},
				UserDefinedDate02: {key: 'entityUserDefinedDate02'},
				UserDefinedDate03: {key: 'entityUserDefinedDate03'},
				UserDefinedDate04: {key: 'entityUserDefinedDate04'},
				UserDefinedDate05: {key: 'entityUserDefinedDate05'},
				UserDefinedNumber01: {key: 'entityUserDefinedNumber01'},
				UserDefinedNumber02: {key: 'entityUserDefinedNumber02'},
				UserDefinedNumber03: {key: 'entityUserDefinedNumber03'},
				UserDefinedNumber04: {key: 'entityUserDefinedNumber04'},
				UserDefinedNumber05: {key: 'entityUserDefinedNumber05'},
			}),
			...prefixAllTranslationKeys('basics.clerk.', {
				ClerkFk: {key: 'entityClerk'}
			}),
			...prefixAllTranslationKeys('resource.equipment.', {
				/*ContactFk: {key: 'entityContactFk'},*/
			})

		}
	},

});