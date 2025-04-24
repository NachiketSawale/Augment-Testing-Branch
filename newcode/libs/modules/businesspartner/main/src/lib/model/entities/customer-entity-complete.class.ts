import { CompleteIdentification } from '@libs/platform/common';
import { ICustomerCompanyEntity, ICustomerEntity } from '@libs/businesspartner/interfaces';

export class CustomerEntityComplete implements CompleteIdentification<ICustomerEntity> {
	public MainItemId: number = 0;
	public Customer: ICustomerEntity | null = null;
	public CustomerCompanyToSave: ICustomerCompanyEntity[] = [];
	public CustomerCompanyToDelete: ICustomerCompanyEntity[] = [];
}