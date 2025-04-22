import {CompleteIdentification} from '@libs/platform/common';
import {ISupplierCompanyEntity, ISupplierEntity} from '@libs/businesspartner/interfaces';

export class SupplierEntityComplete implements CompleteIdentification<ISupplierEntity> {
	public MainItemId: number = 0;
	public Supplier: ISupplierEntity | null = null;
	public SupplierCompanyToSave: ISupplierCompanyEntity[] = [];
	public SupplierCompanyToDelete: ISupplierCompanyEntity[] = [];
}