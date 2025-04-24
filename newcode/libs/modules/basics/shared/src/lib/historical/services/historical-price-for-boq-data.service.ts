/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {
	IEntitySelection
} from '@libs/platform/data-access';
import { IBasicsSharedHistoricalPriceForBoqEntity } from '../model/entities/historical-price-for-boq-entity.interface';
import {
	IBasicsSharedHistoricalPriceForBoqParam,
	IBasicsSharedHistoricalPriceForItemParentData
} from '../model/interfaces/historical-price-for-item-parameter.interface';
import { BasicsSharedHistoricalPriceBaseDataService } from './historical-price-base-data.service';
export class BasicsSharedHistoricalPriceForBoqDataService<PT extends IEntityIdentification, PU extends  CompleteIdentification<PT>>
	extends BasicsSharedHistoricalPriceBaseDataService<IBasicsSharedHistoricalPriceForBoqEntity, PT, PU> {
	protected constructor(
		protected override parentService: IEntitySelection<object>,
		protected override headerParentService: IEntitySelection<object>
	) {
		super(parentService, headerParentService, 'boqitem', 'commonBoqPrice');
	}

	protected override provideLoadPayload(): object {
		return this.getLoadParameter();
	}

	public getLoadParameter(param?: IBasicsSharedHistoricalPriceForBoqParam): IBasicsSharedHistoricalPriceForBoqParam {
		// TODO: boq item param
		const parentSelected = this.parentService.getSelectedEntity() as IBasicsSharedHistoricalPriceForItemParentData;
		return {
			boqItemId: parentSelected.Id,
			queryFromContract: param ? param.queryFromContract : false,
			queryFromQuotation: param ? param.queryFromQuotation : false,
			startDate: param ? param.startDate : new Date(),
			endDate: param ? param.endDate : new Date(),
			filter: ''
		};
	}
}