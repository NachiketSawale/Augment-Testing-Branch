/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialMaterialReferenceDataService } from '../material-reference/basics-material-material-reference-data.service';
import { BasicsMaterialMaterialReferenceLayoutService } from '../material-reference/basics-material-material-reference-layout.service';
import { IMdcMaterialReferenceEntity } from '../model/entities/mdc-material-reference-entity.interface';


export const BASICS_MATERIAL_MATERIAL_REFERENCE_ENTITY_INFO = EntityInfo.create<IMdcMaterialReferenceEntity>({
    grid: {
        title: { text: 'Reference', key: 'basics.material.reference.referenceTitle' }
    },
    form: {
        containerUuid: 'a9fee4f6099142c19f482312e66af2b1',
        title: { text: 'Reference Detail', key: 'basics.material.reference.referenceDetailTitle' },
    },
    dataService: ctx => ctx.injector.get(BasicsMaterialMaterialReferenceDataService),
    dtoSchemeId: { moduleSubModule: 'Basics.Material', typeName: 'MdcMaterialReferenceDto' },
    permissionUuid: '829eb265578a484a8719180f4e10ec57',
    layoutConfiguration: context => {
        return context.injector.get(BasicsMaterialMaterialReferenceLayoutService).generateConfig();
    }
});