import {
    DataServiceHierarchicalNode, IDataServiceEndPointOptions,
    IDataServiceOptions, IDataServiceRoleOptions,
    IEntitySelection, ServiceRole
} from '@libs/platform/data-access';
import {CompleteIdentification} from '@libs/platform/common';
import {IEstimateRuleParameterBaseEntity, IEstRuleEntity} from '@libs/estimate/interfaces';
import {get} from 'lodash';

export abstract class IEstimateRuleParameterBaseDataService<
    T extends IEstimateRuleParameterBaseEntity,
    U extends  CompleteIdentification<PT>,
    PT extends IEstRuleEntity,
    PU extends CompleteIdentification<PT>
> extends DataServiceHierarchicalNode<T, U, PT, PU> {

    protected parentDataService: IEntitySelection<PT> ;

    protected constructor(
        options: {
            itemName: string,
            apiUrl: string,
            readEndPoint: string,
            usePost:boolean,
            canCreate?: boolean,
            canUpdate?: boolean,
            canDelete?: boolean,
            createEndPoint?: string,
            updateEndPoint?: string,
            parentDataService:IEntitySelection<PT>
        }){

        const _options: IDataServiceOptions<T> = {
            apiUrl: options.apiUrl,
            readInfo:<IDataServiceEndPointOptions> {
                endPoint: options.readEndPoint,
                usePost: options.usePost
            },
            createInfo:options.canCreate ? <IDataServiceEndPointOptions>{
                endPoint:options.createEndPoint,
                usePost: true
            } : undefined,
            updateInfo:options.canUpdate ? <IDataServiceEndPointOptions> {
                endPoint: options.updateEndPoint,
                usePost: true
            } : undefined,
            roleInfo:<IDataServiceRoleOptions<T>> {
                role: ServiceRole.Node,
                itemName: options.itemName,
                parent: options.parentDataService,
            }
        };

        super(_options);
        this.parentDataService =  options.parentDataService;
    }

    protected override onLoadSucceeded(loaded: object): T[] {
        if (loaded) {
            return get(loaded, 'Main', []);
        }
        return [];
    }
}