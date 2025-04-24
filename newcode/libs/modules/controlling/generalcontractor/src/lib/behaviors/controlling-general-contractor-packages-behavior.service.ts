import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {Injectable, InjectionToken} from '@angular/core';
import {IGccPackagesEntity} from '../model/entities/gcc-packages-entity.interface';


export const CONTROLLING_GENERAL_CONTRACTOR_PACKAGES_BEHAVIOR_TOKEN = new InjectionToken<ControllingGeneralContractorPackagesBehaviorService>('controllingGeneralContractorPackagesBehaviorService');
@Injectable({
    providedIn: 'root'
})

export class ControllingGeneralContractorPackagesBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IGccPackagesEntity>, IGccPackagesEntity> {
    public onCreate(containerLink: IGridContainerLink<IGccPackagesEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IGccPackagesEntity>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
    }
}