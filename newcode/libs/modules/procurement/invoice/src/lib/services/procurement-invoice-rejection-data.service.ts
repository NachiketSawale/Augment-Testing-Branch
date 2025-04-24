/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IInvHeaderEntity, IInvRejectEntity, InvComplete, InvRejectComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { BasicsSharedTaxCodeLookupService, MainDataDto } from '@libs/basics/shared';
import { ProcurementCommonCalculationService, ProcurementCommonItemCalculationService } from '@libs/procurement/common';
import { FieldKind } from '@libs/procurement/shared';
import { ProcurementInvoiceRejectionReadonlyProcessor } from './processors/procurement-invoice-rejection-readonly-processor.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceRejectionDataService extends DataServiceFlatNode<IInvRejectEntity, InvRejectComplete, IInvHeaderEntity, InvComplete> {
	public readonly itemCalculationService = inject(ProcurementCommonItemCalculationService);
	public readonly roundingType = this.itemCalculationService.getRoundingType<IInvRejectEntity>();
	public readonly round = this.itemCalculationService.round.bind(this.itemCalculationService);
	public readonly calculationService = inject(ProcurementCommonCalculationService);
	private readonly taxCodeLookupService = inject(BasicsSharedTaxCodeLookupService);
	public readonly readonlyProcessor: ProcurementInvoiceRejectionReadonlyProcessor;

	protected constructor(protected parentService: ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInvRejectEntity> = {
			apiUrl: 'procurement/invoice/reject',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IInvRejectEntity, IInvHeaderEntity, InvComplete>>{
				role: ServiceRole.Node,
				itemName: 'InvReject',
				parent: parentService,
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
			},
		};
		super(options);

		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor(this.readonlyProcessor);

		this.init();
	}

	protected init() {
		this.parentService.entityProxy.propertyChanged$.subscribe((e) => {
			switch (e.fieldKind) {
				case FieldKind.ExchangeRate:
					this.exchangeUpdated(e.entity);
					break;
				case FieldKind.MdcVatGroupFk:
					this.vatGroupChanged();
					break;
			}
		});
	}

	protected createReadonlyProcessor() {
		return new ProcurementInvoiceRejectionReadonlyProcessor(this);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();

		if (!parentSelection) {
			throw new Error('Should have selected parent entity');
		}

		return { mainItemId: parentSelection.Id };
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity();
		if (parent) {
			return {
				mainItemId: this.getMainItemId(parent),
			};
		}

		throw new Error('The main entity should be selected!');
	}

	protected override onLoadSucceeded(loaded: object): IInvRejectEntity[] {
		const dto = new MainDataDto<IInvRejectEntity>(loaded);
		return dto.Main;
	}

	protected override onCreateSucceeded(created: object): IInvRejectEntity {
		const newData = created as unknown as IInvRejectEntity;
		newData.Quantity = 1;
		return newData;
	}

	public override createUpdateEntity(modified: IInvRejectEntity | null): InvRejectComplete {
		return {
			MainItemId: modified?.Id,
			InvReject: modified ?? null,
		} as InvRejectComplete;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: InvComplete, modified: InvRejectComplete[], deleted: IInvRejectEntity[]): void {
		if (modified?.some(() => true)) {
			parentUpdate.InvRejectToSave = modified;
		}

		if (deleted?.some(() => true)) {
			parentUpdate.InvRejectToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: InvComplete): IInvRejectEntity[] {
		if (complete?.InvRejectToSave) {
			return complete.InvRejectToSave.filter((i) => i.InvReject != null && i.InvReject !== undefined).map((e) => e.InvReject!);
		}

		return [];
	}

	public override isParentFn(parent: IInvHeaderEntity, entity: IInvRejectEntity): boolean {
		return entity.InvHeaderFk === parent.Id;
	}

	public override canCreate(): boolean {
		const invHeader = this.parentService.getSelectedEntity();
		if (!invHeader) {
			return false;
		}
		return !this.isParentStatusReadonly();
	}

	public override canDelete(): boolean {
		const invHeader = this.parentService.getSelectedEntity();
		if (!invHeader) {
			return false;
		}
		const selectedEntity = this.getSelectedEntity();
		if (!super.canDelete() || !selectedEntity) {
			return false;
		}

		if (selectedEntity.Version === 0) {
			return true;
		}
		return !this.isParentStatusReadonly();
	}

	public isParentStatusReadonly(): boolean {
		return this.parentService.isEntityReadonly();
	}

	public override delete(entities: IInvRejectEntity[] | IInvRejectEntity) {
		super.delete(entities);
		this.recalcuteReject();
	}

	protected getMainItemId(parent: IInvHeaderEntity): number {
		return parent.Id;
	}

	public async recalcuteReject() {
		let amountTotalOc = 0;
		let vatOc = 0;
		const rejections = this.getList();
		rejections.forEach((item) => {
			const lookupItem = this.taxCodeLookupService.cache.getItem({ id: item.TaxCodeFk });
			let vatPercent = 0;
			if (item.NetTotalOc && item.NetTotalOc !== 0) {
				amountTotalOc += item.NetTotalOc;
				if (lookupItem) {
					vatPercent = this.parentService.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
					vatOc += this.calculationService.roundTo((item.NetTotalOc * vatPercent) / 100);
				}
			} else if (item.AmountTotalOc) {
				amountTotalOc += item.AmountTotalOc;
				if (lookupItem) {
					vatPercent = this.parentService.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
					vatOc += this.calculationService.roundTo((item.AmountTotalOc * vatPercent) / 100);
				}
			}
		});

		this.parentService.recalcuteInvoiceReject(amountTotalOc, vatOc);
	}

	private exchangeUpdated(invoiceHeader: IInvHeaderEntity): void {
		const exchangeRate = invoiceHeader.ExchangeRate;
		if (exchangeRate == 0) {
			return;
		}
		const items = this.getList();
		items.forEach((item) => {
			item.AmountNet = this.parentService.roundTo(exchangeRate === 0 ? 0 : item.AmountNetOc / exchangeRate);
			if (item.AmountTotalOc) {
				item.AmountTotal = this.parentService.roundTo(exchangeRate === 0 ? 0 : item.AmountTotalOc / exchangeRate);
			}
			item.PriceAskedFor = this.parentService.roundTo(exchangeRate === 0 ? 0 : item.PriceAskedForOc / exchangeRate);
			item.PriceConfirmed = this.parentService.roundTo(exchangeRate === 0 ? 0 : item.PriceConfirmedOc / exchangeRate);

			if (item.AskedForTotalOc) {
				item.AskedForTotal = this.parentService.roundTo(exchangeRate === 0 ? 0 : item.AskedForTotalOc / exchangeRate);
			}

			if (item.ConfirmedTotalOc) {
				item.ConfirmedTotal = this.parentService.roundTo(exchangeRate === 0 ? 0 : item.ConfirmedTotalOc / exchangeRate);
			}

			if (item.NetTotalOc) {
				item.NetTotal = this.parentService.roundTo(exchangeRate === 0 ? 0 : item.NetTotalOc / exchangeRate);
			}
		});

		this.setModified(items);
		this.recalcuteReject();
	}

	public vatGroupChanged() {
		this.recalcuteReject();
	}

	public get parentEntity(): IInvHeaderEntity | null {
		return this.parentService.getSelectedEntity();
	}
}
