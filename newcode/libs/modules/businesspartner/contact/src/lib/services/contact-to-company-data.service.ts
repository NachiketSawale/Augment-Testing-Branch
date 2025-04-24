import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IContactEntityComplete } from '@libs/businesspartner/common';
import { IContact2BasCompanyEntity, IContact2CompanyResponse, IContactEntity } from '@libs/businesspartner/interfaces';
import { Injectable } from '@angular/core';
import { ContactDataService } from './contact-data.service';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { BasicsCompanyLookupService } from '@libs/basics/shared';

@Injectable({
    providedIn: 'root'
})
export class Contact2CompanyDataService extends DataServiceFlatLeaf<IContact2BasCompanyEntity, IContactEntity, IContactEntityComplete> {

    public constructor(parentService: ContactDataService) {
        const options: IDataServiceOptions<IContact2BasCompanyEntity> = {
            apiUrl: 'businesspartner/contact/contact2company',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false
            },
            createInfo: <IDataServiceEndPointOptions>{
                endPoint: 'createnew'
            },
            roleInfo: <IDataServiceChildRoleOptions<IContact2BasCompanyEntity, IContactEntity, IContactEntityComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'Contact2Company',
                parent: parentService
            }
        };
        super(options);
        this.processor.addProcessor([{
            process: (item) => {
                this.setReadonly(item);
            },
            revertProcess() {
            }
        }]);
        parentService.selectionChanged$.subscribe(selection => {
            if (selection && selection.length === 1 && selection[0].Version === 0) {
                this.create();
            }
        });
    }

    protected override provideLoadPayload(): object {
        const parentSelected = this.getSelectedParent();
        return {
            mainItemId: parentSelected ? parentSelected.Id : -1
        };
    }

    protected override onLoadSucceeded(loaded: IContact2CompanyResponse): IContact2BasCompanyEntity[] {
        if (loaded.Company && loaded.Company.length > 0) {
            const companyLookupService = ServiceLocator.injector.get(BasicsCompanyLookupService);
            companyLookupService.cache.setItems(loaded.Company);
        }

        return loaded.Main;
    }

    protected override provideCreatePayload(): object {
        const parentSelected = this.getSelectedParent();

        return {
            mainItemId: parentSelected ? parentSelected.Id : -1
        };
    }

    protected override onCreateSucceeded(created: IContact2BasCompanyEntity): IContact2BasCompanyEntity {
        return created;
    }

	public override canDelete(): boolean {
		let can = super.canDelete();
		if (can) {
			const selected = this.getSelection();
			if (selected) {
				selected.forEach(item => {
					can = can && this.getCellEditable(item);
				});
			}
		}
		return can;
	}

    private getCellEditable(currentItem: IContact2BasCompanyEntity) {
        const platformConfigurationService = ServiceLocator.injector.get(PlatformConfigurationService);
        // if the companyFk equals to login company's id or the current item is a new item or the current item is a modified item, the cell is editable.
        return currentItem.BasCompanyFk === platformConfigurationService.clientId || currentItem.Version === 0;
    }

    private setReadonly(currentItem: IContact2BasCompanyEntity) {
        const editable = this.getCellEditable(currentItem);
        this.setEntityReadOnly(currentItem, !editable);
    }

    public override isParentFn(parentKey: IContactEntity, entity: IContact2BasCompanyEntity): boolean {
		return entity.BpdContactFk === parentKey.Id;
	}

}