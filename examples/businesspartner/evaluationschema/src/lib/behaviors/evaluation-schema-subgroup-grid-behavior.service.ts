import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {BusinessPartnerEvaluationSchemaSubGroupService} from '../services/subgroup-data.service';
import { IEvaluationSubgroupEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})

export class EvaluationSchemaSubGroupGridBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEvaluationSubgroupEntity>, IEvaluationSubgroupEntity> {
	private dataService: BusinessPartnerEvaluationSchemaSubGroupService;

	public constructor() {
		this.dataService = inject(BusinessPartnerEvaluationSchemaSubGroupService);
	}

	public onCreate(containerLink: IGridContainerLink<IEvaluationSubgroupEntity>) {
	}
}
