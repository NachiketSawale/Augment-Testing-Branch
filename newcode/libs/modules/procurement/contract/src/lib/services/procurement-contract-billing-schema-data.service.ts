/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { CommonBillingSchemaDataService, IBillingSchemaEntity, ICommonBillingSchemaEntity, IReculateUrlParameter } from '@libs/basics/shared';

/**
 * Contract billing schema data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractBillingSchemaDataService extends CommonBillingSchemaDataService<ICommonBillingSchemaEntity, IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const contractDataService = inject(ProcurementContractHeaderDataService);
		const qualifier = 'procurement.contract.billingschmema';
		super(contractDataService, qualifier);
	}

	protected override provideLoadPayload(): object {
		const contract = this.parentService.getSelectedEntity()!;
		return {
			MainItemId: contract.Id,
			qualifier: this.qualifier,
		};
	}

	protected override getRegenerateUrl(): IReculateUrlParameter {
		const contract = this.parentService.getSelectedEntity()!;
		const rubCategoryFk = this.getRubricCategory(contract)!;
		//TODO: rename the URL here, not sure why for contract it should call another url and the name is related to bill?
		const baseUrl = this.apiUrl + '/reloadBillItems';
		const billingSchemaId = this.getParentBillingSchemaId(contract);
		return { baseUrl: baseUrl, params: { HeaderFK: contract?.Id, billingSchemaFk: billingSchemaId, rubricCategoryFk: rubCategoryFk, qualifier: this.qualifier } };
	}

	protected override getParentBillingSchemaId(contract: IConHeaderEntity): number {
		return contract.BillingSchemaFk;
	}

	protected getRubricCategory(contract: IConHeaderEntity): number {
		return contract.RubricCategoryFk;
	}

	public getExchangeRate(contract: IConHeaderEntity): number {
		return contract.ExchangeRate;
	}

	public getDefaultBillingSchema(prcConfigurationFk: number) {
		return this.http.get<IBillingSchemaEntity>('procurement/common/configuration/defaultbillingschema', { params: { configurationFk: prcConfigurationFk } });
	}

	public getBillingSchemas(prcConfigurationFk: number) {
		return this.http.get<IBillingSchemaEntity[]>('procurement/common/configuration/defaultbillingschemas', { params: { configurationFk: prcConfigurationFk } });
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: ICommonBillingSchemaEntity): boolean {
		return entity.HeaderFk === parentKey.Id;
	}

	protected async doRecalculateBillingSchema(): Promise<ICommonBillingSchemaEntity[]> {
		const headerEntity = this.parentService.getSelectedEntity();

		if (headerEntity) {
			return this.http.get<ICommonBillingSchemaEntity[]>('procurement/contract/billingschema/Recalculate', { params: { headerFk: headerEntity.Id } });
		}

		throw new Error('Main entity is not selected');
	}
}
