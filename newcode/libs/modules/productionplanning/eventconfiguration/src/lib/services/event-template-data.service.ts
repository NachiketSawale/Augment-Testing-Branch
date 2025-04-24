
import { get, maxBy } from 'lodash';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';

import { EventTemplateEntity } from '../model/entities/event-template-entity.class';
import { EventSequenceConfigEntity } from '../model/entities/event-sequence-config-entity.class';
import { EventSequenceConfigEntityComplete } from '../model/entities/event-sequence-config-entity-complete.class';
import { ProductionplanningEventconfigurationEventSequenceConfigDataService } from './event-sequence-config-data.service';
import { Injectable } from '@angular/core';

import { PpsEventTemplateProcessor } from './event-template.processor';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningEventconfigurationEventTemplateDataService extends DataServiceFlatLeaf<EventTemplateEntity, EventSequenceConfigEntity, EventSequenceConfigEntityComplete> {

	private parentService: ProductionplanningEventconfigurationEventSequenceConfigDataService;

	public constructor(parentService: ProductionplanningEventconfigurationEventSequenceConfigDataService) {
		const options: IDataServiceOptions<EventTemplateEntity> = {
			apiUrl: 'productionplanning/eventconfiguration/template',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyseq',
				usePost: false,
				prepareParam: ident => {
					return { SequenceFk: ident.pKey1 };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<EventTemplateEntity, EventSequenceConfigEntity, EventSequenceConfigEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Template',
				parent: parentService
			}
		};

		super(options);
		this.parentService = parentService;
		this.processor.addProcessor([
			new PpsEventTemplateProcessor(this, this.parentService)
		]);
	}


	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				SequenceFk: parentSelection.Id
			};
		} else {
			throw new Error('There should be a selected parent event sequence config to load the event template data');
		}
	}

	protected override onLoadSucceeded(loaded: object): EventTemplateEntity[] {
		if (loaded) {
			//find last sequence event
			const list: EventTemplateEntity[] = get(loaded, 'Main', []);
			if (list.length > 0) {
				const maxSequenceOrder = maxBy(list, 'SequenceOrder')?.SequenceOrder;
				list.forEach(e => {
					e.LastInSequence = maxSequenceOrder === e.SequenceOrder;
				});
			}
			return list;
		}
		return [];
	}

}