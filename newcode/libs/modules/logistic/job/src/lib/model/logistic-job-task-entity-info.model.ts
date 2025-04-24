/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticJobTaskDataService } from '../services/logistic-job-task-data.service';
import { IJobTaskEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';


 export const LOGISTIC_JOB_TASK_ENTITY_INFO: EntityInfo = EntityInfo.create<IJobTaskEntity> ({
                grid: {
                    title: {key: 'logistic.job' + '.jobTaskTitle'},
                },
                form: {
			    title: { key: 'logistic.job' + '.jobTaskDetailTitle' },
			    containerUuid: '173d56eae5954d47a7f63559dcc0076b',
		        },
                dataService: ctx => ctx.injector.get(LogisticJobTaskDataService),
                dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'JobTaskDto'},
                permissionUuid: '0a4b9b45b59445c9b536b1d20fb40be8',
	 layoutConfiguration: {
		 groups: [
			 {
				 gid: 'baseGroup',
				 attributes: [/*'JobTaskTypeFk',*/ 'Quantity', /*'PrcItemFk', 'InvOtherFk',*/ 'Remark', 'CommentText',
					 /*'ContractHeaderFk', 'BusinessPartnerFk', 'InvHeaderFk',*/ 'JobCardAreaFk'],
			 },
		 ],
		 overloads: {
			 //TODO:JobTaskTypeFk
			 //TODO:PrcItemFk
			 //TODO:ContractHeaderFk
			 //TODO:BusinessPartnerFk
			 //TODO:InvOtherFk
			 //TODO:InvHeaderFk
			 JobCardAreaFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobCardAreaLookupOverload(true)
		 },
		 labels: {
			 ...prefixAllTranslationKeys('logistic.job', {
				/* JobTaskTypeFk: {key: 'jobTaskType'},
				 PrcItemFk: {key: 'prcItemFk'},
				 InvOtherFk: {key: 'invOtherFk'},
				 ContractHeaderFk: {key: 'contractHeaderFk'},
				 InvHeaderFk: {key: 'invHeaderFk'},*/
				 JobCardAreaFk: {key: 'jobCardAreaFk'},
			 }),
			 ...prefixAllTranslationKeys('cloud.common.', {
				 Quantity: {key: 'entityQuantity'},
				 CommentText: {key: 'entityCommentText'},
				 Remark: {key: 'entityRemark'},
				/* BusinessPartnerFk: {key: 'businessPartner'},*/
			 })
		 },
	 },
            });