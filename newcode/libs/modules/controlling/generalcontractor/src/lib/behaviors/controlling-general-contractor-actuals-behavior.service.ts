import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IGccActualVEntity} from '../model/entities/gcc-actual-ventity.interface';
import {Injectable, InjectionToken} from '@angular/core';


export const CONTROLLING_GENERAL_CONTRACTOR_ACTUALS_BEHAVIOR_TOKEN = new InjectionToken<ControllingGeneralContractorActualsBehaviorService>('controllingGeneralContractorActualsBehaviorService');
@Injectable({
    providedIn: 'root'
})

export class ControllingGeneralContractorActualsBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IGccActualVEntity>, IGccActualVEntity> {
    public onCreate(containerLink: IGridContainerLink<IGccActualVEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IGccActualVEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}