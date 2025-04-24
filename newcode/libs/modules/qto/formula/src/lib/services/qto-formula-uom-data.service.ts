/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject} from '@angular/core';
import {
    ServiceRole,
    IDataServiceOptions,
    IDataServiceEndPointOptions,
    IDataServiceRoleOptions, DataServiceFlatLeaf, IReadOnlyField
} from '@libs/platform/data-access';
import {QtoFormulaGridDataService} from './qto-formula-grid-data.service';
import * as _ from 'lodash';
import {QtoFormulaUomDataProcessor} from './processors/qto-formula-uom-data-processor.service';
import {IQtoFormulaEntity} from '../model/entities/qto-formula-entity.interface';
import {IQtoFormulaUomEntity} from '../model/entities/qto-formula-uom-entity.interface';
import { QtoFormulaItemComplete } from '../model/qto-formula-item-complete.class';
import { MainDataDto } from '@libs/basics/shared';
import { QtoShareFormulaType } from '@libs/qto/shared';

@Injectable({
    providedIn: 'root'
})

export class QtoFormulaUomDataService extends DataServiceFlatLeaf<IQtoFormulaUomEntity, IQtoFormulaEntity, QtoFormulaItemComplete> {

    private parentService = inject(QtoFormulaGridDataService);

    public constructor(parentDataService: QtoFormulaGridDataService) {
        const options: IDataServiceOptions<IQtoFormulaUomEntity> = {
            apiUrl: 'qto/formula/uom',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: false
            },
            createInfo: {
                prepareParam: () => {
                    const parent = parentDataService.getSelection()[0];

                    const parentId = parent && parent.Id ? parent.Id : -1;

                    return {
                        mainItemId: parentId
                    };
                }
            },
            roleInfo: <IDataServiceRoleOptions<IQtoFormulaUomEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'QtoFormulaUom',
                parent: parentDataService,
            }
        };

        super(options);

        this.processor.addProcessor([
            new QtoFormulaUomDataProcessor(this)
        ]);
    }

    protected override onLoadSucceeded(loaded: object): IQtoFormulaUomEntity[] {

        const dto = new MainDataDto<IQtoFormulaUomEntity>(loaded);
        const entities = dto.Main;

        return entities;
    }

    protected override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            return {
                mainItemId: parent.Id
            };
        } else {
            throw new Error('should be a selected parent.');
        }
    }

    /**
     * formula uom readonly logic
     * @param item
     */
    public setColumnsReadonly(item: IQtoFormulaUomEntity) {

        const parentItem = this.parentService.getSelectedEntity();
        if (parentItem) {
            if (parentItem && parentItem.QtoFormulaTypeFk === QtoShareFormulaType.FreeInput) {
                const readOnlyOperatorColumns = this.getReadOnlyOperatorColumns(true);
                this.setEntityReadOnlyFields(item, readOnlyOperatorColumns);

                const readOnlyModelScripts = this.getReadOnlyModelScripts(true);
                this.setEntityReadOnlyFields(item, readOnlyModelScripts);
            } else {
                const readOnlyOperatorColumns = this.getReadOnlyOperatorColumns(false);
                this.setEntityReadOnlyFields(item, readOnlyOperatorColumns);

                const readOnlyModelScripts = this.getReadOnlyModelScripts(false);
                this.setEntityReadOnlyFields(item, readOnlyModelScripts);
            }
        }
    }

    /**
     * get readonly fileds: OperatorColumns
     */
    private getReadOnlyOperatorColumns(value: boolean): IReadOnlyField<IQtoFormulaUomEntity>[]{

        return  [
            {field: 'Operator1', readOnly: value},
            {field: 'Operator2', readOnly: value},
            {field: 'Operator3', readOnly: value},
            {field: 'Operator4', readOnly: value},
            {field: 'Operator5', readOnly: value}
        ];
    }

    /**
     * get readonly fileds: ModelScriptArray
     */
    private getReadOnlyModelScripts(value: boolean): IReadOnlyField<IQtoFormulaUomEntity>[]{

        return  [
            {field: 'Value1IsActive', readOnly: value},
            {field: 'Value2IsActive', readOnly: value},
            {field: 'Value3IsActive', readOnly: value},
            {field: 'Value4IsActive', readOnly: value},
            {field: 'Value5IsActive', readOnly: value}
        ];
    }

    /**
     * the event from QtoFormulaTypeFk change
     */
    public qtoFormulaTypeFkChangeEvent(){
        const items = this.getList();
        _.forEach(items, (item) => {
            this.setColumnsReadonly(item);
        });
    }
}












