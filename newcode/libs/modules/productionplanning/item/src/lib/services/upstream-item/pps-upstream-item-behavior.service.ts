/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsUpstreamItemDataService } from './pps-upstream-item-data.service';
import { IPpsUpstreamItemEntity } from '../../model/models';
import { PpsUpstreamItemButtonFactory } from './pps-upstream-item-button-factory.class';

/**
 * The document base behavior for different type document entity container
 */
// export class PpsUpstreamItemBehaviorService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
export class PpsUpstreamItemBehaviorService
	implements IEntityContainerBehavior<IGridContainerLink<IPpsUpstreamItemEntity>, IPpsUpstreamItemEntity> {

	private readonly toolbarOptions: {
		copySupported: boolean,
		filterSupported: boolean,
		splitSupported: boolean,
	};

	/**
	 * The constructor
	 * @param dataService data service.
	 */
	public constructor(private dataService: IPpsUpstreamItemDataService, toolbarOptions: {
		copySupported?: boolean,
		filterSupported?: boolean,
		splitSupported?: boolean,
	}) {
		this.toolbarOptions = {
			copySupported: toolbarOptions.copySupported ?? true,
			filterSupported: toolbarOptions.filterSupported ?? true,
			splitSupported: toolbarOptions.splitSupported ?? true,
		};
	}

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

		if (this.toolbarOptions.copySupported) {
			PpsUpstreamItemButtonFactory.AddCopyButton(containerLink, this.dataService);
		}
		if (this.toolbarOptions.filterSupported) {
			PpsUpstreamItemButtonFactory.AddFilterButton(containerLink, this.dataService);
		}
		if (this.toolbarOptions.splitSupported) {
			PpsUpstreamItemButtonFactory.AddSplitButton(containerLink, this.dataService);
		}
	}
}
