import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {BusinessPartnerEvaluationSchemaItemService} from '../services/items-data.service';
import {IEvaluationItemEntity} from '@libs/businesspartner/interfaces';


@Injectable({
  providedIn: 'root'
})
export class EvaluationSchemaItemGridBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEvaluationItemEntity>,
    IEvaluationItemEntity>{
  private dataServices: BusinessPartnerEvaluationSchemaItemService;
  public constructor() {
    this.dataServices = inject(BusinessPartnerEvaluationSchemaItemService);
  }

  public onCreate(containerLink: IGridContainerLink<IEvaluationItemEntity>) {
  }
}
