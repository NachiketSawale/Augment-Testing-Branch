/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import {
	CompleteIdentification,
	IEntityIdentification,
	PlatformCommonModule,

} from '@libs/platform/common';
import { BasicsSharedHistoricalPriceForBoqDataService } from '../../services/historical-price-for-boq-data.service';
import { UiCommonModule } from '@libs/ui/common';
import { HistoricalPriceBaseComponent } from '../historical-price-base/historical-price-base.component';
import {
	IBasicsSharedHistoricalPriceForItemParam
} from '../../model/interfaces/historical-price-for-item-parameter.interface';

@Component({
	selector: 'basics-shared-historical-price-for-boq',
	standalone: true,
	templateUrl: './historical-price-for-boq.component.html',
	styleUrls: ['./historical-price-for-boq.component.scss'],
	imports: [
		PlatformCommonModule,
		UiCommonModule,
		HistoricalPriceBaseComponent
	]
})
export class HistoricalPriceForBoqComponent {

	public readonly dataService! : BasicsSharedHistoricalPriceForBoqDataService<IEntityIdentification,CompleteIdentification<IEntityIdentification>>;

	public currentItem: IBasicsSharedHistoricalPriceForItemParam = {
		queryFromQuotation: true,
		queryFromContract: true,
		startDate: new Date(),
		endDate: new Date()
	};

	public constructor() {
	}

	public getBoqLabel() {
		//TODO: for boq
		/*if (this.selectedBoqItem) {
			return this.selectedBoqItem.Brief ? this.selectedBoqItem.Brief :
				(this.selectedBoqItem.rootItem ? this.selectedBoqItem.rootItem.Brief :
					(this.selectedBoqItem.BriefInfo ? this.selectedBoqItem.BriefInfo.Translated : ''));
		}*/
		return '';
	}

	public async search(){
		await this.dataService.reloadData(this.currentItem);
	}
}
