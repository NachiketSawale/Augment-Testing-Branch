import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { BusinessPartnerMainGuarantorDataService } from './guarantor-data.service';
import { GuarantorEntityComplete } from '../model/entities/guarantor-entity-complete.class';
import { IGuaranteeUsedEntity, IGuarantorEntity } from '@libs/businesspartner/interfaces';
import * as _ from 'lodash';


@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerMainGuaranteeUsedDataService extends DataServiceFlatLeaf<IGuaranteeUsedEntity,
	IGuarantorEntity, GuarantorEntityComplete> {
	public constructor(businesspartnerGuarantorDataService: BusinessPartnerMainGuarantorDataService) {
		const options: IDataServiceOptions<IGuaranteeUsedEntity> = {
			apiUrl: 'businesspartner/certificate/certificate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listtoguaranteeused',
				usePost: true
			},
			entityActions: { createSupported: false, deleteSupported: false},
			roleInfo: <IDataServiceChildRoleOptions<IGuaranteeUsedEntity, IGuarantorEntity, GuarantorEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'GuaranteeUsed',
				parent: businesspartnerGuarantorDataService,
			}
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				BusinessPartnerIssuerFk: parentSelection.BusinessPartnerFk,
				CertificateTypeFk: parentSelection.GuarantorTypeFk,
				CurrencyFk: parentSelection.CurrencyFk
			};
		}
		return { };
	}

	protected override onLoadSucceeded(loaded: object): IGuaranteeUsedEntity[] {
		if (loaded) {
			return _.get(loaded, '', loaded as IGuaranteeUsedEntity[]);
		}
		return [];
	}

	public override isParentFn(parentKey: IGuarantorEntity, entity: IGuaranteeUsedEntity): boolean {
		return entity.OrdHeaderFk === parentKey.Id;
	}

}