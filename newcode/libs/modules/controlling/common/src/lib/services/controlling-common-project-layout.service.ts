import {inject, Injectable, Injector, ProviderToken, runInInjectionContext} from '@angular/core';

import {
    ContextService,
    prefixAllTranslationKeys
} from '@libs/platform/common';

import {
    BasicsCompanyLookupService,
    BasicsSharedCustomizeLookupOverloadProvider
} from '@libs/basics/shared';


import {ILayoutConfiguration} from '@libs/ui/common';

import {ControllingCommonProjectComplete} from '../model/controlling-common-project-main-complete.class';
import {ControllingCommonProjectDataService} from './controlling-common-project-data.service';
import {IControllingCommonProjectEntity} from '../model/entities/controlling-common-project-entity.interface';

@Injectable({
    providedIn: 'root'
})

export class ControllingCommonProjectLayoutService {
    private readonly injector = inject(Injector);
    private readonly contextService = inject(ContextService);
    private readonly lookup = {
        company: inject(BasicsCompanyLookupService)
    };

    /**
     * Generate layout config
     */
    public async generateLayout<T extends IControllingCommonProjectEntity, U extends ControllingCommonProjectComplete>(config: {
        dataServiceToken: ProviderToken<ControllingCommonProjectDataService<T, U>>,
    }): Promise<ILayoutConfiguration<T>> {
        return runInInjectionContext(this.injector, () => {
            return <ILayoutConfiguration<T>>{
                groups: [
                    {
                        'gid': 'baseGroup',
                        'attributes': [
                            'StatusFk',
                            'ProjectNo',
                            'ProjectName',
                            'ProjectName2',
                            'TypeFk',
                            'CalendarFk',
                            'StartDate',
                            'EndDate'
                        ]
                    }
                ],
                labels: {
                    ...prefixAllTranslationKeys('cloud.common.', {
                        'StatusFk': {
                            'key': 'entityStatus',
                            'text': 'Status'
                        },
                        'ProjectName': {
                            'key': 'entityName',
                            'text': 'Name'
                        },
                        'TypeFk': {
                            'key': 'entityType',
                            'text': 'Type'
                        },
                        'StartDate': {
                            'key': 'entityStartDate',
                            'text': 'Start'
                        },
                        'EndDate': {
                            'key': 'entityEndDate',
                            'text': 'Finish'
                        },
                        'CalendarFk': {
                            'key': 'entityCalCalendarFk',
                            'text': 'Calendar (FI)'
                        }
                    }),
                    ...prefixAllTranslationKeys('project.main.', {
                        'ProjectNo': {
                            'key': 'projectNo',
                            'text': 'Number'
                        },
                        'ProjectName2': {
                            'key': 'name2',
                            'text': 'Name 2'
                        }
                    })
                },
                overloads: {
                    'ProjectNo': {
                        'readonly': true
                    },
                    'ProjectName': {
                        'readonly': true
                    },
                    'ProjectName2': {
                        'readonly': true
                    },
                    TypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectTypeReadonlyLookupOverload(),
                    'CalendarFk': {
                        'readonly': true
                    },
                    'StartDate': {
                        'readonly': true
                    },
                    'EndDate': {
                        'readonly': true
                    },
                    'StatusFk':{
                        'readonly': true
                    }
                }
            };
        });
    }
}