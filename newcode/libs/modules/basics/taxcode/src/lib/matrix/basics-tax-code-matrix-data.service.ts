/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { BasicsTaxCodeDataService } from '../tax-code/basics-tax-code-data.service';
import { IMdcTaxCodeEntity, IMdcTaxCodeMatrixEntity } from '@libs/basics/interfaces';
import { MdcTaxCodeComplete } from '../model/complete-class/mdc-tax-code-complete.class';
import { BasicsSharedNewEntityValidationProcessorFactory } from '@libs/basics/shared';
import { BasicsTaxCodeMatrixValidationService } from './basics-tax-code-matrix-validation.service';

/**
 * The Basics Tax Code Matrix data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsTaxCodeMatrixDataService extends DataServiceFlatLeaf<IMdcTaxCodeMatrixEntity, IMdcTaxCodeEntity, MdcTaxCodeComplete> {
	private readonly validationProcessor = inject(BasicsSharedNewEntityValidationProcessorFactory);
	public constructor(private parentService: BasicsTaxCodeDataService) {
		const options: IDataServiceOptions<IMdcTaxCodeMatrixEntity> = {
			apiUrl: 'basics/taxcode/taxcodeMatrix',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listtcm',
				usePost: false,
			},
			createInfo: { endPoint: 'createnew', usePost: true },
			roleInfo: <IDataServiceChildRoleOptions<IMdcTaxCodeMatrixEntity, IMdcTaxCodeEntity, MdcTaxCodeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MdcTaxCodeMatrixDto',
				parent: parentService,
			},
		};

		super(options);
		this.processor.addProcessor([this.provideNewEntityValidationProcessor()]);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id,
			};
		} else {
			throw new Error('There should be a selected parent tax code to load the matrix data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IMdcTaxCodeMatrixEntity[] {
		return loaded as IMdcTaxCodeMatrixEntity[];
	}

	protected override onCreateSucceeded(loaded: object): IMdcTaxCodeMatrixEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as IMdcTaxCodeMatrixEntity;
		if (entity && parent) {
			entity.MdcTaxCodeFk = parent.Id;
		}
		return entity;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: MdcTaxCodeComplete, modified: IMdcTaxCodeMatrixEntity[], deleted: IMdcTaxCodeMatrixEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.TaxCodeMatrixToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.TaxCodeMatrixToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: MdcTaxCodeComplete): IMdcTaxCodeMatrixEntity[] {
		return complete && complete.TaxCodeMatrixToSave ? complete.TaxCodeMatrixToSave : [];
	}

	public override isParentFn(parentKey: IMdcTaxCodeEntity, entity: IMdcTaxCodeMatrixEntity): boolean {
		return entity.MdcTaxCodeFk === parentKey.Id;
	}
	private provideNewEntityValidationProcessor() {
		return this.validationProcessor.createProcessor(BasicsTaxCodeMatrixValidationService, {
			moduleSubModule: 'Basics.TaxCode',
			typeName: 'MdcTaxCodeMatrixDto',
		});
	}
}
