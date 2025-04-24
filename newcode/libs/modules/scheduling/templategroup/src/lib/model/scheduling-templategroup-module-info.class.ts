/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';

import { SchedulingTemplateActivityTemplateGroup2CugroupDataService } from '../services/scheduling-template-activity-template-group2-cugroup-data.service';

import { IActivityTmplGrp2CUGrpEntity } from './entities/activity-tmpl-grp-2cugrp-entity.interface';
import { SCHEDULING_ACTIVITY_TEMPLATE_GROUP } from '../activity-group/model/scheduling-activity-templategroup';

export class SchedulingTemplategroupModuleInfo extends BusinessModuleInfoBase {
	private schedulingTemplateActivityTmplGrp2CUGrpEntityInfoEvaluated: EntityInfo | null = null;
	private schedulingTemplateActivityTmplGrpEditEntityInfoEvaluated: EntityInfo | null = null;
	private readonly templateModuleSubmodule: string = 'Scheduling.Template';

	public static readonly instance = new SchedulingTemplategroupModuleInfo();

	private constructor(){
		super();
	}

	public override get internalModuleName(): string {
		return 'scheduling.templategroup';
	}

	private get moduleSubModule(): string {
		return 'Scheduling.Templategroup';
	}

	public override get entities(): EntityInfo[] {
		return [SCHEDULING_ACTIVITY_TEMPLATE_GROUP, this.schedulingTemplateActivityTmplGrp2CUGrpEntityInfo];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}



	private get schedulingTemplateActivityTmplGrp2CUGrpEntityInfo(): EntityInfo {
		if (this.schedulingTemplateActivityTmplGrp2CUGrpEntityInfoEvaluated === null) {
			const schedulingTemplateActivityTmplGrp2CUGrpEntitySettings: IEntityInfo<IActivityTmplGrp2CUGrpEntity> = {
				grid: {
					title: { text: 'Scheduling Template Activity Tmpl Grp2CUGrp' }
				},
				form: '54259d07f8cc42c7ad5b3cd44d39e3e1',
				dataService: (ctx) => ctx.injector.get(SchedulingTemplateActivityTemplateGroup2CugroupDataService),
				dtoSchemeId: { moduleSubModule: this.templateModuleSubmodule, typeName: 'ActivityTmplGrp2CUGrpDto' },
				permissionUuid: '038baa2dc7a94e56900b1c3f21ffc7af',
				layoutConfiguration: {
					groups: [
						{
							gid: 'default',
							attributes: ['ActivityTemplateGroupFk'],
						},
					],
					overloads: {
						Id: { label: { text: 'Id', key: 'basics.customize.id' }, visible: true },
						ActivityTemplateGroupFk: { label: { text: 'ActivityTemplateGroup', key: 'scheduling.template.ActivityTemplateGroup' }, visible: true },
					},
				},
			};
			this.schedulingTemplateActivityTmplGrp2CUGrpEntityInfoEvaluated = EntityInfo.create(schedulingTemplateActivityTmplGrp2CUGrpEntitySettings);
		}
		return this.schedulingTemplateActivityTmplGrp2CUGrpEntityInfoEvaluated;
	}
}
