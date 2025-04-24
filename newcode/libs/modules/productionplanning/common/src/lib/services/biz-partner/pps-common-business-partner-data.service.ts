/* it's useless, to be deleted in the future
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import {
    DataServiceFlatNode,
    IDataServiceOptions, IDataServiceRoleOptions,
} from '@libs/platform/data-access';
import {PpsCommonBizPartnerComplete} from '../../model/pps-common-biz-partner-complete.class';
import {IPpsCommonBizPartnerEntity} from '../../model/entities/pps-common-biz-partner-entity.interface';
import {PpsCommonBusinessPartnerReadonlyProcessor} from './pps-common-business-partner-readonly-processor.serivce';
import * as _ from 'lodash';

export abstract class PpsCommonBusinessPartnerDataService<
    T extends IPpsCommonBizPartnerEntity,
    U extends PpsCommonBizPartnerComplete,
    PT extends IEntityIdentification,
    PU extends CompleteIdentification<PT>>
    extends DataServiceFlatNode<T, U, PT, PU> {

    public constructor(
        protected roleInfo: IDataServiceRoleOptions<T>,
        protected projectFkField: string,
        protected ppsHeaderFkField: string,
        protected mntReqFkField: string = '',
    ) {
        const options: IDataServiceOptions<T> = {
            apiUrl: 'productionplanning/common/bizpartner',
            roleInfo: roleInfo,
            createInfo: {
                endPoint: 'create',
            },
            readInfo: {
                endPoint: 'list',
            },
        };

        super(options);

        this.processor.addProcessor(new PpsCommonBusinessPartnerReadonlyProcessor(this));
    }

    protected override provideCreatePayload(): object {
        return {
            Id: this.getParentFk('Id'),
            PKey1: this.getParentFk(this.projectFkField),
            PKey2: this.getParentFk(this.ppsHeaderFkField),
        };
    }

    protected override provideLoadPayload(): object {
        return {
            projectId: this.getParentFk(this.projectFkField),
            ppsHeaderId: this.getParentFk(this.ppsHeaderFkField),
            mntReqId: this.getParentFk(this.mntReqFkField),
        };
    }

    protected override onLoadSucceeded(loaded: object): T[] {
        return loaded as T[];
    }

    protected override checkCreateIsAllowed(entities: T[] | T | null): boolean {
        return super.checkCreateIsAllowed(entities) && this.getParentFk(this.projectFkField) !== -1;
    }

    /**
     * return the value of the field in the parent entity, or -1 if undefined
     *//*
    protected getParentFk(field: string) {
        if (field.length === 0) {
            return -1;
        }

        const parent = this.getSelectedParent();
        if (!parent) {
            throw new Error('no selected parent for the business partner');
        }

        return _.get(parent, field) ?? -1;
    }

    public takeOver() {
        // todo
        // ensureInvalid(entity);
        // var data = container.data;
        // var dataEntity = data.getItemById(entity.Id, data);
        //
        // data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
        // // var fields = [
        // // 	{field: 'SubsidiaryFk', readonly: !dataEntity.BusinessPartnerFk}
        // // ];
        // // platformRuntimeDataService.readonly(dataEntity, fields);
        //
        // var validateService = ppsCommonProjectBPValidationServiceFactory.getService(container.service);
        // var result = validateService.validateSubsidiaryFk(dataEntity, dataEntity.SubsidiaryFk, 'SubsidiaryFk');
        // platformRuntimeDataService.applyValidationResult(result, dataEntity, 'SubsidiaryFk');
        //
        // data.markItemAsModified(dataEntity, data);
    }

    // function ensureInvalid(newItem) {
    //     if (newItem.SubsidiaryFk === 0) {
    //         newItem.SubsidiaryFk = null;
    //     }
    // }

    // // override findItemToMerge method
    // var orginalFindItemToMerge = container.service.findItemToMerge;
    // container.service.findItemToMerge = function newFindItemToMerge(item2Merge){
    //     var result = undefined;
    //     if(item2Merge){
    //         result = orginalFindItemToMerge(item2Merge); // original method that find by `Id`
    //         // find by `InitialId` if cannot find by `Id`. `InitialId` is only useful on creation/first-time-saving
    //         if(_.isNil(result)){
    //             result = (!item2Merge || !item2Merge.InitialId) ? undefined : _.find(container.service.getList(), {InitialId: item2Merge.InitialId});
    //         }
    //     }
    //     return result;
    // };
    //
    // // for avoiding undefined error when calling communicationFormatter of email field, override onCreateSucceeded method to pre-setting property __rt$data.
    // var orginalOnCreateSucceeded = container.data.onCreateSucceeded;
    // container.data.onCreateSucceeded = function (newData, data, creationData) {
    //     if (!newData.__rt$data) {
    //         newData.__rt$data = {};
    //     }
    //     orginalOnCreateSucceeded(newData, data, creationData);
    // };
    //
    // // for refreshing fields email and telephonenumber, here we have to override mergeItemAfterSuccessfullUpdate method.
    // var orginalMergeItemAfterSuccessfullUpdate = container.data.mergeItemAfterSuccessfullUpdate;
    // container.data.mergeItemAfterSuccessfullUpdate = function (oldItem, newItem, handleItem, data) {
    //     orginalMergeItemAfterSuccessfullUpdate(oldItem, newItem, handleItem, data);
    //     data.dataModified.fire(); // refresh UI
    // };
}
*/