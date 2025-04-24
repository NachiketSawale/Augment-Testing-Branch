/* tslint:disable */
import { CompleteIdentification } from '@libs/platform/common';
import { EventSequenceConfigEntity } from './event-sequence-config-entity.class';
import { EventTemplateEntity } from './event-template-entity.class'; 

export class EventSequenceConfigEntityComplete implements CompleteIdentification<EventSequenceConfigEntity> {
	public MainItemId: number = 0;
	public SequenceConfigs: EventSequenceConfigEntity[] | null = []; // the same as name of property SequenceConfigs of RIB.Visual.Productionplanning.EventConfiguration.ServiceFacade.WebApi.EventSequenceCompleteDto
	public TemplateToSave: EventTemplateEntity[] = [];
	public TemplateToDelete: EventTemplateEntity[] = [];
}
