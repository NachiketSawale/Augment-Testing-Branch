/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { PpsMaintenanceEntity } from './pps-maintenance-entity.class';
import { PpsProductionPlaceEntity } from '@libs/productionplanning/shared';

export class PpsProductionPlaceEntityComplete implements CompleteIdentification<PpsProductionPlaceEntity> {
	public MainItemId: number = 0;
	public PpsMaintenanceToDelete: PpsMaintenanceEntity[] = [];
	public PpsMaintenanceToSave: PpsMaintenanceEntity[] = [];
	public ProductionPlace?: PpsProductionPlaceEntity;
}
