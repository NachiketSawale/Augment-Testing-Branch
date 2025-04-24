/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Subject } from 'rxjs';
import * as _ from 'lodash';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntityList, ServiceRole } from '@libs/platform/data-access';
import { IQtoMainHeaderGridEntity } from '../model/qto-main-header-grid-entity.class';
import { QtoMainHeaderGridComplete } from '../model/qto-main-header-grid-complete.class';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { QtoMainDetailGridDataService } from '../services/qto-main-detail-grid-data.service';
import { QtoMainHeaderReadonlyProcessor } from './qto-main-header-readonly-processor.service';
import { MainDataDto } from '@libs/basics/shared';
import { IQtoFormulaScriptTransEntity, QtoFormulaScriptValidationDataService } from '@libs/qto/formula';
import { IQtoStatusEntity } from '../model/entities/qto-status-entity.interface';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { IQtoBoqQuantityCalculation } from '../model/interfaces/qto-boq-quantity-calculation.interface';
import { IQtoMainDetailGridEntity } from '../model/qto-main-detail-grid-entity.class';
import { IQtoDetailBoqCalculateInfo } from '../model/interfaces/qto-detail-boq-calculate-info.interface';
import { QtoMainHeaderCreationEntity } from '../model/qto-main-header-creation-entity.class';

/**
 * Data service for the QtoMainHeaderGridEntity.
 */
@Injectable({
	providedIn: 'root',
})
export class QtoMainHeaderGridDataService extends DataServiceFlatRoot<IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> {
	protected readonly http = inject(HttpClient);
	protected readonly configurationService = inject(PlatformConfigurationService);

	private readonly msgDialogService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);

	protected readonly formulaTranslationService = inject(QtoFormulaScriptValidationDataService);

	public childDetailService?: QtoMainDetailGridDataService;

	public readonly readonlyProcessor: QtoMainHeaderReadonlyProcessor;

	private qtoStatus: IQtoStatusEntity[] = [];
	private projectId: number = 0;
	private currentQtoHeaderId: number = 0;
	private currentQtoHeader?: IQtoMainHeaderGridEntity;
	private previousProjectId: number = 0;
	private createInfo?: QtoMainHeaderCreationEntity;

	public prcBoqHeaderIds: number[] = [];
	public contractBoqHeaderIds: number[] = [];
	public prcHeaderIds: number[] = [];

	//region event

	public setRubricCatagoryReadOnly = new Subject<void>();

	public refreshSubTotal = new Subject<void>();

	public refreshQtoDetail = new Subject<void>();

	public onQtoHeaderRubricCatagoryChanged = new Subject<IQtoMainHeaderGridEntity>();

	public recalculateBoqQuantities = new Subject<IQtoBoqQuantityCalculation>();

	//endregion

	public constructor() {
		const options: IDataServiceOptions<IQtoMainHeaderGridEntity> = {
			apiUrl: 'qto/main/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'searchlist',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceRoleOptions<IQtoMainHeaderGridEntity>>{
				role: ServiceRole.Root,
				itemName: 'QtoHeader',
			},
		};

		super(options);

		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([this.readonlyProcessor]);
	}

	private createReadonlyProcessor() {
		return new QtoMainHeaderReadonlyProcessor(this);
	}

	protected override onLoadSucceeded(loaded: object): IQtoMainHeaderGridEntity[] {
		const dto = new MainDataDto<IQtoMainHeaderGridEntity>(loaded);
		const entities = dto.getValueAs('dtos') as IQtoMainHeaderGridEntity[];

		//TODO: missing => cache costgroup

		// set some columns as readonly
		_.forEach(entities, (entity) => {
			this.readonlyProcessor.process(entity);
		});

		const formulaScriptTranslations = dto.getValueAs('FormulaScriptTranslations') as IQtoFormulaScriptTransEntity[];
		if (formulaScriptTranslations && formulaScriptTranslations.length > 0) {
			this.formulaTranslationService.setCurrentTranslationItems(formulaScriptTranslations);
		}

		return entities;
	}

	protected override provideCreatePayload(): object {
		if (this.createInfo) {
			return Object.assign({}, this.createInfo);
		} else {
			return {};
		}
	}

	public setCreateInfo(createInfo: QtoMainHeaderCreationEntity) {
		this.createInfo = createInfo;
	}

	protected override onCreateSucceeded(created: IQtoMainHeaderGridEntity): IQtoMainHeaderGridEntity {
		this.readonlyProcessor.process(created);

		return created;
	}

	public override createUpdateEntity(modified: IQtoMainHeaderGridEntity | null): QtoMainHeaderGridComplete {
		const complete = new QtoMainHeaderGridComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.QtoHeader = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: QtoMainHeaderGridComplete): IQtoMainHeaderGridEntity[] {
		/* if (complete.QtoHeaders === null) {
			complete.QtoHeaders = [];
		} */

		return [];
	}

	protected takeOverUpdatedFromComplete(complete: QtoMainHeaderGridComplete, entityList: IEntityList<IQtoMainHeaderGridEntity>) {
		let qtoDetailsToSave: IQtoMainDetailGridEntity[] = [],
			qtodetailGroupIds: number[] = [];
		if (complete.QtoDetailToSave && complete.QtoDetailToSave.length > 0) {
			qtoDetailsToSave = _.map(complete.QtoDetailToSave, 'QtoDetail') as IQtoMainDetailGridEntity[];
			qtodetailGroupIds = _.map(qtoDetailsToSave, 'QtoDetailGroupId') as number[];

			// qto lines: convert Date To UtcDate
			_.each(qtoDetailsToSave, (item) => {
				this.childDetailService?.convertDateToUtcDate(item);
			});

			//TODO: missing => dynamic cost groups -lnt
		}

		// set detail total,it will check this when import data.
		const selectedItem = this.getSelectedEntity();
		if (selectedItem) {
			const addTotal = qtoDetailsToSave ? qtoDetailsToSave.length : 0,
				removeTotal = complete.QtoDetailToDelete ? complete.QtoDetailToDelete.length : 0;
			selectedItem.DetailTotal = selectedItem.DetailTotal ? selectedItem.DetailTotal - (removeTotal - addTotal) : 0;
			this.childDetailService?.setQtoTypeId(selectedItem.QtoTypeFk);
		}

		if (complete.WarningInfo) {
			this.msgDialogService.showMsgBox(complete.WarningInfo, 'Info', 'ico-warning');
		}

		this.refreshQtoDetail.next();
		this.refreshSubTotal.next();

		// update qto detail grouping info first.
		this.childDetailService?.updateQtoDetailGroupInfo();

		// recalculate boq additional quantities
		this.recalculateBoqQuantity(complete, qtoDetailsToSave);

		//TODO: event refreshBtn not ready -lnt
		//qtoDetailCommentsService.refreshBtn.fire();

		if (qtodetailGroupIds.length > 0) {
			const qtoDetails = this.childDetailService?.getList();

			const groupItem = _.filter(qtoDetails, (detail) => {
				return detail.QtoDetailGroupId && qtodetailGroupIds.indexOf(detail.QtoDetailGroupId) > -1;
			}) as IQtoMainDetailGridEntity[];

			if (groupItem) {
				this.childDetailService?.updateQtoLineReferenceReadOnly(groupItem);
			}
		}
	}

	private recalculateBoqQuantity(complete: QtoMainHeaderGridComplete, qtoDetailsToSave: IQtoMainDetailGridEntity[]) {
		let qtoDetialsOfAffectedBoq: IQtoDetailBoqCalculateInfo[] = [];
		if (complete && complete.qtoDetialsOfAffectedBoq && complete.qtoDetialsOfAffectedBoq.length > 0) {
			qtoDetialsOfAffectedBoq = complete.qtoDetialsOfAffectedBoq;
		}

		const item: IQtoBoqQuantityCalculation = {};
		if (qtoDetailsToSave && qtoDetailsToSave.length > 0) {
			item.QtoDetailDatas = qtoDetailsToSave;
			item.qtoDetialsOfAffectedBoq = qtoDetialsOfAffectedBoq;
			this.recalculateBoqQuantities.next(item);
		}
		if (complete && complete.QtoDetailToDelete && complete.QtoDetailToDelete.length > 0) {
			item.QtoDetailDatas = complete.QtoDetailToDelete;
			item.qtoDetialsOfAffectedBoq = qtoDetialsOfAffectedBoq;
			this.recalculateBoqQuantities.next(item);
		}
	}

	/**
	 * delete item with dialog tips
	 * @param entity
	 */
	public deleteItem(entity: IQtoMainHeaderGridEntity) {
		const qtostatusItem = this.getItemStatus(entity);
		if (qtostatusItem && qtostatusItem.IsReadOnly) {
			this.msgDialogService.showMsgBox('qto.main.cannotDeleteQtoHeader', 'cloud.common.errorMessage', 'ico-error');
		} else {
			this.msgDialogService.showYesNoDialog('qto.main.confirmDelete', 'qto.main.confirmDeleteTitle')?.then((result) => {
				if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
					super.delete(entity);
				}
			});
		}
	}

	/**
	 * delete items with dialog tips
	 * @param entities
	 */
	public deleteEntities(entities: IQtoMainHeaderGridEntity[]) {
		this.msgDialogService.showYesNoDialog('qto.main.confirmDelete', 'qto.main.confirmDeleteTitle')?.then((result) => {
			if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
				super.delete(entities);
			}
		});
	}

	public setSelected(item: IQtoMainHeaderGridEntity[] | IQtoMainHeaderGridEntity | null) {
		this.childDetailService?.deleteTemporaryQtos();
		return this.select(item);
	}

	//TODO: missing => updateModuleHeaderInfo -lnt

	/**
	 * recalculate boq quantity with qto line
	 * @param boqItemFks
	 * @param QtoDetailDatas
	 */
	public updateBoqItemQuantity(boqItemFks: number[], QtoDetailDatas: IQtoMainDetailGridEntity[]) {
		const item: IQtoBoqQuantityCalculation = {
			boqItemFks: boqItemFks,
			QtoDetailDatas: QtoDetailDatas,
		};
		this.recalculateBoqQuantities.next(item);
	}

	//TODO: missing => setQtoHeader -lnt

	//TODO: missing => configConHeaderViewLookup -lnt

	//region get and set data

	/**
	 * get header code
	 * @param basRubricCategoryFk
	 * @param qtoHeader
	 */
	public async getCode(basRubricCategoryFk: number, qtoHeader: IQtoMainHeaderGridEntity) {
		const param = {
			BasRubricCategoryFk: basRubricCategoryFk,
			SaleContractId: qtoHeader.OrdHeaderFk, // sales contract
			PrcContractId: qtoHeader.ConHeaderFk,
			ClerkFk: qtoHeader.ClerkFk,
			ProjectId: qtoHeader.ProjectFk,
			PrcStructureFk: qtoHeader.PrcStructureFk,

			ProcurementContractCode: qtoHeader.ConHeaderFk ? qtoHeader.ContractCode : '',
			ProjectNo: qtoHeader.ProjectNo,
			SalesContractCode: qtoHeader.OrdHeaderFk ? qtoHeader.ContractCode : '',
			PackageId: qtoHeader.PrcPackageFk,
			BoqHeaderId: qtoHeader.BoqHeaderFk,
			QtoTargetType: qtoHeader.QtoTargetType,
		};

		const url = this.configurationService.webApiBaseUrl + 'qto/main/header/getcode';
		return (await firstValueFrom(this.http.post(url, param))) as string;
	}

	/**
	 * get and set BasGoniometerTypeFk
	 * @param item
	 */
	public async getGoniometer(item: IQtoMainHeaderGridEntity) {
		const url = this.configurationService.webApiBaseUrl + 'qto/main/header/getGoniometer?QtoTypeFk=' + item.QtoTypeFk;
		const response = await firstValueFrom(this.http.get(url));
		if (response) {
			item.BasGoniometerTypeFk = response as number;
		}
	}

	public setQtoStatus(value: IQtoStatusEntity[]) {
		this.qtoStatus = value;
	}

	public getQtoStatus() {
		return this.qtoStatus;
	}

	/**
	 * get qtostatus
	 * @param item
	 */
	public getItemStatus(item: IQtoMainHeaderGridEntity): IQtoStatusEntity | null {
		if (item === null || item === undefined) {
			return null;
		}

		if (this.qtoStatus && this.qtoStatus.length > 0) {
			return _.find(this.qtoStatus, { Id: item.QTOStatusFk }) as IQtoStatusEntity;
		}

		return null;
	}

	/**
	 * get PrcHeaderId by packageId
	 * @param packageId
	 */
	public async getPrcHeaderId(packageId: number) {
		const url = this.configurationService.webApiBaseUrl + 'qto/main/header/getprcheaderid?prcPackageId=' + packageId;
		this.prcHeaderIds = (await firstValueFrom(this.http.get(url))) as number[];

		return this.prcHeaderIds;
	}

	/**
	 * get BoqHeaderId by package2HeaderId
	 * @param package2HeaderId
	 */
	public async getBoqHeaderId(package2HeaderId: number) {
		const url = this.configurationService.webApiBaseUrl + 'qto/main/header/getboqheaderid?package2HeaderId=' + package2HeaderId;
		this.prcBoqHeaderIds = (await firstValueFrom(this.http.get(url))) as number[];

		return this.prcBoqHeaderIds;
	}

	/**
	 * get ContractBoqHeaderId
	 * @param id
	 */
	public async getContractBoqHeaderId(id: number) {
		const url = this.configurationService.webApiBaseUrl + 'qto/main/header/getcontractboqheaderid?id=' + id;
		this.contractBoqHeaderIds = (await firstValueFrom(this.http.get(url))) as number[];

		return this.contractBoqHeaderIds;
	}

	public async getBoqReferenceNo(isOrd: boolean) {
		let filter = '';
		const items = isOrd ? this.contractBoqHeaderIds : this.prcBoqHeaderIds;
		_.forEach(items, (item) => {
			filter += 'BoqHeaderFk=' + item + '||';
		});
		filter = filter.substr(0, filter.lastIndexOf('||'));
		const url = this.configurationService.webApiBaseUrl + 'procurement/common/prcboqextended/getsearchlist?filtervalue=' + filter;
		return await firstValueFrom(this.http.get(url));
	}

	public getSelectedProjectId() {
		const item = this.getSelectedEntity();
		return item ? item.ProjectFk : 0;
	}

	public setSelectProjectId(projectId: number) {
		this.projectId = projectId;
	}

	public getLastProjectId() {
		return this.projectId;
	}

	public setCurrentdHeaderId(headerId: number) {
		this.currentQtoHeaderId = headerId;
	}

	public getCurrentdHeaderId() {
		return this.currentQtoHeaderId;
	}

	public setCurrentHeader(entity: IQtoMainHeaderGridEntity) {
		this.currentQtoHeader = entity;
	}

	public getCurrentHeader() {
		return this.currentQtoHeader;
	}

	public setPreviousProjectId(value: number) {
		this.previousProjectId = value;
	}

	public getPreviousProjectId() {
		return this.previousProjectId;
	}

	//endregion
}
