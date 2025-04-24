/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsDrawingTypeSkillDataService } from '../services/pps-drawing-type-skill-data.service';
import  {IPpsDrawingTypeSkillEntity} from './entities/pps-drawing-type-skill-entity.interface';
import {PpsDrawingTypeSkillGridBehavior} from '../behaviors/pps-drawing-type-skill-grid-behavior.service';

export const PPS_DRAWING_TYPE_SKILL_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsDrawingTypeSkillEntity> ({
    grid: {
        title: {key: 'productionplanning.drawingtype.skill' + '.listTitle'},
        containerUuid: '29468739bb844a8db199cdb937a33632',
        behavior: ctx => ctx.injector.get(PpsDrawingTypeSkillGridBehavior)
    },
    form: {
        title: { key: 'productionplanning.drawingtype.skill' + '.detailTitle' },
        containerUuid: 'bf7fe88155d740fba56d668f6ff0b5d7',
    },
    dataService: ctx => ctx.injector.get(PpsDrawingTypeSkillDataService),
    dtoSchemeId: {moduleSubModule: 'ProductionPlanning.DrawingType', typeName: 'EngDrawingTypeSkillDto'},
    permissionUuid: '1f1a4316f0fc4c81a8c9a070b9de7009',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                attributes: [ 'CommentText']
                // TODO: 'EngDrawingTypeFk',, 'ResSkillFk'
            }
        ]
    }
});