import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import { BusinessPartnerEvaluationschemaGroupIconService } from '../services/group-icon-data.service';
import { IEvaluationGroupIconEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EvaluationSchemaGroupIconGridBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEvaluationGroupIconEntity>, IEvaluationGroupIconEntity> {
	private dataService: BusinessPartnerEvaluationschemaGroupIconService;

	public constructor() {
		this.dataService = inject(BusinessPartnerEvaluationschemaGroupIconService);
	}

	public onCreate(containerLink: IGridContainerLink<IEvaluationGroupIconEntity>) {
	}
}
