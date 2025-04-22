import { Injectable } from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class SalesSharedGeneralBehavior implements IEntityContainerBehavior<IGridContainerLink<object>, object> {
}