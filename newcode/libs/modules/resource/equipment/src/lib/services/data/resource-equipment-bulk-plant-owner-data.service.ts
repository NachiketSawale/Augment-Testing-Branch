/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceEquipmentBulkPlantOwnerDataGeneratedService } from './generated/resource-equipment-bulk-plant-owner-data-generated.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentBulkPlantOwnerDataService extends ResourceEquipmentBulkPlantOwnerDataGeneratedService {
	//TODO: move the line:
	//entityActions: { createSupported: false, deleteSupported: false }
	//from generated file to this one. If it is not there any more it was deleted by regeneration!
}