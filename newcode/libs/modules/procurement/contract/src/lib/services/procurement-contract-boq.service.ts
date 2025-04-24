/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BoqCompositeDataService, IBoqCompositeCompleteEntity } from '@libs/boq/main';
import { CompleteIdentification } from '@libs/platform/common';
import { IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { ContractComplete } from '../model/contract-complete.class';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';

// Todo-BOQ: Create separate file for this complete entity probably in the procurement common module. Has to be discussed first
export interface IPrcBoqExtendedComplete extends CompleteIdentification<IPrcBoqExtendedEntity>, IBoqCompositeCompleteEntity {
	MainItemId: number;
	PrcBoqExtended: IPrcBoqExtendedEntity
}

/** Prc contract boq list data service */
@Injectable({providedIn: 'root'})
export class ProcurementContractBoqDataService extends BoqCompositeDataService<IPrcBoqExtendedEntity, IPrcBoqExtendedComplete, IConHeaderEntity, ContractComplete> {  //TODO-BOQ-Create complete class for prcboq and use that
	public constructor(private parentService: ProcurementContractHeaderDataService) {
		const options: IDataServiceOptions<IPrcBoqExtendedEntity> = {
			apiUrl: 'procurement/common/boq',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<IPrcBoqExtendedEntity>>{
				role: ServiceRole.Node,
				itemName: 'PrcBoqExtended',
				parent: parentService,
			},
		};
		super(options);

		this.parentService.changeStructureSetTaxCodeToItemBoq$.subscribe(e => {
			this.updateTaxFromParent();
		});
	}

	//  region CRUD operations
	// #region

	protected override provideLoadPayload(): object {
		return { prcHeaderFk:this.parentService.getSelectedEntity()?.PrcHeaderFk, exchangeRate:1, filterBackups: false }; // TODO-BOQ: exchangeRate?
	}

	public override isParentFn(conHeader: IConHeaderEntity, wicBoqComposite: IPrcBoqExtendedEntity): boolean {
		return true; // conHeader.Id === wicBoqComposite.PrcBoq?.PrcHeaderFk; // // TODO-BOQ: What else to compare?
	}

	public override createUpdateEntity(modified: IPrcBoqExtendedEntity): IPrcBoqExtendedComplete {
		return {
			MainItemId: modified?.Id ?? 0, // TODO-BOQ: Nescessary? Check the backend
			PrcBoqExtended: modified
		} as IPrcBoqExtendedComplete;
	}

	public override registerNodeModificationsToParentUpdate(complete: ContractComplete, modified: IPrcBoqExtendedComplete[], deleted: IPrcBoqExtendedEntity[]) {
		if (modified.length > 0) {
			complete.PrcBoqExtendedToSave = modified;
		}
		if (deleted.length > 0) {
			complete.PrcBoqExtendedToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: ContractComplete): IPrcBoqExtendedEntity[] {
		return complete.PrcBoqExtendedToSave ? (complete.PrcBoqExtendedToSave.flatMap(e => e.PrcBoqExtended ? e.PrcBoqExtended : [])) : [];
	}

	// #endregion
	//  endregion

	private updateTaxFromParent(){
		const parentSelected = this.parentService.getSelectedEntity();
		if (!parentSelected) {
			return;
		}
		const prcItems = this.getList();
		prcItems.forEach((item) => {
			item.BoqRootItem.MdcTaxCodeFk = parentSelected.TaxCodeFk;
			this.setModified(item);
		});
	}

}

