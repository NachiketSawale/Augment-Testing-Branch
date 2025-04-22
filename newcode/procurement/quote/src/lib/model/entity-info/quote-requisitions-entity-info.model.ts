/*
 * Copyright(c) RIB Software GmbH
 */

import { IQuoteRequisitionEntity } from '../entities/quote-requisition-entity.interface';
import { ProcurementQuoteRequisitionGridBehavior } from '../../behaviors/quote-requisitions-behavior.service';
import { ProcurementQuoteRequisitionDataService } from '../../services/quote-requisitions-data.service';
import { EntityInfo } from '@libs/ui/business-base';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import {
	IRequisitionEntity,
	ProcurementShareRequisitionLookupService
} from '@libs/procurement/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

const commonModuleName: string = 'procurement.common';

const layoutConfiguration: ILayoutConfiguration<IQuoteRequisitionEntity> = {
	groups: [
		{
			gid: 'default-group',
			attributes: ['ReqHeaderFk']
		},
	],
	overloads: {
		Id: { readonly: true },
		ReqHeaderFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IQuoteRequisitionEntity, IRequisitionEntity>({
				dataServiceToken: ProcurementShareRequisitionLookupService,
				showClearButton: true,
				descriptionMember: 'Code'
			})
		},
		// TODO: additional fields from the same lookup
	},
	labels: {
		...prefixAllTranslationKeys('procurement.rfq' + '.', {
			ReqHeaderFk: { key: 'requisitionCode', text: 'Requisition Code' }
		})
	}
};

export const QUOTE_REQUISITION_ENTITY_INFO = EntityInfo.create<IQuoteRequisitionEntity>({
	grid: {
		title: { text: 'Requisitions', key: commonModuleName + '.requisitionContainerGridTitle' },
		behavior: (ctx) => ctx.injector.get(ProcurementQuoteRequisitionGridBehavior),
	},
	form: {
		title: { text: 'Requisition Detail', key: commonModuleName + '.requisitionContainerFormTitle' },
		containerUuid: 'AB8B7CDBC7FE411C87F2D18E4E0DFFBA'
	},
	dataService: (ctx) => ctx.injector.get(ProcurementQuoteRequisitionDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.Common', typeName: 'QtnRequisitionDto' },
	permissionUuid: 'AB8B7CDBC7FE411C87F2D18E4E0DFFB9',
	layoutConfiguration: layoutConfiguration,
	prepareEntityContainer: async ctx => {

	}
});