/*
 * Copyright(c) RIB Software GmbH
 * ----------------------------------------------------------------------
 * This is auto-generated code by ClientTypeScriptDataServiceGenerator.
 * ----------------------------------------------------------------------
 * This code was generated by RIB Model Generator tool.
 *
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
 * ----------------------------------------------------------------------
 */

import { ResourceMaintenanceSchemaUpdate } from '../../../model/resource-maintenance-schema-update.class';
import {
	DataServiceFlatRoot,
	EntityArrayProcessor,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IResourceMaintenanceSchemaEntity } from '@libs/resource/interfaces';

export class ResourceMaintenanceSchemaDataGeneratedService extends DataServiceFlatRoot<IResourceMaintenanceSchemaEntity,ResourceMaintenanceSchemaUpdate> {
	public constructor(){
		const options: IDataServiceOptions<IResourceMaintenanceSchemaEntity> = {
			apiUrl: 'resource/maintenance/schema',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IResourceMaintenanceSchemaEntity>>{
				role: ServiceRole.Root,
				itemName: 'MaintenanceSchemas'
			},
			processors: [new EntityArrayProcessor<IResourceMaintenanceSchemaEntity>(['SubResources'])]
		};
		super(options);
	}
	public override createUpdateEntity(modified: IResourceMaintenanceSchemaEntity | null): ResourceMaintenanceSchemaUpdate {
		const complete = new ResourceMaintenanceSchemaUpdate();
		if (modified !== null) {
			complete.MaintenanceSchemaId = modified.Id;
			complete.MaintenanceSchemas = [modified];
		}
		
		return complete;
	}
	public override getModificationsFromUpdate(complete: ResourceMaintenanceSchemaUpdate): IResourceMaintenanceSchemaEntity[] {
		if (complete.MaintenanceSchemas === null) {
			return complete.MaintenanceSchemas = [];
		} else {
			return complete.MaintenanceSchemas;
		}
	}
}