/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { SchedulingTemplateActivityCriteriaDataService } from '../services/scheduling-template-activity-criteria-data.service';
import { IActivityCriteriaEntity } from './entities/activity-criteria-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';


 export const SCHEDULING_TEMPLATE_ACTIVITY_CRITERIA_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityCriteriaEntity> ({
                grid: {
                    title: {key: 'scheduling.template' + '.activityCriteriaGridHeader'}
                },

                dataService: ctx => ctx.injector.get(SchedulingTemplateActivityCriteriaDataService),
                dtoSchemeId: {moduleSubModule: 'Scheduling.Template', typeName: 'ActivityCriteriaDto'},
                permissionUuid: '1760df4e1cb24c218e70e3c9f3fbe092',
	             layoutConfiguration: {
						 groups: [
			       {gid: 'default',attributes: ['DescriptionInfo','StructureFk',]},],
		             overloads: {
			             StructureFk: {
				             // todo - navigator
				             grid: {
					             type: FieldType.Lookup,
					             lookupOptions: createLookup({
						             dataServiceToken: BasicsSharedProcurementStructureLookupService,
						             showClearButton: true
					             }),
					             width: 150
				             },
				             form: {
					             type: FieldType.Lookup,
					             lookupOptions: createLookup({
						             dataServiceToken: BasicsSharedProcurementStructureLookupService,
						             showClearButton: true,
						             showDescription: true,
						             descriptionMember: 'DescriptionInfo.Translated'
					             })
				             }
			             }
		             },
		 labels: {
			 ...prefixAllTranslationKeys('cloud.common.',{
				 DescriptionInfo: { key: 'entityDescription'},
			 }),
			 ...prefixAllTranslationKeys('scheduling.template.',{
				 StructureFk :{ key: 'prcStructureFk'}
			 })
		 }
	 },
 });