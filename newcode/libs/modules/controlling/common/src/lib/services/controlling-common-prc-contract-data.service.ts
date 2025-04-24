/*
 * Copyright(c) RIB Software GmbH
 */
import {IControllingCommonPrcContractEntity} from '../model/entities/controlling-common-prc-contract-entity.interface';
import {IControllingCommonProjectEntity} from '../model/entities/controlling-common-project-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';
import {
    DataServiceFlatLeaf,
    DataServiceFlatRoot,
    IDataServiceChildRoleOptions, IDataServiceOptions,
    ServiceRole
} from '@libs/platform/data-access';

export abstract class ControllingCommonPrcContractDataService <T extends IControllingCommonPrcContractEntity,PT extends IControllingCommonProjectEntity,PU extends CompleteIdentification<T>>extends DataServiceFlatLeaf<T, PT, PU>{
    protected constructor (protected parentService: DataServiceFlatRoot<PT,PU>) {
        const options: IDataServiceOptions<T> = {
            apiUrl: 'procurement/contract/controllingtotal',
            readInfo: {
                endPoint: 'list',
                usePost: false,
                prepareParam: ident => {
                    return {
                        //TODD:Wait for Project Controls Dashboard container
                    };
                },
            },

            roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
                role: ServiceRole.Leaf,
                itemName: 'ConControllingTotalDto',
                parent: parentService,
            }
        };
        super(options);
    }
    private getProperty = <T, K extends keyof T>(obj: T, key: K) => {
        return obj[key];
    };
    protected override onLoadSucceeded(loaded:T[]):T [] {
        return loaded;
    }
}