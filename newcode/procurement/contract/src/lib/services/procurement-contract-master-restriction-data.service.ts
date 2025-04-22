/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IConMasterRestrictionEntity } from '../model/entities/con-master-restriction-entity.interface';
import { IFrameworkCatalogChangeEvent, MasterRestrictionType, ProcurementCopyMode } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, IReadOnlyField, ServiceRole } from '@libs/platform/data-access';
import { MainDataDto } from '@libs/basics/shared';
import { ContractComplete } from '../model/contract-complete.class';

/**
 * Contract Master Restriction data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractMasterRestrictionDataService extends DataServiceFlatLeaf<IConMasterRestrictionEntity, IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor(public readonly parentService: ProcurementContractHeaderDataService) {
		const options: IDataServiceOptions<IConMasterRestrictionEntity> = {
			apiUrl: 'procurement/contract/masterrestriction',
			readInfo: {endPoint: 'list'},
			createInfo: {
				endPoint: 'createnew',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IConMasterRestrictionEntity, IConHeaderEntity, ContractComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ConMasterRestriction',
				parent: parentService
			}
		};
		super(options);
		this.parentService.frameworkMdcCatalogChanged$.subscribe(item => {
			this.parentMdcCatalogChanged(item);
		});

		this.processor.addProcessor({
			process: (item) => {
				const contract = parentService.getSelectedEntity();
				this.setEntityReadOnly(item, !!contract && parentService.isCallOff(contract));
				this.setReadonlyByCopyType(item);
			},
			revertProcess: (item: IConMasterRestrictionEntity) => {
			}
		});
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			mainItemId: parent?.Id,
		};
	}

	protected override provideCreatePayload(): object {
		const parentSelected = this.parentService.getSelectedEntity();
		return {
			MainItemId: parentSelected?.Id
		};
	}

	protected override onLoadSucceeded(loaded: object): IConMasterRestrictionEntity[] {
		const dataDto = new MainDataDto<IConMasterRestrictionEntity>(loaded);
		this.cacheLookupData(loaded);
		if (this.parentService.isValidForSubModule()) {
			const readOnlyItems = this.readonlyFields();
			dataDto.Main.forEach(item => {
				this.setEntityReadOnlyFields(item, readOnlyItems);
			});
		}
		this.updateBoqFilter(null);
		return dataDto.Main;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IConMasterRestrictionEntity): boolean {
		return entity.ConHeaderFk === parentKey.Id;
	}

	public override registerModificationsToParentUpdate(parentUpdate: ContractComplete, modified: IConMasterRestrictionEntity[], deleted: IConMasterRestrictionEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.ConMasterRestrictionToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.ConMasterRestrictionToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: ContractComplete): IConMasterRestrictionEntity[] {
		if (complete && complete.ConMasterRestrictionToSave) {
			return complete.ConMasterRestrictionToSave;
		}
		return [];
	}

	public isParentReadOnly() {
		const prcHeaderContext = this.parentService.getHeaderContext();
		return prcHeaderContext.readonly;
	}

	public override canCreate(): boolean {
		if (this.parentService.isValidForSubModule()) {
			return false;
		}
		return super.canCreate() && !this.isParentReadOnly();
	}

	public override canDelete(): boolean {
		if (this.parentService.isValidForSubModule()) {
			return false;
		}
		return super.canDelete() && !this.isParentReadOnly();
	}

	private readonlyFields(): IReadOnlyField<IConMasterRestrictionEntity>[] {
		const fields = ['MdcMaterialCatalogFk', 'BoqWicCatFk', 'BoqItemFk', 'PrjBoqFk', 'PackageBoqHeaderFk', 'ConHeaderBoqFk', 'ConBoqHeaderFk', 'ProjectFk'];
		return this.fieldsToReadonly(fields, true);
	}

	private fieldsToReadonly(fields: string[], isRead: boolean): IReadOnlyField<IConMasterRestrictionEntity>[] {
		return fields.map(f => ({field: f, readOnly: isRead}));
	}

	private parentMdcCatalogChanged(catalogParam: IFrameworkCatalogChangeEvent) {
		const catalogItems = this.getList();
		if (catalogParam.newValue) {
			if (catalogItems && catalogItems.length > 0) {
				const oldCatalogItems = catalogItems.filter(c =>
					c.ConHeaderFk === catalogParam.headerId && c.MdcMaterialCatalogFk === catalogParam.oldValue && c.Version === 0);
				if (oldCatalogItems && oldCatalogItems.length > 0) {
					this.delete(oldCatalogItems);
				}
			}
			const catalogItem = catalogItems.find(c =>
				c.ConHeaderFk === catalogParam.headerId && c.MdcMaterialCatalogFk === catalogParam.newValue);
			if (!catalogItem) {
				this.create().then(created => {
					created.MdcMaterialCatalogFk = catalogParam.newValue;
					created.CopyType = MasterRestrictionType.material;
					this.setModified(created);
				});
			}
		} else if (catalogItems && catalogItems.length > 0) {
			const oldCatalogItems = catalogItems.filter(c => c.MdcMaterialCatalogFk === catalogParam.oldValue && c.Version === 0);
			if (oldCatalogItems && oldCatalogItems.length > 0) {
				this.delete(oldCatalogItems);
			}
		}
	}

	private cacheLookupData(loaded: object): void {
		//const conBoqHeaders = get(loaded, 'conBoqHeaders', []);
		//TODO PrcCommonMasterRestrictionContractBoqHeaderLookupService.setContractBoqHeaderCache(conBoqHeaders);

		//const boqHeadsBasePackage = get(loaded, 'boqHeadsBasePackage', []);
		//boqHeadsBasePackage.forEach(b=>b.BoqNumber = b.Reference);
		//TODO PrcCommonMasterRestrictionBoqHeaderLookupDataService.setBoqHeaderBasePackageCache(boqHeadsBasePackage);
	}

	public setReadonlyByCopyType(entity: IConMasterRestrictionEntity) {
		const readOnlyItems = this.readonlyFields();
		this.setEntityReadOnlyFields(entity, readOnlyItems);
		let editFileds: string[] = [];
		switch (entity.CopyType) {
			case MasterRestrictionType.wicBoq:
				editFileds = ['BoqWicCatFk', 'BoqItemFk'];
				break;
			case MasterRestrictionType.prjBoq:
				editFileds = ['ProjectFk', 'PrjBoqFk'];
				break;
			case MasterRestrictionType.packageBoq:
				editFileds = ['PackageFk', 'PackageBoqHeaderFk'];
				break;
			case MasterRestrictionType.material:
				editFileds = ['MdcMaterialCatalogFk'];
				break;
			case MasterRestrictionType.contractBoq:
				editFileds = ['ConHeaderBoqFk', 'ConBoqHeaderFk'];
				break;
		}
		if (editFileds.length > 0) {
			const readOnlyItems = this.fieldsToReadonly(editFileds, false);
			this.setEntityReadOnlyFields(entity, readOnlyItems);
		}
	}

	public updateBoqFilter(boqType: number | null) {
		//const filterParam = {
		//	wicGroupIds: []
		//};
		const contract = this.parentService.getSelectedEntity();
		if (contract && contract.PrcCopyModeFk === ProcurementCopyMode.CurrentPackageOnly) {
			return;
		}
		const isPortalMode = false;// TODO globals.portal
		if (contract && (contract.PrcCopyModeFk === ProcurementCopyMode.OnlyAllowedCatalogs || (contract.PrcCopyModeFk === ProcurementCopyMode.NoRestrictions4StandardUser && isPortalMode))) {
			// filterParam.wicGroupIds = this.pushParentBoqWicGroup(contract, filterParam.wicGroupIds);
			// TODO asyncAddHeadermBoqWicBoq2BoqHeaderIds(parentItem, mainItemId2BoqHeaderIds)
		}
		// TODO wait other boq lookupDataService: procurementContractMasterRestrictionDataService.updateBoqFilter
	}

	private pushParentBoqWicGroup(parentItem: IConHeaderEntity, wicGroupFks?: number[]) {
		const wicGroupIds = wicGroupFks || [];
		if (!!parentItem && parentItem.BoqWicCatFk && (parentItem.IsFramework || (!parentItem.IsFreeItemsAllowed && !parentItem.IsFramework))) {
			wicGroupIds.push(parentItem.BoqWicCatFk);
		}
		return wicGroupIds;
	}
}
