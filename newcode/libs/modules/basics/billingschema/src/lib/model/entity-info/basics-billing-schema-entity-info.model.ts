/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsBillingSchemaDataService } from '../../services/basics-billing-schema-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedPlainTextContainerComponent, IBillingSchemaEntity, IPlainTextAccessor, PLAIN_TEXT_ACCESSOR } from '@libs/basics/shared';

/**
 * Entity info for basics billing schema
 */
export const BASICS_BILLING_SCHEMA_ENTITY_INFO: EntityInfo = EntityInfo.create<IBillingSchemaEntity> ({
    grid: {
        title: {key: 'basics.billingschema.billingSchemaListContainerTitle'}
    },
    form: {
        title: { key: 'basics.billingschema.billingSchemaDetailContainerTitle' },
        containerUuid: '5D010AE2CB5E4C96BC77DA8044069022',
    },
    dataService: ctx => ctx.injector.get(BasicsBillingSchemaDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.BillingSchema', typeName: 'BillingSchemaDto'},
    permissionUuid: '0DE5C7C7D34D45A7A0EB39172FBD3796',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    text: 'Basic Data',
                    key: 'cloud.common.entityProperties'
                },
                attributes: [
                    'Sorting', 
                    'DescriptionInfo',
                    'ValidFrom',
                    'ValidTo',
                    'IsDefault',
                    'IsChained',
                    'IsChainedPes',
                    'AutoCorrectNetLimit',
                    'AutoCorrectVatLimit',
                    'InvStatusOkFk',
                    'InvStatusErrorFk',
                    'BilStatusOkFk',
                    'BilStatusErrorFk'
                ] 
            },
            { 
                gid:'User-Defined Texts', 
                attributes:['UserDefined1','UserDefined2','UserDefined3']
            }
        ],
        overloads: {
            //InvStatusOkFk: //TODO: Invoice sttaus lookup
            //InvStatusErrorFk: //TODO: Invoice sttaus lookup
            BilStatusOkFk: BasicsSharedCustomizeLookupOverloadProvider.provideBillStatusLookupOverload(false),
            BilStatusErrorFk: BasicsSharedCustomizeLookupOverloadProvider.provideBillStatusLookupOverload(false),
        },
        labels: {
            ...prefixAllTranslationKeys('cloud.common.', {
                DescriptionInfo: {key: 'entityDescription'},
                UserDefined1: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 1',
                    params: {'p_0': '1'}
                },
                UserDefined2: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 2',
                    params: {'p_0': '2'}
                },
                UserDefined3: {
                    key: 'entityUserDefined',
                    text: 'User-Defined 3',
                    params: {'p_0': '3'}
                },
           }),
            ...prefixAllTranslationKeys('basics.billingschema.', {
                Sorting: { key: 'entitySorting' },
                ValidFrom: { key: 'entityValidFrom' },
                ValidTo: { key: 'entityValidTo' },
                IsDefault: { key: 'entityIsDefault' },
                IsChained: { key: 'entityIsChained' },
                IsChainedPes: { key: 'entityIsChainedPes' },
                AutoCorrectNetLimit: { key: 'autoCorrectNetLimit' },
                AutoCorrectVatLimit: { key: 'autoCorrectVatLimit' },
                InvStatusOkFk: { key: 'invStatusOkFk' },
                InvStatusErrorFk: { key: 'invStatusErrorFk' },
                BilStatusOkFk: { key: 'bilStatusOkFk' },
                BilStatusErrorFk: { key: 'bilStatusErrorFk' },
            })  
        },
    },
    additionalEntityContainers: [
		// remark container
		{
			uuid: 'ccea3f4f554c4892b4de13f702dcc47d',
			permission: 'ccea3f4f554c4892b4de13f702dcc47d',
			title: 'basics.billingschema.entityRemark',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IBillingSchemaEntity>>{
						getText(entity: IBillingSchemaEntity): string | undefined {
							return entity.Remark ?? '';
						},
						setText(entity: IBillingSchemaEntity, value?: string) {
							if (value) {
								entity.Remark = value;
							}
						},
					},
				},
			],
		},
	],
        
});