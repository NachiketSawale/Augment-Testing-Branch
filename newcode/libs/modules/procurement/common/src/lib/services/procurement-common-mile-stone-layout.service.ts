/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
    BasicsSharedTaxCodeLookupService,
    BasicsSharedMilestoneTypeLookupService
} from '@libs/basics/shared';
import {IPrcMilestoneEntity} from '../model/entities/prc-milestone-entity.interface';
/**
 * MileStone layout service
 */
@Injectable({
    providedIn: 'root',
})
export class ProcurementCommonMileStoneLayoutService {
    public async generateConfig<T extends IPrcMilestoneEntity>(): Promise<ILayoutConfiguration<T>> {
        return <ILayoutConfiguration<T>>{
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'PrcMilestonetypeFk',
                        'MdcTaxCodeFk',
                        'Amount',
                        'Milestone',
                        'CommentText'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    PrcMilestonetypeFk: {key: 'entityType', text: 'Type'},
                    MdcTaxCodeFk: {key: 'entityTaxCode', text: 'Tax Code'},
                    Milestone: {key: 'entityDate', text: 'Date'},
                    Amount: {key: 'entityAmount', text: 'Amount'},
                    CommentText: {key: 'entityCommentText', text: 'Comment'},
                })
            },
            overloads: {
                PrcMilestonetypeFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedMilestoneTypeLookupService
                    })
                },
                MdcTaxCodeFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BasicsSharedTaxCodeLookupService,
                        showDescription: true,
                        descriptionMember: 'DescriptionInfo.Translated',
                        showClearButton: true
                    })
                }
            }
        };
    }
}