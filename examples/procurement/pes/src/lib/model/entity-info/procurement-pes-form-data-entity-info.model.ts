/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { ProcurementPesHeaderDataService } from '../../services/procurement-pes-header-data.service';
import { IPesHeaderEntity } from '../entities';
import { PesCompleteNew } from '../complete-class/pes-complete-new.class';

/**
 * Procurement PES Form Data Entity Info
 */
export const PROCUREMENT_PES_FORM_DATA_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IPesHeaderEntity, PesCompleteNew>({
	rubric: Rubric.PerformanceEntrySheets,
	permissionUuid: '661feba708a946f485186e2b61a7338e',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},

	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementPesHeaderDataService);
	},
});