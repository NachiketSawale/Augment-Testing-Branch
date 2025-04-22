/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IPesHeaderEntity } from '../entities';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementPesHeaderLayoutService } from '../../services/layouts/procurement-pes-header-layout.service';
import { ProcurementPesHeaderValidationService } from '../../services/validations/procurement-pes-header-validation.service';
import { ProcurementPesHeaderBehavior } from '../../behaviors/procurement-pes-header-behavior.service';
import { ProcurementPesHeaderDataService } from '../../services/procurement-pes-header-data.service';
import { BasicsSharedNumberGenerationService, BasicsSharedPesStatusLookupService, BasicsSharedPlainTextContainerComponent, IPlainTextAccessor, PLAIN_TEXT_ACCESSOR } from '@libs/basics/shared';
import { ProcurementCommonContextService } from '@libs/procurement/common';
import { firstValueFrom } from 'rxjs';

export const PROCUREMENT_PES_ENTITY_INFO = EntityInfo.create<IPesHeaderEntity>({
	grid: {
		title: { text: 'Headers', key: 'procurement.pes.headerContainerTitle' },
		behavior: (ctx) => ctx.injector.get(ProcurementPesHeaderBehavior),
	},
	form: {
		containerUuid: '195fe4ee5c974e0aaa3cfd5473544d2b',
		title: { text: 'Header Detail', key: 'procurement.pes.headerDetailContainerTitle' },
	},
	permissionUuid: 'ebe726dbf2c5448f90b417bf2a30b4eb',
	dataService: (ctx) => ctx.injector.get(ProcurementPesHeaderDataService),
	validationService: (ctx) => ctx.injector.get(ProcurementPesHeaderValidationService),
	dtoSchemeId: { moduleSubModule: ProcurementModule.Pes, typeName: 'PesHeaderDto' },
	layoutConfiguration: (context) => {
		return context.injector.get(ProcurementPesHeaderLayoutService).generateConfig(context);
	},
	prepareEntityContainer: async (ctx) => {
		const statusService = ctx.injector.get(BasicsSharedPesStatusLookupService);
		const prcNumGenSrv = ctx.injector.get(BasicsSharedNumberGenerationService);
		const prcContextService = ctx.injector.get(ProcurementCommonContextService);
		await Promise.all([
			firstValueFrom(statusService.getList()),
			prcNumGenSrv.getNumberGenerateConfig('procurement/pes/numbergeneration/list'),
			prcContextService.preparePrcCommonContext(true)]);
	},
	additionalEntityContainers: [
		// remark container
		{
			uuid: '325D0E1763B2417EBAA7647B30906FC8',
			title: 'procurement.pes.remarkContainerTitle',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IPesHeaderEntity>>{
						getText(entity: IPesHeaderEntity): string | undefined {
							return entity.Remark ?? undefined;
						},
						setText(entity: IPesHeaderEntity, value?: string) {
							if (value) {
								entity.Remark = value;
							}
						},
					},
				},
			],
		},
	],
});
