/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IInvHeader2InvHeaderEntity, IInvHeaderEntity, IInvHeaderLookupVEntity, InvComplete } from '../model';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { ProcurementShareInvoiceLookupService } from '@libs/procurement/shared';
import { BasicsSharedInvoiceTypeLookupService, BasicsShareProcurementConfigurationToBillingSchemaLookupService, MainDataDto } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { maxBy, subtract, sumBy } from 'lodash';
import { ProcurementInvoiceChainedInvoiceReadonlyProcessor } from './processors/procurement-invoice-chained-invoice-readonly-processor.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceChainedInvoiceDataService extends DataServiceFlatLeaf<IInvHeader2InvHeaderEntity, IInvHeaderEntity, InvComplete> {
	private readonly http = inject(HttpClient);

	private readonly configService = inject(PlatformConfigurationService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly invoiceLookupService = inject(ProcurementShareInvoiceLookupService);
	protected readonly invTypeLookupService = inject(BasicsSharedInvoiceTypeLookupService);
	protected readonly url = 'procurement/invoice/invheader2invheader';
	public readonly readonlyProcessor: ProcurementInvoiceChainedInvoiceReadonlyProcessor;
	private readonly billingSchemaLookupService = inject(BasicsShareProcurementConfigurationToBillingSchemaLookupService);
	private creationData: [
		{
			MainItemId?: number;
			InvHeaderChainedFk?: number;
		},
	] = [
		{
			MainItemId: undefined,
			InvHeaderChainedFk: undefined,
		},
	];

	protected constructor(protected parentService: ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInvHeader2InvHeaderEntity> = {
			apiUrl: 'procurement/invoice/invheader2invheader',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IInvHeader2InvHeaderEntity, IInvHeaderEntity, InvComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'InvHeader2InvHeader',
				parent: parentService,
			},
		};
		super(options);
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor(this.readonlyProcessor);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			mainItemId: parent.Id,
		};
	}

	protected override onLoadSucceeded(loaded: object): IInvHeader2InvHeaderEntity[] {
		const dataDto = new MainDataDto<IInvHeader2InvHeaderEntity>(loaded);
		return dataDto.Main;
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			mainItemId: parent.Id,
		};
	}

	protected override onCreateSucceeded(created: IInvHeader2InvHeaderEntity): IInvHeader2InvHeaderEntity {
		return created;
	}

	private getInvLookupDataByInvIds(chainInvIds: number[]){
		const invLookupDatas = this.invoiceLookupService.cache.getList();
		if (!invLookupDatas) {
			return;
		}
		return invLookupDatas.filter((e) => chainInvIds.includes(e.Id));
	}


	public async createItems(itemList: IInvHeaderLookupVEntity[]) {
		const invHeaderSelected = this.parentService.getSelectedEntity()!;

		const invType = this.invTypeLookupService.cache.getItem({ id: invHeaderSelected.InvTypeFk });
		if (invType) {
			itemList.forEach((e) => {
				if ((invType.Isficorrection && !e.IsProgress) || !invType.Isficorrection) {
					this.creationData.push({
						MainItemId: invHeaderSelected.Id,
						InvHeaderChainedFk: e.Id,
					});
				}
			});
		}
		if (this.creationData.length > 0) {
			try {
				this.delete(this.getList());
			} catch (error) {
				console.error('Delete record has error:', error);
			} finally {
				const responseData = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + this.url + 'createitems', this.creationData));
				const data = responseData as IInvHeader2InvHeaderEntity[];
				this.setList(data);
				this.updateParentField();
			}
		}
	}

	public updateParentField() {
		const invoiceIds: number[] = [];
		let sumGrossChainInvoices: number = 0;
		let sumNetChainInvoices: number = 0;
		const invHeaderSelected = this.parentService.getSelectedEntity()!;
		const invType = this.invTypeLookupService.cache.getItem({ id: invHeaderSelected.InvTypeFk });

		if (invType && invType.Isficorrection) {
			const maxProgressIdEty = maxBy(this.getList(), (e) => e.InvHeaderChainedProgressId);
			if (maxProgressIdEty) {
				invoiceIds.push(maxProgressIdEty.InvHeaderChainedFk);
				sumGrossChainInvoices = sumBy(this.getInvLookupDataByInvIds(invoiceIds),e=>e.TotalPerformedGross);
				sumNetChainInvoices = sumBy(this.getInvLookupDataByInvIds(invoiceIds),e=>e.TotalPerformedNet);
			}
		} else {
			this.getList().forEach((e) => {
				invoiceIds.push(e.InvHeaderChainedFk);
			});
			sumGrossChainInvoices = sumBy(this.getInvLookupDataByInvIds(invoiceIds),e=>e.AmountGross);
			sumNetChainInvoices = sumBy(this.getInvLookupDataByInvIds(invoiceIds),e=>e.AmountNet);
		}
		this.onChainInvoiceChange(sumGrossChainInvoices, sumNetChainInvoices);
	}

	public async onAutoCreateItem(conHeaderId?: number) {
		const invHeaderSelected = this.parentService.getSelectedEntity();
		if (!invHeaderSelected || !invHeaderSelected.BillingSchemaFk) {
			return;
		}
		conHeaderId = conHeaderId ?? (invHeaderSelected.ConHeaderFk as number);
		const params = {
			invoiceId: invHeaderSelected.Id,
			conHeaderFk: conHeaderId ?? null,
			billingSchemaFk: invHeaderSelected.BillingSchemaFk,
		};

		try {
			const responseData = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}procurement/invoice/invheader2invheader/getchainedinvoices`, { params: params }));
			if (responseData) {
				await this.createItems(responseData as unknown as IInvHeaderLookupVEntity[]);
			}
		} catch (error) {
			console.error('Error fetching chained invoices:', error);
		}
	}

	public override delete(entities: IInvHeader2InvHeaderEntity[] | IInvHeader2InvHeaderEntity) {
		super.delete(entities);
		this.updateParentField();
	}

	protected createReadonlyProcessor() {
		return new ProcurementInvoiceChainedInvoiceReadonlyProcessor(this);
	}

	public onChainInvoiceChange(sumGrossChainInvoices: number, sumNetChainInvoices: number) {
		const entity = this.getSelectedParent()!;
		const billSchemas = this.billingSchemaLookupService.cache.getList();

		const billSchema = billSchemas.find((e) => e.Id === entity.BillingSchemaFk);
		entity.BillSchemeIsChained = billSchema ? billSchema.IsChained : false;
		//todo-Whether the calculation logic should be done when it is saved on the backend
		if (billSchema && billSchema.IsChained) {
			entity.AmountGrossReconciliation = entity.TotalPerformedGross;
			entity.AmountNetReconciliation = entity.TotalPerformedNet;
			entity.AmountVatReconciliation = entity.TotalPerformedGross - entity.TotalPerformedNet;

			entity.AmountGrossOcReconciliation = entity.TotalPerformedGross * entity.ExchangeRate;
			entity.AmountNetOcReconciliation = entity.TotalPerformedNet * entity.ExchangeRate;
			entity.AmountVatOcReconciliation = Math.round(Math.round(entity.TotalPerformedGross * entity.ExchangeRate) - Math.round(entity.TotalPerformedNet * entity.ExchangeRate));
		} else {
			entity.AmountGrossReconciliation = entity.AmountGross;
			entity.AmountNetReconciliation = entity.AmountNet;
			entity.AmountVatReconciliation = entity.AmountGross - entity.AmountNet;

			entity.AmountGrossOcReconciliation = entity.AmountGross * entity.ExchangeRate;
			entity.AmountNetOcReconciliation = entity.AmountNet * entity.ExchangeRate;
			entity.AmountVatOcReconciliation = (entity.AmountGross - entity.AmountNet) * entity.ExchangeRate;
		}

		entity.TotalPerformedGross = this.round(entity.AmountGross + sumGrossChainInvoices, 2);
		entity.TotalPerformedNet = this.round(entity.AmountNet + sumNetChainInvoices, 2);

		// This field is always calculated as AMOUNT_GROSS - AMOUNT_NET – AMOUNT_VATPES
		// – AMOUNT_VATCONTRACT – AMOUNT_VATOTHER – AMOUNT_VATREJECT
		entity.AmountVatBalanceOc = Math.round(subtract(entity.AmountVatOcReconciliation, entity.FromBillingSchemaVatOc! + entity.AmountVatPesOc + entity.AmountVatContractOc + entity.AmountVatOtherOc + entity.AmountVatRejectOc));
		entity.AmountVatBalance = Math.round(subtract(entity.AmountVatReconciliation, entity.FromBillingSchemaVat! + entity.AmountVatPes + entity.AmountVatContract + entity.AmountVatOther + entity.AmountVatReject));

		entity.AmountVatBalanceOc = Math.round(entity.AmountVatBalanceOc);
		entity.AmountVatBalance = Math.round(entity.AmountVatBalance);

		// This field is calculated as AMOUNT_NET – AMOUNT_NETPES – AMOUNT_NETCONTRACT
		// – AMOUNT_NETOTHER – AMOUNT_NETREJECT
		entity.AmountNetBalanceOc = Math.round(subtract(entity.AmountNetOcReconciliation, entity.FromBillingSchemaNetOc! + entity.AmountNetPesOc + entity.AmountNetContractOc + entity.AmountNetOtherOc + entity.AmountNetRejectOc));
		entity.AmountNetBalance = Math.round(subtract(entity.AmountNetReconciliation, entity.FromBillingSchemaNet! + entity.AmountNetPes + entity.AmountNetContract + entity.AmountNetOther + entity.AmountNetReject));

		entity.AmountNetBalanceOc = Math.round(entity.AmountNetBalanceOc);
		entity.AmountNetBalance = Math.round(entity.AmountNetBalance);

		entity.AmountGrossBalanceOc = entity.AmountNetBalanceOc + entity.AmountVatBalanceOc;
		entity.AmountGrossBalance = entity.AmountNetBalance + entity.AmountVatBalance;

		this.parentService.setModified(entity);
	}

	private round(value: number, precision: number): number {
		const factor = Math.pow(10, precision);
		return Math.round(value * factor) / factor;
	}
}
