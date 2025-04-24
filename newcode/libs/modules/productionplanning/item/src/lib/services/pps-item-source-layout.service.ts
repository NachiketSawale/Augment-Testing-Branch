import {Injectable} from '@angular/core';
import {ILayoutConfiguration} from '@libs/ui/common';
import {IPpsItemSourceEntity} from '../model/entities/pps-item-source-entity.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';

@Injectable({
    providedIn: 'root',
})
export class PpsItemSourceLayoutService {
    public generate(): ILayoutConfiguration<IPpsItemSourceEntity> {
        return {
            groups: [{
                gid: 'baseGroup',
                attributes: ['OrdHeaderFk', 'BoqItemFk', 'PpsEventSeqConfigFk', 'EstHeaderFk',
                    'EstLineItemFk', 'EstResourceFk', 'PpsPlannedQuantityFk']
            }],
            labels: {
                ...prefixAllTranslationKeys('productionplanning.item.', {
                    BoqHeaderFk: '',
                    PpsEventSeqConfigFk: 'PpsEventSeqConfigFk',
                    EstHeaderFk: 'source.estHeader',
                    EstLineItemFk: 'source.estLineItem',
                    EstResourceFk: 'source.estResource',
                    PpsPlannedQuantityFk: 'source.PpsPlannedQuantityFk',
                }),
                OrdHeaderFk: {key: 'productionplanning.common.ordHeaderFk', text: '*Boq Item'},
                BoqItemFk: {key: 'estimate.main.boqItemFk', text: '*Boq Item'},
            },
            overloads: {},
        };
    }
}
