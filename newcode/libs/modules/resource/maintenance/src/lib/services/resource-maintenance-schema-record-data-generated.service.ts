/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMaintenanceSchemaUpdate } from '../model/resource-maintenance-schema-update.class';
import { ResourceMaintenanceSchemaDataService } from './resource-maintenance-schema-data.service';
import { inject } from '@angular/core';
import { DataServiceFlatLeaf, EntityArrayProcessor, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IResourceMaintenanceSchemaEntity, IResourceMaintenanceSchemaRecordEntity } from '@libs/resource/interfaces';

export class ResourceMaintenanceSchemaRecordDataGeneratedService extends DataServiceFlatLeaf<IResourceMaintenanceSchemaRecordEntity,IResourceMaintenanceSchemaEntity,ResourceMaintenanceSchemaUpdate> {
	public constructor(){
		const options: IDataServiceOptions<IResourceMaintenanceSchemaRecordEntity> = {
			apiUrl: 'resource/maintenance/record',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IResourceMaintenanceSchemaRecordEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'Records',
				parent: inject(ResourceMaintenanceSchemaDataService)
			},
			processors: [new EntityArrayProcessor<IResourceMaintenanceSchemaRecordEntity>(['SubResources'])]
		};
		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: ResourceMaintenanceSchemaUpdate, modified: IResourceMaintenanceSchemaRecordEntity[], deleted: IResourceMaintenanceSchemaRecordEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.RecordsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.RecordsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: ResourceMaintenanceSchemaUpdate): IResourceMaintenanceSchemaRecordEntity[] {
		if (complete && complete.RecordsToSave) {
			return complete.RecordsToSave;
		}

		return [];
	}
}