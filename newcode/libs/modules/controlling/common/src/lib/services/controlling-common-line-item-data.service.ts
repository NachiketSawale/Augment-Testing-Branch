import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import {IControllingCommonProjectEntity} from '../model/entities/controlling-common-project-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';
import {
    DataServiceFlatLeaf,
    DataServiceFlatRoot,
    IDataServiceChildRoleOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
export abstract class ControllingCommonLineItemDataService<T extends IEstLineItemEntity,PT extends IControllingCommonProjectEntity,PU extends CompleteIdentification<T>>extends DataServiceFlatLeaf<T, PT, PU>{
    protected constructor (protected parentService: DataServiceFlatRoot<PT,PU>) {
        const options: IDataServiceOptions<T> = {
            apiUrl: 'estimate/main/lineitem',
            readInfo: {
                endPoint: 'projectcontrolslineitemlist',
                usePost: false,
                prepareParam: ident => {
                    return {
                        //TODD:Wait for Project Controls Dashboard container
                    };
                },
            },

            roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
                role: ServiceRole.Leaf,
                itemName: 'EstLineItems',
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