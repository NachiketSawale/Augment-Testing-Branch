import {Injectable} from '@angular/core';
import {ILayoutConfiguration} from '@libs/ui/common';
import {IEstimateMainCostGroupAssignment} from '../../model/interfaces/estimate-main-cost-group-assignment.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';

@Injectable({ providedIn: 'root' })
export class EstimateMainCostGroupAssignmentLayoutService {
    public  generateLayout(): ILayoutConfiguration<IEstimateMainCostGroupAssignment>{
        return {
            'groups': [
                {
                    'gid': 'basicData',
                    'title': {
                        'key': 'cloud.common.entityProperties',
                        'text': 'Basic Data'
                    },
                    'attributes': [
                        'Costgroup',
                        'Costgroup_Desc',
                        'Code',
                        'DescriptionInfo'
                    ]
                }
            ],
            'labels': {
                ...prefixAllTranslationKeys('estimate.main.', {
                    'Code': {
                        'key': 'code',
                        'text': 'Code'
                    },
                    'DescriptionInfo': {
                        'key': 'DescriptionInfo',
                        'text': 'DescriptionInfo'
                    },
                    'Costgroup': {
                        'key': 'costGroupCatalogCode',
                        'text': 'costGroupCatalogCode'
                    },
                    'Costgroup_Desc': {
                        'key': 'costGroupCatalogDesc',
                        'text': 'costGroupCatalogDesc'
                    },
                }),

            },
            'overloads': {

            }
        };
    }

}