/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerEntity, ISubsidiaryEntity } from '@libs/businesspartner/interfaces';
import {
	DISCARD_DUPLICATE_DIALOG_DATA_TOKEN,
	DiscardDuplicateDialogExecutionType,
	IDiscardDuplicateDialogCustomOptions,
	IDiscardDuplicateDialogData,
	IDiscardDuplicateDialogResult
} from '../../model/discard-duplicate-dialog/discard-duplicate-dialog-data.model';
import { BusinesspartnerMainDiscardDuplicateDialogComponent } from '../../components/discard-duplicate-dialog/discard-duplicate-dialog.component';
import { ICustomDialogOptions, IEditorDialogResult, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';

export interface IDiscardDuplicateDialogEntity {
	Id: number;
	BusinessPartnerName1: string;
	BusinessPartnerName2: string;
	SubsidiaryDescriptor: ISubsidiaryEntity;
	Email: string;
}

export class DiscardDuplicateDialogService {
	private readonly translateService = ServiceLocator.injector.get(PlatformTranslateService);
	private readonly dialogService = ServiceLocator.injector.get(UiCommonDialogService);

	public showDialog(duplicateBps: IBusinessPartnerEntity[], model: string, sourceItemToCompare: IBusinessPartnerEntity, customOptions?: IDiscardDuplicateDialogCustomOptions): Promise<IEditorDialogResult<IDiscardDuplicateDialogResult>> | undefined {
		let headerText: string = '';
		switch (model) {
			case 'TelephoneNumber1Dto':
			case 'SubsidiaryDescriptor.TelephoneNumber1Dto':
				headerText = 'businesspartner.main.dialog.discardDuplicateTelephoneTitle';
				break;
			case 'TelephoneNumberTelefaxDto':
			case 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto':
				headerText = 'businesspartner.main.dialog.discardDuplicateTaxTitle';
				break;
			default:
				headerText = 'businesspartner.main.dialog.discardDuplicateBusinessPartnerTitle';
		}

		let data: IDiscardDuplicateDialogData = {
			duplicateBps: duplicateBps,
			model: model,
			sourceItemToCompare: sourceItemToCompare,
			showPage: false
		};

		if (customOptions) {
			data = {
				...data,
				...customOptions
			};
		}

		const modelOptions: ICustomDialogOptions<IDiscardDuplicateDialogResult, BusinesspartnerMainDiscardDuplicateDialogComponent> = {
			headerText: this.translateService.instant(headerText),
			width: '50%',
			buttons: [
				{
					id: 'discardAndDisplay',
					caption: 'businesspartner.main.dialog.btn.displayAndDiscard',
					fn(evt, info) {
						info.dialog.value = {
							executionType: DiscardDuplicateDialogExecutionType.discardAndDisplay,
							displayEntities: info.dialog.body.getSelections()
						};
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{
					id: 'ignore',
					caption: 'businesspartner.main.dialog.btn.ignore',
					fn(evt, info) {
						info.dialog.value = {
							executionType: DiscardDuplicateDialogExecutionType.ignore
						};
						info.dialog.close(StandardDialogButtonId.Cancel);
					},
				}
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: BusinesspartnerMainDiscardDuplicateDialogComponent,
			bodyProviders: [
				{
					provide: DISCARD_DUPLICATE_DIALOG_DATA_TOKEN,
					useValue: data
				}
			]
		};

		return this.dialogService.show(modelOptions);
	}
}