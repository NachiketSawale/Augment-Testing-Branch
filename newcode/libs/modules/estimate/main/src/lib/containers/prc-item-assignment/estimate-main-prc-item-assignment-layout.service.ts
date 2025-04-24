import {inject, Injectable} from '@angular/core';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import {PlatformLazyInjectorService, prefixAllTranslationKeys} from '@libs/platform/common';
import {BasicsSharedPackageStatusLookupService} from '@libs/basics/shared';
import {ProcurementPackageLookupService} from '@libs/procurement/shared';
import { IEstimateMainPrcItemAssignmentEntity } from '@libs/estimate/shared';
import { ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';


@Injectable({
    providedIn: 'root'
})
export class EstimateMainPrcItemAssignmentLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
    public async generateLayout(): Promise<ILayoutConfiguration<IEstimateMainPrcItemAssignmentEntity>> {

        const estimateLineItemProvider = await this.lazyInjector.inject(ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN);

        return {
            'groups': [
                {
                    'gid': 'basicData',
                    'title': {
                        'key': 'estimate.main.itemAssignment',
                        'text': 'Basic Data'
                    },
                    'attributes': [
                        'EstLineItemFk',
                        'EstResourceFk',
                        'PrcItemFk',
                        'BoqHeaderReference',
                        'BoqItemFk',
                        'IsContracted',
                        'PrcPackageFk',
                        'PackageStatusFk'
                    ]
                }
            ],
            'labels': {
                ...prefixAllTranslationKeys('estimate.main.', {
                    'EstLineItemFk': {
                        'key': 'estLineItemFk',
                        'text': 'Line Item Ref.'
                    },
                    'EstResourceFk': {
                        'key': 'estResourceFk',
                        'text': 'Est Resource'
                    },
                    'PrcItemFk': {
                        'key': 'prcItemFk',
                        'text': 'Item No'
                    },
                    'BoqHeaderReference': {
                        'key': 'boqRootRefPrc',
                        'text': 'BoQ Root Item Ref. No'
                    },
                    'BoqItemFk': {
                        'key': 'boqItemFk',
                        'text': 'BoqItem'
                    },
                    'IsContracted': {
                        'key': 'isContracted',
                        'text': 'Is Contracted'
                    },
                    'PrcPackageFk': {
                        'key': 'prcPackageFk',
                        'text': 'PrcPackage'
                    },
                    'PackageStatusFk': {
                        'key': 'packageStatusFk',
                        'text': 'Status'
                    }
                })

            },
            'overloads': {
                'EstLineItemFk': estimateLineItemProvider.GenerateEstimateLineItemLookup(),
                'EstResourceFk':{
                    //TODO: waiting for estimate-main-est-line-item-lookup-dialog
                },
                'PrcItemFk':{
                    //TODO: waiting for lookup dialog
                    readonly:true
                },
                'IsContracted':{
                  readonly:true
                },
                'BoqHeaderReference':{
                    readonly:true
                },
                'PrcPackageFk':{
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: ProcurementPackageLookupService,
                        showDescription: true,
                        descriptionMember: 'Description'
                    })
                },
                'PackageStatusFk':{
                    type: FieldType.Lookup,
                    readonly:true,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedPackageStatusLookupService,
                        displayMember: 'DescriptionInfo.Translated'
                    })
                }
            }
        };
    }
}