/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { firstValueFrom } from 'rxjs';
import { ConCheckChangeResult } from '../model/entities/con-check-change-result.interface';
import { IPrcCheckChangeResult, IPrcUpdateBaseLineResult, ProcurementBaseLineUpdateCode } from '@libs/procurement/common';
import { isEmpty } from 'lodash';
import { IYesNoDialogOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { BasicsSharedConStatusLookupService } from '@libs/basics/shared';


/**
 * procurement contract baseline data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractBaselineDataService  {
	private readonly contractDataService: ProcurementContractHeaderDataService;
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly conStatusLookupService= inject(BasicsSharedConStatusLookupService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);

	private checkingContractIds: number[] = [];
	private refreshContractIds: number[] = [];
	private isShowMessageboxCache: { show?: boolean, cacheTime?: number } = {show: false, cacheTime: undefined};

	public constructor() {
		this.contractDataService = inject(ProcurementContractHeaderDataService);
		this.init();
	}

	private init() {
		this.contractDataService.selectionChanged$.subscribe(e => {
			this.updateChangeOrderDataFromBaseLine();
		});
	}

	public async checkChangeOrderIsChangedInBaseline(entity: IConHeaderEntity) {
		const result = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'procurement/contract/baseline/checkcocontractischanged', entity)) as ConCheckChangeResult;
		return result;
	}

	public async checkAndUpdateChangeOrderFromBaseLine(entity: { Contract: IConHeaderEntity, ChangeResult: IPrcCheckChangeResult }) {
		const result = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'procurement/contract/baseline/checkandupdatecocontract', entity)) as IPrcUpdateBaseLineResult;
		return result;
	}

	public existsCheckingContractId(contractId: number) {
		return this.checkingContractIds.includes(contractId);
	}

	public setCheckingContractId(contractId: number) {
		this.checkingContractIds.push(contractId);
	}

	public removeCheckingContractId(contractId: number) {
		const index = this.checkingContractIds.indexOf(contractId);
		if (index !== -1) {
			this.checkingContractIds.splice(index, 1);
		}
	}

	public hasRefreshContracts() {
		return this.refreshContractIds.length > 0;
	}

	public setRefreshContractId(contractId: number) {
		this.refreshContractIds.push(contractId);
	}

	public existsRefreshContractId(contractId: number) {
		return this.refreshContractIds.includes(contractId);
	}

	public removeRefreshContractId(contractId: number) {
		const index = this.refreshContractIds.indexOf(contractId);
		if (index !== -1) {
			this.refreshContractIds.splice(index, 1);
		}
	}

	public async isShowContractAutoUpdateMessagebox() {
		let show = this.getOptionForMessageBox();
		if (show === undefined) {
			show = await firstValueFrom(
				this.http.get<boolean>(`${this.configService.webApiBaseUrl}basics/common/systemoption/isshowcontractautoupdatemessagebox`)
			);
			this.setOptionForMessageBox(show);
		}
		return show;
	}

	// when leave current module, we must clear the cache data.
	public clearIsShowMessageboxCache() {
		this.isShowMessageboxCache.show = undefined;
		this.isShowMessageboxCache.cacheTime = undefined;
	}

	public async updateChangeOrderDataFromBaseLine() {
		const entity = this.contractDataService.getSelectedEntity();
		if (!entity || !entity.BaselineUpdate) {
			return;
		}

		const currentContractId = entity.Id;
		if (this.existsCheckingContractId(currentContractId) || this.existsRefreshContractId(currentContractId)) {
			return;
		} else {
			this.setCheckingContractId(currentContractId);
		}

		const showBlockDialog = await (this.isShowContractAutoUpdateMessagebox());
		const conStatusEntity = await firstValueFrom(this.conStatusLookupService.getItemByKey({id: entity.ConStatusFk}));

		const strTitle = this.translateService.instant('procurement.contract.updateContractFromBaseline.title').text;
		if (!conStatusEntity.IsUpdateImport) {
			const strBody = this.translateService.instant('procurement.common.errorTip.recordIsReadOnlyBody').text;
			await this.showUdpateBaselineDialog(showBlockDialog, strBody, strTitle);
			this.removeCheckingContractId(currentContractId);
			return;
		}

		const changedInBaseline = await (this.checkChangeOrderIsChangedInBaseline(entity));
		if (changedInBaseline && changedInBaseline.IsChanged && changedInBaseline.Id === entity.Id) {
			if (showBlockDialog) {
				this.showBaselineBlockDialog();
			}

			const request = {
				Contract: entity,
				ChangeResult: changedInBaseline
			};

			const updateContract = await (this.checkAndUpdateChangeOrderFromBaseLine(request));
			if (updateContract) {
				let msg = '';
				switch (updateContract.ResultCode) {
					case ProcurementBaseLineUpdateCode.NotChanged:
						msg = updateContract.Message || this.translateService.instant('procurement.contract.updateContractFromBaseline.alreadyLatestVersion').text;
						break;
					case ProcurementBaseLineUpdateCode.GetDataFromBaseLineSuccess:
						msg = updateContract.Message || this.translateService.instant('procurement.contract.updateContractFromBaseline.getFromBaselineSuccessed').text;
						break;
					case ProcurementBaseLineUpdateCode.GetDataFromBaseLineFailed:
						msg = updateContract.Message || this.translateService.instant('procurement.contract.updateContractFromBaseline.getFromBaselineFailed').text;
						break;
					case ProcurementBaseLineUpdateCode.UpdateSuccess:
						msg = updateContract.Message || this.translateService.instant('procurement.contract.updateContractFromBaseline.updateSuccessed').text;
						this.setRefreshContractId(currentContractId);
						await this.contractDataService.refreshSelected();
						this.removeRefreshContractId(currentContractId);
						break;
					case ProcurementBaseLineUpdateCode.UpdateFailed:
						msg = updateContract.Message || this.translateService.instant('procurement.contract.updateContractFromBaseline.updateFailed').text;
						break;
					case ProcurementBaseLineUpdateCode.NotFoundFileExported:
						msg = updateContract.Message || this.translateService.instant('procurement.contract.updateContractFromBaseline.notFoundFileExported').text;
						break;
				}

				await this.showUdpateBaselineDialog(showBlockDialog, msg, strTitle);
			}

		} else {
			const msg = changedInBaseline.ErrorMsg;
			if (msg && !isEmpty(msg)) {
				this.showUdpateBaselineDialog(showBlockDialog, msg);
			}
		}
		this.removeCheckingContractId(currentContractId);
	}

	private async showUdpateBaselineDialog(allowShowDialog: boolean, message?: string, title?: string,) {
		if (allowShowDialog === false) {
			return false;
		} else {
			return this.showBaselineBlockDialog(title, message);
		}
	}

	private showBaselineBlockDialog(title?: string, body?: string) {
		const options: IYesNoDialogOptions = {
			headerText: title ? title : this.translateService.instant('procurement.contract.updateContractFromBaseline.title').text,
			bodyText: body ? body : this.translateService.instant('procurement.contract.updateContractFromBaseline.checking').text,
			defaultButtonId: StandardDialogButtonId.Yes,
			showCancelButton: true,
			id: 'a74fbe79cee34003ae0a80fef55dcefe',
			dontShowAgain: false
		};
		return this.messageBoxService.showYesNoDialog(options);
	}

	private getOptionForMessageBox(): boolean | undefined {
		return this.isShowMessageboxCache.cacheTime !== null
			? this.isShowMessageboxCache.show
			: undefined;
	}

	private setOptionForMessageBox(show: boolean) {
		this.isShowMessageboxCache.show = show;
		this.isShowMessageboxCache.cacheTime = new Date().getTime();
	}

}