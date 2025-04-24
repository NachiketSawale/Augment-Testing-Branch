/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IOrdCertificateEntity } from '@libs/sales/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class SalesContractCertificateBehavior implements IEntityContainerBehavior<IGridContainerLink<IOrdCertificateEntity>, IOrdCertificateEntity> {

}