/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { AccountingJournalsMainService } from '../services/accounting-journals-main.service';
import { AccountingJournalsLayoutService } from '../services/accounting-journals-layout.service';
import { IAccountingJournalsEntity } from '../model/entities/accounting-journals-entity.interface';

export const BASICS_ACCOUNTING_JOURNALS_ENTITY_INFO = EntityInfo.create<IAccountingJournalsEntity>({
    grid: {
        title: { text: 'Transaction Headers', key: 'basics.accountingJournals.accountingJournalsListContainerTitle' }
    },
    form: {
        containerUuid: '26ef760cd529457da85feadc241f16bb',
        title: { text: 'Transaction Headers Detail', key: 'basics.accountingJournals.accountingJournalsDetailContainerTitle' },
    },
    dataService: ctx => ctx.injector.get(AccountingJournalsMainService),
    dtoSchemeId: { moduleSubModule: 'Basics.AccountingJournals', typeName: 'AccountingJournalsDto' },
    permissionUuid: '008f7b6e76f14ad5b5b16365e2d11823',
    layoutConfiguration: context => {
        return context.injector.get(AccountingJournalsLayoutService).generateConfig();
    }
});