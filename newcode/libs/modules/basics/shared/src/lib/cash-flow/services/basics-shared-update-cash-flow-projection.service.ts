import { Injectable, inject } from '@angular/core';
import { createLookup, FieldType, IFormConfig, ILookupConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonLookupDataFactoryService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsSharedCashFlowProjection } from '../models/types/basics-shared-cash-flow-projection.type';
import { BasicsSharedCashFlowProjectionOptions } from '../models/types/basics-shared-cash-flow-projection-options.type';
import { BasicsSharedCashFlowValidationService } from './basics-shared-cash-flow-validation.service';
import { BasicsSharedTotalCostCompositeComponent, createCostTotalLookupProvider } from '../../basics-shared-total-cost-composite/basics-shared-total-cost-composite.component';
import { firstValueFrom } from 'rxjs';
import { PlatformDateService, PlatformHttpService } from '@libs/platform/common';
import { BasicsSharedSCurveLegacyConfig } from '../../lookup-helper/basics-shared-scurve-legacy-lookup-config.class';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedUpdateCashFlowProjectionService {
	private readonly http = inject(PlatformHttpService);
	private readonly dateService = inject(PlatformDateService);
	private readonly validationService = inject(BasicsSharedCashFlowValidationService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly msgBoxDialogService = inject(UiCommonMessageBoxService);
	private readonly LookupDataFactory = inject(UiCommonLookupDataFactoryService);
	private readonly LookupService = this.LookupDataFactory.fromLookupType('CashProjection', { uuid: 'c808e5aa07d64fe58384a426eec83d67', valueMember: '', displayMember: '' } as ILookupConfig<Record<string, string>>);

	private _isLinear = false;

	public async showDialog<TItem extends object = object, TEntity extends object = object>(options: BasicsSharedCashFlowProjectionOptions<TItem, TEntity>) {
		options = { ...options, ...options.defaultValue };
		const cashFlowProjection = this.getInitValue(options);

		if (options.defaultValue?.CashProjectionFk) {
			const currentCashProjection = await firstValueFrom(this.LookupService.getItemByKey({ id: options.defaultValue?.CashProjectionFk }));

			options = {
				...options,
				StartWork: this.dateService.getUTC(currentCashProjection['StartWork']),
				EndWork: this.dateService.getUTC(currentCashProjection['EndWork']),
			};
		}
		const formConfig: IFormConfig<BasicsSharedCashFlowProjection> = {
			formId: 'updatecashflow',
			showGrouping: false,
			groups: [
				{
					groupId: 'basicData',
					header: 'basics.common.updateCashFlowProjection.headerText',
					visible: true,
					open: true,
				},
			],
			rows: [
				{
					groupId: 'basicData',
					id: 'scurvefk',
					label: 'basics.common.updateCashFlowProjection.sCurve',
					type: FieldType.Lookup,
					model: 'ScurveFk',
					validator: (info) => this.validationService.validateScurveFk(info),
					lookupOptions: createLookup({
						dataService: this.LookupDataFactory.fromLookupTypeLegacy('Scurve', BasicsSharedSCurveLegacyConfig),
					}),
				},
				{
					groupId: 'basicData',
					id: 'totalcost',
					label: 'basics.common.updateCashFlowProjection.totalCost',
					type: FieldType.CustomComponent,
					model: 'TotalCost',
					validator: (info) => this.validationService.validateTotalCost(info),
					componentType: BasicsSharedTotalCostCompositeComponent,
					providers: [createCostTotalLookupProvider(options.totalsLookupService)],
				},
				{
					groupId: 'basicData',
					id: 'startwork',
					label: 'basics.common.updateCashFlowProjection.startDate',
					type: FieldType.DateUtc,
					model: 'StartWork',
					change: (info) => console.log(info),
					validator: (info) => this.validationService.validateStartWork(info),
				},
				{
					groupId: 'basicData',
					id: 'endwork',
					label: 'basics.common.updateCashFlowProjection.endDate',
					type: FieldType.DateUtc,
					model: 'EndWork',
					validator: (info) => this.validationService.validateEndWork(info),
				},
				{
					groupId: 'basicData',
					id: 'onlylinearadjustment',
					label: 'basics.common.updateCashFlowProjection.onlyLinearAdjustment',
					type: FieldType.Boolean,
					model: 'OnlyLinearAdjustment',
				},
			],
		};

		const result = await this.formDialogService.showDialog<BasicsSharedCashFlowProjection>({
			id: 'update-cash-flow-dialog',
			headerText: 'basics.common.updateCashFlowProjection.headerText',
			formConfiguration: formConfig,
			entity: cashFlowProjection,
			// TODO: config the Ok button after DEV-8960 is done.
			customButtons: [
				{
					id: 'refresh',
					caption: 'basics.common.updateCashFlowProjection.refreshBtnText',
					fn: (event, info) => {
						info.dialog.value = this.getDefaultValue(options);
					},
				},
			],
		});

		// TODO: config the Ok button after DEV-8960 is done.
		const initValueObject = this.getInitValue(options);
		const isScurveChanged = !(initValueObject.ScurveFk === result?.value?.ScurveFk);
		const isStartDateChanged = !(initValueObject.StartWork === result?.value?.StartWork);
		const isEndDateChanged = !(initValueObject.EndWork === result?.value?.EndWork);
		if (isScurveChanged || isStartDateChanged || isEndDateChanged) {
			await this.msgBoxDialogService.showYesNoDialog({
				headerText: 'basics.common.updateCashFlowProjection.headerText',
				bodyText: 'basics.common.updateCashFlowProjection.deleteAndRecreateText',
				defaultButtonId: StandardDialogButtonId.No,
			});
		}

		if (result?.closingButtonId === StandardDialogButtonId.Ok && result.value) {
			this._isLinear = result.value.OnlyLinearAdjustment;
			result.value.CashProjectionFk = result.value.CashProjectionFk || -1;
			const requestData = { ...options, ...result.value };
			return this.http.post<BasicsSharedCashFlowProjection>('basics/common/cashcalculate/calculate', requestData);
			// 	({method: 'post', url: initValue.route, data: requestData}).then(function (result) {
			// 		if (result && result.data) {
			// 			defer.resolve(result.data);
			// 		}
			// 	}, function (error) {
			// 		console.log(error);
			// 		defer.reject(error);
			// 	});
			// }
		}
		return null;
	}

	private getDefaultValue<TItem extends object, TEntity extends object>(options: BasicsSharedCashFlowProjectionOptions<TItem, TEntity>): BasicsSharedCashFlowProjection {
		const defaultValue = {
			CashProjectionFk: options.defaultValue?.CashProjectionFk || options.CashProjectionFk,
			ScurveFk: options.defaultValue?.ScurveFk || options.ScurveFk || null,
			TotalCost: options.defaultValue?.TotalCost || options.TotalCost || null,
			StartWork: options.defaultValue?.StartWork || options.StartWork || null,
			EndWork: options.defaultValue?.EndWork || options.EndWork || null,
			OnlyLinearAdjustment: !!options.OnlyLinearAdjustment || false,
		};

		defaultValue.StartWork = defaultValue.StartWork ? new Date(defaultValue.StartWork) : null;
		defaultValue.EndWork = defaultValue.EndWork ? new Date(defaultValue.EndWork) : null;

		return defaultValue;
	}

	private getInitValue<TItem extends object, TEntity extends object>(options: BasicsSharedCashFlowProjectionOptions<TItem, TEntity>): BasicsSharedCashFlowProjection {
		return {
			CashProjectionFk: options.CashProjectionFk,
			ScurveFk: options.ScurveFk || null,
			TotalCost: options.TotalCost || null,
			StartWork: options.StartWork ? new Date(options.StartWork) : null,
			EndWork: options.EndWork ? new Date(options.EndWork) : null,
			OnlyLinearAdjustment: !!options.OnlyLinearAdjustment || false,
		};
	}

	//TODO: could not find the usage in angularjs, it seems can be removed.
	public provideUpdateCashFlowProjectionInstance() {}

	/**
	 * //TODO: is the old logic correct? Only take effect in the frontend.
	 */
	public isLinearAdjustment() {
		return this._isLinear;
	}
}
