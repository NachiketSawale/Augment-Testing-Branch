/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { IHighlightingItemEntity } from '../../model/entities/highlighting-item-entity.interface';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * A container to display some information about a selected filter state.
 */
@Component({
	selector: 'model-administration-filter-state-info-container',
	templateUrl: './filter-state-info-container.component.html',
	styleUrls: ['./filter-state-info-container.component.scss'],
})
export class FilterStateInfoContainerComponent extends EntityContainerBaseComponent<IHighlightingItemEntity> {

	public constructor() {
		super();

		const selSub = this.entitySelection?.selectionChanged$.subscribe(selItems => this.updateOutput());
		if (selSub) {
			this.registerSubscription(selSub);
		}

		// TODO subscribe to customizing filter state data service list loaded (call updateFilterStates) once ready

		this.showLoadingMessage();
		this.showOverlay(this.translateSvc.instant({ key: 'model.administration.noStaticHlItemSelected' }).text);
	}

	private readonly translateSvc = inject(PlatformTranslateService);

	private showOverlay(message?: string) {
		if (message) {
			this.uiAddOns.whiteboard.showInfo(message);
		} else {
			this.uiAddOns.whiteboard.visible = false;
		}
	}

	private showLoadingMessage(message?: string) {
		if (message) {
			this.uiAddOns.busyOverlay.showInfo(message);
		} else {
			this.uiAddOns.busyOverlay.visible = false;
		}
	}

	// TODO: replace with type from customizing once available
	private filterStates?: object[];

	private updateFilterStates() {
		// TODO: use filter state data service from customizing once available
		//this.filterStates = filterStateDataService.getList();
		this.updateOutput();
	}

	public textTitle?: string;

	public textBody?: string;

	private updateOutput() {
		const selStaticHlItem = this.entitySelection.getSelection()[0];
		if (selStaticHlItem) {
			this.showOverlay();
			if (this.filterStates) {
				// TODO: filter by properties of filter states from customizing once available
				const fs = {}; //this.filterStates.find(state => state.Id === selStaticHlItem.FilterStateFk);
				if (fs) {
					// TODO: use properties from filter state entity from customizing once available
					//this.textTitle = fs.DescriptionInfo?.Translated ?? '';
					//this.textBody = fs.RemarkInfo?.Translated ?? '';
					this.showLoadingMessage();
					return;
				}
			}

			this.showLoadingMessage(this.translateSvc.instant({ key: 'model.administration.loadingFilterStates' }).text);
		}
	}
}
