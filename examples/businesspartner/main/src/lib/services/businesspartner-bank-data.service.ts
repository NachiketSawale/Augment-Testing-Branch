/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole, ValidationInfo } from '@libs/platform/data-access';
import { IBankCreateParameter, IBusinessPartnerBankEntity, IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { BusinessPartnerBankReadonlyProcessorService } from './processors/businesspartner-bank-readonly-processor.service';
import { BusinessPartnerBankValidationService } from './validations/businesspartner-bank-validation.service';
import { get } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerBankDataService extends DataServiceFlatLeaf<IBusinessPartnerBankEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	private readonly httpService = ServiceLocator.injector.get(PlatformHttpService);
	public readonlyProcessor: BusinessPartnerBankReadonlyProcessorService;

	public constructor(public businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<IBusinessPartnerBankEntity> = {
			apiUrl: 'businesspartner/main/bank',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createbank',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IBusinessPartnerBankEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BpdBank',
				parent: businesspartnerMainHeaderDataService,
			},
		};
		super(options);
		this.readonlyProcessor = new BusinessPartnerBankReadonlyProcessorService(this);
		this.processor.addProcessor([this.readonlyProcessor]);
		this.processor.addProcessor({
			process: (item) => this.processItem(item),
			revertProcess() {},
		});
	}

	//region basic override
	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		}

		return {
			mainItemId: -1,
		};
	}

	protected override onLoadSucceeded(loaded: object): IBusinessPartnerBankEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		//todo full logic
		return [];
	}

	protected override provideCreatePayload(): IBankCreateParameter {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			const businessPartnerBankCreateRequest: IBankCreateParameter = {
				mainItemId: parentSelection.Id,
				requestDefault: false,
			};
			const existedBanks = this.getList();
			if (existedBanks && existedBanks.length === 0) {
				businessPartnerBankCreateRequest.requestDefault = true;
			}
			return businessPartnerBankCreateRequest;
		}
		throw new Error('Please select a business partner first');
	}

	protected override onCreateSucceeded(created: IBusinessPartnerBankEntity): IBusinessPartnerBankEntity {
		let iban = '';
		if (created.Iban) {
			iban = created.Iban;
		}
		const bankValidationService = ServiceLocator.injector.get(BusinessPartnerBankValidationService);
		const validationInfoIban: ValidationInfo<IBusinessPartnerBankEntity> = {
			entity: created,
			value: iban,
			field: 'Iban',
		};
		bankValidationService.asyncValidateIban(validationInfoIban);
		return created;
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IBusinessPartnerBankEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}

	/// endregion
	// region button
	// todo wait to check
	public override canCreate(): boolean {
		const basecanCreate = super.canCreate();
		if (!basecanCreate) {
			return false;
		}
		const parentSelected = this.getSelectedParent();
		if (!parentSelected) {
			return false;
		}
		const isStatusEditName = this.businesspartnerMainHeaderDataService.isStatusEditName();
		if (!isStatusEditName) {
			return false;
		}
		const isBpStatusHasRight = this.businesspartnerMainHeaderDataService.isBpStatusHasRight(parentSelected, 'statusWithCreateRight');
		return isBpStatusHasRight;
	}

	public override canDelete(): boolean {
		const baseCanDelete = super.canDelete();
		if (!baseCanDelete) {
			return false;
		}
		const parentSelected = this.getSelectedParent();
		if (!parentSelected) {
			return false;
		}
		const selectedEntity = this.getSelectedEntity();
		if (!selectedEntity) {
			return false;
		}
		const isStatusEditName = this.businesspartnerMainHeaderDataService.isStatusEditName();
		if (!isStatusEditName) {
			return false;
		}
		const isBpStatusHasRight = this.businesspartnerMainHeaderDataService.isBpStatusHasRight(parentSelected, 'statusWithDeleteRight');
		return isBpStatusHasRight;
	}

	public disableDeepCopy(): boolean {
		const parentSelected = this.getSelectedParent();
		if (!parentSelected) {
			return true;
		}
		const selectedEntity = this.getSelectedEntity();
		if (!selectedEntity) {
			return true;
		}
		const isStatusEditName = this.businesspartnerMainHeaderDataService.isStatusEditName();
		if (!isStatusEditName) {
			return true;
		}
		const isBpStatusHasRight = this.businesspartnerMainHeaderDataService.isBpStatusHasRight(parentSelected, 'statusWithEidtRight');
		return !isBpStatusHasRight;
	}

	public async copyPaste(): Promise<void> {
		const selectedEntity = this.getSelectedEntity();
		if (selectedEntity) {
			const respone = await this.httpService.post<IBusinessPartnerBankEntity>('businesspartner/main/bank/deepcopy', selectedEntity);
			if (respone) {
				this.handleCreationDone(respone);
			}
		}
	}

	private handleCreationDone(created: IBusinessPartnerBankEntity) {
		if (this.processor !== undefined) {
			this.processor.process(created);
		}
		this.append(created);
		this.select(created);
		this.setModified(created);
	}

	// endregion
	// region process
	private processItem(item: IBusinessPartnerBankEntity) {
		const bankValidationService = ServiceLocator.injector.get(BusinessPartnerBankValidationService);
		const validationInfoBankTypeFk: ValidationInfo<IBusinessPartnerBankEntity> = {
			entity: item,
			value: item.BankTypeFk,
			field: 'BankTypeFk',
		};
		bankValidationService.validateBankTypeFk(validationInfoBankTypeFk);
		if (item.BankFk) {
			const validationInfoBankFk: ValidationInfo<IBusinessPartnerBankEntity> = {
				entity: item,
				value: item.BankFk,
				field: 'BankFk',
			};
			bankValidationService.validateBankFk(validationInfoBankFk);
		}
		const validationInfoCountryFk: ValidationInfo<IBusinessPartnerBankEntity> = {
			entity: item,
			value: item.CountryFk,
			field: 'CountryFk',
		};
		bankValidationService.validateCountryFk(validationInfoCountryFk);
		this.readonlyProcessor.process(item);
	}

	// endregion
}
