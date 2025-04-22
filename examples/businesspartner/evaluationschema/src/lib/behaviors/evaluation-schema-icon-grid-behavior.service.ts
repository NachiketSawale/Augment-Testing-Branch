import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {BusinesspartnerEvaluationschemaIconService} from '../services/schema-icon-data.service';
import { IEvaluationSchemaIconEntity } from '@libs/businesspartner/interfaces';
@Injectable({
	providedIn: 'root'
})
export class EvaluationSchemaIconGridBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEvaluationSchemaIconEntity>,
	IEvaluationSchemaIconEntity> {
	private dataService: BusinesspartnerEvaluationschemaIconService;

	public constructor() {
		this.dataService = inject(BusinesspartnerEvaluationschemaIconService);
	}

	public onCreate(containerLink: IGridContainerLink<IEvaluationSchemaIconEntity>) {
	}
}
