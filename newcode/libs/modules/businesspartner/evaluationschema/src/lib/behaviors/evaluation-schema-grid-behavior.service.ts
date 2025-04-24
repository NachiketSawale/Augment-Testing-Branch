import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {BusinesspartnerEvaluationschemaHeaderService} from '../services/schema-data.service';
import {ISearchPayload} from '@libs/platform/common';
import { IEvaluationSchemaEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EvaluationSchemaGridBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEvaluationSchemaEntity>, IEvaluationSchemaEntity> {
	private dataService: BusinesspartnerEvaluationschemaHeaderService;
	private searchPayload : ISearchPayload ={
		executionHints: false,
		filter: '',
		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pinningContext: [],
		projectContextId: null,
		pattern: '',
		useCurrentClient: false,
		includeNonActiveItems: false
	};
	public constructor() {
		this.dataService = inject(BusinesspartnerEvaluationschemaHeaderService);
	}

	public onCreate(containerLink: IGridContainerLink<IEvaluationSchemaEntity>) {
		this.dataService.refresh(this.searchPayload).then((value) => {
			containerLink.gridData = value.dtos;
		});
	}
}
