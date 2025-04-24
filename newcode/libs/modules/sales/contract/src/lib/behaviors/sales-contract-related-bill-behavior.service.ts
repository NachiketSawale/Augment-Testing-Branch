import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class SalesContractRelatedBillBehavior implements IEntityContainerBehavior<IGridContainerLink<IBillHeaderEntity>, IBillHeaderEntity> {

}