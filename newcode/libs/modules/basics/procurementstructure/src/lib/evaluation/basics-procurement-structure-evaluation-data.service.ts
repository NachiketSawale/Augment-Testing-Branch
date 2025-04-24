/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { get } from 'lodash';
import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import {BasicsProcurementStructureDataService} from '../procurement-structure/basics-procurement-structure-data.service';
import { PrcStructureComplete } from '../model/complete-class/prc-structure-complete.class';
import { IPrcStructureEntity } from '@libs/basics/interfaces';
import { IPrcStructure2EvaluationEntity } from '../model/entities/prc-structure-2-evaluation-entity.interface';


/**
 * Procurement structure evaluation entity data service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementStructureEvaluationDataService extends DataServiceFlatLeaf<IPrcStructure2EvaluationEntity,IPrcStructureEntity,PrcStructureComplete> {

    public constructor(parentService: BasicsProcurementStructureDataService) {
        const options: IDataServiceOptions<IPrcStructure2EvaluationEntity> = {
            apiUrl: 'basics/procurementstructure/evaluation',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list'
            },
            roleInfo: <IDataServiceChildRoleOptions<IPrcStructure2EvaluationEntity, IPrcStructureEntity, PrcStructureComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'PrcStructure2Evaluation',
                parent: parentService
            }
        };
        super(options);
    }

    protected override provideLoadPayload(): object {
        const parentSelection = this.getSelectedParent();
        if (parentSelection) {
            return {
                mainItemId: parentSelection.Id
            };
        } else {
            throw new Error('There should be a selected parent catalog to load the evaluation data');
        }
    }


    protected override onLoadSucceeded(loaded: object): IPrcStructure2EvaluationEntity[] {
        if (loaded) {
            return get(loaded, 'Main', []);
        }
        return [];
    }

    public override isParentFn(parentKey: IPrcStructureEntity, entity: IPrcStructure2EvaluationEntity): boolean {
		return entity.PrcStructureFk === parentKey.Id;
	}
}
