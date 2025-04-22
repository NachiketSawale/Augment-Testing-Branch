/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { ICertificateEntity } from '@libs/businesspartner/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

export const PROCUREMENT_CONTRACT_ACTUAL_CERTIFICATE_BEHAVIOR_TOKEN = new InjectionToken<ProcurementContractActualCertificateBehaviorService>('procurementContractActualCertificateBehaviorService');

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractActualCertificateBehaviorService implements IEntityContainerBehavior<IGridContainerLink<ICertificateEntity>, ICertificateEntity> {
	

	public onCreate(containerLink: IGridContainerLink<ICertificateEntity>): void {
		//todo-The enumeration class does not have a value for the jump button, and the value is set here after being added
		// containerLink.uiAddOns.toolbar.deleteItems([
		//
		// 	EntityContainerCommand.
		// ]);
	}


}