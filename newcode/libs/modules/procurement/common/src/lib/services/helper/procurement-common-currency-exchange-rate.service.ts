/*
 * Copyright(c) RIB Software GmbH
 */

import { get, set } from 'lodash';
import { firstValueFrom, timer } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IModifyExchangeRate } from '../../model/interfaces';
import { IPrcExchangeRateEntity } from '../../model/entities';
import { BasicsSharedDataValidationService, } from '@libs/basics/shared';
import { IEntityRuntimeDataRegistry, IParentRole, ValidationInfo } from '@libs/platform/data-access';
import { ProcurementCommonCompanyContextService } from '../procurement-common-company-context.service';
import { StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementCommonSpecifyCurrencyComponent } from '../../components/specify-currency/specify-currency.component';
import { CompleteIdentification, IEntityBase, IEntityIdentification, INavigationBarControls, PlatformConfigurationService } from '@libs/platform/common';

/**
 * Current Type
 */
export type currentType = 'HomeCurrency' | 'ForeignCurrency';

/**
 * Procurement common currencyFk and exchangeRate service
 */
@Injectable({
	providedIn: 'root'
})
export abstract class ProcurementCommonCurrencyExchangeRateService<
	T extends IEntityIdentification & IEntityBase & IPrcExchangeRateEntity,
	U extends CompleteIdentification<T>> {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly msgDialogService = inject(UiCommonMessageBoxService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly loginCompany = inject(ProcurementCommonCompanyContextService).loginCompanyEntity;
	private readonly exchangeRateModel: (keyof IPrcExchangeRateEntity) = 'ExchangeRate';

	protected constructor(
		protected dataService: INavigationBarControls & IEntityRuntimeDataRegistry<T> & IModifyExchangeRate<T> & IParentRole<T, U>,
		protected updateExchangeRateUrl: string) {
	}

	/**
	 * Validate currencyFk and check BOQ
	 * @param info
	 * @param projectFk
	 */
	public async validateCurrencyFkNCheckBOQ(info: ValidationInfo<T>, projectFk?: number) {
		const entity = info.entity;
		const currentFkModel = info.field;
		const oldCurrencyFk = get(entity, currentFkModel);
		const oldRate = get(entity, this.exchangeRateModel);
		const hasVersionBOQs = await this.checkForVersionBOQs(entity.Id);
		if (hasVersionBOQs) {
			this.msgDialogService.showMsgBox('procurement.common.changeCurrencyVersionBoqText', 'procurement.common.changeCurrencyVersionBoqHeader', 'info')?.then(() => {
				set(entity, this.exchangeRateModel, oldRate);
				set(entity, currentFkModel, oldCurrencyFk);
			});
			return this.validationUtils.createSuccessObject();
		}

		return await this.validateCurrencyFk(info, projectFk);
	}

	/**
	 * Validate currencyFk
	 * @param info
	 * @param projectFk
	 */
	public async validateCurrencyFk(info: ValidationInfo<T>, projectFk?: number | null) {
		const entity = info.entity;
		const currentFkModel = info.field;
		const oldCurrencyFk = get(entity, currentFkModel);
		const oldRate = get(entity, this.exchangeRateModel);
		const newCurrencyFk = info.value as number;
		const newRate = (newCurrencyFk === this.loginCompany.CurrencyFk) ? 1 :
			await this.getExchangeRateByCurrencyFk(newCurrencyFk, projectFk);

		if (!newRate) {
			this.msgDialogService.showMsgBox('procurement.common.changeCurrencyRateIsZero', 'procurement.common.changeCurrencyHeader', 'info')?.then(() => {
				set(entity, this.exchangeRateModel, oldRate);
				set(entity, currentFkModel, oldCurrencyFk);
			});
			return this.validationUtils.createSuccessObject();
		}

		if (info.entity.Version === 0) {
			this.dataService.onExchangeRateChanged(info.entity, newRate, false, false);
			return this.validationUtils.createSuccessObject();
		}

		if (oldRate !== newRate) {
			this.openDialogToSpecifyCurrencyUpdateExchangeRate(entity, newRate, true).then((isSuccess) => {
				if (!isSuccess) {
					set(entity, this.exchangeRateModel, oldRate);
					set(entity, currentFkModel, oldCurrencyFk);
					return;
				}
				set(entity, this.exchangeRateModel, newRate);
			});
		}

		return this.validationUtils.createSuccessObject();
	}

	/**
	 * Validate exchangeRate and check BOQ
	 * @param info
	 */
	public async validateExchangeRateNCheckBOQ(info: ValidationInfo<T>) {
		const entity = info.entity;
		const model = info.field as string;
		const oldRate = get(entity, model);
		const hasVersionBOQs = await this.checkForVersionBOQs(entity.Id);
		if (hasVersionBOQs) {
			this.msgDialogService.showMsgBox('procurement.common.changeCurrencyVersionBoqText', 'procurement.common.changeCurrencyVersionBoqHeader', 'info')?.then(() => {
				set(entity, model, oldRate);
			});
			return this.validationUtils.createSuccessObject();
		}

		return await this.validateExchangeRate(info);
	}

	/**
	 * Validate exchangeRate
	 * @param info
	 */
	public async validateExchangeRate(info: ValidationInfo<T>) {
		const entity = info.entity;
		const model = info.field as string;
		const newRate = info.value as number;
		const oldRate = get(entity, model);
		if (!newRate) {
			timer(100).subscribe(() => {
				set(entity, model, oldRate);
			});
			return this.validationUtils.createSuccessObject();
		}

		if (info.entity.Version === 0) {
			this.dataService.onExchangeRateChanged(info.entity, newRate, false, false);
			return this.validationUtils.createSuccessObject();
		}

		this.openDialogToSpecifyCurrencyUpdateExchangeRate(entity, newRate, false).then((isSuccess) => {
			if (!isSuccess) {
				set(entity, model, oldRate);
				return;
			}
		});

		return this.validationUtils.createSuccessObject();
	}

	private async openDialogToSpecifyCurrencyUpdateExchangeRate(entity: T, newRate: number, isUpdateByCurrency: boolean): Promise<boolean> {
		const applyButtonId = StandardDialogButtonId.Yes;
		const result = await this.dialogService.show<currentType, ProcurementCommonSpecifyCurrencyComponent>({
			headerText: 'procurement.common.changeCurrencyHeader',
			width: '500px',
			resizeable: true,
			bodyComponent: ProcurementCommonSpecifyCurrencyComponent,
			buttons: [{
				id: StandardDialogButtonId.No,
				caption: 'basics.common.no'
			}, {
				id: applyButtonId,
				caption: 'basics.common.yes',
				fn: async (evt, info) => {
					const component = (info.dialog.body as ProcurementCommonSpecifyCurrencyComponent);
					const isRemainHomeCurrency = (component.specifyCurrency === 'HomeCurrency');
					component.showLoadingIcon();
					await this.updateExchangeRate(entity, newRate, isUpdateByCurrency, isRemainHomeCurrency);
					component.closeDialog(applyButtonId);
				}
			}]
		});
		return (result?.closingButtonId === applyButtonId);
	}

	private async updateExchangeRate(entity: T, newRate: number, isUpdateByCurrency: boolean, isRemainHomeCurrency: boolean) {
		this.dataService.onExchangeRateChanged(entity, newRate, isUpdateByCurrency, isRemainHomeCurrency);
		await this.dataService.save();
		await this.updateExchangeRateRequest(entity.Id, isRemainHomeCurrency);
		await this.dataService.loadChildEntities(entity);
		return;
	}

	private async updateExchangeRateRequest(entityId: number, remainNet: boolean): Promise<boolean> {
		const param = {
			HeaderId: entityId,
			RemainNet: remainNet
		};
		return await firstValueFrom(this.http.post<boolean>(this.configService.webApiBaseUrl + this.updateExchangeRateUrl, param));
	}

	private async getExchangeRateByCurrencyFk(currencyFk: number, projectFk?: number | null): Promise<number> {
		const params: HttpParams = new HttpParams().set('CompanyFk', this.loginCompany.Id).set('CurrencyForeignFk', currencyFk);
		if (projectFk) {
			params.set('CurrencyForeignFk', currencyFk);
		}
		return await firstValueFrom(this.http.get<number>(this.configService.webApiBaseUrl + 'procurement/common/exchangerate/defaultrate', {params: params}));
	}

	private async checkForVersionBOQs(packageId: number) {
		const params: HttpParams = new HttpParams().set('packageFk', packageId);
		return await firstValueFrom(this.http.get<boolean>(this.configService.webApiBaseUrl + 'procurement/common/boq/checkforversionboqs', {params: params}));
	}
}