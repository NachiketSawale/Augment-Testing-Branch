/*
 * Copyright(c) RIB Software GmbH
 */

import { get, isNull } from 'lodash';
import {
	DataServiceFlatLeaf,
	DataServiceFlatRoot,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {
	IPpsParameterEntityGenerated
} from '../../model/formula-configuration/pps-parameter-entity-generated.interface';


/**
 *  For ProductTemplate, Product, PpsItem
 * */
export class PpsSharedParameterDataService<T extends IPpsParameterEntityGenerated, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatLeaf<T, PT, PU> {

	public constructor(
		private parentService: DataServiceFlatRoot<PT, PU>,
		protected config: {
			filter?: string,
			PKey1?: string
			PKey2?: string
		}
	) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'productionplanning/formulaconfiguration/parameter',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listby',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: ident => {
					const PKey1 = get(this.getSelectedParent(), config.PKey1 || '');
					const PKey2 = get(this.getSelectedParent(), config.PKey2 || '');
					return {
						Id: this.getSelectedParent()?.Id,
						PKey1: PKey1,
						PKey2: PKey2
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'PpsParameter',
				parent: parentService
			}
		};
		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	protected override provideLoadPayload(): object {
		const descriptionFk = get(this.getSelectedParent(), this.config.filter || '');
		if (!isNull(descriptionFk)) {
			return { DescriptionFk: descriptionFk };
		} else {
			throw new Error('There should be a selected parent to load the corresponding parameter data');
		}
	}
}
