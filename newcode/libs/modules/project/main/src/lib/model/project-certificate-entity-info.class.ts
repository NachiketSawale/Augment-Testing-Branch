/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMainCertificateDataService } from '../services/project-main-certificate-data.service';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IProjectMainCertificateEntity } from '@libs/project/interfaces';
import { ProjectMainCertificateBehavior } from '../behaviors/project-main-certificate-behavior.service';


export const projectCertificateEntityInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'project.main' + '.listCertificateTitle'},
		behavior: ctx => ctx.injector.get(ProjectMainCertificateBehavior),
	},
	form: {
		title: { key: 'project.main' + '.detailCertificateTitle' },
		containerUuid: 'f21fe8dbcc1d47d7baaa495bf9a9015a',
	},
	dataService: ctx => ctx.injector.get(ProjectMainCertificateDataService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'Project2CertificateDto'},
	permissionUuid: '54a408657d304e7f8bbb51dba5d184c2',
	layoutConfiguration: {
		groups: [
			{gid: 'baseGroup', attributes: ['PrcStructureFk', 'CertificateTypeFk', 'IsMandatory', 'IsMandatorySub', 'IsRequiredSub', 'IsRequired']},
		],
		overloads: {
			PrcStructureFk:BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
			CertificateTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCertificateTypeLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('timekeeping.employee.', {
				CertificateTypeFk: { key: 'entityCertificateTypeFk' },
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Comment: { key: 'entityCommentText' },
				PrcStructureFk: { key: 'entityPrcStructureFk' },
				Email: { key: 'email' },
			}),
			...prefixAllTranslationKeys('project.main.', {
				IsMandatorySub: { key: 'isMandatorySub'},
				IsMandatory: { key: 'isMandatory' },
				IsRequiredSub: { key: 'isRequiredSub'},
				IsRequired: { key: 'isRequired'},
			})
		},
	}
} as IEntityInfo<IProjectMainCertificateEntity>);