import {inject, InjectionToken} from '@angular/core';
import {PlatformTranslateService} from '@libs/platform/common';
import {ISelectItem} from '@libs/ui/common';

export const IMORTER_KINDS_TOKEN = new InjectionToken<ISelectItem<number>[]>('Importer Kinds', {
    providedIn: 'root',
    factory: () => [{
        id: 0,
        displayName: inject(PlatformTranslateService).instant('productionplanning.cadimportconfig.importerKinds.autoDetect').text
    }, {
        id: 1,
        displayName: inject(PlatformTranslateService).instant('productionplanning.cadimportconfig.importerKinds.kst').text
    }, {
        id: 2,
        displayName: inject(PlatformTranslateService).instant('productionplanning.cadimportconfig.importerKinds.xAds').text
    }, {
        id: 3,
        displayName: inject(PlatformTranslateService).instant('productionplanning.cadimportconfig.importerKinds.uniOnly').text
    }, {
        id: 4,
        displayName: inject(PlatformTranslateService).instant('productionplanning.cadimportconfig.importerKinds.csv').text
    }]
});