import { inject, Injectable } from '@angular/core';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { PriceAdjustCopyTenderComponent } from '../../../components/price-adjust-copy-tender/price-adjust-copy-tender.component';
//import { EstimatePriceAdjustmentDataService } from '../estimate-price-adjustment.data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { CopyAdjustPriceType } from './estimate-main-copy-adjust-price.type';
import { CopyAdjustPriceResponse } from './estimate-main-copy-adjust-price-response.type';

@Injectable({ providedIn: 'root' })
export class EstimateMainSyncTenderPriceService {
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly http = inject(HttpClient);
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);
	//private readonly dataService = inject(EstimatePriceAdjustmentDataService);

	public async showDialog() {
		const dialogOption: ICustomDialogOptions<CopyAdjustPriceType, PriceAdjustCopyTenderComponent> = {
			headerText: this.translateService.instant({ key: 'estimate.main.priceAdjust.copyTenderPrice' }),
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn: (evt, info) => {
						this.copyTenderPrice(info.dialog.body.currentItem);
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					fn: (evt, info) => {
						info.dialog.close(StandardDialogButtonId.Cancel);
					},
				},
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: PriceAdjustCopyTenderComponent,
		};
		await this.modalDialogService.show(dialogOption);
	}

	public copyTenderPrice(result?: CopyAdjustPriceType) {
		if (result) {
			const postData = {
				EstHeaderId: this.estimateMainContextService.getSelectedEstHeaderId(),
				ProjectId: this.estimateMainContextService.getSelectedProjectId(),
				CopyTenderPriceToLineItem: result.copyTenderPriceToLineItem,
				CopyTenderPriceToBoqItem: result.copyTenderPriceToBoqItem,
				CopyAQQuantityToBoqItem: result.copyAQQuantityToBoqItem
			};

			if (!result.copyTenderPriceToLineItem && !result.copyTenderPriceToBoqItem) {
				return;
			}

			//estimateMainService.update().then(()=>{
			this.http.post(this.configService.webApiBaseUrl + 'estimate/main/priceadjustment/copyTenderPrice', postData).subscribe((res) => {
				const result = res as CopyAdjustPriceResponse;
				if (result && result.AffectedLineItemCount) {
					//estimateMainService.refresh();
				}
			});
			//	}
			//);
		}
	}
}
