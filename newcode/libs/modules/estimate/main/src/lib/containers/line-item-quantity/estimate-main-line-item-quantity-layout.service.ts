/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import {IEstLineItemQuantityEntity} from '@libs/estimate/interfaces';
import {IBasicsCustomizeQuantityTypeEntity} from '@libs/basics/interfaces';
import {BasicsSharedQuantityTypeLookupService} from '@libs/basics/shared';
import {ProcurementSharePesLookupService} from '@libs/procurement/shared';
import { EstimateMainContextService } from '@libs/estimate/shared';

@Injectable({
    providedIn: 'root'
})

/*
 * Service to generate layout configuration for the Estimate Main LineItem Quantity Container
 */
export class EstimateMainLineItemQuantityLayoutService {
    private readonly estimateMainContextService = inject(EstimateMainContextService);
    private QuantityTypes: IBasicsCustomizeQuantityTypeEntity[] | null = this.estimateMainContextService.QuantityTypes;

    /*
     * Generate layout configuration
     */
    public async generateConfig(): Promise<ILayoutConfiguration<IEstLineItemQuantityEntity>> {
        return {
            'groups': [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Line Item Quantity',
                        key: 'estimate.main.lineItemQuantityContainer'
                    },
                    attributes: ['Quantity',
                        'QuantityTypeFk',
                        'Date',
                        'WipHeaderFk',
                        'PesHeaderFk',
                        'BoqRootRef',
                        'BoqItemFk',
                        'PsdActivitySchedule',
                        'PsdActivityFk',
                        'MdlModelFk',
                        'BilHeaderFk',
                        'Comment']
                },
            ],
            'labels': {
                // Prefix all translation keys for the estimate main module and cloud common module
                ...prefixAllTranslationKeys('estimate.main.', {
                    Quantity: {key: 'Quantity'},
                    QuantityTypeFk: {key: 'QuantityType'},
                    Date: {key: 'Date'},
                    WipHeaderFk: {key: 'WipHeaderFk'},
                    PesHeaderFk: {key: 'PesHeaderFk'},
                    BoqRootRef: {key: 'BoqRootRef'},
                    BoqItemFk: {key: 'BoqItemFk'},
                    PsdActivitySchedule: {key: 'ActivitySchedule'},
                    PsdActivityFk: {key: 'PsdActivityFk'},
                    MdlModelFk: {key: 'EntityModel'},
                    BilHeaderFk: {key: 'BilHeaderFk'},
                    Comment: {key: 'Comment'}
                })
            },
            'overloads': {
                'QuantityTypeFk': {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedQuantityTypeLookupService,
                        // clientSideFilter: {
                        //execute: {
                        // let item = this.QuantityTypes.filter(m => m.Id !== 6)
                        //};
                        //},
                    })
                },
                'WipHeaderFk': {
                    //TODO navigate to sales.wip module
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        // dataServiceToken: SalesWipLookupService,  //TODO add sales wip lookup service
                    })
                },
                'PesHeaderFk': {
                    //TODO navigate to 'procurement.pes' module,
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: ProcurementSharePesLookupService,
                        // clientSideFilter: {
                        //execute: {
                        //TODO getselectedProjectId
                        //return $injector.get('estimateMainService').getSelectedProjectId();
                        //};
                        //},
                    })
                },
                'BoqItemFk': {
                    //TODO navigate to 'sales.wip' module,
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        // dataServiceToken: //TODO add sales wip lookup service
                        // clientSideFilter: {
                        //execute: {
                        //TODO add filter
                        //};
                        //},
                    })
                },
                'BoqHeaderFk': {
                    //TODO navigate to 'sales.wip' module,
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        // dataServiceToken: //TODO add sales wip lookup service
                        // clientSideFilter: {
                        //execute: {
                        //TODO add filter
                        //};
                        //},
                    })
                },
                //'PsdActivitySchedule': {
                /*  //TODO navigate to  'scheduling.main' module
                  type: FieldType.Lookup,
                  lookupOptions: createLookup({
                      //  dataServiceToken: //TODO add activity schedule lookup service,
                      // clientSideFilter: {
                      //execute: {
                      // let item = this.QuantityTypes.filter(m => m.Id !== 6)
                      //};
                      //},
                  })
              },*/
                'PsdActivityFk': {
                    //TODO navigate to  'scheduling.main' module
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        //  dataServiceToken: //TODO add activity lookup service,
                        // clientSideFilter: {
                        //execute: {
                        //};
                        //},
                    })
                },
                'Date': {
                    //TODO add formatter, editor dateutc
                },
                'MdlModelFk': {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        //  dataServiceToken: //TODO modelProjectModelLookupDataService ,
                        // clientSideFilter: {
                        //execute: {
                        // TODO add filter
                        //};
                        //},
                    })
                },
                'BilHeaderFk': {
                    //TODO navigate to  'sales.billing' module
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        //TODO add lookup service here
                        //  dataServiceToken: ,
                        // clientSideFilter: {
                        //execute: {
                        //};
                        //},
                    })
                }
            }
        };
    }
}

