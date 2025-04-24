/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatRoot,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { EventSequenceConfigEntity } from '../model/entities/event-sequence-config-entity.class';
import { EventSequenceConfigEntityComplete } from '../model/entities/event-sequence-config-entity-complete.class';

import { PpsEventSequenceConfigReadonlyProcessor } from './event-sequence-config.processor';

@Injectable({ providedIn: 'root' })
export class ProductionplanningEventconfigurationEventSequenceConfigDataService extends DataServiceFlatRoot<EventSequenceConfigEntity, EventSequenceConfigEntityComplete> {
	public constructor() {
		const options: IDataServiceOptions<EventSequenceConfigEntity> = {
			apiUrl: 'productionplanning/eventconfiguration/sequence',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create'
			},
			roleInfo: <IDataServiceRoleOptions<EventSequenceConfigEntity>>{
				role: ServiceRole.Root,
				itemName: 'SequenceConfigs'
			}
		};
		super(options);

		this.processor.addProcessor([
			new PpsEventSequenceConfigReadonlyProcessor(this)
		]);
	}

	public override createUpdateEntity(modified: EventSequenceConfigEntity | null): EventSequenceConfigEntityComplete {
		const complete = new EventSequenceConfigEntityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.SequenceConfigs = [modified];
		} else if (this.hasSelection()) { // fix issue that missing initializing MainItemId(MainItemId is 0) when only updating event templates
			complete.MainItemId = this.getSelection()[0].Id;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: EventSequenceConfigEntityComplete): EventSequenceConfigEntity[] {
		if (complete.SequenceConfigs === null) {
			complete.SequenceConfigs = [];
		}

		return complete.SequenceConfigs;
	}

}
