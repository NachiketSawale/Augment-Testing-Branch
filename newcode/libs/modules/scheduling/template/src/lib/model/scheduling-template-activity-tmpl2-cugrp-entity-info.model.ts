/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { SchedulingTemplateActivityTmpl2CUGrpDataService } from '../services/scheduling-template-activity-tmpl2-cugrp-data.service';
import {IActivityTmplGrp2CUGrpEntity} from '@libs/scheduling/templategroup';
import { prefixAllTranslationKeys } from '@libs/platform/common';


 export const SCHEDULING_TEMPLATE_ACTIVITY_TMPL2_CUGRP_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityTmplGrp2CUGrpEntity> ({
                grid: {
                    title: {key: 'scheduling.template' + '.activityTmpl2CUGrpGridHeader'}
                },
	             form: {
		             title: { key: 'scheduling.template' + '.activityTmpl2CUGrpDetailHeader' },
		            containerUuid: 'afecde4a08404395855258b70652f060',
	           },
                dataService: ctx => ctx.injector.get(SchedulingTemplateActivityTmpl2CUGrpDataService),
                dtoSchemeId: {moduleSubModule: 'Scheduling.Template', typeName: 'ActivityTmpl2CUGrpDto'},
                permissionUuid: 'afecde4a08404395855258b70652d050',
	       layoutConfiguration: {
		       groups: [
			       {gid: 'default', attributes: ['Inherited',]},],
		       labels: {
			       ...prefixAllTranslationKeys('scheduling.template.', {
				       Inherited: {key: 'inherited'},
			       })
		       }
	       }
            });