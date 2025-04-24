/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { SchedulingTemplateMainDataService } from '../services/scheduling-template-main-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IActivityTemplateEntity } from './entities/activity-template-entity.interface';


 export const SCHEDULING_TEMPLATE_MAIN_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityTemplateEntity> ({
                grid: {
                    title: {key: 'scheduling.template' + '.activityTemplateGridHeader'}
                },
	            form: {
		              title: { key: 'scheduling.template' + '.activityTemplateDetailHeader' },
		              containerUuid: 'afecde4a08404395855258b70652d060',
	             },
                dataService: ctx => ctx.injector.get(SchedulingTemplateMainDataService),
                dtoSchemeId: {moduleSubModule: 'Scheduling.Template', typeName: 'ActivityTemplateDto'},
                permissionUuid: 'afecde4a08404395855258b70652d04d',

	 layoutConfiguration: {
		 groups: [
			 {gid: 'default',attributes: ['Code','DescriptionInfo','Specification','PerformanceFactor','ResourceFactor','UserDefinedDate01','UserDefinedDate02','UserDefinedDate03','UserDefinedDate04',
					 'UserDefinedDate05','UserDefinedDate06','UserDefinedDate07','UserDefinedDate08','UserDefinedDate09','UserDefinedDate10','UserDefinedNumber01','UserDefinedNumber02','UserDefinedNumber03',
					 'UserDefinedNumber04','UserDefinedNumber05','UserDefinedNumber06','UserDefinedNumber07','UserDefinedNumber08','UserDefinedNumber09','UserDefinedNumber10','UserDefinedText01','UserDefinedText02','UserDefinedText03',
					 'UserDefinedText04','UserDefinedText05','UserDefinedText06','UserDefinedText07','UserDefinedText08','UserDefinedText09','UserDefinedText10'/*'ConstraintTypeFk','ControllingUnitTemplate','LabelPlacementFk','Perf1UoMFk','Perf2UoMFk','PrcStructureFk','ProgressReportMethodFk','QuantityUoMFk','SCurveFk','SchedulingContextFk','SchedulingMethodFk','TaskTypeFk'*/,]},],
		 labels: {
			 ...prefixAllTranslationKeys('cloud.common.',{
				 Code :{ key: 'entityCode'},
				 DescriptionInfo: { key: 'entityDescription'},
				 PerformanceFactor: { key: 'performanceFactor'},
				 Specification: { key: 'EntitySpec'},
			 })
		 }

	 },
 });