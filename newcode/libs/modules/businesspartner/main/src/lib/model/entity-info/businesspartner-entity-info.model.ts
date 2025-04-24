import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerMainHeaderGridBehavior } from '../../behaviors/businesspartner-main-header-grid-behavior.service';
import { BusinesspartnerMainHeaderDataService } from '../../services/businesspartner-data.service';
import { BasicsSharedPlainTextContainerComponent, IPlainTextAccessor, PLAIN_TEXT_ACCESSOR } from '@libs/basics/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { BusinesspartnerCommonNumberGenerationService, MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BusinesspartnerLayoutService } from '../../services/layouts/businesspartner-layout.service';

export const BUSINESS_PARTNER_ENTITY_INFO = EntityInfo.create<IBusinessPartnerEntity>({
    grid: {
        title: {text: 'Business Partners', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.headerGridContainerTitle'},
        behavior: (ctx) => ctx.injector.get(BusinesspartnerMainHeaderGridBehavior),
    },
    form: {
        title: {text: 'Business Partner Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.headerFormContainerTitle'},
        containerUuid: '411d27cfbb0b4643a368b19fa95d1b40'
    },
    dataService: (ctx) => ctx.injector.get(BusinesspartnerMainHeaderDataService),
    // validationService: (ctx) => ctx.injector.get(BusinesspartnerMainHeaderValidationService), // todo chi: after validation is done, uncomment it
    dtoSchemeId: {moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'BusinessPartnerDto'},
    permissionUuid: '75dcd826c28746bf9b8bbbf80a1168e8',
    layoutConfiguration: context => {
        return context.injector.get(BusinesspartnerLayoutService).generateLayout();
    },
    prepareEntityContainer: async ctx => {
        const dataService = ctx.injector.get(BusinesspartnerMainHeaderDataService);
		const numberGenerationService = ctx.injector.get(BusinesspartnerCommonNumberGenerationService);
        await dataService.getAccessRights();
		await dataService.getBpDuplicateCheckEmail();
		await numberGenerationService.assertLoaded('businesspartner');
    },
    additionalEntityContainers: [
        {
            uuid: '39984583e79c449aa1d9c764222233a5',
            permission: '39984583e79c449aa1d9c764222233a5',
            title: 'businesspartner.main.remark1ContainerTitle',
            containerType: BasicsSharedPlainTextContainerComponent,
            providers: [
                {
                    provide: PLAIN_TEXT_ACCESSOR,
                    useValue: <IPlainTextAccessor<IBusinessPartnerEntity>>{
                        getText(entity: IBusinessPartnerEntity): string | undefined | null {
                            return entity.Remark1;
                        },
                        setText(entity: IBusinessPartnerEntity, value?: string) {
                            entity.Remark1 = value;
                        }
                    }
                }
            ]
        },
        {
            uuid: '6c99da89e843470c82be35c7046a5e9a',
            permission: '6c99da89e843470c82be35c7046a5e9a',
            title: 'businesspartner.main.remark2ContainerTitle',
            containerType: BasicsSharedPlainTextContainerComponent,
            providers: [
                {
                    provide: PLAIN_TEXT_ACCESSOR,
                    useValue: <IPlainTextAccessor<IBusinessPartnerEntity>>{
                        getText(entity: IBusinessPartnerEntity): string | undefined | null {
                            return entity.Remark2;
                        },
                        setText(entity: IBusinessPartnerEntity, value?: string) {
                            entity.Remark2 = value;
                        }
                    }
                }
            ]
        },
        {
            uuid: 'd08cf732ad23451aafed4078ca389619',
            permission: 'd08cf732ad23451aafed4078ca389619',
            title: 'businesspartner.main.marketingContainerTitle',
            containerType: BasicsSharedPlainTextContainerComponent,
            providers: [
                {
                    provide: PLAIN_TEXT_ACCESSOR,
                    useValue: <IPlainTextAccessor<IBusinessPartnerEntity>>{
                        getText(entity: IBusinessPartnerEntity): string | undefined | null {
                            return entity.RemarkMarketing;
                        },
                        setText(entity: IBusinessPartnerEntity, value?: string) {
                            entity.RemarkMarketing = value;
                        }
                    }
                }
            ]
        }
    ]
});