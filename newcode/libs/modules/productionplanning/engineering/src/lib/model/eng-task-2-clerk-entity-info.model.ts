import {EntityInfo} from '@libs/ui/business-base';
import {IEngTask2ClerkEntity} from './entities/eng-task-2-clerk-entity.interface';
import {EngTask2ClerkDataService} from '../services/eng-task-2-clerk-data.service';
import {PpsCommonEntity2ClerkLayoutService} from '@libs/productionplanning/common';
import {ILayoutConfiguration} from '@libs/ui/common';

export const ENG_TASK_2_CLERK_ENTITY_INFO = EntityInfo.create<IEngTask2ClerkEntity>({
    grid: {
        containerUuid: 'ad6b8c6ce05b451d8d22cb2541237558',
        title: {text: 'productionplanning.engineering.engtask2clerkListTitle'}
    },
    permissionUuid: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
    dataService: ctx => ctx.injector.get(EngTask2ClerkDataService),
    dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Engineering', typeName: 'EngTask2ClerkDto'},
    layoutConfiguration: context =>  {
        return context.injector.get(PpsCommonEntity2ClerkLayoutService).generateLayout() as ILayoutConfiguration<IEngTask2ClerkEntity> ;

    }
});