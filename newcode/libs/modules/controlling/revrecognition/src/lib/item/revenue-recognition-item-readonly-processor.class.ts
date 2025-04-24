/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { ControllingRevenueRecognitionItemDataService } from './revenue-recognition-item-data.service';
import { IPrrItemEntity } from '../model/entities/prr-item-entity.interface';
import { ControllingRevenueRecognitionItemType } from '../model/enums/revenue-recognition-item.enum';

export class ControllingRevenueRecognitionItemReadonlyProcessor extends EntityReadonlyProcessorBase<IPrrItemEntity> {
	public constructor(dataService: ControllingRevenueRecognitionItemDataService) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IPrrItemEntity> {
		return {
			Code: {
				shared: ['Code', 'AmountContract', 'AmountContractCo', 'AmountContractTotal', 'AmountPervious', 'AmountInc', 'AmountTotal', 'Percentage', 'HeaderDate', 'PrrAccrualType', 'RelevantDate', 'Remark', 'PostingNarrative', 'BusinessPartner'],
				readonly: () => true,
			},
			Remark: e => !(e.item.ItemType > 0 && e.item.PrrConfigurationFk && e.item.PrrConfigurationFk > 0),
			AmountInc: e => !(e.item.ItemType > 0 && e.item.ItemAmountEditable),
			AmountTotal: e => !((e.item.ItemType === ControllingRevenueRecognitionItemType.HeaderType || e.item.ItemType === ControllingRevenueRecognitionItemType.PerformanceAccrual || e.item.ItemType === ControllingRevenueRecognitionItemType.StockOnsite || e.item.ItemType === ControllingRevenueRecognitionItemType.Accruals) && e.item.ItemAmountEditable),
			Percentage: e => !(e.item.ItemType === ControllingRevenueRecognitionItemType.HeaderType && e.item.ItemAmountEditable),
			PostingNarrative: e => !(e.item.PrrConfigurationFk && e.item.PrrConfigurationFk > 0),
		};
	}
}
