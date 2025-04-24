/*
 * Copyright(c) RIB Software GmbH
 */
import {
	CompleteIdentification,
	IEntityIdentification, IIdentificationData
} from '@libs/platform/common';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {IPrcWarrantyEntity} from '../model/entities';
import { IPrcHeaderDataService } from '../model/interfaces';
import { ProcurementCommonWarrantyProcessor } from './processors/procurement-common-warranty-processor.service';

export abstract class ProcurementCommonWarrantyDataService<T extends IPrcWarrantyEntity,PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>extends DataServiceFlatLeaf<T, PT, PU> {
	protected constructor(protected parentService: IPrcHeaderDataService<PT, PU>) {

		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/common/warranty',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					const headerContext = this.parentService.getHeaderContext();
					return {
						PrcHeaderFk: headerContext.prcHeaderFk
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcWarranty',
				parent: parentService
			}
		};
		super(options);
		this.processor.addProcessor(new ProcurementCommonWarrantyProcessor(this));
	}

	protected override provideLoadPayload(): object {
		const headerContext = this.parentService.getHeaderContext();
		return {
			MainItemId: headerContext.prcHeaderFk,
		};
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		return loaded as T[];
	}

}
