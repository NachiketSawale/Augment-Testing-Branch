/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMaintenanceSchemaLookupService } from './resource-maintenance-schema-lookup.service';
import { ResourceMaintenanceSchemaRecordLookupService } from './resource-maintenance-schema-record-lookup.service';
import { IResourceMaintenanceSchemaEntity, IResourceMaintenanceSchemaRecordEntity } from '@libs/resource/interfaces';
import { createLookup, FieldType, ICommonLookupOptions, TypedConcreteFieldOverload } from '@libs/ui/common';

export class ResourceMaintenanceLookupProviderGeneratedService {
	public provideMaintenanceSchemaLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T,IResourceMaintenanceSchemaEntity>({
				dataServiceToken: ResourceMaintenanceSchemaLookupService,
				showClearButton: !!options?.showClearButton
			})
		};
	}
	public provideMaintenanceSchemaReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T,IResourceMaintenanceSchemaEntity>({
				dataServiceToken: ResourceMaintenanceSchemaLookupService,
				showClearButton: false
			})
		};
	}
	public provideMaintenanceSchemaRecordLookupOverload<T extends object>(options?: ICommonLookupOptions): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T,IResourceMaintenanceSchemaRecordEntity>({
				dataServiceToken: ResourceMaintenanceSchemaRecordLookupService,
				showClearButton: !!options?.showClearButton
			})
		};
	}
	public provideMaintenanceSchemaRecordReadonlyLookupOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T,IResourceMaintenanceSchemaRecordEntity>({
				dataServiceToken: ResourceMaintenanceSchemaRecordLookupService,
				showClearButton: false
			})
		};
	}
}