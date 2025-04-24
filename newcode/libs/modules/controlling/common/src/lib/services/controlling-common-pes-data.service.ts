import {IControllingCommonPesEntity} from '../model/entities/controlling-common-pes-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';
import {
    DataServiceFlatLeaf,
    DataServiceFlatRoot, DataServiceHierarchicalRoot,
    IDataServiceChildRoleOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';

export abstract class ControllingCommonPesDataService<T extends IControllingCommonPesEntity, PT extends object, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU>{
    protected constructor (protected parentService: DataServiceFlatRoot<PT,PU> | DataServiceHierarchicalRoot<PT,PU>, config:{
        apiUrl: string,
        readEndPoint: string,
        itemName: string
    }) {
        const options: IDataServiceOptions<T> = {
            apiUrl: config.apiUrl,
            readInfo: {
                endPoint: config.readEndPoint,
                usePost: false,
            },

            roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
                role: ServiceRole.Leaf,
                itemName: config.itemName,
                parent: parentService,
            }
        };
        super(options);
    }
    private getProperty = <T, K extends keyof T>(obj: T, key: K) => {
        return obj[key];
    };
    protected override onLoadSucceeded(loaded:T[]):T[] {
        return loaded;
    }

    public refreshData(){
    }
}