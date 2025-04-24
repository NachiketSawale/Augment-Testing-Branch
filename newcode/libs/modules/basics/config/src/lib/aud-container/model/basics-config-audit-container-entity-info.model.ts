/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsConfigAuditContainerDataService } from '../services/basics-config-audit-container-data.service';
import { IAudContainerEntity } from './entities/aud-container-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Basics Config Audit Container Entity Info Model
 */
export const BASICS_CONFIG_AUDIT_CONTAINER_ENTITY_INFO: EntityInfo = EntityInfo.create<IAudContainerEntity>({
	grid: {
		title: { key: 'basics.config.AuditTrailContainerTitle' }
	},
	form: {
		title: { key: 'basics.config.AuditTrailDetailsContainerTitle' },
		containerUuid:'789846cceac24b5a8798fb6e15c46f33'
	},

	dataService: (ctx) => ctx.injector.get(BasicsConfigAuditContainerDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'AudContainerDto' },
	permissionUuid: 'a3416418eed24b3fa1fc439172c61320',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'basics.config.AuditTrailContainerTitle',
					text: 'Basic Data',
				},
				attributes: ['Id', 'DescriptionInfo', 'Checked'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('basics.config.', {
				DescriptionInfo: {
					key: 'description',
				},
			}),
			...prefixAllTranslationKeys('basics.config.moduleViews.', {
				Id: {
					key: 'columnViewId',
				},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Checked: {
					key: 'entityChecked',
					text: 'Checked',
				},
			}),
		},
		overloads: {
			Id: {
				readonly: true,
			},
			DescriptionInfo: {
				readonly: true,
			},
		},
	},
});
