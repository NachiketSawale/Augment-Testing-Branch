import {EntityInfo} from '@libs/ui/business-base';
import {BasicsSharedLink2ClerkEntityInfoFactory} from '@libs/basics/shared';
import { SalesContractContractsDataService } from '../../services/sales-contract-contracts-data.service';

export const SALES_CONTRACT_CLERK_ENTITY_INFO: EntityInfo = BasicsSharedLink2ClerkEntityInfoFactory.create({
    permissionUuid: '34d0a7ece4f34f2091f7ba6c622ff04d',
    gridContainerUuid: 'b648fe0b290548d8b4c1787c9c497c35',
    gridTitle: 'sales.contract.clerk.entityClerk',
    formContainerUuid: '5d1ef566843840adbe9d9b6cbf331986',
    formTitle: 'sales.contract.clerk.entityClerkForm',
    link2clerkDataServiceCreateContext: {
        qualifier: 'sales.contract.clerk',
        parentServiceFn: (ctx) => {
            return ctx.injector.get(SalesContractContractsDataService);
        },
    },
});