/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { get } from 'lodash';
import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsConfigRfqReportsEntity } from '@libs/basics/interfaces';
import { IEntityContext, IIdentificationData } from '@libs/platform/common';


/*
 * Procurement Configuration Rfq Reports
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedProcurementConfigurationRfqReportsLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBasicsConfigRfqReportsEntity, TEntity> {

    private moduleName: string | undefined;
    private getItemByKeyQuery = this.configService.webApiBaseUrl + 'basics/reporting/report/getReportsUnderRfqById?id=';

    public constructor() {
        super({
            httpRead: {
                route: 'basics/reporting/report/',
                endPointRead: 'getReportsUnderRfq',
                usePostForRead: false
            },
            filterParam: true,
            prepareListFilter: () => {
                return 'module=' + this.moduleName;
            }
        }, {
            uuid: 'a304cf38ebe047568b1de7e44e3db6d8',
            valueMember: 'Id',
            displayMember: 'Name.Translated',
            gridConfig: {
                uuid: '2c325be8de9e4c04b238d8def190c078',
                columns: [
                    {
                        id: 'reportName',
                        model: 'Name',
                        type: FieldType.Translation,
                        label: {text: 'Report Name', key: 'basics.reporting.reportReportName'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'description',
                        model: 'Description',
                        type: FieldType.Translation,
                        label: {text: 'Description', key: 'cloud.common.entityDescription'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'fileName',
                        model: 'FileName',
                        type: FieldType.Code,
                        label: {text: 'File Name', key: 'basics.reporting.reportFileName'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'filePath',
                        model: 'FilePath',
                        type: FieldType.Code,
                        label: {text: 'File Path', key: 'basics.reporting.reportFilePath'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    }
                ]
            },
            dialogOptions: {
                headerText: {
                    text: 'Assign Report',
                    key: 'basics.reporting.dialogTitleReport'
                }
            },
            showDialog: true
        });
    }

    protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
        this.moduleName = get(request.additionalParameters, 'moduleName') ?? '';
        return 'module=' + this.moduleName;
    }

    public override getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<IBasicsConfigRfqReportsEntity> {
        const cacheItem = this.cache.getItem(key);
        if (cacheItem) {
            return of(cacheItem);
        }

        return this.http.get(this.getItemByKeyQuery + key.id).pipe(map((response) => {
            const entity = response as IBasicsConfigRfqReportsEntity;
            this.cache.setItem(entity);
            return entity;
        }));
    }
}