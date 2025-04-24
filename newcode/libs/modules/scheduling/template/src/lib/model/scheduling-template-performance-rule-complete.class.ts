import { CompleteIdentification } from '@libs/platform/common';
import { IPerformanceRuleEntity } from './entities/performance-rule-entity.interface';

export class SchedulingTemplatePerformanceRuleComplete implements CompleteIdentification<IPerformanceRuleEntity>{

	public Id: number = 0;

	public Datas: IPerformanceRuleEntity[] | null = [];


}
