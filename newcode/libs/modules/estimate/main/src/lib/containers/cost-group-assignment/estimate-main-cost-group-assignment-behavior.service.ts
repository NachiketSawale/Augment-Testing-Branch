import {Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IEstimateMainCostGroupAssignment} from '../../model/interfaces/estimate-main-cost-group-assignment.interface';
import {
    EstimateMainCostGroupAssignmentDataService
} from './estimate-main-cost-group-assignment-data.service';
import {ISearchPayload} from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})
export class EstimateMainCostGroupAssignmentBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEstimateMainCostGroupAssignment>,IEstimateMainCostGroupAssignment>{
    public constructor(private dataService: EstimateMainCostGroupAssignmentDataService) {}
    private searchPayload: ISearchPayload = {
        executionHints: false,
        filter: '',
        includeNonActiveItems: false,

        isReadingDueToRefresh: false,
        pageNumber: 0,
        pageSize: 100,
        pattern: '',
        pinningContext: [],
        projectContextId: null,
        useCurrentClient: true
    };

    public onCreate(containerLink: IGridContainerLink<IEstimateMainCostGroupAssignment>): void {
        this.customizeToolbar(containerLink);
    }

    private customizeToolbar(containerLink: IGridContainerLink<IEstimateMainCostGroupAssignment>) {
        containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
    }

}