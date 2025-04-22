/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IBusinessPartnerEntity, ISupplierCreateParameter, ISupplierEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import * as _ from 'lodash';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { SupplierEntityComplete } from '../model/entities/supplier-entity-complete.class';

import { BasicsSharedNumberGenerationService } from '@libs/basics/shared';
import { SupplierReadonlyProcessorService } from './processors/supplier-readonly-processor.service';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { SupplierInitService } from './init-service/businesspartner-data-provider.service';

@Injectable({
	providedIn: 'root',
})
export class SupplierDataService extends DataServiceFlatNode<ISupplierEntity, SupplierEntityComplete, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	public readonlyProcessor: SupplierReadonlyProcessorService;
	private readonly numberGenerationSettingsService = inject(BasicsSharedNumberGenerationService);
	private readonly translationService = ServiceLocator.injector.get(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly supplierInitService = inject(SupplierInitService);

	public constructor(protected businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		const options: IDataServiceOptions<ISupplierEntity> = {
			apiUrl: 'businesspartner/main/supplier',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createsupplier',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<ISupplierEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Node,
				itemName: 'Supplier',
				parent: businesspartnerMainHeaderDataService,
			},
		};
		super(options);

		this.readonlyProcessor = new SupplierReadonlyProcessorService(this);
		this.processor.addProcessor([this.readonlyProcessor]);
		this.processor.addProcessor({
			process: (item) => this.processItem(item),
			revertProcess: (item: ISupplierEntity) => {
				this.revertProcess(item);
			},
		});
	}

	// region button
	public override canCreate(): boolean {
		const canCreate = super.canCreate();
		return canCreate && !this.businesspartnerMainHeaderDataService.getItemStatus()?.IsReadonly;
	}

	public override canDelete(): boolean {
		const canDelete = super.canDelete();
		return canDelete && !this.businesspartnerMainHeaderDataService.getItemStatus()?.IsReadonly;
	}

	// endregion
	// region process
	private processItem(item: ISupplierEntity): void {
		this.readonlyProcessor.process(item);
	}

	private revertProcess(item: ISupplierEntity): void {
		if (item.RubricCategoryFk && item.Version === 0) {
			const result = this.numberGenerationSettingsService.hasNumberGenerateConfig(item.RubricCategoryFk);
			if (result) {
				item.Code = 'isgenerated';
			}
		}
	}

	// endregion
	// region basic override
	public override createUpdateEntity(modified: ISupplierEntity | null): SupplierEntityComplete {
		const complete = new SupplierEntityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Supplier = modified;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: SupplierEntityComplete): ISupplierEntity[] {
		return complete.Supplier ? [complete.Supplier] : [];
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: BusinessPartnerEntityComplete): ISupplierEntity[] {
		if (parentUpdate.SupplierCompleteToSave) {
			const suppliers = [] as ISupplierEntity[];
			parentUpdate.SupplierCompleteToSave.forEach((updated) => {
				if (updated.Supplier) {
					suppliers.push(updated.Supplier);
				}
			});
			return suppliers;
		}
		return [];
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: BusinessPartnerEntityComplete, modified: SupplierEntityComplete[], deleted: ISupplierEntity[]) {
		if (modified && modified.length > 0) {
			parentUpdate.SupplierCompleteToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			parentUpdate.SupplierToDelete = deleted;
		}
	}

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

	protected override onLoadSucceeded(loaded: object): ISupplierEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', []);
		}
		return [];
	}

	protected override provideCreatePayload(): ISupplierCreateParameter {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			const supplierCreateRequest: ISupplierCreateParameter = {
				mainItemId: parentSelection.Id,
				description: parentSelection.BusinessPartnerName1,
			};
			return supplierCreateRequest;
		}
		throw new Error('Please select a business partner first');
	}

	protected override onCreateSucceeded(created: ISupplierEntity): ISupplierEntity {
		if (created.RubricCategoryFk) {
			const result = this.numberGenerationSettingsService.hasNumberGenerateConfig(created.RubricCategoryFk);
			if (result) {
				created.Code = this.translationService.instant({ key: 'cloud.common.isGenerated' }).text;
			} else {
				created.Code = '';
			}
		}
		return created;
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: ISupplierEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}

	// endregion
	// region status and readonly judge
	public bpSupplierHasRight() {
		const parentSelected = this.getSelectedParent();
		if (parentSelected) {
			const isBpStatusHasRight = this.businesspartnerMainHeaderDataService.isBpStatusHasRight(parentSelected, 'statusWithEidtRight');
			const isBpStatusToCustomerHasRight = this.businesspartnerMainHeaderDataService.isBpStatusHasRight(parentSelected, 'statusWithEidtRightToSupplier');

			return isBpStatusHasRight || isBpStatusToCustomerHasRight;
		}
		return false;
	}

	public isBpStatusHasRight(currentStatusField: string) {
		const parentSelected = this.getSelectedParent();
		if (parentSelected) {
			return this.businesspartnerMainHeaderDataService.isBpStatusHasRight(parentSelected, currentStatusField);
		}
		return false;
	}

	public isReadOnly() {
		const bpStatus = this.businesspartnerMainHeaderDataService.getItemStatus();
		if (bpStatus) {
			return bpStatus.IsReadonly;
		}
		return true;
	}

	public async isItemEditable4WizardChangeCode(currentItem: ISupplierEntity) {
		const isCanEditStatus = await this.readonlyProcessor.isCanEditStatus(currentItem);
		if (!isCanEditStatus) {
			this.messageBoxService.showMsgBox('businesspartner.main.changeCode.statusIsReadonly', 'businesspartner.main.changeCode.supplierTitle', 'ico-warning');
			return false;
		}
		if (currentItem.SubledgerContextFk !== this.supplierInitService.currentSubledgerContextFk) {
			this.messageBoxService.showMsgBox('businesspartner.main.changeCode.supplierDiffSubLedgerContext', 'businesspartner.main.changeCode.supplierTitle', 'ico-warning');
			return false;
		}
		return true;
	}

	// endregion
}
