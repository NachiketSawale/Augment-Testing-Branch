import { EntityInfo } from '@libs/ui/business-base';
import { IReqVariantEntity } from '../entities/req-variant-entity.interface';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementRequisitionRequisitionVariantDataService } from '../../services/requisition-variant-data.service';
import { ProcurementRequisitionRequisitionVariantValidationService } from '../../services/validations/requisition-variant-validation.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { MODULE_INFO_PROCUREMENT } from '@libs/procurement/common';
import { RequisitionVariantBehavior } from '../../behaviors/requisition-variant-behavior.service';

export const PROCUREMENT_REQUISITION_VARIANT_ENTITY_INFO = EntityInfo.create<IReqVariantEntity>({
	grid: {
		title: 'procurement.requisition.variant.reqVariantListTitle',
	},
	form: {
		title: 'procurement.requisition.variant.reqVariantDetailTitle',
		containerUuid: 'cfb0262cdb5b4e50a2727c33d80088b2',
	},
	permissionUuid: '8208623dad6a4205819c2880da4ddf21',
	dataService: (ctx) => ctx.injector.get(ProcurementRequisitionRequisitionVariantDataService),
	validationService: (ctx) => ctx.injector.get(ProcurementRequisitionRequisitionVariantValidationService),
	dtoSchemeId: { moduleSubModule: ProcurementModule.Requisition, typeName: 'ReqVariantDto' },
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['Code', 'Description', 'Remarks', 'Comment'],
			},
		],
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.CloudCommonModuleName + '.', {
				Code: { key: 'entityCode' },
				Description: { key: 'entityDescription' },
				Remarks: { key: 'entityRemark' },
				Comment: { key: 'entityComment' },
			}),
		},
	},
	containerBehavior: (ctx) => ctx.injector.get(RequisitionVariantBehavior)
});