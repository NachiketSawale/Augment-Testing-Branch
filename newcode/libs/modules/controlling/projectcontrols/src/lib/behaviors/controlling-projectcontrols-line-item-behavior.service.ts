import {Injectable} from '@angular/core';
import {IEstimateLineItemBaseBehaviorService } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ControllingProjectcontrolsLineItemBehaviorService extends IEstimateLineItemBaseBehaviorService<IEstLineItemEntity>{

}