/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { SchedulingTemplateEventTemplateDataService } from '../services/scheduling-template-event-template-data.service';
import { IEventTemplateEntity } from './entities/event-template-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';


 export const SCHEDULING_TEMPLATE_EVENT_TEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<IEventTemplateEntity> ({
                grid: {
                    title: {key: 'scheduling.template' + '.eventTemplateGridHeader'},
                },
	             form: {
		             title: { key: 'scheduling.template' + '.eventTemplateDetailHeader' },
		            containerUuid: 'afecde4a08404395855258b70652d070',
	              },
                dataService: ctx => ctx.injector.get(SchedulingTemplateEventTemplateDataService),
                dtoSchemeId: {moduleSubModule: 'Scheduling.Template', typeName: 'EventTemplateDto'},
                permissionUuid: 'afecde4a08404395855258b70652d04e',
	       layoutConfiguration: {
		     groups: [
			  {gid: 'default',attributes: ['DescriptionInfo','DistanceTo','IsDisplayed','PlacedBefore'/*,'ActivityTemplateFk','EventTemplateFk','EventTypeFk'*/,]},],
		 //    overloads: {

		 // },
		 labels: {
			 ...prefixAllTranslationKeys('scheduling.template.',{
				 Inherited :{ key: 'inherited'},
			 })
		 }
	 },
            });