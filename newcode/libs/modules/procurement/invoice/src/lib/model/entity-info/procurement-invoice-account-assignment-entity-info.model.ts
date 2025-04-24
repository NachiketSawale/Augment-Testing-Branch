/*
 * Copyright(c) RIB Software GmbH
 */


import { IInvAccountAssignmentEntity, IInvHeaderEntity } from '../entities';
import { ProcurementInvoiceAccountAssignmentDataService } from '../../services/procurement-invoice-account-assignment-data.service';
import { ProcurementInvoiceAccountAssignmentValidationService } from '../../services/procurement-invoice-account-assignment-validation.service';
import { ProcurementInvoiceAccountAssignmentLayoutService } from '../../services/layouts/procurement-invoice-account-assignment-layout.service';
import { ProcurementCommonAccountAssignmentEntityInfo } from '@libs/procurement/common';
import { InvComplete } from '../inv-complete.class';
import { ProcurementInvoiceAccountAssignmentHeaderComponent } from '../../components/invoice-account-assignment-header/account-assignment-header.component';

export const PROCUREMENT_INVOICE_ACCOUNT_ASSIGNMENT_ENTITY_INFO = ProcurementCommonAccountAssignmentEntityInfo.create<IInvAccountAssignmentEntity, IInvHeaderEntity, InvComplete>({
	permissionUuid: '94d42d2ad7474bd6b4ff95c437ece934',
	formUuid: '1eb6d69bb01847c2b6ffc59254e2f3c1',
	dataServiceToken: ProcurementInvoiceAccountAssignmentDataService,
	validationServiceToken: ProcurementInvoiceAccountAssignmentValidationService,
	moduleSubModule: 'Procurement.Invoice',
	typeName: 'InvAccountAssignmentDto',
	headerComponent: ProcurementInvoiceAccountAssignmentHeaderComponent,
	layoutServiceToken: ProcurementInvoiceAccountAssignmentLayoutService
});
