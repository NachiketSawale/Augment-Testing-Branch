/*
 * Copyright(c) RIB Software GmbH
 */

import { GridContainerBaseComponent } from '../grid-container-base/grid-container-base.component';
import { Component, inject } from '@angular/core';
import { IGridContainerLink } from '../../model/grid-container-link.interface';
import {
	UiBusinessBaseEntityContainerMenulistHelperService
} from '../../services/entity-container-menulist-helper.service';


/**
 * The container component for standard entity-based grid containers that display flat list of items.
 */
@Component({
	selector: 'ui-business-base-grid-container',
	templateUrl: '../grid-container-base/grid-container-base.component.html'
})
export class GridContainerComponent<T extends object> extends GridContainerBaseComponent<T, IGridContainerLink<T>> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();

		this.containerLink = this.createGridContainerLink();

		this.generateGridColumns();

		const menulistHelperSvc = inject(UiBusinessBaseEntityContainerMenulistHelperService);
		this.uiAddOns.toolbar.addItems(menulistHelperSvc.createListMenuItems(this.containerLink, this.loadEntitySchema(), this.entityValidationService, this.layout));
		this.attachToEntityServices();
		this.initCustomBehavior();
	}
}