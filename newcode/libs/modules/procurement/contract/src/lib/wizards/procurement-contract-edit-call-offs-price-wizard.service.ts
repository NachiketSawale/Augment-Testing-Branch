/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {ProcurementContractHeaderDataService} from '../services/procurement-contract-header-data.service';
import { ProcurementContractItemDataService } from '../services/procurement-contract-item-data.service';
import { IReadOnlyField } from '@libs/platform/data-access';
import { IConHeaderEntity } from '../model/entities';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractEditCallOffsPriceWizardService {
	private readonly dataService = inject(ProcurementContractHeaderDataService);
	private readonly prcItemDataService = inject(ProcurementContractItemDataService);

	public onStartWizard() {
		const prcItemEntity = this.prcItemDataService.getSelectedEntity();
		const callOffsEntity = this.dataService.getSelectedEntity();
		const isReadOnly = false;
		if (prcItemEntity && callOffsEntity) {
			const readonlyFields: IReadOnlyField<IConHeaderEntity>[] = [
				{field: 'Price', readOnly: isReadOnly},
				{field: 'PriceOc', readOnly: isReadOnly},
				{field: 'PriceGross', readOnly: isReadOnly},
				{field: 'PriceGrossOc', readOnly: isReadOnly},
				{field: 'PriceUnit', readOnly: isReadOnly},
				{field: 'BasUomPriceUnitFk', readOnly: isReadOnly},
				{field: 'PrcPriceConditionFk', readOnly: isReadOnly},
				{field: 'MdcTaxCodeFk', readOnly: isReadOnly},
			];
			this.dataService.setEntityReadOnlyFields(callOffsEntity, readonlyFields);
		}
		// TODO prcBoqMainService
		//if(prcBoqEntity){
		//const readonlyFields: IReadOnlyField<IConHeaderEntity>[] = [
		//	{field: 'Price', readOnly: isReadOnly},
		//	{field: 'PriceOc', readOnly: isReadOnly},
		//	{field: 'Correction', readOnly: isReadOnly},
		//	{field: 'CorrectionOc', readOnly: isReadOnly}
		//];
		// this.prcBoqMainService.setEntityReadOnlyFields(prcBoqEntity, readonlyFields);}
	}
}