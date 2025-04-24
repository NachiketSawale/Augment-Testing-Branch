/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialRecordLayoutService } from './basics-material-record-layout.service';
import { BasicsMaterialRecordDataService } from './basics-material-record-data.service';
import { IMaterialEntity } from '@libs/basics/interfaces';
import { BasicsSharedMaterialTemplateTypeLookupService, BasicsSharedNumberGenerationService, BasicsSharedPlainTextContainerComponent, IPlainTextAccessor, PLAIN_TEXT_ACCESSOR } from '@libs/basics/shared';
import { BasicsMaterialRecordBehavior } from './basics-material-record-behavior.service';
import { BasicsMaterialRecordValidationService } from './basics-material-record-validation.service';
import { firstValueFrom } from 'rxjs';

export const BASICS_MATERIAL_RECORD_ENTITY_INFO = EntityInfo.create<IMaterialEntity>({
	grid: {
		title: {text: 'Material Records', key: 'basics.material.record.gridViewTitle'},
		behavior: (ctx) => ctx.injector.get(BasicsMaterialRecordBehavior),
	},
	form: {
		containerUuid: 'ebf18cfa17c64948bee42582b45b4a75',
		title: {text: 'Material Record Detail', key: 'basics.material.record.formViewTitle'},
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialRecordDataService),
	permissionUuid: 'dd40337f1f534a42a844122203639ed8',
	validationService: (context) => context.injector.get(BasicsMaterialRecordValidationService),
	dtoSchemeId: {moduleSubModule: 'Basics.Material', typeName: 'MaterialDto'},
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsMaterialRecordLayoutService).generateLayout();
	},
	prepareEntityContainer: async (ctx) => {
		const materialTemplateTypeLookup = ctx.injector.get(BasicsSharedMaterialTemplateTypeLookupService);
		const materialNumGenService = ctx.injector.get(BasicsSharedNumberGenerationService);
		await Promise.all([
			firstValueFrom(materialTemplateTypeLookup.getList()),
			materialNumGenService.getNumberGenerateConfig('basics/material/numbergeneration//list')
		]);
	},
	additionalEntityContainers: [
		{
			uuid: '598ec1bff35c4f92ab46400c5d58a1d2',
			permission: 'e850ba1740c24c35907491f922a3716b',
			title: 'basics.material.specification.plainText',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IMaterialEntity>>{
						getText(entity: IMaterialEntity): string | undefined {
							return entity.SpecificationInfo?.Translated ?? '';
						},
						setText(entity: IMaterialEntity, value?: string) {
							if (!entity.SpecificationInfo) {
								entity.SpecificationInfo = {
									Translated: '',
									Modified: false,
									Description: '',
									DescriptionTr: 0,
									DescriptionModified: false,
									VersionTr: 0,
									OtherLanguages: null,
								};
							}
							entity.SpecificationInfo.Translated = value ?? '';
							entity.SpecificationInfo.Modified = true;
						},
					},
				},
			],
		},
	],
});
