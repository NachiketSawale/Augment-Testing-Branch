/*
 * Copyright(c) RIB Software GmbH
 */

import { lastValueFrom, Subject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { EstimateMainContextService } from '../../../common/services/estimate-main-context.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { isEmpty } from 'lodash';
import { IFormDialogConfig, UiCommonFormDialogService } from '@libs/ui/common';
import { IEstMainConfigComplete, ICustomizeDialogConfigOptions, IEstHeaderEntity } from '@libs/estimate/interfaces';

/**
 * base config dialog service
 */
@Injectable({ providedIn: 'root' })
export abstract class EstimateBaseConfigDialogService{
	//event
	public onCurrentItemChange = new Subject<IEstMainConfigComplete>();
	public onDataLoaded = new Subject();

	//service
	protected readonly http = inject(HttpClient);
	protected readonly platformConfigurationService = inject(PlatformConfigurationService);
	protected readonly translate = inject(PlatformTranslateService);
	protected readonly estimateMainContextService = inject(EstimateMainContextService);
	protected readonly formDialogService = inject(UiCommonFormDialogService);

	//properties
	protected currentItem: { EstHeaderId: number | null } = {EstHeaderId: null};
	protected completeData: IEstMainConfigComplete | null = null;
	protected currentObject: IEstMainConfigComplete | null = null;
	protected isCurrentItemChangeFire = false;
	protected estHeaderItem: IEstHeaderEntity | null = null;
	protected currentContext : string | null = null;

	protected readonly modalOptionsSelectRecord = {
		headerTextKey: this.translate.instant('estimate.main.estConfigDialogTitle').text,
		bodyTextKey: this.translate.instant('estimate.main.estConfigDialogLoadEstimate').text,
		iconClass: 'ico-warning'
	};

	/**
	 * get current item
	 */
	public getCurrentItem() {
		return this.currentItem;
	}

	/**
	 * set current item
	 * @param item
	 */
	public setCurrentItem(item: { EstHeaderId: number | null } ) {
		this.currentItem = item;
	}

	/**
	 * get usage context
	 */
	public getUsageContext() {
		return this.currentContext;
	}

	/**
	 * set usage context
	 * @param context
	 */
	public setUsageContext(context: string) {
		this.currentContext = context;
	}

	/**
	 * get current object
	 */
	public getCurrentObject() {
		return this.currentObject;
	}

	/**
	 * set current object
	 * @param item
	 */
	public setCurrentObject(item: IEstMainConfigComplete | null) {
		//this.currentItemChangeFire();
		this.currentObject = item;
		return Promise.resolve(this.currentObject);
	}

	/**
	 * get complete init data
	 */
	public getCompleteInitData() {
		return this.completeData;
	}

	/**
	 * clear
	 */
	public clearData() {
		this.currentItem = { EstHeaderId : null };
		this.completeData = null;
		this.currentObject = null;
		this.isCurrentItemChangeFire = false;
		this.currentContext = null;
	}

	/**
	 * fire item change event
	 */
	public currentItemChangeFire() {
		if (!this.isCurrentItemChangeFire && !(isEmpty(this.currentObject))) {
			this.onCurrentItemChange.next(this.currentObject);
			this.isCurrentItemChangeFire = true;
		}
	}

	/**
	 * load estimate header
	 */
	public loadHeaderData() {
		return lastValueFrom(this.http.get<IEstHeaderEntity>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/header/getitembyid', {
			params: {
				headerId: this.estimateMainContextService.getSelectedEstHeaderId()
			}
		}));
	}

	/**
	 * load config complete
	 */
	public async loadCompleteData() {
		this.completeData = await lastValueFrom(this.http.get<IEstMainConfigComplete>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/completeconfig/list', {
			params: {
				estHeaderId: this.currentItem.EstHeaderId??0
			}
		}));

		return this.currentItem;
	}

	/**
	 * load customize config complete
	 * @param config
	 */
	public async loadCustomizationCompleteData(config: ICustomizeDialogConfigOptions) {
		this.completeData = await lastValueFrom(this.http.get<IEstMainConfigComplete>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/completeconfig/getbyconfigid', {
			params: {
				configId: config.configFk ?? 0,
				configTypeId: config.configTypeId ?? 0,
				contextId: config.contextId
			}
		}));

		return this.completeData;
	}

	/**
	 * get estimate header by id
	 * @param config
	 * @protected
	 */
	protected async getEstHeaderById(config: {headerId: number}) {
		this.estHeaderItem = await lastValueFrom(this.http.get<IEstHeaderEntity|null>(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/header/getitembyid', {
			params: {
				headerId: config.headerId
			}
		}));

		return this.estHeaderItem;
	}

	/**
	 * update estimate config complete
	 * @param updateData
	 */
	public async update(updateData: IEstMainConfigComplete){
		updateData.EstHeaderId = this.currentItem.EstHeaderId || updateData.EstHeaderId;
		const data = await lastValueFrom(this.http.post(this.platformConfigurationService.webApiBaseUrl + 'estimate/main/completeconfig/update', updateData));
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return Object.assign(this.completeData!, data);
	}

	/**
	 * show config dialog
	 * @param config
	 * @protected
	 */
	protected showConfigDialog<T extends object>(config: IFormDialogConfig<T>) {
		return this.formDialogService.showDialog(config);
		//return Promise.resolve(dialogOptions);
	}

	/**
	 * load current item
	 * @param headerItem
	 * @protected
	 */
	protected async loadCurrentItem(headerItem: IEstHeaderEntity) {
		this.currentItem.EstHeaderId = headerItem.Id;
		await this.loadCompleteData();
		this.setCurrentObject(this.completeData);
		//this.showConfigDialog(this.modalOptionsEstConfigType);
	}
}