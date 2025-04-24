/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    DataServiceFlatRoot,
    IDataServiceEndPointOptions,
    IDataServiceOptions,
    IDataServiceRoleOptions,
    ServiceRole
} from '@libs/platform/data-access';
import { IEstRootAssignmentData } from '@libs/estimate/interfaces';
import {IEstRuleExecutionResultEntity} from '@libs/estimate/interfaces';
import {IIdentificationData} from '@libs/platform/common';
import {EstimateMainContextService} from '@libs/estimate/shared';

/*
 * Service to handle data operations for the root assignment in estimates main
 */
@Injectable({
    providedIn: 'root',
})
export class EstimateMainRuleScriptOutputDataService extends DataServiceFlatRoot<IEstRuleExecutionResultEntity, IEstRuleExecutionResultEntity> {
    public constructor() {
        const options: IDataServiceOptions<IEstRuleExecutionResultEntity> = {
            apiUrl: 'estimate/ruleresult',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: true,
                prepareParam: (ident: IIdentificationData) => {
                    return {
                        estHeaderId: inject(EstimateMainContextService).getSelectedEstHeaderId(), // to do:Add temporary value by LQ,
                        lastCount: 0
                    };
                },
            },
            roleInfo: <IDataServiceRoleOptions<IEstRootAssignmentData>>{
                role: ServiceRole.Root,
                itemName: 'EstRuleExecutionResults'
            }
        };
        super(options);
    }
}
