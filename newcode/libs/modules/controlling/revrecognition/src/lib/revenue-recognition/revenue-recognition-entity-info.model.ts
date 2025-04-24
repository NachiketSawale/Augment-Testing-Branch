/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { ControllingRevenueRecognitionLayoutService } from './revenue-recognition-layout.service';
import { ControllingRevenueRecognitionDataService } from './revenue-recognition-data.service';
import { IPrrHeaderEntity } from '../model/entities/prr-header-entity.interface';
import { ControllingRevenueRecognitionValidationService } from './revenue-recognition-validation.service';
import { BasicsSharedPlainTextContainerComponent, IPlainTextAccessor, PLAIN_TEXT_ACCESSOR } from '@libs/basics/shared';


export const REVENUE_RECOGNITION_ENTITY_INFO = EntityInfo.create<IPrrHeaderEntity>({
	dtoSchemeId: {moduleSubModule: 'Controlling.RevRecognition', typeName: 'PrrHeaderDto'},
	permissionUuid: '5167e45d71034697bf9dbd272888f1b0',
	grid: {
		title: {text: 'Revenue Recognition', key: 'controlling.revrecognition.progressReportHeaderListTitle'},
		containerUuid: '5167e45d71034697bf9dbd272888f1b0',
	},
	form: {
		containerUuid: '317ea2cdd36247edad0e5fbc44e433ae',
		title: {text: 'Revenue Recognition Detail', key: 'controlling.revrecognition.progressReportHeaderDetailTitle'},
	},
	validationService: ctx => ctx.injector.get(ControllingRevenueRecognitionValidationService),
	dataService: ctx => ctx.injector.get(ControllingRevenueRecognitionDataService),
	layoutConfiguration: context => {
		return context.injector.get(ControllingRevenueRecognitionLayoutService).generateLayout(context);
	},
	additionalEntityContainers: [
		// remark container
		{
			uuid: '677930C52E4C4B0998E67E7DFF33E870',
			permission: '3c17e18947514d48ab6417ed2d991f63',
			title: 'cloud.common.remark',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IPrrHeaderEntity>>{
						getText(entity: IPrrHeaderEntity): string | undefined {
							return entity.Remark ?? '';
						},
						setText(entity: IPrrHeaderEntity, value?: string) {
							if (value) {
								entity.Remark = value;
							}
						},
					},
				},
			],
		}
	],
});
