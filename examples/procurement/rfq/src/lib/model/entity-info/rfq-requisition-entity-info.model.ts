/*
 * Copyright(c) RIB Software GmbH
 */

import { IRfqRequisitionEntity } from '../entities/rfq-requisition-entity.interface';
import { ProcurementRfqRequisitionGridBehavior } from '../../behaviors/rfq-requisition-behavior.service';
import { ProcurementRfqRequisitionDataService } from '../../services/rfq-requisition-data.service';
import { EntityInfo } from '@libs/ui/business-base';
import { RfqRequisitionValidationService } from '../../services/validations/rfq-requisition-validation.service';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IRequisitionEntity, ProcurementPackageLookupService, ProcurementShareRequisitionLookupService } from '@libs/procurement/shared';
import { IProcurementPackageLookupEntity } from '@libs/basics/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';

const commonModuleName: string = 'procurement.common';

const layoutConfiguration: ILayoutConfiguration<IRfqRequisitionEntity> = {
	groups: [
		{
			gid: 'default-group',
			attributes: ['ReqHeaderFk', 'ProjectFk', 'PackageFk'],
		},
	],
	overloads: {
		Id: { readonly: true },
		ReqHeaderFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IRfqRequisitionEntity, IRequisitionEntity>({
				dataServiceToken: ProcurementShareRequisitionLookupService,
				showClearButton: true,
				descriptionMember: 'Code',
			}),
		},
		ProjectFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IRfqRequisitionEntity, IProjectEntity>({
				dataServiceToken: ProjectSharedLookupService,
			}),
		},
		PackageFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup<IRfqRequisitionEntity, IProcurementPackageLookupEntity>({
				dataServiceToken: ProcurementPackageLookupService,
				showClearButton: true,
				descriptionMember: 'Code',
			}),
		},
		// TODO: additional fields from the same lookup
	},
	labels: {
		...prefixAllTranslationKeys('procurement.rfq' + '.', {
			ReqHeaderFk: { key: 'requisitionCode', text: 'Requisition Code' },
		}),
		...prefixAllTranslationKeys('cloud.common.', {
			ProjectFk: { key: 'entityProjectName', text: 'Project' },
			PackageFk: { key: 'entityPackageCode', text: 'Package Code' },
		}),
	},
};

export const RFQ_REQUISITION_ENTITY_INFO = EntityInfo.create<IRfqRequisitionEntity>({
	grid: {
		title: { text: 'Requisitions', key: commonModuleName + '.requisitionContainerGridTitle' },
		behavior: (ctx) => ctx.injector.get(ProcurementRfqRequisitionGridBehavior),
	},
	form: {
		title: { text: 'Requisition Detail', key: commonModuleName + '.requisitionContainerFormTitle' },
		containerUuid: '4E0F88CF3A074ABE96D1EE7F4C93AD0E',
	},
	dataService: (ctx) => ctx.injector.get(ProcurementRfqRequisitionDataService),
	validationService: (ctx) => ctx.injector.get(RfqRequisitionValidationService),
	dtoSchemeId: { moduleSubModule: 'Procurement.RfQ', typeName: 'RfqRequisitionDto' },
	permissionUuid: '3da6f959d8744a84be2d78dac89ffeef',
	layoutConfiguration: layoutConfiguration,
	prepareEntityContainer: async (ctx) => {},
});
