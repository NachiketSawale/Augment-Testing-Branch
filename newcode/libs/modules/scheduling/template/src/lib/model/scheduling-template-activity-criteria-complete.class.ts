import { CompleteIdentification } from '@libs/platform/common';
import { IActivityCriteriaEntity } from './entities/activity-criteria-entity.interface';

export class SchedulingTemplateActivityCriteriaComplete implements CompleteIdentification<IActivityCriteriaEntity>{

	public Id: number = 0;
	public ActivityCriteria: IActivityCriteriaEntity | null = null;
}
