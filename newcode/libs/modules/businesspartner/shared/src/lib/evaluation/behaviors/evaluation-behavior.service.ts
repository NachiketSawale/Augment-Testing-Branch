import {IEntityContainerBehavior, IEntityContainerLink} from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
import { IEvaluationGetTreeResponse } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root'
})

export class BusinesspartnerSharedEvaluationBehaviorService implements IEntityContainerBehavior<IEntityContainerLink<IEvaluationGetTreeResponse>, IEvaluationGetTreeResponse> {
	public constructor() {}
}
