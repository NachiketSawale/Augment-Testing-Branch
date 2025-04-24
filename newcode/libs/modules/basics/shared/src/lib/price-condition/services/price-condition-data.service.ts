/*
 * Copyright(c) RIB Software GmbH
 */
import { IBasicsPriceConditionHeaderService, IMaterialPriceConditionEntity } from '@libs/basics/interfaces';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceOptions } from '@libs/platform/data-access';
import { IBasicsSharedPriceConditionService } from './interfaces/price-condition-service.interface';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPriceConditionContext } from '../model/interfaces/price-condition-context.interface';
import { BasicsSharedPriceConditionResponse } from '../model/price-condition-response';
import { MainDataDto } from '../../model/dtoes';
import { BasicsSharedRoundingFactoryService, BasicsSharedRoundingModule as roundingModule } from '../../rounding';
import { sumBy } from 'lodash';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { firstValueFrom } from 'rxjs';
import { IPriceConditionReloadParam } from '../model/interfaces/price-condition-param.interface';

/**
 * The basic data service for Price Condition entity
 */
export abstract class BasicsSharedPriceConditionDataService<T extends IMaterialPriceConditionEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatLeaf<T, PT, PU>
	implements IBasicsSharedPriceConditionService<IMaterialPriceConditionEntity, PT> {
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	protected parentDataService: IBasicsPriceConditionHeaderService<PT, PU>;
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly roundingService = BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial);
	// TODO remove roundType after rounding function ready
	private roundType = {
		TotalOc: 2,
		Total: 2,
	};

	protected constructor(parentDataService: IBasicsPriceConditionHeaderService<PT, PU>, options: IDataServiceOptions<T>) {
		super(options);
		this.parentDataService = parentDataService;
		this.parentDataService.priceConditionChanged$.subscribe((e) => {
			this.reloadPriceConditions({ priceConditionId: e });
		});
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		} else {
			throw new Error('There should be a selected parent catalog to load the price list price condition data');
		}
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dto = new MainDataDto<T>(loaded);
		return dto.Main;
	}

	public abstract getContextFromParent(): IPriceConditionContext;

	public abstract onCalculateDone(total: number, totalOc: number, field: string): void;

	public getParentService() {
		return this.parentDataService;
	}

	public async reloadPriceConditions(param: IPriceConditionReloadParam) {
		const context = this.getContextFromParent();
		if (context && this.getParentService().getSelection().length > 0) {
			const headerEntity = this.getParentService().getSelectedEntity();
			const params = {
				PrcPriceConditionId: param.priceConditionId,
				MainItem: headerEntity,
				ExchangeRate: context.ExchangeRate,
				IsFromMaterial: param.isFromMaterial,
				IsCopyFromPrcItem: param.isCopyFromPrcItem,
				MaterialPriceListId: param.materialPriceListId,
				HeaderId: context.HeaderId,
				HeaderName: context.HeaderName,
				ProjectFk: context.ProjectFk,
				IsCopyFromBoqDivision: param.isCopyPriceConditionFromBoqDivision,
				BasicPrcItemId: param.basicPrcItemId,
			};
			//todo reload price condition when price condition type change
			const response = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + this.options.apiUrl + '/reload', params));
			if (response) {
				const priceConditions = (response as BasicsSharedPriceConditionResponse).PriceConditions;
				//this.remove(this.getList()); todo need clear exist price condition list
				priceConditions.forEach((item) => {
					if (this.onCreateSucceeded) {
						this.onCreateSucceeded(item);
					}
				});
			}
		}
	}

	public handleReloadSucceeded(parentItem: IEntityIdentification, loadedData: IMaterialPriceConditionEntity[]) {
		// sync description of priceCondition Type to priceCondition
		loadedData.forEach((item) => {
			if (!!item.PriceConditionType && !!item.PriceConditionType.DescriptionInfo) {
				item.Description = item.Description || item.PriceConditionType.DescriptionInfo.Translated;
			}
			this.delete(this.getList());
			if (this.onCreateSucceeded) {
				this.onCreateSucceeded(item);
			}
		});
		//todo  If the priceCondition of prcItem is changed, it will reload the price condition. Before the asynchronous request is completed, if the parent is switched, data disorder may occur,In the new framework, maybe this problem will not occur or there may be a better way to solve it.
	}

	public handleRecalculateDone(priceConditionResponse: BasicsSharedPriceConditionResponse) {
		if (!priceConditionResponse.IsSuccess) {
			this.messageBoxService.showMsgBox('basics.material.record.priceConditionTypeFormulaError', 'cloud.common.informationDialogHeader', 'ico-info');
		}

		const priceComponentPriceConditions = priceConditionResponse.PriceConditions.filter((item) => {
			return item.PriceConditionType?.IsPriceComponent && item.IsActivated;
		});
		const total = this.roundingService.doRounding(
			this.roundType.Total,
			sumBy(priceComponentPriceConditions, (item) => item.Total),
		);
		const totalOc = this.roundingService.doRounding(
			this.roundType.TotalOc,
			sumBy(priceComponentPriceConditions, (item) => item.TotalOc),
		);
		this.onCalculateDone(total, totalOc, priceConditionResponse.Field);
	}

	public async recalculate(priceConditionId?: number | null): Promise<IMaterialPriceConditionEntity[]> {

		//TODO: priceConditionId parameter was not used currently. Please double check again Anything wrong @Alina
		if (!priceConditionId) {
			return [];
		}
		const headerEntity = this.parentDataService.getSelectedEntity();
		const priceConditions = this.getList();
		const context = this.getContextFromParent();
		const params = {
			PriceConditions: priceConditions,
			MainItem: headerEntity,
			ExchangeRate: context.ExchangeRate,
			HeaderId: context.HeaderId,
			HeaderName: context.HeaderName,
			ProjectFk: context.ProjectFk,
		};
		const response = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + this.options.apiUrl + '/recalculate', params));
		if (response) {
			const priceConditionResponse = response as BasicsSharedPriceConditionResponse;
			this.handleRecalculateDone(priceConditionResponse);
			//todo The logic here is currently unclear
			//service.mergeChanges(result.data.PriceConditions, parentItem));
			return priceConditionResponse.PriceConditions;
		}
		return [];
	}
}
