/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { IConHeaderEntity, IConItemEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { FrmStyle, ICreatePrcItemDto, IPaymentTermChangedEvent, IPrjStockContext, ProcurementCommonItemDataService, ProcurementCommonPriceConditionDataService } from '@libs/procurement/common';
import { ConItemComplete } from '../model/con-item-complete.class';
import { IYesNoDialogOptions, ServerSideFilterValueType, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementContractTotalDataService } from './procurement-contract-total-data.service';
import { IContractLookupEntity, ProcurementInternalModule, ProcurementShareContractLookupService } from '@libs/procurement/shared';
import { ProcurementContractItemReadonlyProcessor } from './processors/procurement-contract-item-readonly-processor.class';
import { map, uniq } from 'lodash';
import { IReadOnlyField } from '@libs/platform/data-access';
import { ProcurementContractPriceConditionDataService } from './procurement-contract-price-condition-data.service';
import { ProcurementContractItemDataProcessor } from './processors/procurement-contract-item-data-processor.service';
import { BasicsSharedProcurementConfigurationHeaderLookupService, BasicsSharedProcurementConfigurationLookupService } from '@libs/basics/shared';
import { ProcurementContractItemValidationService } from './procurement-contract-item-validation.service';

export const PROCUREMENT_CONTRACT_ITEM_DATA_TOKEN = new InjectionToken<ProcurementContractItemDataService>('procurementContractItemDataToken');

/**
 * Contract item data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractItemDataService extends ProcurementCommonItemDataService<IConItemEntity, ConItemComplete, IConHeaderEntity, ContractComplete> {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly uiCommonMessageBoxService = inject(UiCommonMessageBoxService);
	private readonly conTotalService = inject(ProcurementContractTotalDataService);
	private readonly contractLookupService = inject(ProcurementShareContractLookupService);
	private readonly prcConfigurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly prcConfigurationHeaderLookupService = inject(BasicsSharedProcurementConfigurationHeaderLookupService);
	/**
	 * Identify whether it is possible to copy call off items via toolbar button
	 */
	public canCopyCallOffItems?: boolean = false;

	/**
	 * The constructor
	 */
	public constructor(public readonly contractDataService: ProcurementContractHeaderDataService) {
		super(
			contractDataService,
			{
				readInfo: {
					endPoint: 'list',
					usePost: false,
				},
				createInfo: {
					endPoint: 'create',
					usePost: true,
				},
			},
			ProcurementContractItemValidationService,
		);

		this.contractDataService = contractDataService;
		this.subscribeTaxCodeChanged();
		this.subscribeParentUpdateEvent();
	}

	protected subscribeParentUpdateEvent(): void {
		this.contractDataService.onHeaderUpdated$.subscribe((contractComplete) => {
			if (contractComplete.ConHeader !== undefined && contractComplete.ConHeader.ConHeaderFk !== undefined) {
				this.updatePrcItemReadonlyByConHeader(contractComplete.ConHeader.ConHeaderFk);
			}
		});
		this.subscribeListChangedChanged();
	}

	protected subscribeTaxCodeChanged() {
		this.contractDataService.changeStructureSetTaxCodeToItemBoq$.subscribe((e) => {
			this.updateTaxCodeFromParent();
		});
	}

	private subscribeListChangedChanged() {
		this.listChanged$.subscribe(() => {
			const contract = this.getSelectedParent()!;
			const hasItems = this.getList().length > 0;

			if (contract.HasItems === hasItems) {
				return;
			}

			contract.HasItems = hasItems;
			this.contractDataService.readonlyProcessor.process(contract);
		});
	}

	protected override createReadonlyProcessor() {
		return new ProcurementContractItemReadonlyProcessor(this);
	}

	protected override createDataProcessor() {
		return new ProcurementContractItemDataProcessor(this);
	}

	/**
	 * Create update entity
	 * @param modified
	 */
	public override createUpdateEntity(modified: IConItemEntity | null): ConItemComplete {
		const complete = new ConItemComplete();
		if (modified !== null) {
			complete.PrcItem = modified;
		}

		if (this.hasSelection()) {
			complete.MainItemId = this.getSelectedEntity()!.Id;
		}
		return complete;
	}

	/**
	 * Check can copy call off items when contract selection changed
	 */
	public async checkCanCopyCallOffItems() {
		const contract = this.getSelectedParent()!;

		if (contract?.ConHeaderFk) {
			const contractStatus = await this.contractDataService.getContractStatus(contract.ConHeaderFk);
			this.canCopyCallOffItems = !contractStatus.IsReadOnly;
		} else {
			this.canCopyCallOffItems = false;
		}
	}

	/**
	 * Copy main items
	 */
	public async copyCallOffItems() {
		const list = this.getList();

		if (list && list.length) {
			const result = await this.uiCommonMessageBoxService.showYesNoDialog({
				headerText: 'procurement.common.copyMainContractItems',
				bodyText: 'procurement.contract.confirmCopyMainCallOffHeader',
			});

			if (result?.closingButtonId !== StandardDialogButtonId.Yes) {
				return;
			}
		}

		await this.doCopyCallOffItems();
	}

	/**
	 * Get main contract items
	 * @private
	 */
	private async doCopyCallOffItems() {
		const contract = this.contractDataService.getSelectedEntity()!;

		// Save data into backend first
		await this.contractDataService.update(contract);

		const entities = await this.http.get<IConItemEntity[]>('procurement/contract/change/copymainitems', {
			params: { itemId: contract.Id },
		});

		if (!entities || !entities.length) {
			await this.uiCommonMessageBoxService.showMsgBox(this.translateService.instant('procurement.contract.noneCopyMainCallOffHeader').text, 'Info', 'ico-info');
			return;
		}

		//TODO it is only a workaround here. Should enhance it after framework updated.
		await this.load({ id: 0, pKey1: contract.Id });

		//TODO it is only a workaround here. Should enhance it after framework updated.
		const ident = { id: 0, pKey1: contract.Id };
		const totals = await this.conTotalService.load(ident);
		this.conTotalService.setList(totals);
	}

	/**
	 * Check item if is readonly
	 * @param contract
	 * @param items
	 * @private
	 */
	private async checkContractItemReadonly(contract: IConHeaderEntity, items: IConItemEntity[]) {
		if (!contract.ConHeaderFk) {
			return;
		}

		const parentPreviousItems = await this.http.get<IConItemEntity[]>('procurement/common/prcitem/getprcitemsbyheader', {
			params: { conHeaderFk: contract.ConHeaderFk },
		});

		if (!parentPreviousItems?.length) {
			return;
		}

		items.forEach((item) => {
			item.hasPreviousParent = parentPreviousItems.some((e) => e.Id !== item.Id && e.Itemno === item.Itemno);
			// refresh readonly state affected by hasPreviousParent
			this.readonlyProcessor.process(item);
		});
	}

	/**
	 * Get parent exchange rate
	 * @protected
	 */
	public override getParentExchangeRate(): number {
		const contract = this.contractDataService.getSelectedEntity();
		if (contract) {
			return contract.ExchangeRate;
		}
		return 1;
	}

	protected override provideLoadPayload(): object {
		const contract = this.contractDataService.getSelectedEntity()!;
		return {
			MainItemId: contract.PrcHeaderFk,
			projectId: contract.ProjectFk!,
			moduleName: ProcurementInternalModule.Contract,
		};
	}

	protected override provideCreatePayload(): object {
		const contract = this.contractDataService.getSelectedEntity()!;
		const payload = super.provideCreatePayload() as ICreatePrcItemDto;

		payload.IsContract = true;
		payload.ContractHeaderFk = contract.ContractHeaderFk;
		payload.FrmHeaderFk = contract.Id;
		payload.FrmStyle = FrmStyle.Contract;
		payload.BasPaymentTermFiFk = contract.PaymentTermFiFk;
		payload.BasPaymentTermPaFk = contract.PaymentTermPaFk;

		return payload;
	}

	protected override onCreateSucceeded(created: object): IConItemEntity {
		// todo - contract specific logic
		return super.onCreateSucceeded(created);
	}

	public override getStockContext(): IPrjStockContext {
		const selected = this.getSelectedEntity();

		if (selected) {
			return {
				materialFk: selected.MdcMaterialFk ?? undefined,
				materialStockFk: selected.MaterialStockFk ?? undefined,
			};
		}

		return {};
	}

	public override getAgreementLookupFilter(): ServerSideFilterValueType {
		return {
			filterDate: this.getSelectedParent()?.DateOrdered,
		};
	}

	protected override onParentPaymentTermChanged(e: IPaymentTermChangedEvent) {
		const items = this.getList();
		if (items && items.length) {
			const itemPaFks = uniq(map(items, 'BasPaymentTermPaFk'));
			const itemFiFks = uniq(map(items, 'BasPaymentTermFiFk'));
			if (!(itemPaFks.length === 1 && itemPaFks.includes(e.paymentTermPaFk) && itemFiFks.length === 1 && itemFiFks.includes(e.paymentTermFiFk ?? undefined))) {
				const options: IYesNoDialogOptions = {
					headerText: '',
					bodyText: this.translateService.instant('procurement.common.updatePaymentTermFIandPAToItems').text,
					defaultButtonId: StandardDialogButtonId.Yes,
					showCancelButton: true,
					id: 'd78011f7bf894f0eb9777f4d2c6650eb',
					dontShowAgain: true,
				};
				this.uiCommonMessageBoxService.showYesNoDialog(options)?.then((result) => {
					if (result?.closingButtonId === StandardDialogButtonId.Yes) {
						items.forEach((item) => {
							item.BasPaymentTermPaFk = e.paymentTermPaFk;
							item.BasPaymentTermFiFk = e.paymentTermFiFk ?? undefined;
						});
						this.setModified(items);
					}
				});
			}
		}
	}

	public updateTaxCodeFromParent() {
		const parentSelected = this.contractDataService.getSelectedEntity();
		if (!parentSelected) {
			return;
		}
		const prcItems = this.getList();
		prcItems.forEach((item) => {
			item.MdcTaxCodeFk = parentSelected.TaxCodeFk;
			this.setModified(item);
		});
	}

	public async updatePrcItemsByConHeaderFk(contractHeaderFk: number) {
		const materialIds = await this.getMaterialIdsByConHeaderFk(contractHeaderFk);
		const basicsContract = (await firstValueFrom(this.contractLookupService.getItemByKey({ id: contractHeaderFk }))) as IContractLookupEntity;
		const prcHeaderId = basicsContract ? basicsContract.PrcHeaderId : -1;
		const prcItems = await this.getPrcItemsByPrcHeaderId(prcHeaderId);
		const toDeleteList = this.getList().filter((item: IConItemEntity) => {
			if (item.MdcMaterialFk) {
				return !materialIds.some((mid: number) => mid === item.MdcMaterialFk);
			} else if (!item.MdcMaterialFk && item.Description1) {
				const prcItemsWithoutMaterial = prcItems.filter((i: IConItemEntity) => !i.MdcMaterialFk);
				const relatedItem = prcItemsWithoutMaterial.find((i: IConItemEntity) => i.Description1 === item.Description1);
				return !relatedItem;
			}
			return true;
		});

		if (toDeleteList.length > 0) {
			this.delete(toDeleteList);
		}
	}

	public getMaterialIdsByConHeaderFk(contractHeaderFk: number) {
		return this.http.get<number[]>('procurement/contract/header/getmaterialids', { params: { conHeaderId: contractHeaderFk } });
	}

	public getPrcItemsByPrcHeaderId(prcHeaderId: number) {
		return this.http.get<IConItemEntity[]>('procurement/common/prcitem/listbyheaders', { params: { headerIds: [prcHeaderId] } });
	}

	private async updatePrcItemReadonlyByConHeader(conHeaderFk?: number | null) {
		const res = await this.http.get('procurement/common/prcitem/getprcitemsbyheader', { params: { conHeaderFk: conHeaderFk ?? '' } });
		const items = this.getList();
		const parentPreviousItems = res as IConItemEntity[];

		items.forEach((item) => {
			const existingItem = parentPreviousItems.some((prevItem) => prevItem.Id !== item.Id && prevItem.Itemno === item.Itemno);
			if (existingItem) {
				const readonlyFields: IReadOnlyField<IConItemEntity>[] = [
					{ field: 'MdcMaterialFk', readOnly: true },
					{ field: 'PrcStructureFk', readOnly: true },
					{ field: 'BasUomFk', readOnly: true },
					{ field: 'Description1', readOnly: true },
					{ field: 'Description2', readOnly: true },
				];
				this.setEntityReadOnlyFields(item, readonlyFields);
			}
		});
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: ContractComplete, modified: ConItemComplete[], deleted: IConItemEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.PrcItemToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.PrcItemToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: ContractComplete): IConItemEntity[] {
		if (parentUpdate && parentUpdate.PrcItemToSave) {
			return parentUpdate.PrcItemToSave.map((e) => e.PrcItem!);
		}
		return [];
	}

	protected getPriceConditionService(): ProcurementCommonPriceConditionDataService<IConItemEntity, ConItemComplete> {
		return ServiceLocator.injector.get(ProcurementContractPriceConditionDataService);
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IConItemEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}

	public isConsolidateChange(parentSelected?: IConHeaderEntity) {
		const parentEntity = parentSelected ? parentSelected : this.parentService.getSelectedEntity();
		let isConsolidateChange = false;

		if (parentEntity?.PrcHeaderEntity?.ConfigurationFk) {
			const config = this.prcConfigurationLookupService.cache.getItem({ id: parentEntity.PrcHeaderEntity.ConfigurationFk });
			if (config) {
				const configHeader = this.prcConfigurationHeaderLookupService.cache.getItem({ id: config.PrcConfigHeaderFk });
				if (configHeader) {
					isConsolidateChange = configHeader.IsConsolidateChange;
				}
			}
		}

		return isConsolidateChange;
	}
}
