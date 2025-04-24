import { CompleteIdentification } from '@libs/platform/common';
import { IEventTemplateEntity } from './entities/event-template-entity.interface';

export class SchedulingTemplateEventTemplateComplete implements CompleteIdentification<IEventTemplateEntity>{

	public Id: number = 0;

	public Datas:IEventTemplateEntity[] | null = [];


}
