/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {IProcurementCommonOverviewEntity} from '../model/entities/procurement-common-overview-entity.interface';
/**
 * MileStone layout service
 */
@Injectable({
    providedIn: 'root',
})
export class ProcurementCommonOverviewLayoutService {
    public async generateConfig<T extends IProcurementCommonOverviewEntity>(): Promise<ILayoutConfiguration<T>> {
        return <ILayoutConfiguration<T>>{
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'Title',
                        'Count'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    Title: {key: 'entityDescription', text: 'Title'},
                    Count: {key: 'entityCount', text: 'Status'}
                })
            },
            overloads: {
	            Title: {
                    'grid':{
                        'formatter': this.TitleFormatter,
                        'name$tr$':'procurement.common.data.reqDataTitle',
                        'width': 200
                    }
                },
                Count: {
                    'grid':{
                        'editor': '',
                        'formatter': this.IconTickFormatter,
                        'name$tr':'procurement.common.data.reqDataStatus',
                        'width': 90
                    }
                }
            }
        };
    }

    public IconTickFormatter(value : number |null){
        const cls = typeof value === 'number' && value > 0 ? 'ico-tick' : '';
        return '<span style="padding-left:16px;width:100%;height: 100%" class="control-icons ' + cls + '"></span>';
    }

    public TitleFormatter(dataContext : IProcurementCommonOverviewEntity) {
        let style = '<div  data-domain-control data-domain="description" data-model="DescriptionInfo.Translated">' + dataContext.Title + '</div>';
        if (dataContext.Count > 0) {
            style = '<div style="font-weight: bold" data-domain-control data-domain="description" data-ng-model="DescriptionInfo.Translated" >' + dataContext.Title + '</div>';
        }
        return style;
    }
}