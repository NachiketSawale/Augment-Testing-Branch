import {EntityInfo} from '@libs/ui/business-base';
import {IPPSItem2ClerkEntity} from '@libs/productionplanning/item';
import {PpsCommonEntity2ClerkLayoutService} from '@libs/productionplanning/common';
import {ILayoutConfiguration} from '@libs/ui/common';
import {EngTaskItem2clerkBehaviorService} from '../behaviors/eng-task-item-2clerk-behavior.service';
import {EngTaskItem2clerkDataService} from '../services/eng-task-item-2clerk-data.service';

export const ENG_TASK_ITEM2_CLERK_ENTITY_INFO = EntityInfo.create<IPPSItem2ClerkEntity>({
    grid: {
        containerUuid: 'a738f9b403554c5fa9ef3b7e7820dd31',
        behavior: (ctx) => ctx.injector.get(EngTaskItem2clerkBehaviorService),
        title: {text: 'productionplanning.engineering.itemClerkListTitle'}
    },
    permissionUuid: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
    dataService: ctx => ctx.injector.get(EngTaskItem2clerkDataService),
    dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Item', typeName: 'PPSItem2ClerkDto'},
    layoutConfiguration: context =>  {
        return context.injector.get(PpsCommonEntity2ClerkLayoutService).generateLayout() as ILayoutConfiguration<IPPSItem2ClerkEntity> ;
    }
});