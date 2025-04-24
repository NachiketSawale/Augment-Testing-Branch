import {EntityInfo} from '@libs/ui/business-base';
import {IPpsItemSourceEntity} from './entities/pps-item-source-entity.interface';
import {PpsItemSourceDataService} from '../services/pps-item-source-data.service';
import {PpsItemSourceLayoutService} from '../services/pps-item-source-layout.service';

export const PPS_ITEM_SOURCE_ENTITY_INFO : EntityInfo = EntityInfo.create<IPpsItemSourceEntity>({
    grid: {
        containerUuid: '75be0fd1a18944e3826023c1bfc88ddb',
        title: {key: 'productionplanning.item.sourceListTitle'},
    },
    permissionUuid: '6151cf32e8ef471f93d4fa3724276cdf',
    dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Item', typeName: 'PpsItemSourceDto'},
    dataService: ctx => ctx.injector.get(PpsItemSourceDataService),
    layoutConfiguration: ctx => ctx.injector.get(PpsItemSourceLayoutService).generate(),
});