

/*
 * Copyright(c) RIB Software GmbH
 */

import _, { get } from 'lodash';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

import {
	IEngDrawingComponentEntityGenerated
} from '../../model/drawing/eng-drawing-component-entity-generated.interface';
import {
	IDrawingComponentDataServiceCreationOptions
} from '../../model/drawing/drawing-component-data-service-creation-options.interface';

/**
 *  For PpsItem, ProductTemplate
 * */
export class PpsSharedDrawingComponentDataService<T extends IEngDrawingComponentEntityGenerated, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatLeaf<T, PT, PU> {

	public constructor(
		private config: IDrawingComponentDataServiceCreationOptions<PT, PU>
	) {
		const endPoint = config.endPoint || 'getbydrawing';
		const options: IDataServiceOptions<T> = {
				apiUrl: 'productionplanning/drawing/component',
				readInfo: <IDataServiceEndPointOptions>{
					endPoint: endPoint,
					usePost: true,
					prepareParam: ident => {
						if (endPoint === 'getbydrawing') {
							const drawingId = get(this.getSelectedParent(), config.drawingKey || '');
							return {
								PKey1: drawingId,
							};
						} else if (this.config.endPoint === 'getbyproductdesc') {
							const descriptionId = get(this.getSelectedParent(), config.productTemplateKey || '');
							const drawingId = get(this.getSelectedParent(), config.drawingKey || '');
							return {
								PKey1: descriptionId,
								PKey2: drawingId
							};
						}
						return {};
					}
				},
				createInfo: <IDataServiceEndPointOptions>{
					endPoint: 'create',
					usePost: true,
					prepareParam: ident => {
						const drawingId = get(this.getSelectedParent(), config.drawingKey || '');
						const descriptionId = get(this.getSelectedParent(), config.productTemplateKey || '');
						return {
							PKey1: drawingId,
							PKey2: descriptionId
						};
					}
				},
				roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
					role: ServiceRole.Leaf,
					itemName: 'DrawingComponents',
					parent: config.parentService
				}
			};
		super(options);
	}

	public override isParentFn(parentKey: PT, entity: IEngDrawingComponentEntityGenerated): boolean {
		return entity.PpsProductdescriptionFk === _.get(parentKey, this.config.productTemplateKey || '');
	}
}
