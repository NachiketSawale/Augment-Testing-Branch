import {IControllingCommonActualEntity} from '../model/entities/controlling-common-actual-entity.interface';
import {IControllingCommonProjectEntity} from '../model/entities/controlling-common-project-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';
import {
    DataServiceFlatLeaf,
    DataServiceFlatRoot,
    IDataServiceChildRoleOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';

export abstract class ControllingCommonActualDataService<T extends IControllingCommonActualEntity,PT extends IControllingCommonProjectEntity,PU extends CompleteIdentification<PT>>extends DataServiceFlatLeaf<T, PT, PU>{
    protected constructor (protected parentService: DataServiceFlatRoot<PT,PU>) {
        const options: IDataServiceOptions<T> = {
            apiUrl: 'controlling/actuals/subtotal',
            readInfo: {
                endPoint: 'ControllingUnitTotals',
                usePost: false,
                prepareParam: ident => {
                    return {
                       //TODD:Wait for Project Controls Dashboard container
                    };
                },
            },

            roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
                role: ServiceRole.Leaf,
                itemName: 'ControllingActualsSubTotalDto',
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