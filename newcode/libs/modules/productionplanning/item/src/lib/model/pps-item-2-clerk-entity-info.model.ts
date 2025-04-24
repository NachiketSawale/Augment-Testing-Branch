import {PlatformTranslateService, prefixAllTranslationKeys} from '@libs/platform/common';
import {EntityInfo} from '@libs/ui/business-base';
import {createLookup, FieldType, UiCommonLookupDataFactoryService} from '@libs/ui/common';
import {IPPSItem2ClerkEntity} from './entities/pps-item-2clerk-entity.interface';
import {PpsItem2ClerkDataService} from '../services/pps-item-2-clerk-data.service';
import {PpsItem2ClerkValidationDataService} from '../services/pps-item-2-clerk-validation-data.service';
import {BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider} from '@libs/basics/shared';

export const PPS_ITEM_TO_CLERK_ENTITY_INFO = EntityInfo.create<IPPSItem2ClerkEntity>({
    grid: {
        containerUuid: '1c7766b319f74459994d1885a56fdc3e',
        title: {text: 'productionplanning.item.clerkListTitle'}
    },
    permissionUuid: '0552ba86fc1e4d559ef93c2a10e0696b',
    dataService: ctx => ctx.injector.get(PpsItem2ClerkDataService),
    dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Item', typeName: 'PPSItem2ClerkDto'},
    validationService: context => context.injector.get(PpsItem2ClerkValidationDataService),
    layoutConfiguration: context => {
        const lookupServiceFactory = context.injector.get(UiCommonLookupDataFactoryService);
        const translateService = context.injector.get(PlatformTranslateService);

        const fromItems = [
            { id: '', description: '' },
            { id: 'PRJ', description: translateService.instant('project.main.sourceProject').text },
            { id: 'HEADERR', description: translateService.instant('productionplanning.common.header.headerTitle').text },
            { id: 'ORDHEADER', description: translateService.instant('productionplanning.common.ordHeaderFk').text },
            { id: 'ENGTASK', description: translateService.instant('productionplanning.engineering.entityEngTask').text }
        ];

        return {
            groups: [
                {
                    gid: 'basicData',
                    attributes: ['ClerkRoleFk', 'ClerkFk', 'ValidFrom', 'ValidTo', 'CommentText', 'From']
                },
            ],
            overloads: {
                ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true),
                ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
                From: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataService: lookupServiceFactory.fromItems(fromItems, {
                            uuid: '',
                            idProperty: 'id',
                            valueMember: 'id',
                            displayMember: 'description'
                        })
                    })
                },
            },
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    basicData: { key: 'entityProperties' },
                    CommentText: { key: 'entityComment' },
                }),
                ...prefixAllTranslationKeys('basics.common.', {
                    ClerkRoleFk: { key: 'entityClerkRole' },
                    ClerkFk: { key: 'entityClerk' },
                    ValidFrom: { key: 'entityValidFrom' },
                    ValidTo: { key: 'entityValidTo' },
                }),
                ...prefixAllTranslationKeys('productionplanning.common.', {
                    From: { key: 'from' },
                }),
            },
        };
    },
});