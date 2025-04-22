import { ProcurementCommonItemEntityInfo } from '@libs/procurement/common';
import { RequisitionItemsDataService } from '../../services/requisition-items-data.service';
import { RequisitionItemValidationService } from '../../services/validations/requisition-item-validation.service';
import { RequisitionItemBehaviorsService } from '../../behaviors/requisition-item-behaviors.service';

export const PRC_ITEMS_ENTITY_INFO = ProcurementCommonItemEntityInfo.create({
	permissionUuid: '5d58a4a9633a485986776456695e1241',
	formUuid: '7393ed1e419c49199bb3d3aaa993e628',
	dataServiceToken: RequisitionItemsDataService,
	validationServiceToken: RequisitionItemValidationService,
	behavior: RequisitionItemBehaviorsService,
});
