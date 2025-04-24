/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import {
	DataServiceFlatNode, DataServiceFlatRoot,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPpsProductEntityGenerated } from '../../model/product/product-entity-generated.interface';



/**
 *  For UnassignBundle, Bundle, Formwork, ProductionSet, ProductTemplate
 * */
export class PpsSharedProductDataService<T extends IPpsProductEntityGenerated, U extends CompleteIdentification<T>, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatNode<T, U, PT, PU> {

	public constructor(
		private parentService: DataServiceFlatRoot<PT, PU>,
		protected config: {
			apiUrl?: string,
			itemName?: string,
			filter?: string,
			PKey1?: string
		}
	) {
		config.apiUrl = config.apiUrl || 'productionplanning/common/product';
		config.itemName = config.itemName || 'Product';
		const options: IDataServiceOptions<T> = {
			apiUrl: config.apiUrl,
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customlistbyforeignkey',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: ident => {
					const PKey1 = get(this.getSelectedParent(), config.PKey1 || '');
					return {
						Id: this.getSelectedParent()?.Id,
						PKey1: PKey1
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Node,
				itemName: config.itemName,
				parent: parentService
			}
		};
		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	protected override provideLoadPayload(): object {
		const mainItemId = this.getSelectedParent()?.Id || -1;
		if (this.config.filter !== '') {
			return { foreignKey: this.config.filter, mainItemId: mainItemId };
		} else {
			throw new Error('There should be a selected parent to load the corresponding product data');
		}
	}
}
