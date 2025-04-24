/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { EstimateLineItemBaseLayoutService } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';

/**
 * Estimate Line Item Layout Service
 *
 * A service responsible for generating the layout configuration for estimate line items.
 */
@Injectable({ providedIn: 'root' })
export class EstimateMainLineItemLayoutService extends EstimateLineItemBaseLayoutService<IEstLineItemEntity>{
	/**
	 * Generates the layout configuration for estimate line items.
	 *
	 * @returns A promise that resolves with the layout configuration for estimate line items.
	 */
	public override async generateLayout(): Promise<ILayoutConfiguration<IEstLineItemEntity>> {
		// You can modify the layout here by adding custom logic or calling other methods
		// For this example, we're just returning the common layout as is.
		return this.commonLayout() as ILayoutConfiguration<IEstLineItemEntity>;
	}
}