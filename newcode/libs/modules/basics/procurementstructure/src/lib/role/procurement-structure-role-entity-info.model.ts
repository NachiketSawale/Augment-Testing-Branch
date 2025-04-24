/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsProcurementStructureClerkDataService } from './basics-procurement-structure-clerk-data.service';
import { BasicsProcurementStructureClerkLayoutService } from './basics-procurement-structure-clerk-layout.service';
import { IPrcStructure2clerkEntity } from '../model/entities/prc-structure-2-clerk-entity.interface';

//Although the entity the is PrcStructure2clerkDto, but shows as role container in UI
export const PROCUREMENT_STRUCTURE_ROLE_ENTITY_INFO = EntityInfo.create<IPrcStructure2clerkEntity>({
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementStructure', typeName: 'PrcStructure2clerkDto'},
    permissionUuid: '9f82d18224164812991295f00e0dde9d',
    grid: {
        title: {text: 'Role', key: 'basics.procurementstructure.clerkContainerTitle'},
    },
    form: {
        containerUuid: 'dd35df201a3a464eafbd10e227d7527b',
        title: {text: 'Role Detail', key: 'basics.procurementstructure.clerkDetailContainerTitle'},
    },
    dataService: ctx => ctx.injector.get(BasicsProcurementStructureClerkDataService),
    layoutConfiguration: context => {
        return context.injector.get(BasicsProcurementStructureClerkLayoutService).generateLayout();
    }
});
