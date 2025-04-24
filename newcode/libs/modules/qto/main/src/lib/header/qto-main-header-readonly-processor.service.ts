/*
 * Copyright(c) RIB Software GmbH
 */

import { isNil } from 'lodash';
import {EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo} from '@libs/basics/shared';
import {IQtoMainHeaderGridEntity} from '../model/qto-main-header-grid-entity.class';
import {QtoMainHeaderGridDataService} from './qto-main-header-grid-data.service';
import {QtoShareTargetType} from '@libs/qto/shared';

/**
 * qto header readonly processor
 */
export class QtoMainHeaderReadonlyProcessor extends EntityReadonlyProcessorBase<IQtoMainHeaderGridEntity> {
	public constructor(protected dataService: QtoMainHeaderGridDataService) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IQtoMainHeaderGridEntity> {
		return {
            QtoTargetType: {
                shared: ['IsLive', 'BasRubricCategoryFk', 'ProjectFk', 'QtoTypeFk', 'BoqHeaderFk', 'QTOStatusFk','BusinessPartnerFk','ContractCode',
                    'PrcStructureFk','PrcBoqFk', 'PackageFk','OrdHeaderFk','ConHeaderFk'],
                readonly: this.readOnlyFields
            },
            Code: e => {
                return isNil(e.item.Code);
            },
            IsWQ: {
                shared: ['IsAQ'],
                readonly: e => {
                    return !!(e.item.QtoTargetType === QtoShareTargetType.SalesWqAq || e.item.QtoTargetType === QtoShareTargetType.prcWqAq);
                }
            },
            IsBQ: {
                shared: ['IsIQ'],
                readonly: e => {
                    return !!(e.item.QtoTargetType === QtoShareTargetType.SalesWipBill || e.item.QtoTargetType === QtoShareTargetType.PrcPes);
                }
            }
        };
	}

	protected override readonlyEntity(item: IQtoMainHeaderGridEntity): boolean {
        return this.getItemStatus(item);
	}

    private getItemStatus(item: IQtoMainHeaderGridEntity): boolean{
        if (item){
            //TODO: missing => cache QtoStatus -lnt
        }

        return false;
    }

    private readOnlyFields(info: ReadonlyInfo<IQtoMainHeaderGridEntity>){
        let isReadonly: boolean = true;

        if (info.field === 'BasGoniometerTypeFk'){
            isReadonly = !!info.item.hasQtoDetal;
        }

        return isReadonly;
    }
}