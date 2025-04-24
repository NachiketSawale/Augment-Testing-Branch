/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';

import { IEventTypeEntity } from '../model/entities/event-type-entity.interface';
import { EventTypeComplete } from '../model/event-type-complete.class';
import { ConfigurationClerkRoleSlotDataService } from './configuration-clerk-role-slot-data.service';
import { ConfigurationEngtypeDataService } from './configuration-engtype-data.service';
import { ConfigurationEventTypeQtySlotDataService } from './configuration-event-type-qty-slot-data.service';
import { ConfigurationEventTypeSlotDataService } from './configuration-event-type-slot-data.service';
import { ConfigurationLogConfigDataService } from './configuration-log-config-data.service';
import { ConfigurationPhaseDateSlotDataService } from './configuration-phase-date-slot-data.service';
import { ConfigurationPlannedQuantitySlotDataService } from './configuration-planned-quantity-slot-data.service';
import { ConfigurationUpstreamItemTemplateDataService } from './configuration-upstream-item-template-data.service';
import { ExternalConfigurationDataService } from './external-configuration-data.service';


@Injectable({
	providedIn: 'root'
})

export class ConfigurationEventTypeDataService extends DataServiceFlatRoot<IEventTypeEntity, EventTypeComplete> {

	public constructor(
		private _clerkRoleService: ConfigurationClerkRoleSlotDataService,
		private _engTypeService: ConfigurationEngtypeDataService,
		private _eventTypeQtySlotService: ConfigurationEventTypeQtySlotDataService,
		private _eventTypeSlotService: ConfigurationEventTypeSlotDataService,
		private _logConfigService: ConfigurationLogConfigDataService,
		private _phaseDateSlotService: ConfigurationPhaseDateSlotDataService,
		private _plannedQuantitySlotService: ConfigurationPlannedQuantitySlotDataService,
		private _upstreamItemTemplateService: ConfigurationUpstreamItemTemplateDataService,
		private _externalConfigurationService: ExternalConfigurationDataService,
	) {
		const options: IDataServiceOptions<IEventTypeEntity> = {
			apiUrl: 'productionplanning/configuration/eventtype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IEventTypeEntity>>{
				role: ServiceRole.Root,
				itemName: 'EventType',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IEventTypeEntity | null): EventTypeComplete {
		const complete = new EventTypeComplete();
		if (modified !== null) {
			complete.EventType = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: EventTypeComplete): IEventTypeEntity[] {
		if (complete.EventType) {
			return [complete.EventType];
		}
		return [];
	}

	//TODO: a workaround for multiple root containers
	public override refreshAll(): Promise<void> {
		this._clerkRoleService.refreshAll();
		this._engTypeService.refreshAll();
		this._eventTypeQtySlotService.refreshAll();
		this._eventTypeSlotService.refreshAll();
		this._logConfigService.refreshAll();
		this._phaseDateSlotService.refreshAll();
		this._plannedQuantitySlotService.refreshAll();
		this._upstreamItemTemplateService.refreshAll();
		this._externalConfigurationService.refreshAll();
		return super.refreshAll();
	}
}












