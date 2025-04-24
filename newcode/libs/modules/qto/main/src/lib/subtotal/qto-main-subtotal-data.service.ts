/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, IReadOnlyField, ServiceRole
} from '@libs/platform/data-access';
import {IQtoMainDetailGridEntity} from '../model/qto-main-detail-grid-entity.class';
import {IQtoMainHeaderGridEntity} from '../model/qto-main-header-grid-entity.class';
import {QtoMainHeaderGridComplete} from '../model/qto-main-header-grid-complete.class';
import {QtoMainHeaderGridDataService} from '../header/qto-main-header-grid-data.service';
import {MainDataDto} from '@libs/basics/shared';
import _, {forEach} from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class QtoMainSubtotalDataService extends DataServiceFlatLeaf<IQtoMainDetailGridEntity, IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> {
    private parentService: QtoMainHeaderGridDataService;

    public constructor(QtoMainHeaderGridDataService: QtoMainHeaderGridDataService) {
        const options: IDataServiceOptions<IQtoMainDetailGridEntity>  = {
            apiUrl: 'qto/main/detail',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: true,
            },
            roleInfo: <IDataServiceChildRoleOptions<IQtoMainDetailGridEntity,IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'SubTotals',
                parent: QtoMainHeaderGridDataService
            }
        };
        super(options);
        this.parentService = QtoMainHeaderGridDataService;
    }

    protected override onLoadSucceeded(loaded: object): IQtoMainDetailGridEntity[] {
        const updateReadOnly = this.updateReadOnly;
        const dto = new MainDataDto<IQtoMainDetailGridEntity>(loaded);
        let entities = dto.Main;

        if (entities && entities.length > 0) {
            entities = _.filter(entities, function (k) {
                return (k.QtoLineTypeFk === 3 || k.QtoLineTypeFk === 4);
            });
        }

        forEach(entities, function (item) {
            updateReadOnly(item, ['PrjLocationFk', 'BoqItemFk', 'BasUomFk', 'SubTotal', 'RemarkText'],true);
        });
        return entities;
    }

    protected override provideLoadPayload(): object {
        return {
            MainItemId: this.parentService.getSelectedEntity()?.Id?? 0,
            BillTos: [],
            Boqs: [],
            Locations: [],
            Structures: [],
            filter: ''
        };
    }

    /**
     * readonly
     * @param item
     * @param modelArray
     * @param value
     */
    public updateReadOnly(item: IQtoMainDetailGridEntity, modelArray: string[], value: boolean) {
        if (item.IsCopySource) {
            value = true;
        }
        const qtostatusItem = item.QtoStatusItem;
        //let qtostatusItem = item.QtoStatusItem ? item.QtoStatusItem : qtoDetailReadOnlyProcessor.getItemStatus(item);
        value = value || !!(qtostatusItem && qtostatusItem.IsReadOnly);

        const readonlyFields: IReadOnlyField<IQtoMainDetailGridEntity>[] = [];

        forEach(modelArray,function (model) {
            readonlyFields.push({ field: model, readOnly: value });
        });
        this.setEntityReadOnlyFields(item, readonlyFields);
    }

    //TODO: missing => setFilterLocations, location not ready - Jun

    //TODO: missing => setFilterBoqs, qto boq not ready - Jun

    //TODO: missing => setFilterBillTos, billTo not ready - Jun

    //TODO: missing => setFilterStructures, sheet not ready - Jun

    //TODO: missing => setQtoDetailSelectItem, qto boq not ready - Jun


}