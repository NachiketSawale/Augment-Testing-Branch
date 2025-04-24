import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import { IGuarantorEntity, IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import { PlatformConfigurationService } from '@libs/platform/common';
import { GuarantorEntityComplete } from '../model/entities/guarantor-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerMainGuarantorDataService extends DataServiceFlatNode<IGuarantorEntity, GuarantorEntityComplete, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	private platformConfiguration = inject(PlatformConfigurationService);

	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IGuarantorEntity> = {
			apiUrl: 'businesspartner/main/guarantor',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IGuarantorEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Node,
				itemName: 'Guarantor',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);
	}

	public override createUpdateEntity(modified: IGuarantorEntity | null): GuarantorEntityComplete {
		const complete = new GuarantorEntityComplete();
		if (modified !== null) {
			modified.CurrencyFk = 1;
			complete.MainItemId = modified.Id;
			complete.Guarantor = modified;
			// complete.Guarantors = [modified];
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: GuarantorEntityComplete): IGuarantorEntity[] {
		if (complete.Guarantors === null) {
			complete.Guarantors = [];
		}

		return complete.Guarantors;
	}

	public override canDelete(): boolean {
		const parentSelection = this.getSelectedParent();
		if(!_.isUndefined(parentSelection) && !_.isNull(parentSelection)){
			const guarantorSelection = this.getSelection();
			if (guarantorSelection.length > 0){
				return true;//(guarantorSelection.shift()?.CompanyFk === this.platformConfiguration.signedInClientId); // TODO: && !parentSelection.shift()?.B;
			}
		}
		return false;
	}

	public override canCreate(): boolean {
		return super.canCreate();// TODO: && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
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

	protected override onLoadSucceeded(loaded: object): IGuarantorEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', loaded as IGuarantorEntity[]);
		}
		return [];
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		throw new Error('Please select a business partner first');
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IGuarantorEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}
}