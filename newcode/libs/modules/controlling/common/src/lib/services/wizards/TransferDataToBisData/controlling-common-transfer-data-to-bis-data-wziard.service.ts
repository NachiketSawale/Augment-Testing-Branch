/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { bisTransferDataRequest, IControllingTransferDataToBisDataEntity, ICostGroupCatalog, projectActivityInfo, quantityUpdateData, quantityUpdateDateInfo, validationInfo } from './controlling-common-transfer-data-wizard-options';
import { ControllingCommonProjectComplete } from '../../../model/controlling-common-project-main-complete.class';
import { ControllingCommonProjectDataService } from '../../controlling-common-project-data.service';
import { ControllingCommonVersionDataService } from '../../controlling-common-version-data.service';
import { IControllingCommonBisPrjHistoryEntity, ITransferReport } from '../../../model/entities/controlling-common-bis-prj-history-entity.interface';
import { IControllingCommonProjectEntity } from '../../../model/entities/controlling-common-project-entity.interface';
import * as _ from 'lodash';
import { ControllingCommonTransferDataToBisDataComponent } from '../../../components/controlling-common-transfer-data-to-bis-wizard/controlling-common-transfer-data-to-bis-data.component';
import { ControllingCommonTransferCostgroupLookupService } from './controlling-common-transfer-costgroup-lookup.service';
import { ControllingCommonTransferBisDataReportService } from '../../controlling-common-transfer-bis-data-report.service';

@Injectable({
	providedIn: 'root',
})
export class ControllingCommonTransferDataToBisDataWziardService {
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly http = inject(HttpClient);
	protected readonly classificationSize = 4;
	protected readonly classificationPrefix = 'Catalog ';
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly dialogService = inject(UiCommonDialogService);
	protected readonly formDialogSvc = inject(UiCommonFormDialogService);
	protected readonly msgboxService = inject(UiCommonMessageBoxService);
	protected readonly costgroupLookupSvc = inject(ControllingCommonTransferCostgroupLookupService);
	private readonly wizardPathName = 'controlling.common.transferdatatobisWizard.';
	private readonly controllingCommonTransferBisDataService = inject(ControllingCommonTransferBisDataReportService);

	private entity: IControllingTransferDataToBisDataEntity = {
		versionType: 2,
		project: null,
		projectId: -1,
		projectNo: '',
		ribHistoryId: -1,
		ribHistoryRemark: '',
		ribHistoryDescription: '',
		qtyUpdateDataNValidateionInfo: null,
		historyList: [],
		valResult: null,
		costGroupCatalogList: [],
		costGroupCatalogListForLookup: [],
		costGroupList: [],
		validatedEstHeaderIds: [],
		validateActivities: [],
		validatedEstLineItems: [],
		periods: [],
		debugMode: false,
		qtyUpdateDateInfo: {
			AQLastUpdateDate: '',
			BQLastUpdateDate: '',
			FQLastUpdateDate: '',
			IQLastUpdateDate: '',
		},
		prjValidateResult: {
			show: true,
			canContinue: true,
			message: '',
			type: 3,
			isDisableOkBtn: false,
		},
		updateInstalledQty: false,
		insQtyUpdateFrom: 1,
		updateBillingQty: false,
		updateForecastingPlannedQty: false,
		updatePlannedQty: false,
		updateRevenue: false,
		revenueUpdateFrom: 1,
		ProjectIsCompleteperformance: false,
	};

	private projectSvc: ControllingCommonProjectDataService<IControllingCommonProjectEntity, ControllingCommonProjectComplete> | undefined = undefined;
	private versionSvc: ControllingCommonVersionDataService<IControllingCommonBisPrjHistoryEntity, IControllingCommonProjectEntity, ControllingCommonProjectComplete> | undefined = undefined;

	public constructor() {
		// this.entity.project = this.projectSvc ? this.projectSvc.getSelectedEntity() : null;
	}

	public setService(
		projectSvc: ControllingCommonProjectDataService<IControllingCommonProjectEntity, ControllingCommonProjectComplete>,
		versionSvc: ControllingCommonVersionDataService<IControllingCommonBisPrjHistoryEntity, IControllingCommonProjectEntity, ControllingCommonProjectComplete>,
	) {
		this.projectSvc = projectSvc;
		this.versionSvc = versionSvc;
	}

	private async getHistroysByPrjId(projectId: number): Promise<void> {
		this.entity.historyList = (await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'controlling/BisPrjHistory/list?mainItemId=' + projectId))) as IControllingCommonBisPrjHistoryEntity[];
	}

	private processData() {
		for (let x = 0; x < this.classificationSize; x++) {
			const id = x + 1;
			this.entity.costGroupCatalogList.push({
				Id: id,
				Classification: this.classificationPrefix + id,
				Code: '',
				DescriptionInfo: null,
			});
		}
	}

	private getHistoryId() {
		return this.entity.ribHistoryId;
	}

	private getProjectId() {
		return this.entity.projectId;
	}

	private getProject() {
		return this.entity.project;
	}

	public getList() {
		return this.entity.costGroupCatalogList;
	}

	public getCostGroupCatalogListForRequest() {
		const result: ICostGroupCatalog[] = [];
		let idCount = 1;
		_.forEach(this.entity.costGroupCatalogList, (cg) => {
			result.push({
				Id: idCount++,
				Classification: cg.Classification,
				Code: cg.Code,
				DescriptionInfo: null,
			});
		});

		return result;
	}

	public getCostGroupCatalogListForLookup() {
		return this.entity.costGroupCatalogListForLookup;
	}

	public getHistoryList() {
		return this.entity.historyList;
	}

	public getUpdateLineItemConfig() {
		return this.entity.qtyUpdateDataNValidateionInfo;
	}

	public setEntity(entity: IControllingTransferDataToBisDataEntity) {
		this.entity = entity;
	}

	private getValidateResult() {
		return this.entity.valResult;
	}

	private async getUpdateLineItemConfigNValidateInfo(projectId: number) {
		this.entity.qtyUpdateDataNValidateionInfo = (await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'controlling/structure/getupdateliconfnvalidateinfo?projectId=' + projectId))) as quantityUpdateData & validationInfo;
		await this.handleValidateResult();
		return this.entity.qtyUpdateDataNValidateionInfo;
	}

	private async setDefaultCostGroupCatalogs() {
		this.entity.costGroupCatalogListForLookup = await this.costgroupLookupSvc.getCostGroupCatalogList(this.getProjectId());

		for (let index = 0; index < this.classificationSize; index++) {
			const catalog = this.entity.costGroupCatalogListForLookup[index];
			if (catalog) {
				this.entity.costGroupCatalogList[index].Id = catalog.Id;
				this.entity.costGroupCatalogList[index].Code = catalog.Code;
				this.entity.costGroupCatalogList[index].DescriptionInfo = catalog.DescriptionInfo;
				this.entity.costGroupCatalogList[index].IsProjectCatalog = catalog.IsProjectCatalog;
			}
		}
	}

	public async showTransferToBisWizard() {
		await this.initServiceData();

		const dialogOption: ICustomDialogOptions<IControllingTransferDataToBisDataEntity, ControllingCommonTransferDataToBisDataComponent> = {
			id: 'controlling-trasnsfer-data-to-bis-data-dialog',
			headerText: this.translateService.instant(this.wizardPathName + 'transferWizardTitle'),
			bodyComponent: ControllingCommonTransferDataToBisDataComponent,
			value: this.entity,
			resizeable: true,
			showCloseButton: true,
		};

		if (this.entity.projectId > 0) {
			// Show dialog
			const result = await this.dialogService.show(dialogOption);

			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.transferData(
					{},
					{},
					{
						versionType: this.entity.versionType.toString(),
						projectId: this.entity.projectId,
						ribHistoryId: this.entity.ribHistoryId,
						costGroupCats: this.getCostGroupCatalogListForRequest(),
						estHeaderIds: _.uniq(this.entity.validatedEstHeaderIds),
						histroyRemark: this.entity.ribHistoryRemark,
						historyDescription: this.entity.ribHistoryDescription,
						debugMode: this.entity.debugMode,

						updateInstalledQty: this.entity.updateInstalledQty,
						insQtyUpdateFrom: this.entity.insQtyUpdateFrom,
						updateBillingQty: this.entity.updateBillingQty,
						updateForecastingPlannedQty: this.entity.updateForecastingPlannedQty,
						updatePlannedQty: this.entity.updatePlannedQty,
						updateRevenue: this.entity.updateRevenue,
						revenueUpdateFrom: this.entity.revenueUpdateFrom,
						projectIsCompletePerformance: this.entity.ProjectIsCompleteperformance,
					},
				);
			}
		} else {
			void this.msgboxService.showMsgBox(this.wizardPathName + 'noCurrentProjectSelection', this.wizardPathName + 'errorHeader', 'ico-error');
		}
	}

	public async transferData(scopeDialog: object, scope: object, postData: bisTransferDataRequest) {
		console.log('Transfer Start at : ' + Date());

		try {
			postData.costGroupCats = this.getList();

			const transferResults = (await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'controlling/structure/transferdatatobisdata', postData))) as ITransferReport[];

			const executeLogInfo = _.find(transferResults, { MessageType: -1 });
			const executeLog = executeLogInfo && executeLogInfo.Message ? executeLogInfo.Message : '';
			console.log(executeLog + 'Transfer End at : ' + Date());
			const exceptionInfo = _.find(transferResults, { MessageType: 999 });
			if (exceptionInfo && exceptionInfo.Message) {
				// todo: implement the scope
				// scope.isLoading = false;

				let message = 'Error occured during transfer: ' + '\n';
				message += exceptionInfo.Message;
				message += ' \nPlease check and continue.';
				// todo: remove the comment;
				console.log(executeLog + 'Transfer End at : ' + message);

				// todo: implemen the scope
				// scope.error.show = true;
				// scope.error.canContinue = true;
				// scope.error.message = message;
				// scope.error.type = 3;
				// scope.isDisableOkBtn = false;
			} else {
				await this.controllingCommonTransferBisDataService.showTransferResult(transferResults);

				// After dialog is closed, we filter the affected line items
				// todo: how to refresh the version container;
				// this.versionSvc?.load({ id: -1 });

				// todo: should be called in projectControls Module
				// reload the project controls
				// $injector.get('controllingProjectcontrolsDashboardService').reload();
			}
		} catch (error) {
			this.msgboxService.showMsgBox(error + '', this.wizardPathName + 'errorHeader', 'ico-error');
		}
	}

	public getTransferEntity() {
		return this.entity;
	}

	private async initServiceData() {
		const project = this.projectSvc?.getSelectedEntity();

		if (project) {
			this.entity.projectId = project.Id;
			this.entity.projectNo = project.ProjectNo;
			this.entity.project = project;
			this.entity.ProjectIsCompleteperformance = this.entity.project.IsCompletePerformance;
			this.processData();

			await this.setDefaultCostGroupCatalogs();
			await this.getUpdateLineItemConfigNValidateInfo(project.Id);
			await this.getHistroysByPrjId(project.Id);
		}
	}

	public getQuantityUpdateInfo(): quantityUpdateDateInfo {
		return this.entity.qtyUpdateDateInfo;
	}

	/**
	 *
	 * @private
	 */
	private async handleValidateResult() {
		if (this.entity.qtyUpdateDataNValidateionInfo && this.entity.qtyUpdateDataNValidateionInfo.validateResult) {
			this.entity.validatedEstHeaderIds = this.entity.qtyUpdateDataNValidateionInfo.validateResult.EstHeaderIds;
			this.entity.validateActivities = this.entity.qtyUpdateDataNValidateionInfo.validateResult.Activities;
			this.entity.periods = this.entity.qtyUpdateDataNValidateionInfo.validateResult?.Periods;
			this.entity.validatedEstLineItems = this.entity.qtyUpdateDataNValidateionInfo.validateResult.EstLineItems;
			this.entity.updateInstalledQty = this.entity.qtyUpdateDataNValidateionInfo.updateIQ;
			this.entity.insQtyUpdateFrom = this.entity.qtyUpdateDataNValidateionInfo.updateIQFrom;
			this.entity.updateBillingQty = this.entity.qtyUpdateDataNValidateionInfo.updateBQ;
			this.entity.updateForecastingPlannedQty = this.entity.qtyUpdateDataNValidateionInfo.updateFQ;
			this.entity.updatePlannedQty = this.entity.qtyUpdateDataNValidateionInfo.updateAQ;
			this.entity.updateRevenue = this.entity.qtyUpdateDataNValidateionInfo.updateRevenue;
			this.entity.revenueUpdateFrom = this.entity.qtyUpdateDataNValidateionInfo.updateRevenueFrom;
		}

		if (this.entity.validatedEstHeaderIds && this.entity.validatedEstHeaderIds.length > 0) {
			await this.getQuantityLastModifiedDate();

			if (this.entity.validateActivities.length === 0) {
				this.entity.prjValidateResult.show = false;
			} else if (this.entity.periods.length <= 0 && this.entity.validateActivities.length > 0) {
				this.entity.prjValidateResult.canContinue = false;
				this.entity.prjValidateResult.message = this.getActivityValidateMessage(this.entity.validateActivities, [], 1);
			} else {
				if (this.entity.validatedEstLineItems.length > 0) {
					const noActivityMatchPeriod = this.entity.valResult ? this.entity.valResult.NoActivityMatchPeriod : null;
					// activity date range is out of period date range partly
					const activityCantMatchPeriod = this.entity.valResult ? this.entity.valResult.ActivityCantMatchPeriod : null;
					const noActivityMatchPeriodList = this.entity.valResult ? this.entity.valResult.NoActivityMatchPeriodList : null;
					const activityCantMatchPeriodList = this.entity.valResult ? this.entity.valResult.ActivityCantMatchPeriodList : null;

					if (noActivityMatchPeriod && noActivityMatchPeriodList && noActivityMatchPeriodList.length > 0) {
						this.entity.prjValidateResult.canContinue = false;
						this.entity.prjValidateResult.message = this.getActivityValidateMessage(noActivityMatchPeriodList, activityCantMatchPeriodList, 1);
					} else if (!noActivityMatchPeriod && activityCantMatchPeriod) {
						if (activityCantMatchPeriod) {
							this.entity.prjValidateResult.message = this.getActivityValidateMessage(noActivityMatchPeriodList, activityCantMatchPeriodList, 2);
							this.entity.prjValidateResult.type = 2;
						} else {
							this.entity.prjValidateResult.show = false;
						}
					} else {
						this.entity.prjValidateResult.show = false;
					}
				} else {
					this.entity.prjValidateResult.canContinue = false;
					this.entity.prjValidateResult.message = this.translateService.instant(this.wizardPathName + 'coEstLineitemNullError').text;
				}
			}
		} else {
			this.entity.prjValidateResult.canContinue = false;
			this.entity.prjValidateResult.message = this.translateService.instant(this.wizardPathName + 'coEstHeaderNullError').text;
		}

		this.entity.prjValidateResult.isDisableOkBtn = this.entity.prjValidateResult.show && !this.entity.prjValidateResult.canContinue;
	}

	/**
	 * Check the date range of activity and company period date range
	 * @param errorActivityList
	 * @param warnActivityList
	 * @param validateType
	 * @private
	 */
	private getActivityValidateMessage(errorActivityList: projectActivityInfo[] | null, warnActivityList: projectActivityInfo[] | null, validateType: number) {
		let message = '';

		if (validateType === 1) {
			// get message for all activity date range is out of periods datea range
			message += this.translateService.instant(this.wizardPathName + 'noMatchedActivityAndPeriodError').text + '\n';

			_.forEach(errorActivityList, function (activity) {
				message += '[' + activity.Code + '],';
			});
		} else if (validateType === 2) {
			// get message for part of activity date range is out of periods datea range

			if ((errorActivityList === null || errorActivityList.length <= 0) && (warnActivityList === null || warnActivityList.length <= 0)) {
				message += 'No Error or Warn Activity.';
				return message;
			}

			if (errorActivityList !== null && errorActivityList.length > 0) {
				message += this.translateService.instant(this.wizardPathName + 'noMatchedActivityAndPeriodError').text + '\n';

				_.forEach(errorActivityList, function (activity) {
					message += '[' + activity.Code + '],';
				});

				message = message.endsWith(',') ? message.substring(0, message.length - 1) + '\n' : message + '\n';
			}

			if (warnActivityList !== null && warnActivityList.length > 0) {
				message += this.translateService.instant(this.wizardPathName + 'activityCantMatchPeriodWarning').text + '\n';

				_.forEach(warnActivityList, function (activity) {
					message += '[' + activity.Code + '],';
				});
			}
		}
		message = message.endsWith(',') ? message.substring(0, message.length - 1) + '\n' : message + '\n';
		return message;
	}

	/**
	 * get last modified date in isControlling Estimate headers.
	 * @private
	 */
	private async getQuantityLastModifiedDate() {
		// If project has controlling Estimate Header, get quantity last update date;
		const dateInfo = (await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'estimate/main/lineitemquantity/getlastmodifieddate', this.entity.validatedEstHeaderIds))) as quantityUpdateDateInfo;
		if (dateInfo) {
			const lastUpdateLabel = this.translateService.instant(this.wizardPathName + 'lastUpdateAt').text;
			const noUpdateRecordLabel = this.translateService.instant(this.wizardPathName + 'noUpdateRecord').text;

			this.entity.qtyUpdateDateInfo.AQLastUpdateDate = '		(' + lastUpdateLabel + ' : ' + dateInfo.AQLastUpdateDate !== null ? dateInfo.AQLastUpdateDate : noUpdateRecordLabel + ')';
			this.entity.qtyUpdateDateInfo.IQLastUpdateDate = '		(' + lastUpdateLabel + ' : ' + dateInfo.IQLastUpdateDate !== null ? dateInfo.AQLastUpdateDate : noUpdateRecordLabel + ')';
			this.entity.qtyUpdateDateInfo.BQLastUpdateDate = '		(' + lastUpdateLabel + ' : ' + dateInfo.BQLastUpdateDate !== null ? dateInfo.AQLastUpdateDate : noUpdateRecordLabel + ')';
			this.entity.qtyUpdateDateInfo.FQLastUpdateDate = '		(' + lastUpdateLabel + ' : ' + dateInfo.FQLastUpdateDate !== null ? dateInfo.AQLastUpdateDate : noUpdateRecordLabel + ')';
		}
	}
}
