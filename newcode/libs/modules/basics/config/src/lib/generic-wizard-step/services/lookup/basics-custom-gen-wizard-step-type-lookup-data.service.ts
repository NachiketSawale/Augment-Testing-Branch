/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IGenericWizardStepLookupEntity } from '../../model/entities/generic-wizard-step-lookup-entity.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * Lookup service for basics custom generic wizard step
 */
export class BasicsCustomGenWizardStepTypeLookupDataService<T extends object = object> extends UiCommonLookupEndpointDataService<IGenericWizardStepLookupEntity, T> {

    public constructor() {
        super({
            httpRead: { route: 'basics/customize/genericwizardsteptype/', endPointRead: 'list', usePostForRead: true }
        }, {
            uuid: '491f222aa83144f790395a1f347fbdb0',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated',
            gridConfig: {
                columns: [
                    {
                        id: 'DescriptionInfo',
                        model: 'DescriptionInfo.Translated',
                        type: FieldType.Translation,
                        label: { text: 'DescriptionInfo' },
                        width: 300,
                        sortable: true,
                        visible: true,
                        readonly: true
                    }
                ]
            }
        });
    }
}
