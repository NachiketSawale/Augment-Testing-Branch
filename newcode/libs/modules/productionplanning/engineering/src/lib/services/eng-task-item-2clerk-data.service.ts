
import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {IPPSItem2ClerkEntity} from '@libs/productionplanning/item';
import {EngTaskComplete} from '../model/entities/eng-task-complete.class';
import {IEngTaskEntity} from '../model/entities/eng-task-entity.interface';
import {EngineeringTaskDataService} from './engineering-task-data.service';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class EngTaskItem2clerkDataService extends DataServiceFlatLeaf<IPPSItem2ClerkEntity, IEngTaskEntity, EngTaskComplete> {
    public constructor(private engTaskDataServic : EngineeringTaskDataService) {
        const options: IDataServiceOptions<IPPSItem2ClerkEntity> = {
            apiUrl: 'productionplanning/engineering/task',
            readInfo: <IDataServiceEndPointOptions> {
                endPoint: 'getClerksByTaskId',
                usePost: false,
                prepareParam: () => {
                    const engTask = engTaskDataServic.getSelectedEntity();
                    return {taskId: engTask?.Id};
                }

            },
            roleInfo: <IDataServiceChildRoleOptions<IPPSItem2ClerkEntity, IEngTaskEntity, EngTaskComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'PPSItemClerk',
                parent: engTaskDataServic
            }
        };
        super(options);
    }

    public override isParentFn(parentKey: IEngTaskEntity, entity: IPPSItem2ClerkEntity): boolean {
        return true;
    }
}
