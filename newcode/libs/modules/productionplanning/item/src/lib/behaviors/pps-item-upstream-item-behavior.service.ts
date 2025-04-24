import {Injectable, InjectionToken, inject} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IPpsUpstreamItemEntity} from '../model/entities/pps-upstream-item-entity.interface';
import {PpsUpstreamItemButtonFactory} from '../services/upstream-item/pps-upstream-item-button-factory.class';
import {PpsUpstreamItemDataService} from '../services/upstream-item/pps-upstream-item-data.service';

export const PPS_ITEM_UPSTREAM_ITEM_BEHAVIOR_TOKEN = new InjectionToken<PpsItemUpstreamItemBehavior>('ppsItemUpstreamItemBehavior');

@Injectable({
    providedIn: 'root'
})
export class PpsItemUpstreamItemBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsUpstreamItemEntity>, IPpsUpstreamItemEntity> {
    private readonly dataService = inject(PpsUpstreamItemDataService);

    // events:
    // on cell changed
    // on properties changed
    // documentsproject-parent-grid-click

    // buttons:
    // copy
    // onlyShowCurrentUpstreams
    // splitUpStreamItem

    public onCreate(containerLink: IGridContainerLink<IPpsUpstreamItemEntity>): void {
        this.dataService.listGuid = containerLink.uuid;

        PpsUpstreamItemButtonFactory.AddCopyButton(containerLink, this.dataService);
        PpsUpstreamItemButtonFactory.AddFilterButton(containerLink, this.dataService);
        PpsUpstreamItemButtonFactory.AddSplitButton(containerLink, this.dataService);
    }
}