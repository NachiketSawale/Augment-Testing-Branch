import { Component, inject, OnInit } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import {ContainerBaseComponent} from '@libs/ui/container-system';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';
import { IBusinessPartnerEntity, IRatingViewEntity } from '@libs/businesspartner/interfaces';
@Component({
	selector: 'businesspartner-main-customer-satisfaction-container',
	templateUrl: './customer-satisfaction.component.html',
	styleUrls: ['customer-satisfaction.component.scss']
})

export class BusinesspartnerMainCustomerSatisfactionComponent extends ContainerBaseComponent implements OnInit {
	private readonly httpService = inject(PlatformHttpService);
	private readonly businesspartnerMainHeaderDataService = inject(BusinesspartnerMainHeaderDataService);
	private ratingViewHttpResponse:IRatingViewEntity|null=null;

	private async getData(parentSelect:IBusinessPartnerEntity): Promise<boolean> {
		const data = await this.httpService.get<IRatingViewEntity[]>('businesspartner/main/ratingview/list' + '?mainItemId=' + parentSelect.Id);
		if (data[0]) {
			this.ratingViewHttpResponse=data[0];
		}
		return false;


	}
	public getShow(index:number): boolean{
		if (this.ratingViewHttpResponse?.Rating !== undefined && this.ratingViewHttpResponse.Rating !== null) {
			return this.ratingViewHttpResponse && (this.ratingViewHttpResponse.Rating === index || (this.ratingViewHttpResponse.Rating > 1 && index === 0));
		}
		return false;
	}
	public ngOnInit(): void {
		const selSub = this.businesspartnerMainHeaderDataService.selectionChanged$.subscribe(parentSelect => {
			if (parentSelect?.[0]) {
				this.getData(parentSelect[0]);
			}
		});
		this.registerFinalizer(() => selSub.unsubscribe());
	}
}


