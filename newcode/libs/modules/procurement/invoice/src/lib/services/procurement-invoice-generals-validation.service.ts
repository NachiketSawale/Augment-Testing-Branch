/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcGeneralsEntity, ProcurementCommonGeneralsValidationService } from '@libs/procurement/common';
import { IInvHeaderEntity } from '../model/entities';
import { InvComplete } from '../model';
import { ProcurementInvoiceGeneralsDataService } from './procurement-invoice-generals-data.service';
import { ValidationInfo } from '@libs/platform/data-access';
import { Injectable } from '@angular/core';


/**
 * Generals validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementInvoiceGeneralsValidationService extends ProcurementCommonGeneralsValidationService<IPrcGeneralsEntity, IInvHeaderEntity, InvComplete> {

	public constructor(protected generalDataService: ProcurementInvoiceGeneralsDataService) {
		super(generalDataService);
	}

	public override async validateControllingUnitFk(info: ValidationInfo<IPrcGeneralsEntity>) {
		let result = this.validationUtils.createSuccessObject();
		const header = this.generalDataService.getParentEntity();
		if (header?.ProjectFk) {
			const response = await this.http.get<boolean>('procurement/common/prcgenerals/prjgeneralvalue?GeneralsTypeFk=' + info.value + '&ProjectFk=' + header.ProjectFk);
			if (response) {
				result = this.validationUtils.createErrorObject({
					key: 'basics.common.error.controllingUnitError'
				});
			}
		}
		return result;
	}
}