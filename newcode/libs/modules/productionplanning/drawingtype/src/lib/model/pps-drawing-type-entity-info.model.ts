/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsDrawingTypeGridBehavior } from '../behaviors/pps-drawing-type-grid-behavior.service';
import { PpsDrawingTypeDataService } from '../services/pps-drawing-type-data.service';
import  {IPpsDrawingTypeEntity} from './entities/pps-drawing-type-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';


 export const PPS_DRAWING_TYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsDrawingTypeEntity> ({
    grid: {
        title: {key: 'productionplanning.drawingtype' + '.listTitle'},
        behavior: ctx => ctx.injector.get(PpsDrawingTypeGridBehavior),
    },
    form: {
    title: { key: 'productionplanning.drawingtype' + '.detailTitle' },
    containerUuid: 'a5258fb9a56b465da880aacffe345158',
    },
    dataService: ctx => ctx.injector.get(PpsDrawingTypeDataService),
    dtoSchemeId: {moduleSubModule: 'ProductionPlanning.DrawingType', typeName: 'EngDrawingTypeDto'},
    permissionUuid: '1f1a4316f0fc4c81a8c9a070b9de7009',
     layoutConfiguration: {
         groups: [
             {
                 gid: 'basicData',
                 attributes: [ 'DescriptionInfo', 'Icon','IsDefault', 'Sorting', 'IsLive']
                 // TODO: 'RubricCategoryFk',, 'MaterialGroupFk', 'ResTypeDetailerFk'
             }
         ],
         overloads: {
             IsLive: {
                 readonly : true
             }
         },
         labels: {
             ...prefixAllTranslationKeys('basics.customize.', {
                 RubricCategoryFk: {key: 'rubriccategoryfk', text: '*Rubric Category'}
             })
         }
     }


});