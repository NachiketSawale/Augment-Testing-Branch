/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsConfigReportGroupDataService } from '../services/basics-config-report-group-data.service';
import { BasicsConfigReportGroupBehavior } from '../behaviors/basics-config-report-group-behavior.service';
import { IReportGroupEntity } from './entities/report-group-entity.interface';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsConfigReportGroupIconService } from '../services/basic-config-report-group-icon.service';

export const BASICS_CONFIG_REPORT_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IReportGroupEntity>({
	grid: {
		title: { key: 'basics.config.reportGroupContainerTitle' },
		behavior: (ctx) => ctx.injector.get(BasicsConfigReportGroupBehavior),
	},
	form: {
		title: { key: 'basics.config.reportGroupDetailsContainerTitle' },
		containerUuid: '81340775ba344a6f98b60ec9403460bf',
	},
	dataService: (ctx) => ctx.injector.get(BasicsConfigReportGroupDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'ReportGroupDto' },
	permissionUuid: '04825f8e8f24445ca2a49fd140daafff',
	layoutConfiguration: (ctx) => {
		const basicsConfigReportGroupIconService = ctx.injector.get(BasicsConfigReportGroupIconService);

		return <ILayoutConfiguration<IReportGroupEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['DescriptionInfo', 'Sorting', 'Isvisible', 'AccessRightDescriptorFk', 'Icon'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.config.', {
					DescriptionInfo: {
						key: 'entityDescription',
					},
					Sorting: {
						key: 'tabSorting',
					},
					Isvisible: {
						key: 'isvisible',
					},
					AccessRightDescriptorFk: {
						key: 'descriptor',
					},
					Icon: {
						key: 'icon',
					},
				}),
			},
			overloads: {
				AccessRightDescriptorFk: {
					readonly: true,
				},
				Icon: {
					grid: {
						type: FieldType.ImageSelect,
						itemsSource: {
							items: basicsConfigReportGroupIconService.createReportGroupCssIconObjects(), //TODO Image select and Icon basis service not available so mock data created using service.
						},
					},
				},
			},
		};
	},
});
