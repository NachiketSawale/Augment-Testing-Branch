/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatNode, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { PrcCommonItemComplete } from '../model/procurement-common-item-complete.class';
import { PrcItemScopeComplete } from '../model/prc-item-scope-complete.class';
import { IPrcItemEntity, IPrcItemScopeEntity } from '../model/entities';
import { PrcItemScopeReadonlyProcessor } from './prc-item-scope-readonly-processor.class';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonItemDataService } from '../services';
import { BasItemType } from '@libs/basics/shared';
import { EntityProxy } from '@libs/procurement/shared';

export class PrcItemScopeDataService<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>
> extends DataServiceFlatNode<IPrcItemScopeEntity, PrcItemScopeComplete, PT, PU> {
	public readonly readonlyProcessor: PrcItemScopeReadonlyProcessor<PT, PU, HT, HU>;
	public readonly entityProxy: EntityProxy<IPrcItemScopeEntity>;

	public get prcItemService() {
		return this.config.parentService;
	}

	public get prcHeaderService() {
		return this.prcItemService.parentService;
	}

	public get prcHeaderContext() {
		return this.prcItemService.parentService.getHeaderContext();
	}

	public get selectedPrcItem() {
		return this.getSelectedParent();
	}

	public constructor(protected config: {
		parentService: ProcurementCommonItemDataService<PT, PU, HT, HU>
	}) {
		super({
			apiUrl: 'procurement/common/item/scope',
			readInfo: {
				endPoint: 'list',
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1!,
					};
				}
			},
			createInfo: {
				endPoint: 'create',
				prepareParam: ident => {
					return {
						Id: ident.id
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcItemScopeEntity, IPrcItemEntity, PrcCommonItemComplete>>{
				role: ServiceRole.Node,
				itemName: 'PrcItemScope',
				parent: config.parentService
			},
			// Todo - translation
		});

		this.entityProxy = new EntityProxy<IPrcItemScopeEntity>(this);
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor(this.readonlyProcessor);
		this.subscribePrcItemChanged();
	}

	protected subscribePrcItemChanged() {
		this.config.parentService.entityProxy.propertyChanged$.subscribe(e => {
			switch (<keyof PT>e.field) {
				// MatScope defaults to NULL and is read only. If the parent PRC_ITEM has a MDC_MATERIAL_FK not null
				// then the user can choose from a drop down the records in MDC_MATERIALSCOPE for this material record
				case 'MdcMaterialFk':
					this.updateReadonlyForList();
					break;
			}
		});
	}

	protected subscribeReadonlyStateChanged() {
		this.config.parentService.parentService.readonlyChanged$.subscribe(e => {
			this.updateReadonlyForList();
		});
	}

	private updateReadonlyForList() {
		this.getList().forEach(item => this.readonlyProcessor.process(item));
	}

	protected createReadonlyProcessor() {
		return new PrcItemScopeReadonlyProcessor(this);
	}

	protected override onCreateSucceeded(created: object): IPrcItemScopeEntity {
		const entity = this.setDefaultSelectedScope(created as IPrcItemScopeEntity);
		this.updateScopeToPrcItem();
		return entity;
	}

	public override delete(entities: IPrcItemScopeEntity[] | IPrcItemScopeEntity) {
		super.delete(entities);
		this.updateScopeToPrcItem();
	}

	protected setDefaultSelectedScope(entity: IPrcItemScopeEntity) {
		if (!this.getList().some(e => e.IsSelected)) {
			entity.IsSelected = true;
		}
		return entity;
	}

	public isReadonly() {
		return this.prcHeaderContext.readonly || this.selectedPrcItem?.BasItemTypeFk === BasItemType.TextElement;
	}

	protected override checkCreateIsAllowed(entities: IPrcItemScopeEntity[] | IPrcItemScopeEntity | null): boolean {
		return super.checkCreateIsAllowed(entities) && !this.isReadonly();
	}

	protected override checkDeleteIsAllowed(entities: IPrcItemScopeEntity[] | IPrcItemScopeEntity | null): boolean {
		return super.checkDeleteIsAllowed(entities) && !this.isReadonly();
	}

	public updateScopeToPrcItem() {
		if (!this.selectedPrcItem) {
			return;
		}

		const prcItem = this.config.parentService.entityProxy.apply(this.selectedPrcItem);
		// Only one scope could be selected
		const selectedScope = this.getList().find(e => e.IsSelected);
		prcItem.HasScope = !!selectedScope;
		prcItem.PrcItemScopeFk = selectedScope?.Id;
	}

	public resetScopeEntity(entity: IPrcItemScopeEntity, origin: IPrcItemScopeEntity) {
		entity = this.entityProxy.apply(entity);
		if (!entity.DescriptionInfo) {
			entity.DescriptionInfo = {
				Description: '',
				DescriptionTr: 0,
				DescriptionModified: false,
				Modified: false,
				OtherLanguages: null,
				VersionTr: 0,
				Translated: ''
			};
		}

		entity.DescriptionInfo.Translated = origin.DescriptionInfo?.Translated ?? '';
		entity.DescriptionInfo.Modified = true;
		entity.BusinessPartnerFk = origin.BusinessPartnerFk;
		entity.SubsidiaryFk = origin.SubsidiaryFk;
		entity.SupplierFk = origin.SupplierFk;
		entity.BusinessPartnerProdFk = origin.BusinessPartnerProdFk;
		entity.SubsidiaryProdFk = origin.SubsidiaryProdFk;
		entity.SupplierProdFk = origin.SupplierProdFk;
		entity.CommentText = origin.CommentText;
		entity.Remark = origin.Remark;
		entity.UserDefined1 = origin.UserDefined1;
		entity.UserDefined2 = origin.UserDefined2;
		entity.UserDefined3 = origin.UserDefined3;
		entity.UserDefined4 = origin.UserDefined4;
		entity.UserDefined5 = origin.UserDefined5;
	}

	public override createUpdateEntity(modified: IPrcItemScopeEntity | null): PrcItemScopeComplete {
		return new PrcItemScopeComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PU, modified: PrcItemScopeComplete[], deleted: IPrcItemScopeEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.PrcItemScopeToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.PrcItemScopeToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PU): IPrcItemScopeEntity[] {
		if (parentUpdate && parentUpdate.PrcItemScopeToSave) {
			return parentUpdate.PrcItemScopeToSave.map(e => e.PrcItemScope!);
		}

		return [];
	}

	public override isParentFn(parentKey: PT, entity: IPrcItemScopeEntity): boolean {
		return entity.PrcItemFk === parentKey.Id;
	}
}