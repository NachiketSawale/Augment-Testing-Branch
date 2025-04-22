/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IInv2PESEntity, IInvHeaderEntity, InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { MainDataDto } from '@libs/basics/shared';
import { IExchangeRateChangedEvent, ProcurementCommonRoundingService } from '@libs/procurement/common';
import { ProcurementInvoicePesReadonlyProcessor } from './processors/procurement-invoice-pes-readonly-processor.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoicePesDataService extends DataServiceFlatLeaf<IInv2PESEntity, IInvHeaderEntity, InvComplete> {
	public readonly readonlyProcessor: ProcurementInvoicePesReadonlyProcessor;
	private isAutoCreate: boolean = false;
	private readonly roundingService = inject(ProcurementCommonRoundingService);

	protected constructor(protected parentService: ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInv2PESEntity> = {
			apiUrl: 'procurement/invoice/pes',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IInv2PESEntity, IInvHeaderEntity, InvComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'InvPes',
				parent: parentService,
			},
		};
		super(options);
		this.readonlyProcessor = new ProcurementInvoicePesReadonlyProcessor(this);
		this.processor.addProcessor([this.readonlyProcessor]);
		this.parentService.autoCreateInvoiceToPES$.subscribe((e) => {
			this.onAutoCreateItem(e);
		});
		this.parentService.exchangeRateChanged$.subscribe((e) => {
			this.onParentExchangeRateChanged(e);
		});
	}

	public override isParentFn(parentKey: IInvHeaderEntity, entity: IInv2PESEntity): boolean {
		return entity.InvHeaderFk === parentKey.Id;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: InvComplete, modified: IInv2PESEntity[], deleted: IInv2PESEntity[]): void {
		if (modified && modified.length > 0) {
			parentUpdate.InvPesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			parentUpdate.InvPesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: InvComplete): IInv2PESEntity[] {
		if (parentUpdate && parentUpdate.InvPesToSave) {
			return parentUpdate.InvPesToSave;
		}
		return [];
	}

	public calculateFromPes() {
		//todo Waiting for the invoiceHeaderValidationService design
		// const totalPesValueOc = this.getList().reduce((accumulator, item) => accumulator + item.PesValueOc, 0);
		// const totalPesVatOc = this.getList().reduce((accumulator, item) => accumulator + item.PesVatOc, 0);
		// invoiceHeaderValidationService.recalculateFromPes(totalPesValueOc, totalPesVatOc);
	}

	////procurementInvoicePESDataFillFieldsProcessor.processItem(entity) => updateEntityValues  Implement it another way
	public updateEntityValues(entities: IInv2PESEntity[]) {
		const exChangeRate = this.getSelectedParent()!.ExchangeRate;
		entities.forEach((entity) => {
			entity.PesValue = exChangeRate === 0 ? 0 : (entity.PesValueOc || 0) / exChangeRate;
			entity.PesVat = exChangeRate === 0 ? 0 : (entity.PesVatOc || 0) / exChangeRate;
		});
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			mainItemId: parent.Id,
		};
	}

	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			mainItemId: parent.Id,
			BillschemeFk: parent.BillingSchemaFk,
			BpdVatGroupFk: parent.BpdVatGroupFk,
			PesHeaderFk: parent.PesHeaderFk,
		};
	}

	protected override onLoadSucceeded(loaded: object): IInv2PESEntity[] {
		const dataDto = new MainDataDto<IInv2PESEntity>(loaded);
		this.calculateValueGrossAndOc(dataDto.Main);
		return dataDto.Main;
	}

	protected override onCreateSucceeded(created: IInv2PESEntity): IInv2PESEntity {
		if (this.isAutoCreate) {
			this.isAutoCreate = false;
		}
		this.calculateValueGrossAndOc([created]);
		return created;
	}

	protected async onAutoCreateItem(pesHeaderId?: number) {
		const pesItem = this.getList()
			.map((item) => item.PesHeaderFk)
			.filter((item) => item === pesHeaderId);
		if (!pesItem) {
			this.isAutoCreate = true;
			await this.create();
		}
	}

	protected onParentExchangeRateChanged(e: IExchangeRateChangedEvent) {
		const exchangeRate = e.exchangeRate;
		this.getList().forEach((item) => {
			item.PesValue = this.roundingService.roundTo(item.PesValueOc || 0, exchangeRate);
			item.PesVat = this.roundingService.roundTo(item.PesVatOc || 0, exchangeRate);
			this.calculateValueGrossAndOc([item]);
			this.setModified(item);
		});
		this.calculateFromPes();
	}

	private calculateValueGrossAndOc(entities: IInv2PESEntity[]) {
		entities.forEach((entity) => {
			entity.ValueGross = (entity.PesValue || 0) + (entity.PesVat || 0);
			entity.ValueOcGross = (entity.PesValueOc || 0) + (entity.PesVatOc || 0);
		});
	}

	//todo Waiting for the ProcurementInvoiceCertificateDataService design
	// function setConHeaderToCertificate() {
	// 	procurementInvoiceCertificateDataService.setConHeaderFromPes(_.map(service.getList(), 'PesHeaderFk'));
	// }
	// procurementInvoiceCertificateDataService.getConHeaderDataFromPes.register(setConHeaderToCertificate);
}
