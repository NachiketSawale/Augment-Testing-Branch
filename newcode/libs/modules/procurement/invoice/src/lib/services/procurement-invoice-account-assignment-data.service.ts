/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { IInvAccountAssignmentEntity, IInvHeaderEntity, InvComplete } from '../model';
import { ProcurementCommonAccountAssignmentDataService } from '@libs/procurement/common';
import { sumBy } from 'lodash';
import { round } from 'mathjs';
import { ServiceLocator } from '@libs/platform/common';
import { ProcurementInvoiceAccountAssignmentValidationService } from './procurement-invoice-account-assignment-validation.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceAccountAssignmentDataService extends ProcurementCommonAccountAssignmentDataService<IInvAccountAssignmentEntity, IInvHeaderEntity, InvComplete> {
	public constructor() {
		const invoiceDataService = inject(ProcurementInvoiceHeaderDataService);
		super(invoiceDataService, {
			apiUrl: 'procurement/invoice/accountAssignment',
			itemName: 'InvAccountAssignmentDto',
			getMainEntityFk: (entity) => entity.InvHeaderFk,
		});
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: InvComplete, modified: IInvAccountAssignmentEntity[], deleted: IInvAccountAssignmentEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.InvAccountAssignmentDtoToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.InvAccountAssignmentDtoToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: InvComplete): IInvAccountAssignmentEntity[] {
		if (parentUpdate && parentUpdate.InvAccountAssignmentDtoToSave) {
			return parentUpdate.InvAccountAssignmentDtoToSave;
		}
		return [];
	}

	public override isParentFn(parentKey: IInvHeaderEntity, entity: IInvAccountAssignmentEntity): boolean {
		return entity.InvHeaderFk === parentKey.Id;
	}

	public updateInvBreakDownPercent(entity: IInvAccountAssignmentEntity, value: number) {
		if (this.accountAssignmentTotal) {
			entity.InvBreakdownAmount = round((this.accountAssignmentTotal.invoiceTotalNet / 100) * value, 2);
			entity.InvBreakdownPercent = value;
			entity.InvBreakdownAmountOc = round((this.accountAssignmentTotal.invoiceTotalNetOc / 100) * value, 2);
		}
	}

	public updateInvBreakDown() {
		if (this.accountAssignmentTotal) {
			this.accountAssignmentTotal.invoiceTotalPercent = sumBy(this.getList(), (i) => i.InvBreakdownPercent);
			this.accountAssignmentTotal.invoiceTotalAmount = sumBy(this.getList(), (i) => i.InvBreakdownAmount);
			this.accountAssignmentTotal.invoiceTotalAmountOc = sumBy(this.getList(), (i) => i.InvBreakdownAmountOc);
		}
	}

	public updatePreviousInvoice() {
		if (this.accountAssignmentTotal) {
			this.accountAssignmentTotal.previousInvoiceAmount = sumBy(this.getList(), (i) => i.PreviousInvoiceAmount);
			this.accountAssignmentTotal.previousInvoiceAmountOc = sumBy(this.getList(), (i) => i.PreviousInvoiceAmountOc);
		}
	}

	protected override provideLoadPayload(): object {
		const selEntity = this.parentService.getSelectedEntity();
		if (selEntity) {
			return {
				invoiceId: selEntity.Id,
			};
		}

		throw new Error('The main entity should be selected!');
	}

	protected override provideCreatePayload(): object {
		const header = this.parentService.getSelectedEntity();
		if (header) {
			return {
				InvHeaderFk: header.Id,
				...super.provideCreatePayload(),
			};
		}

		throw new Error('Invoice header should be selected');
	}

	protected override onCreateSucceeded(created: object): IInvAccountAssignmentEntity {
		this.updateInvBreakDown();
		this.validateInvBreakdownPercent();

		this.updateBreakDown();
		this.validateBreakdownPercent();

		this.updatePreviousInvoice();
		return super.onCreateSucceeded(created);
	}

	private validateBasAccAssignAccTypeFk() {
		this.validateField('BasAccAssignAccTypeFk', 'validateBasAccAssignAccTypeFk');
	}

	private validateBreakdownPercent() {
		this.validateField('BreakdownPercent', 'validateBreakdownPercent');
	}

	private validateInvBreakdownPercent() {
		this.validateField('InvBreakdownPercent', 'validateInvBreakdownPercent');
	}


	private validateField<T extends keyof IInvAccountAssignmentEntity>(fieldName: T, validatorName: 'validateBasAccAssignAccTypeFk' | 'validateBreakdownPercent' | 'validateInvBreakdownPercent') {
		const list = this.getList();
		if (list.length > 0) {
			const validationService = ServiceLocator.injector.get(ProcurementInvoiceAccountAssignmentValidationService);
			const entity = list[0];
			const value = entity[fieldName] as number;
			validationService[validatorName]({
				entity: entity,
				value: value,
				field: fieldName,
			});
		}
	}
}
