/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceMaintenanceSchemaEntity, IResourceMaintenanceSchemaRecordEntity } from '@libs/resource/interfaces';

export class ResourceMaintenanceSchemaUpdate implements CompleteIdentification<IResourceMaintenanceSchemaEntity> {
	public MaintenanceSchemaId: number = 0;
	public MaintenanceSchemas: IResourceMaintenanceSchemaEntity[] | null = [];
	public RecordsToSave: IResourceMaintenanceSchemaRecordEntity[] | null = [];
	public RecordsToDelete: IResourceMaintenanceSchemaRecordEntity[] | null = [];
}