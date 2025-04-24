/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { PlatformConfigurationService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IEditorDialogResult, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';

import { IBasicsCurrencyRateEntity } from '@libs/basics/interfaces';

import { SetProjectCurrencyRate } from './set-project-currency-rate.class';
import { SetProjectCurrencyRateDialogConfig } from './set-project-currency-rate-dialog-config.class';
import { IProjectMainCurrencyRateEntity } from '@libs/project/interfaces';
import { ProjectMainCurrencyRateDataService } from '../../services/project-main-currency-rate-data.service';

@Injectable({
	providedIn: 'root'
})
export class SetProjectCurrencyRateService {
	private readonly modalDialogService = inject(UiCommonFormDialogService);

	public setCurrencyRate(dataService: ProjectMainCurrencyRateDataService): void {
		const currency = this.getSelectedCurrency(dataService);
		if(currency !== null) {
			const configService = ServiceLocator.injector.get(PlatformConfigurationService);
			const http = ServiceLocator.injector.get(HttpClient);
			const dialogConfigurator = new SetProjectCurrencyRateDialogConfig();

			this.modalDialogService.showDialog(dialogConfigurator.createFormConfiguration(currency))?.then((result: IEditorDialogResult<SetProjectCurrencyRate>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					const setCurrencyRate = result.value;
					const queryPath = configService.webApiBaseUrl + 'basics/currency/rate/ratebyconversionforeign';

					lastValueFrom(http.post<IBasicsCurrencyRateEntity>(queryPath, setCurrencyRate)).then(function(lastRate) {
						dataService.create().then(function(created) {
							created.CurrencyRateTypeFk = lastRate.CurrencyRateTypeFk ?? setCurrencyRate.CurrencyRateTypeFk;
							created.CurrencyConversionFk = lastRate.CurrencyConversionFk ?? currency.CurrencyConversionFk;
							created.CurrencyHomeFk = lastRate.CurrencyHomeFk;
							created.CurrencyForeignFk = lastRate.CurrencyForeignFk;
							created.RateDate = lastRate.RateDate;
							created.Rate = lastRate.Rate;
							created.Basis = lastRate.Basis;
							created.Comment = currency.Comment;
						});
					});
				}
			});
		} else  {
			// Error MessageText
			const translateService = ServiceLocator.injector.get(PlatformTranslateService);
			const dialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
			const bodyText = translateService.instant({key:'cloud.common.noCurrentSelection'}).text;

			dialogService.showInfoBox(bodyText,'info',false);
		}
	}

	private getSelectedCurrency(dataService: ProjectMainCurrencyRateDataService): IProjectMainCurrencyRateEntity | null {
		return dataService.getSelectedEntity();
	}
}