/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityContainerInjectionTokens, EntityInfo } from '@libs/ui/business-base';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { DefectMainHeaderDataService } from '../../services/defect-main-header-data.service';
import { DefectMainHeaderLayoutService } from '../../services/layouts/defect-main-header-layout.service';
import { DefectMainHeaderValidationService } from '../../services/validations/defect-main-header-validation.service';
import { BasicsSharedDefectStatusLookupService, BasicsSharedNumberGenerationService, BasicsSharedPlainTextContainerComponent, IPlainTextAccessor, PLAIN_TEXT_ACCESSOR } from '@libs/basics/shared';
import { DefectMainHeaderBehavior } from '../../services/behaviors/defect-main-header-behavior.service';
import { DefectMainSpecificationComponent } from '../../components/defect-main-specification.component';

export const DEFECT_MAIN_HEADER_ENTITY_INFO: EntityInfo = EntityInfo.create<IDfmDefectEntity>({
	grid: {
		title: { text: 'Defect', key: 'defect.main.defectGridTitle' },
		behavior: (ctx) => ctx.injector.get(DefectMainHeaderBehavior),
	},
	form: {
		containerUuid: '5c9d46ff418144718f6eab49825cb86e',
		title: { text: 'Defect Detail', key: 'defect.main.defectDetailTitle' },
	},
	dataService: (ctx) => ctx.injector.get(DefectMainHeaderDataService),
	validationService: (ctx) => ctx.injector.get(DefectMainHeaderValidationService),
	dtoSchemeId: { moduleSubModule: 'Defect.Main', typeName: 'DfmDefectDto' },
	permissionUuid: '01a52cc968494eacace7669fb996bc72',
	layoutConfiguration: (context) => {
		return context.injector.get(DefectMainHeaderLayoutService).generateLayout();
	},
	prepareEntityContainer: async (ctx) => {
		const statusService = ctx.injector.get(BasicsSharedDefectStatusLookupService);
		const prcNumGenSrv = ctx.injector.get(BasicsSharedNumberGenerationService);
		await Promise.all([statusService.getList(), prcNumGenSrv.getNumberGenerateConfig('defect/main/numbergeneration/list')]);
	},
	additionalEntityContainers: [
		// plain text container
		{
			uuid: '91588bf46f4e4b42a44eaee80c1fbc83',
			permission: '01a52cc968494eacace7669fb996bc72',
			title: 'defect.main.headerText.dfmHeaderPlainTextContainerTitle',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IDfmDefectEntity>>{
						getText(entity: IDfmDefectEntity): string | undefined {
							return entity.Detail ?? undefined;
						},
						setText(entity: IDfmDefectEntity, value?: string) {
							if (value) {
								entity.Detail = value;
							}
						},
					},
				},
			],
		},
		{ // header text container
			uuid: 'aef394158e3649ad9dd149859d18d708',
			permission: '01a52cc968494eacace7669fb996bc72',
			title: 'defect.main.headerText.dfmHeaderTextContainerTitle',
			containerType: DefectMainSpecificationComponent,
			providers: [
				{
					provide: new EntityContainerInjectionTokens<IDfmDefectEntity>().dataServiceToken,
					useExisting: DefectMainHeaderDataService,
				},
			],
		},
	],
});
