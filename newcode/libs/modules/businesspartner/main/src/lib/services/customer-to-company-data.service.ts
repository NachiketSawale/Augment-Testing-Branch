import {Injectable} from '@angular/core';
import {BusinesspartnerSharedSubEntityDialogLeafDataService} from '@libs/businesspartner/shared';
import {
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {CustomerEntityComplete} from '../model/entities/customer-entity-complete.class';
import {BusinesspartnerMainCustomerDataService} from './customer-data.service';
import {CustomerToCompanyReadonlyProcessorService} from './customer-to-company-readonly-processor.service';
import { ICustomerCompanyEntity, ICustomerEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainCustomer2CompanyDataService extends BusinesspartnerSharedSubEntityDialogLeafDataService<ICustomerCompanyEntity, ICustomerEntity, CustomerEntityComplete> {

	public readonlyProcessor: CustomerToCompanyReadonlyProcessorService;

	public constructor(public parentService: BusinesspartnerMainCustomerDataService) {
		const options = {
			apiUrl: 'businesspartner/main/customercompany',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ICustomerCompanyEntity, ICustomerEntity, CustomerEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CustomerCompany',
				parent: parentService
			}
		};
		super(options);
		this.readonlyProcessor = new CustomerToCompanyReadonlyProcessorService(this);
		this.processor.addProcessor([
			this.readonlyProcessor
		]);
	}
	
	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}

		return {
			mainItemId: -1
		};
	}

	protected override onLoadSucceeded(loaded: object): ICustomerCompanyEntity[] {
		const list = loaded as ICustomerCompanyEntity[];
		super.onLoadSucceeded(list);
		return list;
	}

	public override canCreate() {
		const result = super.canCreate();
		if (result) {
			return this.parentService.isBpStatusHasRight('statusWithCreateRight');
		}
		return result;
	}

	public override canDelete() {
		const result = super.canDelete();
		if (result) {
			return this.parentService.isBpStatusHasRight('statusWithDeleteRight');
		}
		return result;
	}

	public override isParentFn(parentKey: ICustomerEntity, entity: ICustomerCompanyEntity): boolean {
		return entity.BpdCustomerFk === parentKey.Id;
	}
}