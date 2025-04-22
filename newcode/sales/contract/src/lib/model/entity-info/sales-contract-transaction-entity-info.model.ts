import {SalesSharedEntityInfo} from '@libs/sales/shared';
import { SalesContractTransactionDataService } from '../../services/sales-contract-transaction-data.service';

export const SALES_CONTRACT_TRANSACTION_ENTITY_INFO =
    new SalesSharedEntityInfo().getTransactionEntityInfo
    (
        'cf96dfc3307941d2a4d7224911f33538',
        '903f9f1aa40f49fa8c1e5cf2ff3ec003',
        'OrdTransactionDto',
        'Sales.Contract',
        SalesContractTransactionDataService
    );
