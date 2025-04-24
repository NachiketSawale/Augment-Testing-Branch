import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { IBusinessPartnerEntity, IUpdaterequestEntity, UpdateRequestHttpresponseEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import * as _ from 'lodash';
import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerMainUpdateRequestDataService extends DataServiceFlatLeaf<IUpdaterequestEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>{
	private businesspartnerMainHeaderDataService = inject(BusinesspartnerMainHeaderDataService);
	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);
	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IUpdaterequestEntity> = {
			apiUrl: 'businesspartner/main/updaterequest',
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IUpdaterequestEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'BpdUpdateRequest',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}

		return {
			mainItemId: -1
		};
	}

	protected override onLoadSucceeded(loaded: object): IUpdaterequestEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', []);
		}
		return [];
	}

	public canUpdateRequest():boolean{
		const selected = this.getSelectedParent() as IBusinessPartnerEntity;
		if(this.getList().length <= 0 || this.businesspartnerMainHeaderDataService.isEntityReadOnly(selected)){
			return false;
		}else{
			return  true;
		}
	}

	public UpdateRequests(){
		const item = this.getSelectedParent() as IBusinessPartnerEntity;
		if(item){
			this.http.post(this.config.webApiBaseUrl + 'businesspartner/main/updaterequest/update?mainItemId=' + item.Id, {}).subscribe(res=>{
				let currentList:IUpdaterequestEntity[] = [];
				const data = res as UpdateRequestHttpresponseEntity;
				if(!_.isNull(data.data)){
					currentList = data.data;
				}
				this.updateList(currentList);
			});
		}
	}

	private updateList(items: IUpdaterequestEntity[]){
		if(items.length > 0){
			this.setList(this.getList().concat(items));
		}
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IUpdaterequestEntity): boolean {
		return entity.BpdBusinesspartnerFk === parentKey.Id;
	}
}