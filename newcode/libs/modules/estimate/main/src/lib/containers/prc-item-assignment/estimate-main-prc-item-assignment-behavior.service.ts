import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
import { IEstimateMainPrcItemAssignmentEntity } from '@libs/estimate/shared';
import { EstimateMainPrcItemAssignmentDataService } from './estimate-main-prc-item-assignment-data.service';


@Injectable({
    providedIn: 'root'
})
export class EstimateMainPrcItemAssignmentBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEstimateMainPrcItemAssignmentEntity>,IEstimateMainPrcItemAssignmentEntity>{

    public constructor(private dataService: EstimateMainPrcItemAssignmentDataService) {}

    public onCreate(containerLink: IGridContainerLink<IEstimateMainPrcItemAssignmentEntity>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IEstimateMainPrcItemAssignmentEntity>) {
        containerLink.uiAddOns.toolbar.addItems([]);
    }

}