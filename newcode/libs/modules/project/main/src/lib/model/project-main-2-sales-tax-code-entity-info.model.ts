/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMain2SalesTaxCodeDataService } from '../services/project-main-2-sales-tax-code-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IProject2SalesTaxCodeEntity } from '@libs/project/interfaces';

export const project2SalesTaxCodeEntityInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: {key: 'project.main.project2salestaxcodeListTitle'},
	},
	form: {
		title: { key: 'project.main.project2salestaxcodeDetailTitle' },
		containerUuid: '7cb4984e06ba46a4bb64ff72d169d23b',
	},
	dataService: ctx => ctx.injector.get(ProjectMain2SalesTaxCodeDataService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'Project2SalesTaxCodeDto'},
	permissionUuid: '323812e8f71549019915dbb494a65142',
	layoutConfiguration: {
		groups: [
			{gid: 'baseGroup', attributes: ['SalesTaxCodeFk']}
		],
		overloads: {
			SalesTaxCodeFk: BasicsSharedLookupOverloadProvider.provideSalesTaxCodeLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('project.main.', {
				SalesTaxCodeFk: { key: 'SalesTaxCodeEntity'},
			})
		}
	},
} as IEntityInfo<IProject2SalesTaxCodeEntity>);