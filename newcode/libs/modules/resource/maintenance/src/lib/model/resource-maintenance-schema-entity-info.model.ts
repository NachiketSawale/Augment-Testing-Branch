/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMaintenanceSchemaDataService } from '../services/data/resource-maintenance-schema-data.service';
import { ResourceMaintenanceSchemaValidationService } from '../services/validation/resource-maintenance-schema-validation.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IResourceMaintenanceSchemaEntity } from '@libs/resource/interfaces';
import { EntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const RESOURCE_MAINTENANCE_SCHEMA_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: {
			text: 'MaintenanceSchema',
			key: 'resource.maintenance.schemaListTitle'
		}
	},
	form: {
		title: {
			text: 'MaintenanceSchema',
			key: 'resource.maintenance.schemaDetailTitle'
		},
		containerUuid: '7f8efe8f35b34937aaf023d76ae30172'
	},
	dataService: (ctx) => ctx.injector.get(ResourceMaintenanceSchemaDataService),
	validationService: (ctx) => ctx.injector.get(ResourceMaintenanceSchemaValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Maintenance',
		typeName: 'MaintenanceSchemaDto'
	},
	permissionUuid: '3218a6cca2b4415ea455785bbe633285',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<IResourceMaintenanceSchemaEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: [
						'DescriptionInfo',
						'Comment',
						'LeadQuantity',
						'LeadDays',
						'IsDefault',
						'Sorting',
						'IsLive',
					]
				},
			],
			overloads: {},
			labels: {
				...prefixAllTranslationKeys('resource.maintenance.', {
					Comment: { key: 'entityComment' },
					LeadQuantity: { key: 'leadQuantity' },
					LeadDays: { key: 'leadDays' },
					IsDefault: { key: 'entityIsDefault' },
					Sorting: { key: 'entitySorting' },
					IsLive: { key: 'entityIsLive' }
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: {key: 'entityDescription'}
				})
			 }
		};
	}
});