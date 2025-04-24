/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable, InjectionToken,} from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { PpsDrawingTypeCompleteEntity } from '../model/entities/pps-drawing-type-complete.class';
import {IPpsDrawingTypeEntity} from '../model/entities/pps-drawing-type-entity.interface';
import {IPpsDrawingTypeSkillEntity} from '../model/entities/pps-drawing-type-skill-entity.interface';
import {IIdentificationData} from '@libs/platform/common';
import {PpsDrawingTypeDataService} from './pps-drawing-type-data.service';

export const PPS_DRAWING_TYPE_SKILL_DATA_TOKEN = new InjectionToken<PpsDrawingTypeSkillDataService>('ppsDrawingTypeSkillDataToken');
@Injectable({
    providedIn: 'root'
})
export class PpsDrawingTypeSkillDataService extends DataServiceFlatLeaf<IPpsDrawingTypeSkillEntity, IPpsDrawingTypeEntity, PpsDrawingTypeCompleteEntity> {
    public constructor(ppsDrawingTypeService: PpsDrawingTypeDataService) {
        const options: IDataServiceOptions<IPpsDrawingTypeSkillEntity> = {
            apiUrl: 'productionplanning/drawingtype/skill',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'listbydrawingtype',
                usePost: false,
                prepareParam: (ident: IIdentificationData) => {
                    return {mainItemId: ident.pKey1};
                },
            },
            createInfo: <IDataServiceEndPointOptions> {
                prepareParam: ident => {
                    return { pKey1 : ident.pKey1};
                }
            },
            roleInfo: <IDataServiceChildRoleOptions<IPpsDrawingTypeSkillEntity, IPpsDrawingTypeEntity, PpsDrawingTypeCompleteEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'EngDrawingTypeSkill',
                parent: ppsDrawingTypeService
            }
        };
        super(options);
    }

    public override registerByMethod(): boolean {
        return true;
    }

    public override registerModificationsToParentUpdate(parentUpdate : PpsDrawingTypeCompleteEntity, modified: IPpsDrawingTypeSkillEntity[], deleted :IPpsDrawingTypeSkillEntity[]): void {
        if(modified && modified.length > 0) {
            parentUpdate.EngDrawingTypeSkillToSave = modified;
        }
        if(deleted && deleted.length > 0 ) {
            parentUpdate.EngDrawingTypeSkillToDelete = deleted;
        }
    }
    public override getSavedEntitiesFromUpdate(complete: PpsDrawingTypeCompleteEntity): IPpsDrawingTypeSkillEntity[] {
        if (complete && complete.EngDrawingTypeSkillToSave) {
            return complete.EngDrawingTypeSkillToSave;
        }
        return [];
    }
}
