/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialPriceListDataService } from '../material-price-list/basics-material-price-list-data.service';
import { BasicsMaterialPriceListLayoutService } from '../material-price-list/basics-material-price-list-layout.service';
import { IMaterialPriceListEntity } from '../model/entities/material-price-list-entity.interface';


export const BASICS_MATERIAL_PRICE_LIST_ENTITY_INFO = EntityInfo.create<IMaterialPriceListEntity>({
    grid: {
        title: { text: 'Price Lists', key: 'basics.material.priceList.priceListTitle' }
    },
    form: {
        containerUuid: '83f4d48ff373416aa8c5a8fd389af1c2',
        title: { text: 'Price List Detail', key: 'basics.material.priceList.priceListDetailTitle' },
    },
    dataService: ctx => ctx.injector.get(BasicsMaterialPriceListDataService),
    dtoSchemeId: { moduleSubModule: 'Basics.Material', typeName: 'MaterialPriceListDto' },
    permissionUuid: '8161248d9b014fb4a284326e5dd3d1c7',
    layoutConfiguration: context => {
        return context.injector.get(BasicsMaterialPriceListLayoutService).generateConfig();
    }
});