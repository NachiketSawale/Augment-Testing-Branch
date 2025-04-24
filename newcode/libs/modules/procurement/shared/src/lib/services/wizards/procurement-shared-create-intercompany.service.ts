/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ProcurementSharedCreateIntercompanyComponent } from '../../components/create-intercompany/procurement-shared-create-intercompany.component';
import { IInterCompanyFormData, IInterCompanyServiceOptions, INTER_COMPANY_REQUEST_TOKEN } from '../../model/interfaces/wizard/procurement-shared-create-intercompany.interface';


export abstract class ProcurementSharedCreateIntercompanyService {
	protected readonly dialogService = inject(UiCommonDialogService);
	protected readonly translateService = inject(PlatformTranslateService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	protected constructor(protected readonly options: IInterCompanyServiceOptions) {
	}

	/**
	 * Starts the intercompany creation wizard by fetching initialization data and displaying a dialog.
	 */
	public async onStartWizard() {
		const {translateSource, contextUrlSuffix} = this.options;
		const uiEntity = await this.httpService.get<IInterCompanyFormData>(`${contextUrlSuffix}initialize`);
		const dialogResult = await this.dialogService.show({
			width: '870px',
			headerText: `${translateSource}title`,
			resizeable: true,
			id: 'a566464f5f264f4abd27c83523b72896',
			showCloseButton: true,
			bodyComponent: ProcurementSharedCreateIntercompanyComponent,
			bodyProviders: [{provide: INTER_COMPANY_REQUEST_TOKEN, useValue: {uiEntity, serviceConfig: this.options}}],
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: {key: 'ui.common.dialog.okBtn'},
					fn(evt, info) {
						info.dialog.body.onOKBtnClicked();
						return undefined;
					},
					isDisabled: (info) => info.dialog.body.okBtnDisabled(),
				},
				{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}},
			],
		});
		if (dialogResult?.closingButtonId === StandardDialogButtonId.Ok) {
			const params = {
				...uiEntity,
				IcCompanyDic: undefined,
				SelectIcCompanyItems: uiEntity.SelectIcCompanyItems.filter((i) => i.Selected),
			};
			const result = await this.httpService.post<string>(`${contextUrlSuffix}create`, params,{ responseType: 'text' as 'json' });
			if (result) {
				await this.messageBoxService.showInfoBox(this.translateService.instant(translateSource + 'interCompanyCreated').text + result, 'info', false);
			}
		}
	}
}
