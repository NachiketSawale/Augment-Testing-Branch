/*
 * Copyright(c) RIB Software GmbH
 */


import { EntityInfo } from '@libs/ui/business-base';
import { IActivityTemplateGroupEntity } from './entities/activity-template-group-entity.interface';
import { SchedulingTemplateActivityTemplateGroupDataService } from '../../services/scheduling-template-activity-template-group-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IGridTreeConfiguration } from '@libs/ui/common';

export const SCHEDULING_ACTIVITY_TEMPLATE_GROUP = EntityInfo.create<IActivityTemplateGroupEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Scheduling.Template',
		typeName: 'ActivityTemplateGroupDto'
	},
	permissionUuid: '59e580ecab1f42608b3ab858dcbc22b0',
	grid: {
		legacyId: 'scheduling.templategroup.activityGroupList',
		title: { key: 'scheduling.templategroup.activityGroupListTitle' },
		treeConfiguration: {
			parent: function (entity: IActivityTemplateGroupEntity) {
				if (entity.ActivityTemplateGroupFk){
					return this.parent(entity);
				}return null;
			},
			children: function (entity: IActivityTemplateGroupEntity) {
				const children = entity.ActivityTemplateGroups ?? [];
				return children as IActivityTemplateGroupEntity[];
			}
		} as IGridTreeConfiguration<IActivityTemplateGroupEntity>,
	},
	form: {
		containerUuid: '9F6BDD0C5B51423CA2BCA64FE103187C',
		legacyId: 'scheduling.templategroup.activityGroupDetail',
		title: { key: 'scheduling.templategroup.activityGroupDetailTitle' }
	},
	dataService: ctx => ctx.injector.get(SchedulingTemplateActivityTemplateGroupDataService),
	layoutConfiguration: {
		groups: [
			{
				gid: 'default',
				attributes: ['Code', 'DescriptionInfo'],
			},

		],
		overloads: {

		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.',{
				Code :{ key: 'entityCode'},
				DescriptionInfo: { key: 'entityDescription'},
			})
		}
	}
});
