
import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {IEngTask2ClerkEntity} from '../model/entities/eng-task-2-clerk-entity.interface';
import {EngTaskComplete} from '../model/entities/eng-task-complete.class';
import {IEngTaskEntity} from '../model/entities/eng-task-entity.interface';
import {EngineeringTaskDataService} from './engineering-task-data.service';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class EngTask2ClerkDataService extends DataServiceFlatLeaf<IEngTask2ClerkEntity, IEngTaskEntity, EngTaskComplete> {
    public constructor(private engTaskDataServic : EngineeringTaskDataService) {
        const options: IDataServiceOptions<IEngTask2ClerkEntity> = {
            apiUrl: 'productionplanning/engineering/engtask2clerk',
            readInfo: <IDataServiceEndPointOptions> {
                endPoint: 'list',
                usePost: false,
                prepareParam: () => {
                    const engTask = engTaskDataServic.getSelectedEntity();
                    return {mainitemid: engTask?.Id, ppsitemid: engTask?.PPSItemFk};
                 }

            },
            roleInfo: <IDataServiceChildRoleOptions<IEngTask2ClerkEntity, IEngTaskEntity, EngTaskComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'EngTask2Clerk',
                parent: engTaskDataServic
            },
            createInfo: <IDataServiceEndPointOptions>{
                endPoint: 'create',
                usePost: true,
                prepareParam: () => {
                    const engTask = engTaskDataServic.getSelectedEntity();
                    return { Id : engTask?.Id };
                }
            }
        };
        super(options);
    }

    public override isParentFn(parentKey: IEngTaskEntity, entity: IEngTask2ClerkEntity): boolean {
        return entity.EngTaskFk === parentKey.Id;
    }
}
