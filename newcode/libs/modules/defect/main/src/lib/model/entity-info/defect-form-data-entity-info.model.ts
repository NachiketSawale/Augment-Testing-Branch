/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { DefectMainComplete } from '../defect-main-complete.class';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { DefectMainHeaderDataService } from '../../services/defect-main-header-data.service';

export const DEFECT_FORM_DATA_ENTITY_INFO: EntityInfo = BasicsSharedUserFormDataEntityInfoFactory.create<IDfmDefectEntity, DefectMainComplete>({
	rubric: Rubric.DefectManagement,
	permissionUuid: 'dae0941f05bd41f0a4cd2f0e6f280380',
	gridTitle: { key: 'defect.main.formData' },
	parentServiceFn: (ctx) => {
		return ctx.injector.get(DefectMainHeaderDataService);
	},
});
