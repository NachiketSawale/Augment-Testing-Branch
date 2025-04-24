
import { BasicsSharedUserFormDataEntityInfoFactory, Rubric } from '@libs/basics/shared';


import { PpsProductDataService } from '../services/pps-product-data.service';
import {PpsProductComplete} from './productionplanning-product-complete.class';
import {IPpsProductEntity} from './entities/product-entity.interface';

export const PPS_PRODUCT_USER_FORM_ENTITY_INFO = BasicsSharedUserFormDataEntityInfoFactory.create<IPpsProductEntity, PpsProductComplete>({
    rubric: Rubric.PPSProduct,
    permissionUuid: '70210ee234ef44af8e7e0e91d45186b2',
    containerUuid: '29d62dfb91234305a02bcffd8c6b9d9d',
    gridTitle: {
        key: 'productionplanning.product.formDataLisTitle'
    },
    parentServiceFn: (ctx) => {
        return ctx.injector.get(PpsProductDataService);
    }
});