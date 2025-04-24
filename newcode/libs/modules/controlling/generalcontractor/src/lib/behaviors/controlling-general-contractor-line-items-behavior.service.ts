import {Injectable, InjectionToken} from '@angular/core';
import {IEstimateLineItemBaseBehaviorService} from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';


export const CONTROLLING_GENERAL_CONTRACTOR_LINE_ITEMS_BEHAVIOR_TOKEN = new InjectionToken<ControllingGeneralContractorLineItemsBehaviorService>('controllingGeneralContractorLineItemsBehaviorService');
@Injectable({
    providedIn: 'root'
})

export class ControllingGeneralContractorLineItemsBehaviorService extends IEstimateLineItemBaseBehaviorService<IEstLineItemEntity>{

}