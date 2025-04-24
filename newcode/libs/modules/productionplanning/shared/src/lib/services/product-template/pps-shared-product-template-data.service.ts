/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { DataServiceFlatNode, DataServiceFlatRoot, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPpsProductTemplateEntityGenerated } from '../../model/product-template/pps-product-template-entity-generated.interface';

/**
 *  For Drawing, DrawingStack, CadImport
 * */
export class PpsSharedProductTemplateDataService<T extends IPpsProductTemplateEntityGenerated, U extends CompleteIdentification<T>, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatNode<T, U, PT, PU> {
	public constructor(
		protected parentService: DataServiceFlatRoot<PT, PU>,
		protected config: {
			apiUrl?: string | null;
			parentFilter?: string | null;
			endRead?: string | null;
			uiServiceKey?: string | null;
			usePostForRead?: boolean | null;
		},
	) {
		config.apiUrl = config.apiUrl || 'productionplanning/producttemplate/productdescription';
		const options: IDataServiceOptions<T> = {
			apiUrl: config.apiUrl,
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: config.endRead,
				usePost: config.usePostForRead,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident) => {
					const parentSelected = this.getSelectedParent();
					if (config.parentFilter === 'engDrawingId') {
						return {
							pKey1: parentSelected?.Id,
						};
					} else if (config.parentFilter === 'engTaskId') {
						return {
							pKey2: parentSelected?.Id,
						};
					} else if (config.parentFilter === 'engStackId') {
						return {
							pKey1: get(parentSelected, 'EngDrawingFk'),
							pKey3: parentSelected?.Id,
						};
					}
					return {};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'ProductDescription',
				parent: parentService,
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	protected override provideLoadPayload(): object {
		const parentSelected = this.getSelectedParent();
		const id = get(parentSelected, 'Id');
		if (parentSelected) {
			if (this.config.usePostForRead) {
				const engDrawingFk = get(parentSelected, 'EngDrawingFk') || null;
				if (engDrawingFk && this.config.parentFilter === 'engDrawingId') {
					return { Id: id, PKey1: engDrawingFk };
				}
				return { Id: id };
			} else {
				return { [this.config.parentFilter!]: parentSelected.Id };
			}
		} else {
			throw new Error('There should be a selected parent to load the corresponding product-template data');
		}
	}
}
