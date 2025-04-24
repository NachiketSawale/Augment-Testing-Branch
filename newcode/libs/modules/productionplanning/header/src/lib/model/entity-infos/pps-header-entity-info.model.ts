/*
* Copyright(c) RIB Software GmbH
*/
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedPlainTextContainerComponent, IPlainTextAccessor, PLAIN_TEXT_ACCESSOR } from '@libs/basics/shared';
import { IPpsHeaderEntity, PpsHeaderLayoutService, PpsHeaderGridBehavior } from '@libs/productionplanning/shared';
import { PpsHeaderDataService } from '../../services/pps-header-data.service';
import { PpsHeaderValidationService } from '../../services/pps-header-validation.service';

export const PPS_HEADER_ENTITY_INFO = EntityInfo.create<IPpsHeaderEntity>({
	grid: {
		title: { text: '*Production Planning', key: 'productionplanning.header.headerListTitle' },
		behavior: ctx => ctx.injector.get(PpsHeaderGridBehavior)
	},
	form: {
		title: { text: '*PPS Header Details', key: 'productionplanning.header.headerDetailTitle' },
		containerUuid: 'b3eb27dc5c954de8bdcaea19df99e3ba',
	},
	dataService: (ctx) => ctx.injector.get(PpsHeaderDataService),
	validationService: (ctx) => ctx.injector.get(PpsHeaderValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Header', typeName: 'HeaderDto' },
	permissionUuid: 'c3edae3d673443b7badc9eee399ae880',
	layoutConfiguration: async context => {
		return context.injector.get(PpsHeaderLayoutService).generateLayout(context);
	},
	additionalEntityContainers: [
		{
			uuid: '1815e614d75f46ef80d2fbdab3bd4ef0',
			permission: 'ca4314096bea4206a6423df7b0864c7a',
			title: 'logistic.job.deliveryAddressRemark',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IPpsHeaderEntity>>{
						getText(entity: IPpsHeaderEntity): string | undefined | null {
							return entity.DeliveryAddressRemark;
						},
						setText(entity: IPpsHeaderEntity, value?: string) {
							entity.DeliveryAddressRemark = value;
						}
					}
				}
			]
		},
	],
});
