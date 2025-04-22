/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { IInvHeaderEntity, IInvStatusEntity } from '../model';
import { MainDataDto } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceStatusPermissionService {
	protected readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private _InvStatusEditRightToContract: IInvStatusEntity[] = [];
	private _InvStatusCreateRightToContract: IInvStatusEntity[] = [];
	private _InvStatusDeleteRightToContract: IInvStatusEntity[] = [];
	private _InvStatusEditRight: IInvStatusEntity[] = [];
	private _InvStatusEditRightToPes: IInvStatusEntity[] = [];

	/**
	 * Prepare context before entering entity container
	 */
	public preparePermissionContext(dto: MainDataDto<IInvHeaderEntity>) {
		this._InvStatusEditRightToContract = dto.getValueAs<IInvStatusEntity[]>('InvStatusEditRightToContract')!;
		this._InvStatusCreateRightToContract = dto.getValueAs<IInvStatusEntity[]>('InvStatusCreateRightToContract')!;
		this._InvStatusDeleteRightToContract = dto.getValueAs<IInvStatusEntity[]>('InvStatusDeleteRightToContract')!;
		this._InvStatusEditRight = dto.getValueAs<IInvStatusEntity[]>('InvStatusEditRight')!;
		this._InvStatusEditRightToPes = dto.getValueAs<IInvStatusEntity[]>('InvStatusEditRightToPes')!;
	}

	private hasContractRight(statusId: number, statusList: IInvStatusEntity[]): boolean {
		const status = statusList.find((item) => item.Id === statusId);
		if (!status?.HasAccessRightDescriptor) {
			return true;
		}
		return status?.HasAccessRightDescriptorToContract ?? false;
	}

	public hasEditContractRight(statusId: number): boolean {
		return this.hasContractRight(statusId, this._InvStatusEditRightToContract);
	}

	public hasCreateContractRight(statusId: number): boolean {
		return this.hasContractRight(statusId, this._InvStatusCreateRightToContract) || this.hasEditContractRight(statusId);
	}

	public hasDeleteContractRight(statusId: number): boolean {
		return this.hasContractRight(statusId, this._InvStatusDeleteRightToContract) || this.hasEditContractRight(statusId);
	}

	public isEditableInvoiceStatus(statusId: number): boolean {
		const status = this._InvStatusEditRight.find((item) => item.Id === statusId);
		return ((status?.HasAccessRightDescriptor ?? true) && !status?.IsReadOnly) || false;
	}

	public isEditableToPes(statusId: number): boolean {
		const status = this._InvStatusEditRightToPes.find((item) => item.Id === statusId);
		return status?.HasAccessRightDescriptor ?? true;
	}
}
