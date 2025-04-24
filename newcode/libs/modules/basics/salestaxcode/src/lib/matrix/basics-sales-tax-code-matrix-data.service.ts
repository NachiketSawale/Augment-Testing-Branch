/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf, ServiceRole,
	IDataServiceChildRoleOptions, IDataServiceEndPointOptions,
	IDataServiceOptions
} from '@libs/platform/data-access';
import { BasicsSalesTaxCodeDataService } from '../sales-tax-code/basics-sales-tax-code-data.service';
import { IMdcSalesTaxMatrixEntity } from '../model/entities/interface/mdc-sales-tax-matrix-entity.interface';
import { MdcSalesTaxCodeComplete } from '../model/entities/complete-class/mdc-sales-tax-code-complete.class';
import { IMdcSalesTaxCodeEntity } from '@libs/basics/interfaces';

/**
 * The Basics Sales Tax Code Matrix data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSalesTaxCodeMatrixDataService extends DataServiceFlatLeaf<IMdcSalesTaxMatrixEntity, IMdcSalesTaxCodeEntity, MdcSalesTaxCodeComplete> {
	public constructor(private parentService: BasicsSalesTaxCodeDataService) {
		const options: IDataServiceOptions<IMdcSalesTaxMatrixEntity> = {
			apiUrl: 'basics/salestaxcode/salestaxmatrix',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listtcm',
				usePost: false,
				prepareParam: ident => {
					return { mainItemId: ident.pKey1 };
				}
			},
			createInfo: { endPoint: 'createnew', usePost: true },
			roleInfo: <IDataServiceChildRoleOptions<IMdcSalesTaxMatrixEntity, IMdcSalesTaxCodeEntity, MdcSalesTaxCodeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MdcSalesTaxMatrixDto',
				parent: parentService
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id
			};
		} else {
			throw new Error('There should be a selected parent sales tax code to load the matrix data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IMdcSalesTaxMatrixEntity[] {
		return loaded as IMdcSalesTaxMatrixEntity[];
	}

	protected override onCreateSucceeded(loaded: object): IMdcSalesTaxMatrixEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as IMdcSalesTaxMatrixEntity;
		if (entity && parent) {
			entity.SalesTaxCodeFk = parent.Id;
		}
		return entity;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: MdcSalesTaxCodeComplete, modified: IMdcSalesTaxMatrixEntity[], deleted: IMdcSalesTaxMatrixEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.MdcSalesTaxMatrixToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.MdcSalesTaxMatrixToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MdcSalesTaxCodeComplete): IMdcSalesTaxMatrixEntity[] {
		if (complete && complete.MdcSalesTaxMatrixToSave) {
			return complete.MdcSalesTaxMatrixToSave;
		}
		return [];
	}

	public override isParentFn(parentKey: IMdcSalesTaxCodeEntity, entity: IMdcSalesTaxMatrixEntity): boolean {
		return entity.SalesTaxCodeFk === parentKey.Id;
	}
}