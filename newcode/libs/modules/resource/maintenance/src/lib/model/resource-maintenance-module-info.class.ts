/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { RESOURCE_MAINTENANCE_SCHEMA_ENTITY_INFO } from './resource-maintenance-schema-entity-info.model';
import { RESOURCE_MAINTENANCE_SCHEMA_RECORD_ENTITY_INFO } from './resource-maintenance-schema-record-entity-info.model';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';

export class ResourceMaintenanceModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance: ResourceMaintenanceModuleInfo = new ResourceMaintenanceModuleInfo();
	public override get internalModuleName(): string {
		return 'resource.maintenance';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Resource.Maintenance';
	}
	private readonly translationPrefix: string = 'resource.maintenance';
	public override get entities(): EntityInfo[] {
		return [
			RESOURCE_MAINTENANCE_SCHEMA_ENTITY_INFO,
			RESOURCE_MAINTENANCE_SCHEMA_RECORD_ENTITY_INFO,
		];
	}
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}
	protected override get translationContainer(): string | undefined {
		return 'c3471218f5694e6f89273acee90547be';
	}
}