/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf, IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IBusinessPartner2CompanyEntity, IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import {BusinesspartnerMainHeaderDataService} from './businesspartner-data.service';
import { get } from 'lodash';
import { PlatformConfigurationService } from '@libs/platform/common';
import { BusinessPartner2CompanyReadonlyProcessorService } from './processors/businesspartner-2company-readonly-processor.service';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartner2CompanyDataService extends DataServiceFlatLeaf<IBusinessPartner2CompanyEntity,
	IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	private readonly configService = inject(PlatformConfigurationService);
	public readonlyProcessor: BusinessPartner2CompanyReadonlyProcessorService;

	public constructor(public businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IBusinessPartner2CompanyEntity> = {
			apiUrl: 'businesspartner/main/businesspartner2company',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IBusinessPartner2CompanyEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BusinessPartner2Company',
				parent: businesspartnerMainHeaderDataService
			}
		};
		super(options);
		businesspartnerMainHeaderDataService.bpCreated$.subscribe((newBp) => {
			this.create();
		});
		this.readonlyProcessor = new BusinessPartner2CompanyReadonlyProcessorService(this);
		this.processor.addProcessor([this.readonlyProcessor]);
		this.processor.addProcessor({

			process: (item) => this.processItem(item),
			revertProcess() {
			}
		});
	}

	private processItem(item: IBusinessPartner2CompanyEntity) {
		this.readonlyProcessor.process(item);
	}

//region basic override
	protected override onLoadSucceeded(loaded: IBusinessPartner2CompanyEntity[]): IBusinessPartner2CompanyEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		return [];
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

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IBusinessPartner2CompanyEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}

	// endregion
	// region button
	// todo wait to check
	public override canCreate(): boolean {
		const firstResult = super.canCreate();
		let secondResult: boolean = true;
		const bpStatus = this.businesspartnerMainHeaderDataService.getItemStatus();
		if (bpStatus?.IsReadonly) {
			secondResult = false;
		}
		const finalResult = firstResult && secondResult;
		return finalResult;
	}

	public override canDelete(): boolean {
		const firstResult = super.canDelete();
		let secondResult: boolean = true;
		const bpStatus = this.businesspartnerMainHeaderDataService.getItemStatus();
		if (bpStatus?.IsReadonly) {
			secondResult = false;
		}
		const data = this.getSelectedEntity();
		if (!data) {
			return false;
		}
		const thirdResult = this.getCellEditable(data);
		const finalResult = firstResult && secondResult && thirdResult;
		return finalResult;
	}

	public getCellEditable(data: IBusinessPartner2CompanyEntity) {
		if (data.Version === 0) {
			return true;
		}
		const dataModified = this.getModified();
		if (dataModified && dataModified.length > 0) {
			const selectDataModified = dataModified.find(e => e.Id == data.Id);
			if (selectDataModified) {
				return true;
			}
		}
		const loginCompanyId = this.configService.getContext().clientId;
		if (loginCompanyId && loginCompanyId === data.CompanyFk) {
			return true;
		}
		return false;
	}

	// endregion
}