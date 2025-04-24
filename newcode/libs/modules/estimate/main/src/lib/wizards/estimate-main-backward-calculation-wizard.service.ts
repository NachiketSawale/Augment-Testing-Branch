import { inject, Injectable, InjectionToken } from '@angular/core';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonFormDialogService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BackwardCalculationDialogComponent } from '../components/wizards/backward-calculation/backward-calculation-dialog/backward-calculation-dialog.component';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { filter } from 'lodash';
import { IBackwarkCalculationConfiguration, IConfigEntity } from '@libs/estimate/interfaces';

export const BACKWARD_CALCULATION_CONFIGURATION_TOKEN = new InjectionToken<IBackwarkCalculationConfiguration>('BACKWARD_CALCULATION_CONFIGURATION_TOKEN');

@Injectable({ providedIn: 'root' })
export class EstimateMainBackwardCalculationWizardService {
	private readonly http = inject(HttpClient);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly formDialogService = inject(UiCommonFormDialogService);

	public async showBackwardWizardDialog() {
		const dialogOption: ICustomDialogOptions<IBackwarkCalculationConfiguration, BackwardCalculationDialogComponent> = {
			headerText: this.translateService.instant({ key: 'estimate.main.backwardCalculation.title' }),
			minWidth: '600px',
			width: '940px',
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn: (evt, info) => {
						this.execute(info.dialog.body.entity, info.dialog.body.items);
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					fn: (evt, info) => {
						info.dialog.close(StandardDialogButtonId.Cancel);
					},
				},
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: BackwardCalculationDialogComponent,
			bodyProviders: [{ provide: BACKWARD_CALCULATION_CONFIGURATION_TOKEN, useValue: this.getInitEntity() }],
		};
		await this.modalDialogService.show(dialogOption);
	}

	private getInitEntity(): IBackwarkCalculationConfiguration {
		// todo: standard allowance container not finished
		const actStandardAllowance: { id: number; desc: string } = {
			id: 2,
			desc: 'test',
		}; //get default standard allowance.

		return {
			SelLineItemScope: {
				FixedPriceLineItems: true,
				LineItemsAllowance: true,
				LineItemsMarkup: true
			},
			ActStandardAllowanceFk: actStandardAllowance.id,
			ActStandardAllowance: actStandardAllowance,
			KeepFixedPrice: false
		};
	}

	private execute(entity: IBackwarkCalculationConfiguration, list: IConfigEntity[]) {
		const projectId = this.estimateMainContextService.getProjectId();
		const estHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId();
		const postData = {
			ProjectId: projectId,
			EstHeaderFk: estHeaderFk,
			SettingDetails: filter(list, { IsChange: true }),
			FixedPriceLineItems: entity.SelLineItemScope.FixedPriceLineItems,
			LineItemsAllowance: entity.SelLineItemScope.LineItemsAllowance,
			LineItemsMarkup: entity.SelLineItemScope.LineItemsMarkup,
			KeepFixedPrice: entity.KeepFixedPrice,
			ActStandardAllowanceFk: entity.ActStandardAllowanceFk,
			ActStandardAllowance: entity.ActStandardAllowance,
		};
		//postData = angular.extend(postData, angular.copy(basicData));
		return this.http.post(this.configService.webApiBaseUrl + 'estimate/main/lineitem/excutebackwardcalculation', postData).subscribe((response) => {});
	}
}
