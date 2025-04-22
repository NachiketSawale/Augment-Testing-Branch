/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { ProcurementRequisitionHeaderDataService } from '../../services/requisition-header-data.service';
import { IReqHeaderEntity } from '../entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../entities/requisition-complete-entity.class';


export const PROCUREMENT_REQUISITION_USER_FORM_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IReqHeaderEntity, ReqHeaderCompleteEntity>({
	rubric: Rubric.Requisition,
	permissionUuid: '9F8740ECF4FB46E9874633478F9F8585',
	gridTitle: {
		key: 'cloud.common.ContainerUserformDefaultTitle'
	},

	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementRequisitionHeaderDataService);
	},
});