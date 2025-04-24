/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';
import { IJobEntity } from '@libs/logistic/interfaces';
import { JobComplete } from './logistic-job-complete.class';
import { LogisticJobDataService } from '../services/logistic-job-data.service';


/**
 * Contact Form Data Entity Info
 */
export const LOGISTIC_JOB_FORM_DATA_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IJobEntity, JobComplete>({
	rubric: Rubric.Contact,
	permissionUuid: '49ba3aa8e7ad11ebba800242ac130004',
	gridTitle: {
		key: 'logistic.job.formFormData'
	},
	parentServiceFn: (ctx) => {
		return ctx.injector.get(LogisticJobDataService);
	}
});
