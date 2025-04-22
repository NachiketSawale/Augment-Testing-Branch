import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {BusinessPartnerEvaluationSchemaGroupService} from '../services/group-data.service';
import { IEvaluationGroupEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})

export class EvaluationSchemaGroupGridBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEvaluationGroupEntity>, IEvaluationGroupEntity> {
	private dataService: BusinessPartnerEvaluationSchemaGroupService;

	public constructor() {
		this.dataService = inject(BusinessPartnerEvaluationSchemaGroupService);
	}

	public onCreate(containerLink: IGridContainerLink<IEvaluationGroupEntity>) {
	}
}
