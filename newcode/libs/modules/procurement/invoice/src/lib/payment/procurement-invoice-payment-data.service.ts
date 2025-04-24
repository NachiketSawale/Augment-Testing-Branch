/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IInvChildCreateParameter, IInvHeaderEntity, IInvPaymentEntity, InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { BasicsSharedInvoiceStatusLookupService, MainDataDto } from '@libs/basics/shared';
import { sumBy } from 'lodash';
import { Permissions, PlatformPermissionService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';

/**
 * Procurement invoice payment data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoicePaymentDataService extends DataServiceFlatLeaf<IInvPaymentEntity, IInvHeaderEntity, InvComplete> {
	private readonly permissionService = inject(PlatformPermissionService);
	private readonly invoiceStatusLookupService = inject(BasicsSharedInvoiceStatusLookupService);
	private isReadonly = false;

	protected constructor(protected parentService: ProcurementInvoiceHeaderDataService) {
		const options: IDataServiceOptions<IInvPaymentEntity> = {
			apiUrl: 'procurement/invoice/payment',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IInvPaymentEntity, IInvHeaderEntity, InvComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'InvPayment',
				parent: parentService,
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
			},
		};

		super(options);

		this.entitiesModified$.subscribe((data) => {
			this.updateInvoiceHeaderWithPaymentChanged();
		});
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity();
		if (parent) {
			return {
				mainItemId: this.getMainItemId(parent),
			};
		} else {
			throw new Error('There should be a selected invoice');
		}
	}

	protected override onLoadSucceeded(loaded: object): IInvPaymentEntity[] {
		//Check readonly whenever the parent entity selection change and trigger the loading for this container.
		this.checkIsReadonly();
		return new MainDataDto<IInvPaymentEntity>(loaded).Main;
	}

	protected override provideCreatePayload(): IInvChildCreateParameter {
		const selected = this.getSelectedParent();
		if (selected) {
			return {
				MainItemId: selected.Id,
			};
		} else {
			throw new Error('There should be a selected invoice');
		}
	}

	protected override onCreateSucceeded(created: object): IInvPaymentEntity {
		return created as unknown as IInvPaymentEntity;
	}

	protected getMainItemId(parent: IInvHeaderEntity): number {
		return parent.Id;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: InvComplete, modified: IInvPaymentEntity[], deleted: IInvPaymentEntity[]): void {
		if (modified?.some(() => true)) {
			parentUpdate.InvPaymentToSave = modified;
		}

		if (deleted?.some(() => true)) {
			parentUpdate.InvPaymentToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: InvComplete): IInvPaymentEntity[] {
		if (complete && complete.InvPaymentToSave) {
			return complete.InvPaymentToSave;
		}

		return [];
	}

	public override isParentFn(parentKey: IInvHeaderEntity, entity: IInvPaymentEntity) {
		return entity.InvHeaderFk === parentKey.Id;
	}

	public updateInvoiceHeaderWithPaymentChanged() {
		const parent = this.parentService.getSelectedEntity();
		if (parent) {
			const paymentList = this.getList();
			parent.FromPaymentTotalPayment = sumBy(paymentList, (item) => item.Amount);
			parent.FromPaymentTotalPaymentDiscount = sumBy(paymentList, (item) => item.DiscountAmount);

			this.parentService.setModified(parent);
		} else {
			throw new Error('There should be a selected invoice');
		}
	}

	private async canEditPaymentByInvoiceStatus(statusId: number) {
		const currentStatus = await firstValueFrom(this.invoiceStatusLookupService.getItemByKey({ id: statusId }));

		if(currentStatus.AccessrightDescriptor06Fk){
			await this.permissionService.loadPermissions(currentStatus.AccessrightDescriptor06Fk);
			return this.permissionService.has(currentStatus.AccessrightDescriptor06Fk, Permissions.Write);
		}

		return true;

	}

	protected override checkCreateIsAllowed(entities: IInvPaymentEntity[] | IInvPaymentEntity | null): boolean {
		return super.checkCreateIsAllowed(entities) && !this.isReadonly;
	}

	protected override checkDeleteIsAllowed(entities: IInvPaymentEntity[] | IInvPaymentEntity | null): boolean {
		return super.checkDeleteIsAllowed(entities) && !this.isReadonly;
	}

	//TDOO: waiting for a simple way from framework to simply set the whole container as readonly

	private async checkIsReadonly() {
		const parent = this.parentService.getSelectedEntity();
		if (parent) {
			this.isReadonly = !(await this.canEditPaymentByInvoiceStatus(parent.InvStatusFk)) ||
				(this.parentService.isEntityReadonly() ?? false);
		} else {
			throw new Error('There should be a selected invoice');
		}
	}
}
