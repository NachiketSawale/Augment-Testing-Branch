/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainObjectSetDataService } from '../services/model-main-object-set-data.service';
import { IObjectSetEntity } from './entities/object-set-entity.interface';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider,BasicUserFormLookupService, IUserformEntity } from '@libs/basics/shared';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
export const MODEL_MAIN_OBJECT_SET_ENTITY_INFO: EntityInfo = EntityInfo.create<IObjectSetEntity>({
    grid: {
        title: { key: 'model.main.objectSet.listTitle' },
        //   behavior: ctx => ctx.injector.get(ModelMainObjectSetBehavior),
    },
    form: {
        title: { key: 'model.main.objectSet.detailTitle' },
        containerUuid: 'afc330272d704407856af51fc68f62c1',
    },
    dataService: ctx => ctx.injector.get(ModelMainObjectSetDataService),
    dtoSchemeId: { moduleSubModule: 'Model.Main', typeName: 'ObjectSetDto' },
    permissionUuid: 'a358f29d65c74a0f955ed5c1a1a57651',
    layoutConfiguration: async ctx => {
        const [
            pjLookupProvider,
            bpRelatedLookupProvider
        ] = await Promise.all([
            ctx.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN),
            ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN)
        ]);
        return <ILayoutConfiguration<IObjectSetEntity>>{
            groups: [
                {
                    gid: 'baseGroup',
                    attributes: ['ProjectFk', 'Name', 'DueDate', 'ObjectSetStatusFk', 'ObjectSetTypeFk', 'Remark', 'ClerkFk', 'BusinessPartnerFk', 'ReportFk', 'FormFk'/* , 'workflowtemplatefk' */]
                },
            ],
            overloads: {
                ProjectFk: {
                    ...pjLookupProvider.generateProjectLookup(),
                    readonly: true
                },
                BusinessPartnerFk: {
                  ...bpRelatedLookupProvider.getBusinessPartnerLookupOverload(),
                  readonly: true
                },
                ClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
                FormFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup<IObjectSetEntity, IUserformEntity>({
                        dataServiceToken: BasicUserFormLookupService,
                        showClearButton: true,
                        valueMember: 'Id',
                        displayMember: 'DescriptionInfo.Description',
                    }),
                },
                //todo ReportFk: {
                // 	type: FieldType.Lookup,
                // 	lookupOptions: createLookup({dataServiceToken: mainModelReportingLookupService})
                // }
                //todo ObjectSetStatusFk
                // ObjectSetStatusFk: {
                // 	readonly: true,
                // },
                ObjectSetTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelObjectSetTypeLookupOverload(true)

            },
            labels: {
                ...prefixAllTranslationKeys('model.main.objectSet.', {
                    DueDate: { key: 'dueDate' },
                    ObjectSetStatusFk: { key: 'objectSetStatus' },
                    ObjectSetTypeFk: { key: 'objectSetType' },
                    Remark: { key: 'remark' },
                    ClerkFk: { key: 'clerk' },
                    BusinessPartnerFk: { key: 'businessPartner' },
                    ReportFk: { key: 'report' },
                    FormFk: { key: 'form' }
                })
            }
        };
    }
});