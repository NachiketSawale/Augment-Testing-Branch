/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { EstimateMainDetailColumnComponent, EstimateResourceBaseLayoutService } from '@libs/estimate/shared';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { extend } from 'lodash';

/**
 * Estimate Resource Layout Service
 *
 * A service responsible for generating the layout configuration for estimate resources.
 */
@Injectable({ providedIn: 'root' })
export class EstimateMainResourceLayoutService extends EstimateResourceBaseLayoutService<IEstResourceEntity>{
	/**
	 * Generates the layout configuration for estimate resources.
	 *
	 * @returns A promise that resolves with the layout configuration for estimate resources.
	 */
	public override async generateLayout(): Promise<ILayoutConfiguration<IEstResourceEntity>> {
		// You can modify the layout here by adding custom logic or calling other methods
		// For this example, we're just returning the common layout as is.

		const layout = this.commonLayout();

		extend(layout, {
			'overloads': {
				'QuantityDetail':{
					type: FieldType.CustomComponent,
					componentType: EstimateMainDetailColumnComponent
				},
				'QuantityFactorDetail1':{
					type: FieldType.CustomComponent,
					componentType: EstimateMainDetailColumnComponent
				},
				'QuantityFactorDetail2':{
					type: FieldType.CustomComponent,
					componentType: EstimateMainDetailColumnComponent
				},
				'ProductivityFactorDetail':{
					type: FieldType.CustomComponent,
					componentType: EstimateMainDetailColumnComponent
				},
				'CostFactorDetail1':{
					type: FieldType.CustomComponent,
					componentType: EstimateMainDetailColumnComponent
				},
				'CostFactorDetail2':{
					type: FieldType.CustomComponent,
					componentType: EstimateMainDetailColumnComponent
				},
				'EfficiencyFactorDetail1':{
					type: FieldType.CustomComponent,
					componentType: EstimateMainDetailColumnComponent
				},
				'EfficiencyFactorDetail2':{
					type: FieldType.CustomComponent,
					componentType: EstimateMainDetailColumnComponent
				}
			}
		});

		return layout as ILayoutConfiguration<IEstResourceEntity>;
	}
}