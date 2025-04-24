/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceHierarchicalLeaf, IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions, IReadOnlyField
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import * as _ from 'lodash';
import { QtoMainHeaderGridDataService } from '../header/qto-main-header-grid-data.service';
import { IQtoMainHeaderGridEntity } from '../model/qto-main-header-grid-entity.class';
import { QtoMainHeaderGridComplete } from '../model/qto-main-header-grid-complete.class';
import {CollectionHelper, PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import { map, firstValueFrom} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { QtoSheetCreationRequest } from '../model/request/sheet-creation-request';
import { QtoShareBoqType } from '@libs/qto/shared';
import { IQtoSheetEntity } from '../model/entities/qto-sheet-entity.interface';
import {MainDataDto} from '@libs/basics/shared';
import {QtoMainSheetReadonlyProcessor} from './qto-main-sheet-readonly-processor.service';
import {QtoMainDetailGridDataService} from '../services/qto-main-detail-grid-data.service';
import {IBasicsCustomizeQtoSheetStatusEntity} from '@libs/basics/interfaces';
import {IMessageBoxOptions, StandardDialogButtonId, UiCommonMessageBoxService} from '@libs/ui/common';
import {IQtoMainDetailGridEntity} from '../model/qto-main-detail-grid-entity.class';
import {IQtoAddressRange} from '@libs/qto/interfaces';

@Injectable({
	providedIn: 'root',
})
export class QtoMainSheetDataService extends DataServiceHierarchicalLeaf<IQtoSheetEntity, IQtoMainHeaderGridEntity, QtoMainHeaderGridComplete> {
	public readonly parentService: QtoMainHeaderGridDataService;

	protected readonly http = inject(HttpClient);
	protected readonly configurationService = inject(PlatformConfigurationService);

	private readonly msgboxService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);

	public readonly qtoDetailDataService = inject(QtoMainDetailGridDataService);
	protected readonly readonlyProcessor: QtoMainSheetReadonlyProcessor;

	private qtoSheetStatusList: IBasicsCustomizeQtoSheetStatusEntity[] = [];
	private qtoHeaderId: number = 0;

	public constructor(qtoMainHeaderGridDataService: QtoMainHeaderGridDataService) {
		const options: IDataServiceOptions<IQtoSheetEntity> = {
			apiUrl: 'qto/main/structure',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IQtoSheetEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'QtoSheets',
				parent: qtoMainHeaderGridDataService,
			},
		};

		super(options);

		// processor: readonly
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([this.readonlyProcessor]);

		this.qtoDetailDataService.setSelectedPageNumber(null);

		this.parentService = qtoMainHeaderGridDataService;
	}

	/**
	 * create new readonly processor
	 * @protected
	 */
	protected createReadonlyProcessor() {
		return new QtoMainSheetReadonlyProcessor(this);
	}

	protected override provideLoadPayload(): object {
		// set qto Header Id
		this.setQtoHeaderId();

		return {
			MainItemId: this.qtoHeaderId,
			filter: '',
		};
	}

	protected override onLoadSucceeded(loaded: object): IQtoSheetEntity[] {
		const dto = new MainDataDto<IQtoSheetEntity>(loaded);
		const entities = dto.getValueAs('dtos') as IQtoSheetEntity[];

		//TODO: missing => filter in sheet, the markersChanged not ready -lnt

		//TODO: missing => the create button status, maybe not handle here -lnt

		// set qto addressrange
		const qtoAddressRange = dto.getValueAs('qtoAddressRange') as IQtoAddressRange;
		this.qtoDetailDataService.setSheetAreaList(qtoAddressRange);

		// update cache qto sheet status
		const qtoSheetStatusList = dto.getValueAs('qtoSheetStatusList') as IBasicsCustomizeQtoSheetStatusEntity[];
		this.setQtoSheetStatusList(qtoSheetStatusList);

		return entities;
	}

	public override childrenOf(element: IQtoSheetEntity): IQtoSheetEntity[] {
		return element.QtoSheets ?? [];
	}

	protected override provideCreatePayload(): object {
		const selectItem = this.getSelectedEntity();
		const itemList = this.getList();
		const parentId: number | null =    selectItem && selectItem.QtoSheetParent ? selectItem.QtoSheetParent.Id : null;
		const isItem: boolean = false;
		let isOverflow: boolean = false;
		let pageNumber: string = '', strNumberAppend: string = '';

		if (itemList && itemList.length > 0) {
			if (parentId && parentId > 0 && selectItem) {
				this.initQtoSheetDec(selectItem);
				//TODO: missing => nodeInfo -lnt
			} else {
				if (selectItem) {
					strNumberAppend = this.getLastInSaveLevel(selectItem, itemList);
					if (!strNumberAppend) {
						isOverflow = true;
					}
				} else {
					const itemsInLevel = _.filter(itemList, function (item) {
						return item.QtoSheetFk === null;
					});

					const qtoTypeId = this.getQtoTypeId();
					const increment = qtoTypeId === 1 ? 10000 : 1000;
					if (itemsInLevel && itemsInLevel.length > 0) {
						const itemTemp = itemsInLevel[itemsInLevel.length - 1];
						const pageNumberDesAarry = _.split(itemTemp.Description, '-');
						if (pageNumberDesAarry && pageNumberDesAarry.length > 1) {
							isOverflow = qtoTypeId === 1 ? _.parseInt(pageNumberDesAarry[1]) === 99999 : _.parseInt(pageNumberDesAarry[1]) === 9999;
							const number1 = _.parseInt(pageNumberDesAarry[0]) + increment;
							const strNumber1 = this.leftPadZero(number1, number1 > 9999 ? 5 : 4);
							const number2 = _.parseInt(pageNumberDesAarry[1]) + increment;
							const strNumber2 = this.leftPadZero(number2, number2 > 9999 ? 5 : 4);
							strNumberAppend = strNumber1 + '-' + strNumber2;
						}
					}
				}

				pageNumber = strNumberAppend;
			}
		} else {
			pageNumber = '0000-9999';
		}

		//TODO: missing => qtoheader function updateReadOnly -lnt

		return {
			MainItemId: this.qtoHeaderId,
			parentId: parentId,
			PageNumber: pageNumber,
			IsOverflow: isOverflow,
			IsItem: isItem,
		};
	}
	
	protected override onCreateSucceeded(created: IQtoSheetEntity): IQtoSheetEntity {
		// set the parents readonly flag
		const parentItems = this.setQtoSheetParentsReadonlyFlag(created);
		this.setModified(parentItems);

		return created;
	}

	//TODO: missing => handleOnDeleteSucceeded -lnt

	//TODO: missing => create replace function, missing nodeInfo -lnt

	/**
	 * defined delete item function
	 * @param entity
	 * @private
	 */
	private deleteItem(entity: IQtoSheetEntity) {
		const strContent = this.translateService.instant('qto.main.sheetDelete').text;
		const strTitle = this.translateService.instant('qto.main.sheetDeleteTitle').text;
		this.msgboxService.showYesNoDialog(strContent, strTitle)?.then((result) => {
			if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
				super.delete(entity);
			}
		});
	}

	/**
	 * defined delete items function
	 * @param entities
	 * @private
	 */
	private deleteEntities(entities: IQtoSheetEntity[]) {
		const qotLineList = this.qtoDetailDataService.getList();
		const filterLine = _.find(qotLineList, (qtoLine) => {
			if (qtoLine.IsReadonly || qtoLine.PesHeaderFk || qtoLine.WipHeaderFk) {
				const index = _.findIndex(entities, {'PageNumber': qtoLine.PageNumber});
				if (index !== -1) {
					return qtoLine;
				}
			}
			return null;
		}) as IQtoMainDetailGridEntity;

		if(filterLine) {
			const modalOptions: IMessageBoxOptions = {
				headerText: 'qto.main.sheetWarningTitle',
				bodyText: this.translateService.instant('qto.main.sheetWarning', {value: filterLine.QtoDetailReference}),
				iconClass: 'ico-info',
				buttons: [
					{id: StandardDialogButtonId.Yes},
					{id: StandardDialogButtonId.Cancel}
				]
			};
			this.msgboxService.showMsgBox(modalOptions);
		} else {
			const strContent = this.translateService.instant('qto.main.sheetDelete').text;
			const strTitle = this.translateService.instant('qto.main.sheetDeleteTitle').text;
			this.msgboxService.showYesNoDialog(strContent, strTitle)?.then((result) => {
				if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
					super.delete(entities);
				}
			});
		}
	}

	//TODO: missing => addMarkersChanged -lnt

	/**
	 * create qto sheet
	 * @param number
	 * @param qtoHeaderId
	 * @param boqType
	 * @param qtoType
	 */
	public createQtoStructure(number: number, qtoHeaderId: number, boqType: number, qtoType: number) {
		const n = number > 9999 ? 5 : 4;
		const pageNumber = this.leftPadZero(number, n);
		const list = this.getList();
		const index = list.findIndex((e) => e.Description === pageNumber);
		if (index === -1) {
			const creationData: QtoSheetCreationRequest = {
				MainItemId: qtoHeaderId,
				Number: number,
				QtoType: qtoType,
				IsPrjBoq: boqType === QtoShareBoqType.PrjBoq,
				IsPrcBoq: boqType === QtoShareBoqType.PrcBoq,
				IsBillingBoq: boqType === QtoShareBoqType.BillingBoq,
				IsWipBoq: boqType === QtoShareBoqType.WipBoq,
				IsPesBoq: boqType === QtoShareBoqType.PesBoq,
				IsQtoBoq: boqType === QtoShareBoqType.QtoBoq,
			};

			return this.http.post(this.configurationService.webApiBaseUrl + 'qto/main/structure/createbyqtoline', creationData).pipe(
				map((res) => {
					const response = res as IQtoSheetEntity[];
					let createItem: IQtoSheetEntity | null = null;
					if (boqType !== QtoShareBoqType.QtoBoq) {
						const qtoSheetList =  CollectionHelper.Flatten(response, this.childrenOf);

						const selectIndex = qtoSheetList.findIndex((e) => e.Description === pageNumber);
						if (selectIndex !== -1) {
							createItem = qtoSheetList[selectIndex];
						}
						return createItem;
					} else {
						const qtoHeader = this.parentService.getSelection()[0];
						const identificationData = {
							id: qtoHeader.Id,
							MainItemId: qtoHeader.Id,
						};
						return this.load(identificationData).then(() => {
							const selectIndex = list.findIndex((data) => data.Description === pageNumber);
							if (selectIndex !== -1) {
								createItem = list[selectIndex];
								this.select(list[selectIndex]);
							}

							// qtoMainStrucutrueFilterService.removeFilter('QtoSheets');

							return createItem;
						});
					}
				}),
			);
		} else {
			return Promise.resolve(list[index]);
		}
	}

	/**
	 * create qto sheets
	 * @param qtoHeaderId
	 * @param targetItems
	 * @param pageNumberList
	 * @param qtoTypeFk
	 */
	public async createQtoStructures(qtoHeaderId: number, targetItems: IQtoSheetEntity[], pageNumberList: number[], qtoTypeFk: number){
		const creationData = {
			MainItemId: qtoHeaderId,
			Numbers: pageNumberList,
			QtoType: qtoTypeFk
		};

		const url = this.configurationService.webApiBaseUrl + 'qto/main/structure/createbyqtolines';
		const response = await firstValueFrom(this.http.post(url, creationData));
		if (response){
			const qtoSheetItems = response as IQtoSheetEntity[];
			this.loadQtoSheetData(qtoSheetItems);
			_.forEach(targetItems, (item) => {
				const qtoSheetList = CollectionHelper.Flatten(qtoSheetItems, this.childrenOf);
				const index = _.findIndex(qtoSheetList, {'PageNumber': item.PageNumber});
				if (index !== -1) {
					item.QtoSheetFk = qtoSheetList[index].Id;
				}
			});
		}
	}

	/**
	 * load sheets with setlist
	 * @param qtoSheets
	 */
	public loadQtoSheetData(qtoSheets: IQtoSheetEntity[]){
		if(qtoSheets && qtoSheets.length > 0) {
			//data.itemTree = qtoSheets; //TODO: not sure how to replace -lnt
			const qtoSheetList = CollectionHelper.Flatten(qtoSheets, this.childrenOf);
			this.setList(qtoSheetList);
			//data.listLoaded.fire(null, qtoSheets); //TODO: not sure whether need -lnt
			void this.select(qtoSheetList[qtoSheetList.length - 1]);

			//qtoMainStrucutrueFilterService.removeFilter('QtoSheets'); //TODO: the filter not ready -lnt
		}
	}

	/**
	 * left Pad Zero
	 * @param num
	 * @param n
	 */
	public leftPadZero(num: number, n: number) {
		return (new Array(n).join('0') + num).slice(-n);
	}

	private initQtoSheetDec(selectItem: IQtoSheetEntity){
		if(!selectItem.Description && selectItem.From && selectItem.To && !selectItem.PageNumber){
			selectItem.Description = this.leftPadZero(selectItem.From, 4) + '-' + this.leftPadZero(selectItem.To, 4);
		} else if(!selectItem.Description && selectItem.PageNumber){
			selectItem.Description = this.leftPadZero(selectItem.PageNumber, 4);
		}

		if(selectItem.QtoSheets && selectItem.QtoSheets.length > 0){
			_.forEach(selectItem.QtoSheets, (qtoSheet) => {
				if(!qtoSheet.Description && qtoSheet.From && qtoSheet.To && !qtoSheet.PageNumber){
					qtoSheet.Description = this.leftPadZero(qtoSheet.From, 4) + '-' + this.leftPadZero(qtoSheet.To, 4);
				} else if(!qtoSheet.Description && qtoSheet.PageNumber){
					qtoSheet.Description = this.leftPadZero(qtoSheet.PageNumber, 4);
				}
			});
		}
	}

	/**
	 * set sheet parents as readonly
	 * @param qtoSheet
	 */
	public setQtoSheetParentsReadonlyFlag(qtoSheet: IQtoSheetEntity){
		const parentItems: IQtoSheetEntity[] = [], itemsToSave: IQtoSheetEntity[] = [];
		this.getQtoSheetParentList(qtoSheet, parentItems);
		if (parentItems.length > 0) {
			_.forEach(parentItems, function (parentItem) {
				if (parentItem.IsReadonly) {
					parentItem.IsReadonly = false;
					itemsToSave.push(parentItem);
				}
			});
		}

		return itemsToSave;
	}

	/**
	 * get sheet parents
	 * @param qtoSheet
	 * @param parentItems
	 */
	public getQtoSheetParentList(qtoSheet: IQtoSheetEntity, parentItems: IQtoSheetEntity[]){
		const qtoSheetList = _.filter(this.getList(), {'PageNumber': null});
		this.getParentList(qtoSheet, qtoSheetList, parentItems);
	}

	private getParentList(qtoSheet: IQtoSheetEntity, qtoSheetList: IQtoSheetEntity[], parentItems: IQtoSheetEntity[]){
		if (qtoSheet.QtoSheetFk){
			const findItem = _.find(qtoSheetList, { 'Id': qtoSheet.QtoSheetFk });
			if (findItem){
				parentItems.push(findItem);
				if (findItem.QtoSheetFk){
					this.getParentList(findItem, qtoSheetList, parentItems);
				}
			}
		}
	}

	private getLastInSaveLevel(selectItem: IQtoSheetEntity, itemList: IQtoSheetEntity[]) {
		// let itemsInLevel: IQtoSheetEntity[] = [], strPageNumber: string = '';
		const strNumberAppend: string = '';
		//TODO: missing => nodeInfo -lnt
		// if (selectItem) {
		// 	itemsInLevel = _.filter(itemList, (item) => {
		// 		return item.QtoSheetFk === selectItem.QtoSheetFk;
		// 	});
		//
		// 	if (!selectItem.Description) {
		// 		strPageNumber = this.leftPadZero(selectItem.From ?? 0, 4) + '-' + this.leftPadZero(selectItem.To ?? 0, 4);
		// 	} else {
		// 		strPageNumber = selectItem.Description;
		// 	}
		// }
		return strNumberAppend;
	}

	/**
	 * set fields as readonly
	 * @param item
	 * @param fieldList
	 * @param value
	 */
	public updateReadOnly(item: IQtoSheetEntity, fieldList: string[], value: boolean){
		const readonlyFields: IReadOnlyField<IQtoMainDetailGridEntity>[] = [];
		_.forEach(fieldList, (field) => {
			readonlyFields.push({field: field, readOnly: value});
		});

		this.setEntityReadOnlyFields(item, readonlyFields);
	}

	// region set and get data

	private setQtoHeaderId(){
		const qtoHeader = this.parentService.getSelectedEntity();
		if (qtoHeader){
			this.qtoHeaderId = qtoHeader.Id;
		}
	}

	private getQtoTypeId(){
		let qtoTypeId: number = 0;
		const qtoHeader = this.parentService.getSelectedEntity();
		if (qtoHeader){
			qtoTypeId = qtoHeader.QtoTypeFk;
		}

		return qtoTypeId;
	}

	private setQtoSheetStatusList(values: IBasicsCustomizeQtoSheetStatusEntity[]) {
		this.qtoSheetStatusList = values;
	}

	public getQtoSheetStatusList(): IBasicsCustomizeQtoSheetStatusEntity[] {
		return this.qtoSheetStatusList;
	}

	// endregion
}
