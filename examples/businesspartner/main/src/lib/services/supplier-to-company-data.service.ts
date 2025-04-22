import {BusinesspartnerSharedSubEntityDialogLeafDataService} from '@libs/businesspartner/shared';
import {ISupplierCompanyEntity, ISupplierEntity} from '@libs/businesspartner/interfaces';
import {Injectable} from '@angular/core';
import {SupplierDataService} from './suppiler-data.service';
import {
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IReadOnlyField,
	ServiceRole
} from '@libs/platform/data-access';
import {SupplierEntityComplete} from '../model/entities/supplier-entity-complete.class';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainSupplier2CompanyDataService extends BusinesspartnerSharedSubEntityDialogLeafDataService<ISupplierCompanyEntity, ISupplierEntity, SupplierEntityComplete> {

	private readOnlyFields = ['BasCompanyFk', 'CustomerNo', 'SupplierLedgerGroupFk', 'BusinessPostingGroupFk', 'VatGroupFk', 'BusinessPostGrpWhtFk', 'BasPaymentMethodFk', 'SupplierLedgerGroupIcFk'];

	public constructor(protected parentService: SupplierDataService) {
		const options = {
			apiUrl: 'businesspartner/main/suppliercompany',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ISupplierCompanyEntity, ISupplierEntity, SupplierEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'SupplierCompany',
				parent: parentService
			}
		};
		super(options);
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

	protected override onLoadSucceeded(loaded: object): ISupplierCompanyEntity[] {
		const list = loaded as ISupplierCompanyEntity[];

		if (!this.parentService.bpSupplierHasRight()) {
			this.setReadOnly(list);
		}
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

	private setReadOnly(items: ISupplierCompanyEntity[]) {
		const fields: IReadOnlyField<ISupplierCompanyEntity>[] = [];
		this.readOnlyFields.forEach(field => {
			fields.push({field: field, readOnly: true});
		});

		items.forEach(item => {
			this.setEntityReadOnlyFields(item, fields);
		});
	}

	public override isParentFn(parentKey: ISupplierEntity, entity: ISupplierCompanyEntity): boolean {
		return entity.BpdSupplierFk === parentKey.Id;
	}
}