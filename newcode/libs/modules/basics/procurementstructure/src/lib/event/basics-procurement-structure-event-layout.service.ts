/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
    createLookup,
    FieldOverloadSpec,
    FieldType,
    ILayoutConfiguration, ILookupContext,
    UiCommonLookupDataFactoryService,
    LookupSimpleEntity
} from '@libs/ui/common';
import {BasicsSharedLookupOverloadProvider, BasicsSharedProcurementStructureEventTypeLookupService} from '@libs/basics/shared';
import { IPrcStructureEventEntity } from '../model/entities/prc-structure-event-entity.interface';


/**
 * Procurement structure event layout service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementStructureEventLayoutService {

    private lookupFactory = inject(UiCommonLookupDataFactoryService);

    /**
     * Generate layout config
     */
    public async generateLayout(): Promise<ILayoutConfiguration<IPrcStructureEventEntity>> {

        const eventTypeOverLoads: FieldOverloadSpec<IPrcStructureEventEntity> = {
            type: FieldType.Lookup,
            lookupOptions: createLookup({
                dataServiceToken: BasicsSharedProcurementStructureEventTypeLookupService,
                showClearButton: true
            })
        };

        const eventOptionOverLoads: FieldOverloadSpec<IPrcStructureEventEntity> = {
            type: FieldType.Lookup,
            lookupOptions: createLookup({
                dataService: this.lookupFactory.fromSimpleItemClass([{
                        id: 1,
                        desc: {
                            text: 'Supplier Lead Time',
                            key: 'basics.procurementstructure.event.supplierLeadTime'
                        }
                    }, {
                        id: 2,
                        desc: {
                            text: 'Supplier lead Time + Safety Lead Time',
                            key: 'basics.procurementstructure.event.supplierAndSafetyLeadTime'
                        }
                    }, {
                        id: 3,
                        desc: {
                            text: 'Buffer Lead Time + Supplier Lead Time + Safety Lead Time',
                            key: 'basics.procurementstructure.event.prcAndSupplierAndSafetyLeadTime'
                        }
                    }, {
                        id: 4,
                        desc: {
                            text: 'Buffer Lead Time',
                            key: 'basics.procurementstructure.event.prcLeadTime'
                        }
                    }, {
                        id: 5,
                        desc: {
                            text: 'Safety Lead Time',
                            key: 'basics.procurementstructure.event.safetyLeadTime'
                        }
                    }], {
                        uuid: '',
                        valueMember: 'id',
                        displayMember: 'desc',
                        translateDisplayMember: true
                    }
                ),
                showClearButton: true
            })
        };

        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'Sorting',
                        'PrcEventTypeFk',
                        'StartNoOfDays',
                        'StartBasis',
                        'EndNoOfDays',
                        'EndBasis',
                        'PrcSystemEventTypeStartFk',
                        'PrcEventTypeStartFk',
                        'PrcSystemEventTypeEndFk',
                        'PrcEventTypeEndFk',
                        'AddLeadTimeToStart',
                        'AddLeadTimeToEnd',
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('basics.procurementstructure.', {
                    'Sorting': {
                        text: 'Sorting',
                        key: 'eventSorting'
                    },
                    'PrcEventTypeFk': {
                        text: 'Event Type',
                        key: 'eventType'
                    },
                    'StartNoOfDays': {
                        text: 'Start No. Of Days',
                        key: 'startNoOfDays'
                    },
                    'StartBasis': {
                        text: 'Start Basis',
                        key: 'startBasis'
                    },
                    'EndNoOfDays': {
                        text: 'End No. Of Days',
                        key: 'endNoOfDays'
                    },
                    'EndBasis': {
                        text: 'End Basis',
                        key: 'endBasis'
                    },
                    'PrcSystemEventTypeStartFk': {
                        text: 'System Event Type Start',
                        key: 'systemEventTypeStart'
                    },
                    'PrcEventTypeStartFk': {
                        text: 'Event Type Start',
                        key: 'eventTypeStart'
                    },
                    'PrcSystemEventTypeEndFk': {
                        text: 'System Event Type End',
                        key: 'systemEventTypeEnd'
                    },
                    'PrcEventTypeEndFk': {
                        text: 'Event Type End',
                        key: 'eventTypeEnd'
                    },
                    'AddLeadTimeToStart': {
                        text: 'Include Lead Time To Start',
                        key: 'addLeadTimeToStart'
                    },
                    'AddLeadTimeToEnd': {
                        text: 'Include Lead Time To End',
                        key: 'addLeadTimeToEnd'
                    }
                }),
            },
            overloads: {
                PrcEventTypeFk: BasicsSharedLookupOverloadProvider.providePrcEventTypeLookupOverload(),
                StartBasis: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataService: this.lookupFactory.fromSimpleItemClass([
                            {
                                id: 1,
                                desc: {
                                    text: 'No start date',
                                    key: 'basics.procurementstructure.noStartDate'
                                }
                            }, {
                                id: 2,
                                desc: {
                                    text: 'Before event end',
                                    key: 'basics.procurementstructure.beforeEventEnd'
                                }
                            }, {
                                id: 3,
                                desc: {
                                    text: 'Before system event',
                                    key: 'basics.procurementstructure.beforeSystemEvent'
                                }
                            }, {
                                id: 4,
                                desc: {
                                    text: 'After system event',
                                    key: 'basics.procurementstructure.afterSystemEvent'
                                }
                            }, {
                                id: 5,
                                desc: {
                                    text: 'Before custom event start',
                                    key: 'basics.procurementstructure.beforeCustomEventStart'
                                }
                            }, {
                                id: 6,
                                desc: {
                                    text: 'Before custom event end',
                                    key: 'basics.procurementstructure.beforeCustomEventEnd'
                                }
                            }, {
                                id: 7,
                                desc: {
                                    text: 'After custom event start',
                                    key: 'basics.procurementstructure.afterCustomEventStart'
                                }
                            }, {
                                id: 8,
                                desc: {
                                    text: 'After custom event end',
                                    key: 'basics.procurementstructure.afterCustomEventEnd'
                                }
                            }
                        ], {
                            uuid: '',
                            valueMember: 'id',
                            displayMember: 'desc',
                            translateDisplayMember: true,
                            clientSideFilter: {
                                execute(item: LookupSimpleEntity, context: ILookupContext<LookupSimpleEntity, IPrcStructureEventEntity>): boolean {
                                    if (context.entity?.EndBasis === 2) {
                                        return item.id !== 2;
                                    }
                                    return true;
                                }
                            }
                        })
                    })
                },
                EndBasis: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataService: this.lookupFactory.fromSimpleItemClass([{
                            id: 1,
                            desc: {
                                text: 'No end date',
                                key: 'basics.procurementstructure.noEndDate'
                            }
                        }, {
                            id: 2,
                            desc: {
                                text: 'After event start',
                                key: 'basics.procurementstructure.afterEventStart'
                            }
                        }, {
                            id: 3,
                            desc: {
                                text: 'Before system event',
                                key: 'basics.procurementstructure.beforeSystemEvent'
                            }
                        }, {
                            id: 4,
                            desc: {
                                text: 'After system event',
                                key: 'basics.procurementstructure.afterSystemEvent'
                            }
                        }, {
                            id: 5,
                            desc: {
                                text: 'Before custom event start',
                                key: 'basics.procurementstructure.beforeCustomEventStart'
                            }
                        }, {
                            id: 6,
                            desc: {
                                text: 'Before custom event end',
                                key: 'basics.procurementstructure.beforeCustomEventEnd'
                            }
                        }, {
                            id: 7,
                            desc: {
                                text: 'After custom event start',
                                key: 'basics.procurementstructure.afterCustomEventStart'
                            }
                        }, {
                            id: 8,
                            desc: {
                                text: 'After custom event end',
                                key: 'basics.procurementstructure.afterCustomEventEnd'
                            }
                        }], {
                            uuid: '',
                            valueMember: 'id',
                            displayMember: 'desc',
                            translateDisplayMember: true,
                            clientSideFilter: {
                                execute(item: LookupSimpleEntity, context: ILookupContext<LookupSimpleEntity, IPrcStructureEventEntity>): boolean {
                                    if (context.entity?.StartBasis === 2) {
                                        return item.id !== 2;
                                    }
                                    return true;
                                }
                            }
                        })
                    })
                },
                PrcEventTypeStartFk: eventTypeOverLoads,
                PrcSystemEventTypeStartFk: eventTypeOverLoads,
                PrcEventTypeEndFk: eventTypeOverLoads,
                PrcSystemEventTypeEndFk: eventTypeOverLoads,
                AddLeadTimeToStart: eventOptionOverLoads,
                AddLeadTimeToEnd: eventOptionOverLoads
            }
        };
    }
}