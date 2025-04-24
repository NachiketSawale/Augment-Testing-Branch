import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})
export class SalesContractChangeOrderBehavior implements IEntityContainerBehavior<IGridContainerLink<IOrdHeaderEntity>, IOrdHeaderEntity> {

}