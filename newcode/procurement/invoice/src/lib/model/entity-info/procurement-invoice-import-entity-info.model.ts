/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType } from '@libs/ui/common';
import { IInvInvoiceImportEntity } from '../entities';
import { ProcurementInvoiceImportBehavior } from '../../behaviors/procurement-invoice-import-behavior.service';
import { ProcurementInvoiceImportDataService } from '../../services/procurement-invoice-import-data.service';
import { PackageImportStatusItems } from '@libs/procurement/package';

export const PROCUREMENT_INVOICE_IMPORT_ENTITY_INFO: EntityInfo = EntityInfo.create<IInvInvoiceImportEntity> ({
    grid: {
        title: {key: 'procurement.invoice.title.importInvoiceTitle'},
        behavior: ctx => ctx.injector.get(ProcurementInvoiceImportBehavior),
    },
    
    dataService: ctx => ctx.injector.get(ProcurementInvoiceImportDataService),
    dtoSchemeId: {moduleSubModule: 'Procurement.Invoice', typeName: 'InvInvoiceImportDto'},
    permissionUuid: 'A453D1390DB54AD6A05D8518CCCD3A04',
    layoutConfiguration: {
        groups: [
            {gid: 'basicData', attributes: ['Status','ErrorMessage','Log'] }
        ],
        labels: {
            ...prefixAllTranslationKeys('procurement.package.', {
                Status: { key: 'import.status' },
                ErrorMessage: { key: 'import.errorMessage' },
                Log: { key: 'import.log', text: 'Log'},
            }),
        },
        overloads: {
			Status: {
				readonly: true,
				type: FieldType.Select,
				itemsSource: {
					items: PackageImportStatusItems,
				},
			},
            ErrorMessage: {
				readonly: true,
			},
            Log: {
				readonly: true,
			},
		},
    }              
                    
});