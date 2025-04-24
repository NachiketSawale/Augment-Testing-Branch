/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import {
	EstimateAssembliesBaseLayoutService
} from '@libs/estimate/shared';
import { ILayoutConfiguration } from '@libs/ui/common';
import { Injectable } from '@angular/core';

/**
 * An Angular service responsible for estimating the layout of assemblies, extending the AssemblyBaseLayoutService.
 * It provides specific layout generation logic for IEstLineItemEntity types.
 */
@Injectable({ providedIn: 'root' })
export class EstimateAssembliesLayoutService extends EstimateAssembliesBaseLayoutService<IEstLineItemEntity>{

	/**
	 * Generates a layout configuration.
	 * This method returns a Promise that resolves to an ILayoutConfiguration<IEstLineItemEntity> type.
	 * You can modify the layout logic here, but currently it just calls the commonLayout method.
	 */
	public override async generateLayout(): Promise<ILayoutConfiguration<IEstLineItemEntity>> {
		// Note: The current implementation just calls the commonLayout method, and we can modify the commonLayout here
		return this.commonLayout() as ILayoutConfiguration<IEstLineItemEntity>;
	}
}