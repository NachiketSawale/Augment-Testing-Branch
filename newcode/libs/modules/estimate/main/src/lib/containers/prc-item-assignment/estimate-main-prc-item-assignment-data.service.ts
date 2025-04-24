import {
    DataServiceHierarchicalNode,
    IDataServiceEndPointOptions,
    IDataServiceOptions,
    IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import {
    EstimateMainPrcItemAssignmentComplete,
    IEstimateMainPrcItemAssignmentEntity,
    LineItemBaseComplete
} from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import {IIdentificationData} from '@libs/platform/common';
import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import { EstimateMainService } from '../line-item/estimate-main-line-item-data.service';


@Injectable({ providedIn: 'root' })
export class EstimateMainPrcItemAssignmentDataService extends DataServiceHierarchicalNode<IEstimateMainPrcItemAssignmentEntity, EstimateMainPrcItemAssignmentComplete,IEstLineItemEntity, LineItemBaseComplete> {

    public constructor(private parentDataService: EstimateMainService) {
        const options: IDataServiceOptions<IEstimateMainPrcItemAssignmentEntity> = {
            apiUrl: 'procurement/common/prcitemassignment',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getPrcItemAssignments',
                usePost: true
            },
            createInfo: <IDataServiceEndPointOptions>{
                endPoint: 'createnew',
                prepareParam: (ident: IIdentificationData) => {
                    const parent = this.getSelectedParent();
                    if (parent) {
                        return {
                            EstHeaderFk: parent.EstHeaderFk,
                            LineItemFk: parent.Id,
                            EstResourceFk:null,
                            PrcPackageFk:1010524 //TODO: set it to hardcode temporarily, wait for the package lookup
                        };
                    }
                    return {};
                }
            },
            roleInfo: <IDataServiceRoleOptions<IEstimateMainPrcItemAssignmentEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'EstimateMainPrcItemAssignments',
                parent: parentDataService
            }
        };

        super(options);
    }

    protected override onLoadSucceeded(loaded: object): IEstimateMainPrcItemAssignmentEntity[] {
        const items = _.get(loaded, 'dtos');
        if (items) {
            return items as IEstimateMainPrcItemAssignmentEntity[];
        }
        return [];
    }

    protected override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            return {
                EstHeaderFk: parent.EstHeaderFk,
                LineItemFk: parent.Id,
                EstResourceFk:null
            };
        } else {
            throw new Error('There should be a selected parent qto header record to load the Formula data');
        }
    }

    protected override onCreateSucceeded(created: IEstimateMainPrcItemAssignmentEntity): IEstimateMainPrcItemAssignmentEntity {
        return created;
    }

    protected override provideCreatePayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            return {
                EstHeaderFk: parent.EstHeaderFk,
                LineItemFk: parent.Id,
                EstResourceFk:null,
                PrcPackageFk:1010524 //TODO: set it to hardcode temporarily, wait for the package lookup
            };
        }
        return {};
    }

    public override registerByMethod(): boolean {
        return true;
    }

    public override registerNodeModificationsToParentUpdate(complete: LineItemBaseComplete, modified: EstimateMainPrcItemAssignmentComplete[], deleted: IEstimateMainPrcItemAssignmentEntity[]) {
        if (modified && modified.length > 0) {
            complete.EstimateMainPrcItemAssignmentsToSave = modified;
        }
        if (deleted && deleted.length > 0) {
            complete.EstimateMainPrcItemAssignmentsToDelete = deleted;
        }
    }

    public override createUpdateEntity(modified: IEstimateMainPrcItemAssignmentEntity | null): EstimateMainPrcItemAssignmentComplete {
        const complete =  new EstimateMainPrcItemAssignmentComplete();
        if (modified){
            complete.EstResourceFk = null;
            complete.EstLineItemFk = modified.EstLineItemFk;
            complete.EstHeaderFk = modified.EstHeaderFk;
            complete.PrcPackageFk=1010524; //TODO: set it to hardcode temporarily, wait for the package lookup
            complete.Id = modified.Id;

        }

        return complete;
    }
}