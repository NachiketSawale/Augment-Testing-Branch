/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { find } from 'lodash';
import {EntityReadonlyProcessorBase, ReadonlyFunctions} from '@libs/basics/shared';
import {IQtoSheetEntity} from '../model/entities/qto-sheet-entity.interface';
import {QtoMainSheetDataService} from './qto-main-sheet-data.service';
import {QtoMainHeaderGridDataService} from '../header/qto-main-header-grid-data.service';
import {QtoMainDetailGridDataService} from '../services/qto-main-detail-grid-data.service';
import {IQtoStatusEntity} from '../model/entities/qto-status-entity.interface';
import {PlatformConfigurationService} from '@libs/platform/common';

/**
 * qto sheet readonly processor
 */
export class QtoMainSheetReadonlyProcessor extends EntityReadonlyProcessorBase<IQtoSheetEntity> {
    protected readonly qtoHeaderDataService = inject(QtoMainHeaderGridDataService);

    protected configurationService = inject(PlatformConfigurationService);

    protected readonly qtoDetailDataService: QtoMainDetailGridDataService;

    public constructor(protected dataService: QtoMainSheetDataService) {
        super(dataService);

        this.qtoDetailDataService = new QtoMainDetailGridDataService();
    }

    public generateReadonlyFunctions(): ReadonlyFunctions<IQtoSheetEntity> {
        return {
            Description: e => {
                let isReadonly = this.readonlyEntity(e.item);
                if (!isReadonly) {
                    isReadonly = !e.item.PageNumber;
                }

                return isReadonly;
            }
        };
    }

    protected override readonlyEntity(item: IQtoSheetEntity): boolean {
        let isReadonly = false;

        //TODO: missing => qtoStatusItem -lnt
        // qtoheader status is readonly

        // set by qto adrress config
        if (!isReadonly) {
            const sheetAreaList = this.qtoDetailDataService.getSheetAreaList();
            if (sheetAreaList && sheetAreaList.length) {
                if (item.PageNumber && !item.From && !item.To && sheetAreaList.indexOf(item.PageNumber) <= -1) {
                    isReadonly = true;
                }
            }
        }

        // set by qtosheet status
        if (!isReadonly) {
            const qtoSheetStatus = this.getItemSheetStatus(item);
            if (qtoSheetStatus && (qtoSheetStatus.IsReadOnly || (!qtoSheetStatus.IsCoreData && !this.configurationService.isPortal) ||
                (!qtoSheetStatus.IsCoreDataExt && this.configurationService.isPortal))) {
                isReadonly = true;
            }
        }

        return isReadonly;

    }

    private getItemSheetStatus(item: IQtoSheetEntity): IQtoStatusEntity {
        //TODO: has not cache: QtoSheetStatus -lnt
        // let sheetStatuses = lookupDescriptorService.getData('QtoSheetStatus');
        // return _.find(sheetStatuses, {Id: item.QtoSheetStatusFk});

        // replace - will be removed
        const sheetStatuses: IQtoStatusEntity[] = [];
        return find(sheetStatuses, {Id: item.QtoSheetStatusFk}) as IQtoStatusEntity;
    }
}