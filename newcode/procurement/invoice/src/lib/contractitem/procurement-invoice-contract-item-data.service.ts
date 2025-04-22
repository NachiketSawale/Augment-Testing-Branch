/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceOptions, IReadOnlyField, ServiceRole } from '@libs/platform/data-access';
import { IInv2ContractEntity, IInvHeaderEntity, IItemsResult, Inv2ContractComplete, InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { BasicsSharedCalculateOverGrossService, BasicsSharedCompanyContextService, BasicsSharedDataValidationService, BasicsSharedPrcStockTransactionTypeLookupService, BasItemType, MainDataDto } from '@libs/basics/shared';
import { ProcurementInvoiceStatusPermissionService } from '../services/procurement-invoice-status-permission.service';
import { ProcurementInvoiceContractItemReadonlyProcessor } from './procurement-invoice-contract-item-readonly-processor.class';
import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { IPrcItemEntity, ProcurementCommonRoundingService, ProcurementRoundingMethod, ProcurementStockTransactionType } from '@libs/procurement/common';
import { firstValueFrom } from 'rxjs';
import { EntityProxy, IContractLookupEntity } from '@libs/procurement/shared';
import { difference } from 'lodash';
import { ControllingSharedControllingUnitLookupService } from '@libs/controlling/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceContractItemDataService extends DataServiceFlatNode<IInv2ContractEntity, Inv2ContractComplete, IInvHeaderEntity, InvComplete> {
	public readonly companyContextService = inject(BasicsSharedCompanyContextService);
	private http = inject(PlatformHttpService);
	private readonly configService = inject(PlatformConfigurationService);

	private readonly invStatusRightSvc = inject(ProcurementInvoiceStatusPermissionService);
	public readonly readonlyProcessor: ProcurementInvoiceContractItemReadonlyProcessor;
	private readonly transactionTypeService = inject(BasicsSharedPrcStockTransactionTypeLookupService);
	public readonly controllingUnitLookupService = inject(ControllingSharedControllingUnitLookupService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);

	public readonly entityProxy = new EntityProxy(this, []);
	public readonly prcRoundingService = inject(ProcurementCommonRoundingService);
	public readonly roundingType = this.prcRoundingService.getRoundingType<IInv2ContractEntity>();
	public readonly isOverGross = inject(BasicsSharedCalculateOverGrossService).isOverGross;

	protected constructor(protected parentService: ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInv2ContractEntity> = {
			apiUrl: 'procurement/invoice/contract',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IInv2ContractEntity, IInvHeaderEntity, InvComplete>>{
				role: ServiceRole.Node,
				itemName: 'InvContract',
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
		this.subscribeInvoiceHeader();
	}

	private subscribeInvoiceHeader() {
		this.parentService.entityProxy.propertyChanged$.subscribe(async (e) => {
			switch (e.field) {
				case 'BpdVatGroupFk':
					this.vatGroupChanged();
					break;
			}
		});

		this.parentService.onUpdateSucceeded$.subscribe(async (e) => {
			this.refreshAccountInfo();
		});
	}

	public async refreshAccountInfo(items?: IInv2ContractEntity[]) {
		const contractItems: IInv2ContractEntity[] = items || this.getList();

		if (contractItems.length > 0) {
			const updatedItems = await this.http.post<IInv2ContractEntity[]>('procurement/invoice/contract/refreshaccount', { contractItems });

			updatedItems.forEach((updatedItem) => {
				const index = contractItems.findIndex((c) => c.Id === updatedItem.Id);
				if (index !== -1) {
					contractItems[index].Account = updatedItem.Account;
					contractItems[index].AccountDesc = updatedItem.AccountDesc;
				}
			});
		}
	}

	protected createReadonlyProcessor() {
		return new ProcurementInvoiceContractItemReadonlyProcessor(this);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();

		if (!parentSelection) {
			throw new Error('Should have selected parent entity');
		}

		return { mainItemId: parentSelection.Id, conHeaderId: parentSelection.ConHeaderFk };
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

	protected override onLoadSucceeded(loaded: object): IInv2ContractEntity[] {
		const dto = new MainDataDto<IInv2ContractEntity>(loaded);
		const conHeaders = dto.getValueAs<IContractLookupEntity[]>('ConHeaderView')!;

		const items = dto.Main;
		items.forEach((item) => {
			if (item.PrcItemFk && item.BasItemTypeFk && item.BasItemTypeFk === BasItemType.TextElement) {
				this.canReadonlyByPrcItemBasItemType(item, true);
			}
			this.initData(conHeaders, items);
		});
		//todo: wait lvy ticket: https://rib-40.atlassian.net/browse/DEV-21784
		//this.setAdditionalGross(items);
		return items;
	}

	protected override onCreateSucceeded(created: object): IInv2ContractEntity {
		const newData = created as unknown as IInv2ContractEntity;
		newData.Percentage = 0;
		if (newData.OrderQuantity) {
			//todo: wait lvy ticket: https://rib-40.atlassian.net/browse/DEV-21784
			//newData.Percentage = itemCalculationHelper.getPercentageForInv(newData.Quantity, newData.OrderQuantity);
		}
		// #147304 - 0 is invalid value
		if (newData.ConHeaderFk === 0) {
			newData.ConHeaderFk = -1;
		}
		return newData;
	}

	public override createUpdateEntity(modified: IInv2ContractEntity | null): Inv2ContractComplete {
		return {
			MainItemId: modified?.Id,
			InvContract: modified ?? null,
		} as Inv2ContractComplete;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: InvComplete, modified: Inv2ContractComplete[], deleted: IInv2ContractEntity[]): void {
		if (modified?.some(() => true)) {
			parentUpdate.InvContractToSave = modified;
		}

		if (deleted?.some(() => true)) {
			parentUpdate.InvContractToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: InvComplete): IInv2ContractEntity[] {
		if (complete?.InvContractToSave) {
			return complete.InvContractToSave.filter((i) => i.InvContract != null && i.InvContract !== undefined).map((e) => e.InvContract!);
		}

		return [];
	}

	public override isParentFn(parent: IInvHeaderEntity, entity: IInv2ContractEntity): boolean {
		return entity.InvHeaderFk === parent.Id;
	}

	public override canCreate(): boolean {
		const invHeader = this.parentService.getSelectedEntity();
		if (!invHeader) {
			return false;
		}
		return !this.parentService.isEntityReadonly() && this.invStatusRightSvc.hasCreateContractRight(invHeader.InvStatusFk);
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
		const isNotReadOnly = !this.parentService.isEntityReadonly();
		const hasDeleteRight = this.invStatusRightSvc.hasDeleteContractRight(invHeader.InvStatusFk);
		return isNotReadOnly && hasDeleteRight;
	}

	public override delete(entities: IInv2ContractEntity[] | IInv2ContractEntity) {
		super.delete(entities);
		this.recalcuteContract();
	}

	protected getMainItemId(parent: IInvHeaderEntity): number {
		return parent.Id;
	}

	public canCreateContractItem() {
		return this.canCreate();
	}

	public canReadonlyByPrcItemBasItemType(entity: IInv2ContractEntity, isReadonly: boolean) {
		const columns = Object.keys(entity);
		entity.AlternativeUomFk = 0;
		entity.AlternativeQuantity = 0;
		entity.Quantity = 0;
		entity.Price = 0;
		entity.PriceOc = 0;
		entity.PriceGross = 0;
		entity.TotalPrice = 0;
		entity.TotalPriceOc = 0;
		entity.PriceExtra = 0;
		entity.DiscountSplit = 0;
		entity.DiscountSplitOc = 0;
		entity.ProvisionPercent = 0;
		entity.TotalValue = 0;
		entity.ProvisionTotal = 0;
		entity.TotalValueOc = 0;
		entity.TotalValueGross = 0;
		entity.TotalValueGrossOc = 0;
		entity.OrderQuantity = 0;
		entity.OrderQuantityConverted = 0;
		entity.PrcItemQuantity = 0;
		entity.PrcItemTotalGross = 0;
		entity.PrcItemTotalGrossOc = 0;
		entity.PriceOcGross = 0;
		const readonlyFields = ['Itemno', 'Description1', 'Description2', 'PrcItemSpecification', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'];
		columns.forEach((item) => {
			if (readonlyFields.some((f) => f === item)) {
				this.setEntityReadOnlyFields(entity, this.fieldsToReadonly([item], isReadonly));
			}
			this.setEntityReadOnlyFields(entity, this.fieldsToReadonly([item], true));
		});
	}

	public async createOtherContracts(currentItem: IInv2ContractEntity) {
		const invHeader = this.parentService.getSelectedEntity();
		if (!invHeader) {
			return;
		}
		const conHeaderId = currentItem?.ConHeaderFk ? currentItem.ConHeaderFk : invHeader.ConHeaderFk;
		if (!conHeaderId) {
			return;
		}

		const items = this.getList().filter((i) => i.ConHeaderFk === conHeaderId);
		const referencedPrcItemIds = items.flatMap((item) => (item.PrcItemFk ? [item.PrcItemFk] : []));

		const params = {
			IsCanceled: false,
			IsDelivered: false,
			ContractId: conHeaderId,
			InvHeaderId: invHeader.Id,
		};
		const contractPrcItems = await this.http.post<IPrcItemEntity[]>('procurement/common/prcitem/getitems4create', params);
		if (!contractPrcItems?.length) {
			return;
		}

		const contractPrcItemIds = contractPrcItems.map((e) => e.Id);
		const remainingPrcItemIds = difference(contractPrcItemIds, referencedPrcItemIds);
		if (remainingPrcItemIds.length > 0 && invHeader.Id > 0) {
			const creationData = {
				mainItemId: invHeader.Id,
				conHeaderId: conHeaderId,
				prcItemIds: remainingPrcItemIds,
				exchangeRate: invHeader.ExchangeRate,
				headerConfigurationFk: invHeader.PrcConfigurationFk,
			};
			const inv2ContractCompletes = await this.http.post<Inv2ContractComplete[]>('procurement/invoice/contract/createcontracts', creationData);
			if (inv2ContractCompletes) {
				inv2ContractCompletes.forEach((item) => {
					const invContract = item.InvContract;
					if (!invContract) {
						return;
					}

					const toFillItems = items.filter((i) => i.PrcItemFk === null && i.PrcBoqFk === null);
					if (toFillItems.length > 0) {
						this.setGross([invContract]);
						this.overrideDataItem(invContract, toFillItems[0]);
						this.initPrjstockReadOnly(toFillItems[0]);
						//todo: pel, wait procurementInvGrpSetDTLByContractDataService ready
						//GrpSetDTLDataService.roadData(item, entity.controllingStructureGrpSetDTLToSave);
						this.validateControllingUnitFk(toFillItems[0], toFillItems[0].ControllingUnitFk);
					} else {
						//todo: pel, wait procurementInvGrpSetDTLByContractDataService ready
						//GrpSetDTLDataService.roadData(item, entity.controllingStructureGrpSetDTLToSave);
						this.validateControllingUnitFk(invContract, invContract.ControllingUnitFk);
					}
				});
			}
		}
	}

	protected setProvisionReadOnly(entity: IInv2ContractEntity): void {
		if (!entity.PrjStockFk) {
			return;
		}

		this.getProvisionallowed(entity.PrjStockFk).then((readonlyRes) => {
			//set readonly according the result
			const readOnlyItems = this.fieldsToReadonly(['ProvisionPercent'], readonlyRes);
			this.setEntityReadOnlyFields(entity, readOnlyItems);
			if (readonlyRes) {
				entity.ProvisionPercent = 0;
				entity.ProvisionTotal = 0;
			}
		});
	}

	public async getProvisionallowed(projectStockId: number) {
		return this.http.get<boolean>('project/stock/material/getprovisionallowed', { params: { projectStockId: projectStockId } });
	}

	protected async validateControllingUnitFk(entity: IInv2ContractEntity, value?: number | null | undefined) {
		if (!value) {
			this.checkIsAssetManagementReadonly(entity, false);
			return;
		}

		const projectfk = this.parentService.getSelectedEntity()?.ProjectFk;
		const params = {
			ControllingUnitFk: value,
			ProjectFk: projectfk ?? -1,
		};
		const isError = await this.http.get<boolean>('controlling/structure/validationControllingUnit', { params });
		if (isError) {
			const validateResult = this.validationService.createErrorObject({ key: 'basics.common.error.controllingUnitError' });
			this.addInvalid(entity, { field: 'ControllingUnitFk', result: validateResult });
		}
	}

	public checkIsAssetManagementReadonly(entity: IInv2ContractEntity, isReadOnly: boolean) {
		const fields = ['IsAssetManagement'];
		if (entity.PrcBoqFk) {
			this.readonlyProcessor.process(entity);
			return;
		}

		this.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, isReadOnly));
	}

	public recalcuteContract() {
		const items = this.getList();
		let netOc = 0;
		let net = 0;
		let grossOc = 0;
		let gross = 0;
		items.forEach((item) => {
			const roundMethod = this.getContractRoundingMethod(item);
			netOc += this.prcRoundingService.round(this.roundingType.TotalValueOc, item.TotalValueOc, roundMethod);
			net += this.prcRoundingService.round(this.roundingType.TotalValueOc, item.TotalValueOc, roundMethod);
			grossOc += this.prcRoundingService.round(this.roundingType.TotalValueOc, item.TotalValueOc, roundMethod);
			gross += this.prcRoundingService.round(this.roundingType.TotalValueOc, item.TotalValueOc, roundMethod);
		});

		this.parentService.recalcuteContract(netOc, net, grossOc, gross);
	}

	public async readBasItemTypeFk(entity: IInv2ContractEntity) {
		const result = await this.http.get<IPrcItemEntity>('procurement/common/prcitem/getbyid', {
			params: {
				id: entity.PrcItemFk ?? -1,
			},
		});
		return result;
	}

	protected initData(conHeaders: IContractLookupEntity[], contracItems: IInv2ContractEntity[]) {
		if (conHeaders.length <= 0) {
			return;
		}
		contracItems.forEach((item) => {
			if (item.ConHeaderFk) {
				const conHeader = conHeaders.find((c) => c.Id === item.ConHeaderFk);
				if (conHeader) {
					item.PrcHeaderId = conHeader.PrcHeaderId;
				}
			}
			item.Percentage = 0;
			if (item.OrderQuantity) {
				//todo: wait ticket: https://rib-40.atlassian.net/browse/DEV-21784
				//item.Percentage = itemCalculationHelper.getPercentageForInv(item.Quantity, item.OrderQuantity);
			}
			this.initPrjstockReadOnly(item);
		});
	}

	protected initPrjstockReadOnly(entity: IInv2ContractEntity): void {
		if (!entity.PrjStockFk) {
			this.getIsStockContractItem().then((res) => {
				if (res) {
					entity.PrjStockFk = res.PrjStockFk;
					entity.PrjStockLocationFk = res.PrjStockLocationFk;
					entity.PrcStockTransactionTypeFk = res.PrcStockTransactionTypeFk;
					const isReadonly = !res.PrjStockFk;
					this.setPrjStockReadOnly(entity, isReadonly);
					if (!isReadonly) {
						this.setProvisionReadOnly(entity);
						this.setPrcStockTransactionType(entity);
					}
				}
			});
		} else {
			const invStatus = this.parentService.getStatus();
			const isReadonlyStatus = invStatus ? invStatus.IsReadOnly : false;
			this.setPrjStockReadOnly(entity, isReadonlyStatus);
			if (!isReadonlyStatus) {
				this.setProvisionReadOnly(entity);
				this.setPrcStockTransactionType(entity);
			}
		}
	}

	public setPrjStockReadOnly(entity: IInv2ContractEntity, isReadonly: boolean): void {
		this.readonlyProcessor.process(entity);
		const fields = ['PrjStockFk', 'PrcStockTransactionTypeFk', 'PrcStockTransactionFk', 'PrjStockLocationFk', 'ProvisionPercent', 'ProvisonTotal', 'LotNo', 'ExpirationDate'];
		const readonlyFields = this.fieldsToReadonly(fields, isReadonly);
		this.setEntityReadOnlyFields(entity, readonlyFields);
	}

	protected async overrideDataItem(target: IInv2ContractEntity, source: IInv2ContractEntity) {
		const keep: Partial<IInv2ContractEntity> = {
			Id: source.Id,
			InvHeaderFk: source.InvHeaderFk,
			InsertedAt: source.InsertedAt,
			InsertedBy: source.InsertedBy,
			UpdatedAt: source.UpdatedAt,
			UpdatedBy: source.UpdatedBy,
			Version: source.Version,
		};
		Object.assign(target, source);
		Object.assign(target, keep);
		if (!target.ControllingUnitFk) {
			return;
		}
		const controllingUnit = await firstValueFrom(this.controllingUnitLookupService.getItemByKey({ id: target.ControllingUnitFk }));
		if (controllingUnit) {
			const readonlyFields = this.fieldsToReadonly(['IsAssetManagement'], !controllingUnit.Isassetmanagement);
			this.setEntityReadOnlyFields(source, readonlyFields);
		}
	}

	//todo: wait lyv fixed the ticket: https://rib-40.atlassian.net/browse/DEV-21784
	// protected exchangeUpdate(exchangeRate: number){
	// 	const contractItems = this.getList();
	// 	contractItems.forEach((item) => {
	// 		const roundMethod = this.getContractRoundingMethod(item);
	// 		item.TotalValue = itemCalculationHelper.getAmountNonOcByOc(item.TotalValueOc, exchangeRate, constant);
	// 		item.TotalPrice = itemCalculationHelper.getAmountNonOcByOc(item.TotalPriceOc, exchangeRate, constant, roundingType.Inv2Con_TotalPrice);// specific
	// 		item.Price = itemCalculationHelper.getUnitRateNonOcByOc(item.PriceOc, exchangeRate, constant);
	//
	// 		var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
	// 		item.PriceGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(item.Price, vatPercent, constant);
	// 		item.PrcItemTotalGross = exchangeRate === 0 ? 0 : itemCalculationHelper.getTotalGrossForInv(item.Price, item.OrderQuantity, 0, 0, vatPercent, 1, 1, item.PrcItemTotalGrossOc, exchangeRate, constant);
	// 		item.TotalValueGross = round(roundingType.TotalValueGross, math.bignumber(item.Quantity).mul(item.PriceGross).toNumber(), constant);
	// 	});
	//    this.recalcuteContract();
	// }

	// function setAdditionalGross(items) {
	// 	if (!items) {
	// 		return;
	// 	}
	// 	if (!_.isArray(items)) {
	// 		items = [items];
	// 	}
	//
	// 	var exchangeRate = 1;
	// 	var parentSelected = parentService.getSelected();
	// 	var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
	// 	if (parentSelected && parentSelected.ExchangeRate) {
	// 		exchangeRate = parentSelected.ExchangeRate;
	// 	}
	// 	_.forEach(items, function (item) {
	// 		var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
	// 		let constant = getContractRoundingMethod(item);
	// 		item.PriceGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(item.Price, vatPercent, constant);
	// 		item.PriceOcGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(item.PriceOc, vatPercent, constant);
	// 		if (item.PrcItemFk) {
	// 			var prcItem = service.getLookupValue(item, 'PrcItemFk:PrcItemMergedLookup');
	// 			if (prcItem) {
	// 				if (isOverGross) {
	// 					item.PriceGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGross, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
	// 					item.PriceOcGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGrossOc, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
	// 				}
	// 			}
	// 			item.PrcItemTotalGross = item.PrcItemTotalGross ? item.PrcItemTotalGross : 0;
	// 			item.PrcItemTotalGrossOc = item.PrcItemTotalGrossOc ? item.PrcItemTotalGrossOc : 0;
	// 		} else {
	// 			item.PrcItemTotalGrossOc = itemCalculationHelper.getTotalGrossOcForInv(item.PriceOc, item.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, constant);
	// 			item.PrcItemTotalGross = itemCalculationHelper.getTotalGrossForInv(item.Price, item.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, item.PrcItemTotalGrossOc, exchangeRate, constant);
	// 		}
	// 	});
	// }

	protected vatGroupChanged() {
		const items = this.getList();
		if (items.length > 0) {
			this.setGross(items);
		}
		this.recalcuteContract();
	}

	private setGross(entities: IInv2ContractEntity[]) {
		if (entities.length <= 0) {
			return;
		}
		//todo: below code need to wait lyv fixed the ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// let exchangeRate = 1;
		// const invHeader = this.parentService.getSelectedEntity();
		// if (invHeader && invHeader.ExchangeRate) {
		// 	exchangeRate = invHeader.ExchangeRate;
		// }
		//entities.forEach((item) => {
		// var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
		// let constant = getContractRoundingMethod(item);
		// item.PriceGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(item.Price, vatPercent, constant);
		// item.PriceOcGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(item.PriceOc, vatPercent, constant);
		// if (item.PrcItemFk) {
		// 	var prcItem = service.getLookupValue(item, 'PrcItemFk:PrcItemMergedLookup');
		// 	if (prcItem) {
		// 		if (isOverGross) {
		// 			item.PriceGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGross, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
		// 			item.PriceOcGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGrossOc, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
		// 		}
		// 	}
		// 	item.PrcItemTotalGross = item.PrcItemTotalGross ? item.PrcItemTotalGross : 0;
		// 	item.PrcItemTotalGrossOc = item.PrcItemTotalGrossOc ? item.PrcItemTotalGrossOc : 0;
		// 	item.TotalValueGross = itemCalculationHelper.getAmountAfterTaxByPreTax(item.TotalValue, vatPercent, constant);
		// 	item.TotalValueGrossOc = itemCalculationHelper.getAmountAfterTaxByPreTax(item.TotalValueOc, vatPercent, constant);
		// } else {
		// 	item.PrcItemTotalGrossOc = itemCalculationHelper.getTotalGrossOcForInv(item.PriceOc, item.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, constant);
		// 	item.PrcItemTotalGross = itemCalculationHelper.getTotalGrossForInv(item.Price, item.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, item.PrcItemTotalGrossOc, exchangeRate, constant);
		// 	item.TotalValueGross = itemCalculationHelper.getAmountAfterTaxByPreTax(item.TotalValue, vatPercent, constant);
		// 	item.TotalValueGrossOc = itemCalculationHelper.getAmountAfterTaxByPreTax(item.TotalValueOc, vatPercent, constant);
		// }

		//});
	}

	private setPrcStockTransactionType(entity: IInv2ContractEntity) {
		const type = entity.PrcStockTransactionTypeFk;
		if (!type) {
			return;
		}
		const fields = ['PrcStockTransactionFk'];
		const params = {
			prcItemId: entity.PrcItemFk ?? -1,
			projectStockId: entity.PrjStockFk ?? -1,
			quantity: entity.Quantity,
		};
		switch (type) {
			case ProcurementStockTransactionType.MaterialReceipt:
				this.http.get<IItemsResult>(this.configService.webApiBaseUrl + 'procurement/pes/item/getmaterial2projectstock', { params: params }).then((res) => {
					if (res) {
						this.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, !res.IsInStock2Material));
					}
				});
				break;
			case ProcurementStockTransactionType.IncidentalAcquisitionExpense:
				this.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, false));
				break;
			default: {
				//already load the transaction type when init the module
				const tranType = this.transactionTypeService.cache.getItem({ id: type });
				const isDelta = tranType ? !tranType.IsDelta : true;
				this.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, isDelta));
				break;
			}
		}
	}

	public async getIsStockContractItem() {
		const parentSeleted = this.parentService.getSelectedEntity();
		if (!parentSeleted) {
			return null;
		}
		const requestData = {
			PrcStructureFk: parentSeleted.PrcStructureFk,
			ControllingUnitFk: parentSeleted.ControllingUnitFk,
			PrcItemFk: parentSeleted.PrcItemFk,
			ConHeaderFk: parentSeleted.ConHeaderFk,
			InvHeaderPrcConfigurationFk: parentSeleted ? parentSeleted.PrcConfigurationFk : null,
		};
		return await this.http.post<IInv2ContractEntity>('procurement/invoice/contract/getisstock', requestData);
	}

	public getContractRoundingMethod(entity: IInv2ContractEntity) {
		if (entity?.PrcBoqFk) {
			return ProcurementRoundingMethod.ForBoq;
		}
		if (entity?.PrcItemFk) {
			return ProcurementRoundingMethod.ForPrcItem;
		}
		return ProcurementRoundingMethod.ForNull;
	}

	public fieldsToReadonly(fields: string[], isRead: boolean): IReadOnlyField<IInv2ContractEntity>[] {
		return fields.map((f) => ({ field: f, readOnly: isRead }));
	}

	public isStatusReadonly(): boolean {
		return this.parentService.isEntityReadonly();
	}
}
