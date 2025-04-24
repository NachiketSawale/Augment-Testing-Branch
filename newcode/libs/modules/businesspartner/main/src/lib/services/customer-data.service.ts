import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IBusinessPartnerEntity, ICustomerCompanyEntity, ICustomerEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../model/entities/businesspartner-entity-complete.class';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { CustomerEntityComplete } from '../model/entities/customer-entity-complete.class';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { cloneDeep, isUndefined, forEach } from 'lodash';
import { BusinesspartnerSharedCustomerStatusLookupService } from '@libs/businesspartner/shared';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { BusinesspartnerCommonNumberGenerationService } from '@libs/businesspartner/common';
import { RubricCateGenCodeSettingDto } from '@libs/procurement/common';
import { CustomerReadonlyProcessorService } from './customer-readonly-processor.service';

export interface ICacheItem {
	mainItemId: number;
	Value: ICustomerCompanyEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class BusinesspartnerMainCustomerDataService extends DataServiceFlatNode<ICustomerEntity, CustomerEntityComplete, IBusinessPartnerEntity, BusinessPartnerEntityComplete> {
	private readonly customerStatusLookup = inject(BusinesspartnerSharedCustomerStatusLookupService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly numberGenerationService = ServiceLocator.injector.get(BusinesspartnerCommonNumberGenerationService);
	private readonly translationService = ServiceLocator.injector.get(PlatformTranslateService);

	public currentSubledgerContextFk: number | null = null;
	private cacheToRead: { saveItem: ICustomerEntity[]; deleteItem: ICustomerEntity[] } = { saveItem: [], deleteItem: [] };
	private originItemList: ICacheItem[] = [];
	private rubricCateGenCodeSettingDto: RubricCateGenCodeSettingDto[] = [];

	public readonlyProcessor: CustomerReadonlyProcessorService;

	public constructor(
		protected businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService,
		protected http: PlatformHttpService,
		protected configuration: PlatformConfigurationService,
	) {
		const options: IDataServiceOptions<ICustomerEntity> = {
			apiUrl: 'businesspartner/main/customer',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<ICustomerEntity, IBusinessPartnerEntity, BusinessPartnerEntityComplete>>{
				role: ServiceRole.Node,
				itemName: 'Customer',
				parent: businesspartnerMainHeaderDataService,
			},
		};
		super(options);

		const loginCompanyId = configuration.getContext().clientId;
		http.get<{ SubledgerContextFk: number }>('basics/company/getCompanyById', { params: { companyId: isUndefined(loginCompanyId) ? -1 : loginCompanyId } }).then((data) => {
			this.currentSubledgerContextFk = data?.SubledgerContextFk;
		});
		this.numberGenerationService.loadRubricCateGenCodeSetting('customer').then((data) => {
			if (data) {
				this.rubricCateGenCodeSettingDto = data;
			}
		});
		this.readonlyProcessor = new CustomerReadonlyProcessorService(this);
		this.processor.addProcessor([this.readonlyProcessor]);
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return { PKey1: parentSelection.Id };
		}
		return { PKey1: -1 };
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

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: ICustomerEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}

	protected override onLoadSucceeded(loaded: object): ICustomerEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', []);
		}
		return [];
	}

	protected override onCreateSucceeded(created: ICustomerEntity): ICustomerEntity {
		if (created.RubricCategoryFk) {
			const result = this.numberGenerationService.hasToGenerateForRubricCategoryNew(this.rubricCateGenCodeSettingDto, created.RubricCategoryFk);
			if (result) {
				created.Code = this.translationService.instant({ key: 'cloud.common.isGenerated' }).text;
			} else {
				created.Code = '';
			}
		}
		return created;
	}

	public override createUpdateEntity(modified: ICustomerEntity | null): CustomerEntityComplete {
		const complete = new CustomerEntityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Customer = modified;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: CustomerEntityComplete): ICustomerEntity[] {
		return complete.Customer ? [complete.Customer] : [];
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: BusinessPartnerEntityComplete): ICustomerEntity[] {
		if (parentUpdate.CustomerCompleteToSave) {
			const suppliers = [] as ICustomerEntity[];
			parentUpdate.CustomerCompleteToSave.forEach((updated) => {
				if (updated.Customer) {
					suppliers.push(updated.Customer);
				}
			});
			return suppliers;
		}
		return [];
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: BusinessPartnerEntityComplete, modified: CustomerEntityComplete[], deleted: ICustomerEntity[]) {
		if (modified && modified.length > 0) {
			parentUpdate.CustomerCompleteToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			parentUpdate.CustomerToDelete = deleted;
		}
	}

	public bPCustomerhasRight() {
		const parentSelected = this.getSelectedParent();
		if (parentSelected) {
			const isBpStatusHasRight = this.businesspartnerMainHeaderDataService.isBpStatusHasRight(parentSelected, 'statusWithEidtRight');
			const isBpStatusToCustomerHasRight = this.businesspartnerMainHeaderDataService.isBpStatusHasRight(parentSelected, 'statusWithEidtRightToCustomer');

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

	public async loadCustomerCompanyItem(mainItemId: number) {
		if (mainItemId !== -1) {
			const tempItems = this.originItemList.filter((item) => item.mainItemId === mainItemId);
			if (tempItems && tempItems.length > 0) {
				const tempItem = tempItems[0];
				if (isUndefined(tempItem)) {
					this.originItemList.push({ mainItemId: mainItemId, Value: [] });
				}
				if (tempItem?.Value.length === 0) {
					const resp = await this.http.get<{ data: ICustomerCompanyEntity[] }>('businesspartner/main/customercompany/list', { params: { mainItemId: mainItemId } });
					tempItem.Value = resp.data;
				}
			}
		}
	}

	public getOriginalDataList(mainItemId: number) {
		const items = this.originItemList.filter((item) => item.mainItemId === mainItemId);
		if (items && items.length > 0) {
			return cloneDeep(items[0].Value);
		}
		return [];
	}

	public async getCustomerByCustomerLedgerGrps(groupIds: number[]) {
		return await this.http.post<ICustomerEntity>('businesspartner/main/customer/getcustomerbycustomerledgergroup', groupIds);
	}

	public isItemEditable4WizardChangeCode(item: ICustomerEntity) {
		if (!item) {
			return false;
		}
		if (this.isItemReadonly(item)) {
			this.messageBoxService.showMsgBox(this.translationService.instant('businesspartner.main.changeCode.statusIsReadonly').text, this.translationService.instant('businesspartner.main.changeCode.customerTitle').text, 'ico-warning');
			return false;
		}
		if (item.SubledgerContextFk !== this.configuration.getContext().clientId) {
			this.messageBoxService.showMsgBox(this.translationService.instant('businesspartner.main.changeCode.customerDiffSubLedgerContext').text, this.translationService.instant('businesspartner.main.changeCode.customerTitle').text, 'ico-warning');
			return false;
		}
		return true;
	}

	private isItemReadonly(item: ICustomerEntity) {
		const status = this.customerStatusLookup.syncService?.getListSync() || [];
		const filterItems = status.filter((s) => s.Id === item.CustomerStatusFk);
		const customerStatusEntity = filterItems[0];
		return item.Version !== 0 && (!this.bPCustomerhasRight() || (customerStatusEntity?.IsDeactivated));
	}

	public getCache() {
		return this.cacheToRead;
	}

	public storeData(cacheData: { customerId: number; saveItem: ICustomerEntity[]; deleteItem: ICustomerEntity[] }[], customerId: number) {
		const tempFilter = cacheData.filter((c) => c.customerId === customerId);
		if (tempFilter && tempFilter.length > 0) {
			const tempData = tempFilter[0];
			if (tempData?.saveItem) {
				forEach(tempData.saveItem, (item) => {
					const filterItems = this.cacheToRead.saveItem.filter((i) => i.Id === item.Id);
					if (filterItems && filterItems.length > 0) {
						this.cacheToRead.saveItem = this.cacheToRead.saveItem.filter((i) => i.Id !== item.Id);
					}
					this.cacheToRead.saveItem.push(item);
				});
			}
			if (tempData?.deleteItem) {
				forEach(tempData.deleteItem, (item) => {
					if (this.cacheToRead.saveItem.filter((i) => i.Id === item.Id).length > 0) {
						this.cacheToRead.saveItem = this.cacheToRead.saveItem.filter((i) => i.Id !== item.Id);
					} else if (!this.cacheToRead.deleteItem.filter((i) => i.Id === item.Id)) {
						this.cacheToRead.deleteItem.push(item);
					}
				});
			}
		}
	}
}
