/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {QtoHeaderHistroyBehavior} from './qto-header-histroy-behavior.service';
import {QtoHeaderHistoryDataService} from './qto-header-history-data.service';
import { BasicsSharedPostConHistoryLayout, IBasicsSharedPostConHistoryEntity } from '@libs/basics/shared';

export const QTO_MAIN_HISTORY_ENTITY_INFO: EntityInfo = EntityInfo.create<IBasicsSharedPostConHistoryEntity> ({
    grid: {
        title: { key: 'qto.main.listPostconHistoryTitle', text: 'History' },
        behavior: ctx => ctx.injector.get(QtoHeaderHistroyBehavior)
    },
    form: {
        containerUuid: '50f5def8e7f94faabda2e873e3744cf8',
        title: {text: 'History Detail', key: 'qto.main.detailPostconHistoryTitle'},
    },
    dataService: ctx => ctx.injector.get(QtoHeaderHistoryDataService),
    dtoSchemeId: {moduleSubModule: 'Procurement.Common', typeName: 'PrcPostconHistoryDto'},
    permissionUuid: '61c44d54375b4600bdb318c9926e81c7',
    layoutConfiguration: context => {
        return context.injector.get(BasicsSharedPostConHistoryLayout).generateConfig();
    }
});