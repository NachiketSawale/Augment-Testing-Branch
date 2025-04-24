/*
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EventEmitter, inject } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService, PlatformDateService, PlatformTranslateService } from '@libs/platform/common';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceOptions, IDataServiceRoleOptions, IReadOnlyField, ServiceRole, ValidationInfo } from '@libs/platform/data-access';
import { IQtoShareDetailEntity } from '../model/entities/qto-share-detail-entity.interface';
import { QtoShareDetailGridComplete } from '../model/qto-share-detail-complete.class';
import { IReadonlyRootService } from '@libs/procurement/shared';
import { IQtoShareHeaderEntity } from '../model/entities/qto-share-header-entity.interface';
import { MainDataDto } from '@libs/basics/shared';
import { QtoShareBoqType } from '../model/enums/qto-share-boq-type.enum';
import { QtoShareDetailReadonlyProcessor } from './processors/qto-share-detail-readonly-processor.service';
import { IBasicsCustomizeQtoDetailStatusEntity } from '@libs/basics/interfaces';
import { QtoShareTargetType } from '../model/enums/qto-share-target-type.enum';
import { QtoShareDetailValidationService } from './validation/qto-share-detail-validation.service';
import { QtoShareLineType } from '../model/enums/qto-share-line-type.enum';
import { IQtoShareFormulaEntity } from '../model/entities/qto-share-formula-entity.interface';
import { QtoShareAddressMap } from '../model/interfaces/qto-share-address-map.interface';
import { QtoShareDetailCreateService } from './qto-share-detail-create.service';
import { QtoShareDetailCopyService } from './qto-share-detail-copy.service';
import { QtoShareDetailCalculateService } from './qto-share-detail-calculate.service';
import { IQtoShareDetailCopyParameter } from '../model/interfaces/qto-share-detail-copy-parameter.interface';
import { IQtoShareLineTypeEntity } from '../model/entities/qto-share-line-type.interface';
import {
	ILastLineAddressInterface, IQtoAddressRange, IQtoDetailAddressScrope,
	IQtoDetailListInfoInterface,
	IQtoDetailSimpleInterface, IQtoDetailValidInfo,
	IQtoSheetInterface,
	QtoType
} from '@libs/qto/interfaces';

/**
 * qto detail share data service
 */
export abstract class QtoShareDetailDataService<T extends IQtoShareDetailEntity, U extends QtoShareDetailGridComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatNode<T, U, PT, PU> {
	protected readonly http = inject(HttpClient);
	protected readonly configurationService = inject(PlatformConfigurationService);

	protected readonly translateService = inject(PlatformTranslateService);

	protected readonly platformDateService = inject(PlatformDateService);

	protected isFormulaChanged: boolean = false;
	public readonly readonlyProcessor: QtoShareDetailReadonlyProcessor<T, U, PT, PU>;
	public readonly dataValidationService: QtoShareDetailValidationService<T, U, PT, PU>;
	private readonly newItemService: QtoShareDetailCreateService<T, U, PT, PU>;
	public readonly copyItemService: QtoShareDetailCopyService<T, U, PT, PU>;
	private readonly calculateService: QtoShareDetailCalculateService<T, U, PT, PU>;

	public currentQtoHeader?: IQtoShareHeaderEntity;

	public boqType: number = QtoShareBoqType.QtoBoq;

	public qtoDetailStatus: IBasicsCustomizeQtoDetailStatusEntity[] = [];
	public qtoLineTypes: IQtoShareLineTypeEntity[] = [];

	private readonly detailArray: string[] = ['Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'];
	private readonly operatorArray: string[] = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];
	private readonly modelArray: string[] = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5', 'Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];

	//TODO: missing => boq -lnt
	// private selectBoq = null;
	private fromBoqChanged: boolean = false;
	private isAutomaticallyCreateQTO: boolean = false;
	private updateIsInvoking: boolean = false;
	private isCreatedSucceeded: boolean = false;
	private boqLineTypeFk: number = 0;
	private defaultQtoFormula: IQtoShareFormulaEntity | null = null;
	private pageNumberCell: number = -1;
	private currentCell: number = -1;
	private pageNumberCreated: number = 0;
	private showQtoUserFormDialog: boolean = false;
	private isFilterActive: boolean = false;
	private isFilterByNoWipOrBilActive: boolean = false;
	private changedBoqIds: number[] = [];

	public selectedPageNumber: number | null = null;
	public lineAddress: ILastLineAddressInterface = {};
	public isInsert: boolean = false;
	public lastQtoDetail: T | null = null;
	public allQtoDetailEntities: T[] = [];
	public filterPageNumbers: number[] = [];
	public isFirstStep: boolean = false;
	public sheetAreaList: number[] = [];
	public qtoTypeFk: number = 0;

	//TODO: define events -lnt
	// service.dataRefreshed = new PlatformMessenger();
	// service.cellStyleChanged = new PlatformMessenger();
	// service.cellStyleChangedForQtoLines = new PlatformMessenger();
	// service.resizeGrid = new PlatformMessenger();

	protected constructor(
		public parentService: IReadonlyRootService<PT, PU>,
		protected config: {
			boqType?: number;
			roleInfo?: IDataServiceRoleOptions<T>;
		},
	) {
		const apiUrl = 'qto/main/detail';

		const roleInfo = config.roleInfo
			? config.roleInfo
			: <IDataServiceChildRoleOptions<T, PT, PU>>{
					role: ServiceRole.Node,
					itemName: 'QtoDetail',
					parent: parentService,
				};

		const options: IDataServiceOptions<T> = {
			apiUrl: apiUrl,
			readInfo: {
				endPoint: 'list',
				usePost: true,
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
			},
			roleInfo: roleInfo,
		};

		super(options);

		this.boqType = config.boqType ? config.boqType : QtoShareBoqType.QtoBoq;

		// processor: readonly and data processor
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([
			this.readonlyProcessor,
			// TODO - date processor
		]);

		// validation service
		this.dataValidationService = this.createDataValidationService();

		// create item service
		this.newItemService = this.createNewItemService();

		// copy item service
		this.copyItemService = this.createItemCopyService();

		// calculate qto line service
		this.calculateService = this.createCalculateService();

		// register events
		this.subscribeEventsChanged();

		if (this.boqType === QtoShareBoqType.QtoBoq) {
			void this.getAllQtoDetailEntities();
		}
	}

	public getCurrentQtoHeader() {
		return this.getQtoHeaderSelected();
	}

	// region create service: createservice, copyservice

	/**
	 * create new readonly processor
	 * @protected
	 */
	protected createReadonlyProcessor() {
		return new QtoShareDetailReadonlyProcessor(this);
	}

	/**
	 * create new detail validation service
	 * @protected
	 */
	protected createDataValidationService() {
		return new QtoShareDetailValidationService(this);
	}

	/**
	 * create qto line: create, inset and split buttons
	 * create multi qto lines
	 * @protected
	 */
	protected createNewItemService() {
		return new QtoShareDetailCreateService(this);
	}

	/**
	 * copy qto lines: copy button
	 * drag/drop to copy
	 * souce qto lines copy
	 * @protected
	 */
	protected createItemCopyService() {
		return new QtoShareDetailCopyService(this);
	}

	/**
	 * calculate qto line service
	 * @protected
	 */
	protected createCalculateService() {
		return new QtoShareDetailCalculateService(this);
	}

	// endregion

	/**
	 * register the event: SelectionChanged...
	 * @private
	 */
	private subscribeEventsChanged() {
		if (this.boqType === QtoShareBoqType.QtoBoq) {
			this.parentService.selectionChanged$.subscribe(() => {
				this.qtoMainHeaderGridSelectionChanged();
			});
		}
	}

	//TODO: missing => basicsLookupdataLookupFilterService.registerFilter(filters); -lnt
	// var filters = [
	//     {
	//         key: 'qto-detail-reference-filter',
	//         fn: function (dataItem, dataContext) {
	//             return dataItem.Id !== dataContext.Id;
	//         }
	//     } .....
	// basicsLookupdataLookupFilterService.registerFilter(filters);

	protected override provideLoadPayload(): object {
		this.currentQtoHeader = this.getQtoHeaderSelected();
		this.boqType = this.getBoqType();
		return {
			MainItemId: this.getMainItemId(),
			PrjProjectFk: this.getPrjProjectFk(),
			BoqHeaderFk: this.getBoqHeaderFk(),
			BasRubricCategoryFk: this.getBasRubricCategoryFk(),
			IsQtoBoq: this.boqType === QtoShareBoqType.QtoBoq,
			IsPrjBoq: this.boqType === QtoShareBoqType.PrjBoq,
			IsPrcBoq: this.boqType === QtoShareBoqType.PrcBoq,
			IsPesBoq: this.boqType === QtoShareBoqType.PesBoq,
			IsWipBoq: this.boqType === QtoShareBoqType.WipBoq,
			IsBillingBoq: this.boqType === QtoShareBoqType.BillingBoq,
			BoqType: this.boqType,
			QtoTypeFk: this.getQtoTypeFk(),
			IsCrbBoq: this.getIsCrbBoq(),
			SubQuantityBoqItemFks: this.getSubQuantityBoqItemFks(),
			PesHeaderFk: this.getPesHeaderFk(),
			WipHeaderFk: this.getWipHeaderFk(),
			BilHeaderFk: this.getBilHeaderFk(),
			BoqSplitQuantityFk: this.getBoqSplitQuantityFk(),
			IsFilterByNoWipOrBilActive: this.getIsFilterByNoWipOrBilActive(),
			//TODO: missing => filters containers -lnt
			Boqs: [],
			Locations: [],
			BillTos: [],
			PageNumberIds: [],
			Structures: [],
			CostGroupFks: [],
		};
	}

	// region initReadData: the paramaters for get qto details

	/**
	 * Get qto selected Header: here for qto module to override
	 * @protected
	 */
	protected getQtoHeaderSelected(): IQtoShareHeaderEntity | undefined {
		return undefined;
	}

	/**
	 * Get MainItemId:
	 * qto mudule: the qtoheader id
	 * other modules: project boq, wip boq, bill boq, package boq and pes boq, the MainItemId is source boqitem id
	 * @protected
	 */
	protected getMainItemId(): number {
		const qtoHeader = this.getQtoHeaderSelected();
		return qtoHeader ? qtoHeader.Id : -1;
	}

	/**
	 * Get qto BoqType: default is qtoboq
	 * @protected
	 */
	protected getBoqType(): number {
		return QtoShareBoqType.QtoBoq;
	}

	/**
	 * only fo qto module
	 * @protected
	 */
	protected getPrjProjectFk(): number {
		const qtoHeader = this.getQtoHeaderSelected();
		return qtoHeader ? qtoHeader.ProjectFk : -1;
	}

	/**
	 * BasRubricCategoryFk
	 * defualt qto module; get from qtoheader
	 * other modules:...
	 * @protected
	 */
	protected getBasRubricCategoryFk(): number {
		const qtoHeader = this.getQtoHeaderSelected();
		return qtoHeader ? qtoHeader.BasRubricCategoryFk : -1;
	}

	/**
	 * Get BoqHeaderFk
	 * @protected
	 */
	protected getBoqHeaderFk(isCreate: boolean = false): number {
		if (isCreate) {
			//TODO: missing => qtoBoqStructureService
			// const qtoBoqItem = $injector.get('qtoBoqStructureService').getSelected();
			// creationData.BoqHeaderFk = qtoBoqItem ? qtoBoqItem.BoqHeaderFk : -1;
			return -1;
		} else {
			const qtoHeader = this.getQtoHeaderSelected();
			return qtoHeader ? qtoHeader.BoqHeaderFk : -1;
		}
	}

	/**
	 * Get QtoTypeFk
	 * default: get from qtoheader
	 * other module: ...
	 * @protected
	 */
	protected getQtoTypeFk(): number {
		const qtoHeader = this.getQtoHeaderSelected();
		return qtoHeader ? qtoHeader.QtoTypeFk : -1;
	}

	/**
	 * Get Is CrbBoq
	 * @protected
	 */
	protected getIsCrbBoq(): boolean {
		return false;
	}

	/**
	 * Get SubQuantityBoqItemFk
	 * @protected
	 */
	protected getSubQuantityBoqItemFks(): number[] {
		return [];
	}

	/**
	 * Get PesHeaderFk
	 * @protected
	 */
	protected getPesHeaderFk(): number {
		return -1;
	}

	/**
	 * Get WipHeaderFk
	 * @protected
	 */
	protected getWipHeaderFk(): number {
		return -1;
	}

	/**
	 * Get BilHeaderFk
	 * @protected
	 */
	protected getBilHeaderFk(): number {
		return -1;
	}

	/**
	 * Get BoqSplitQuantityFk
	 * @protected
	 */
	protected getBoqSplitQuantityFk(): number | undefined {
		return undefined;
	}

	/**
	 * Get Is IsFilterByNoWipOrBilActive
	 * @protected
	 */
	protected getIsFilterByNoWipOrBilActive(): boolean {
		return false;
	}

	// endregion

	protected override onLoadSucceeded(loaded: object): T[] {
		const dto = new MainDataDto<T>(loaded);
		const entities = dto.Main;

		//TODO: generate cost group validation on qto detail => handleBeforeQtoLineResponse(readData)

		//TODO: setLookupData

		//TODO: setQtoHeaderInfo

		// set QtoDetailStatus
		this.qtoDetailStatus = _.get(dto, 'QtoDetailStatus') as unknown as IBasicsCustomizeQtoDetailStatusEntity[];

		// set QtoLineTypes
		this.qtoLineTypes =	_.get(dto, 'qtoLineTypeCodeLookupService') as unknown as IQtoShareLineTypeEntity[];

		// todo - dynamic cost group columns

		return entities;
	}

	protected override provideCreatePayload(): object {
		const selectedItem = this.getSelectedEntity();
		const itemList = this.getList();
		const item = itemList && itemList.length > 0 && selectedItem === null ? itemList[itemList.length - 1] : selectedItem;
		const billToFK = selectedItem ? selectedItem.BillToFk : null;

		return {
			SelectItem: item,
			QtoHeaderFk: this.boqType === QtoShareBoqType.QtoBoq ? this.currentQtoHeader?.Id : -1,
			BasRubricCategoryFk: this.getBasRubricCategoryFk(),
			SelectedPageNumber: this.selectedPageNumber,
			LastLineAddress: this.lineAddress,
			BoqHeaderFk: this.getBoqHeaderFk(true),
			BoqItemFk: this.getBoqItemFk(),
			SelectedBoqHeaderFk: this.getSelectedBoqHeaderFk(),
			SelectedBoqItemFk: this.getSelectedBoqItemFk(),
			IsPrjBoq: this.boqType === QtoShareBoqType.PrjBoq,
			IsPrcBoq: this.boqType === QtoShareBoqType.PrcBoq,
			BillToFk: this.BillToFk(billToFK),
			IsBillingBoq: this.boqType === QtoShareBoqType.BillingBoq,
			IsWipBoq: this.boqType === QtoShareBoqType.WipBoq,
			IsPesBoq: this.boqType === QtoShareBoqType.PesBoq,
			IsQtoBoq: this.boqType === QtoShareBoqType.QtoBoq,
			IsInsert: this.isInsert,
			FromBoqChanged: this.fromBoqChanged,
			BasUomFk: this.getBasUomFK(),
			OrdHeaderFk: this.getOrdHeaderFk(),
			BilHeaderFk: this.getBilHeaderFk(),
			PesHeaderFk: this.getPesHeaderFk(),
			BoqSplitQuantityFk: this.getSelectedBoqSplitQuantityFk(),
		};
	}

	// region initCreationData

	/**
	 * get select boqItemfk to create qto line
	 * @protected
	 */
	protected getBoqItemFk(): number {
		//TODO: missing => qtoBoqStructureService -lnt
		// var qtoBoqItem = $injector.get('qtoBoqStructureService').getSelected();
		// creationData.BoqItemFk = qtoBoqItem ? qtoBoqItem.Id : -1;
		return -1;
	}

	private BillToFk(value: number | null | undefined): number | null | undefined {
		const billToFk = value;
		if (this.boqType === QtoShareBoqType.QtoBoq) {
			const qtoHeader = this.getQtoHeaderSelected();
			if (qtoHeader && qtoHeader.QtoTargetType === QtoShareTargetType.SalesWipBill) {
				//TODO: missing => qtoMainBillToDataService -lnt
				// const boqItem = $injector.get('qtoMainBillToDataService').getSelected();
				// if (boqItem){
				//     billToFk = boqItem.Id;
				// }
			}
		}

		return billToFk;
	}

	/**
	 * get base uomfk: the boqitem uomfk
	 * @protected
	 */
	protected getBasUomFK(): number {
		return -1;
	}

	/**
	 * get Selected BoqHeaderFk
	 * @protected
	 */
	protected getSelectedBoqHeaderFk(): number {
		return -1;
	}

	/**
	 * get Selected BoqItemFk
	 * @protected
	 */
	protected getSelectedBoqItemFk(): number {
		return -1;
	}

	/**
	 * get OrdHeaderFk
	 * @protected
	 */
	protected getOrdHeaderFk(): number {
		return -1;
	}

	/**
	 * get Selected BoqSplitQuantityFk
	 * @private
	 */
	private getSelectedBoqSplitQuantityFk(): number {
		//TODO: missing => splitQuantityService -lnt
		// if selected boq split item
		// var splitQuantityService = service.getBoqSplitQuantityService(boqType);
		// var splitItem = splitQuantityService.getSelected();
		// creationData.BoqSplitQuantityFk = splitItem ? splitItem.Id :
		//     (creationData.SelectItem && creationData.SelectItem.BoqItemFk === creationData.BoqItemFk ? creationData.SelectItem.BoqSplitQuantityFk : null);
		return -1;
	}

	// endregion

	/**
	 * on create Succeeded
	 * @param created
	 * @protected
	 */
	protected override onCreateSucceeded(newItem: T): T {
		// set the created status
		this.setIsCreatedSucceeded(true);

		//TODO: missing => qto sheet create logic createQtoStructure -lnt

		const baseItem = this.getSelectedEntity();

		const isNewItemInOldGroup = () => {
			if (!baseItem) {
				return false;
			}

			//TODO: need to check how to replace creationData -lnt
			// if (baseItem && baseItem.QtoFormula && !baseItem.QtoFormula.IsMultiline || creationData.FromBoqChanged || (!creationData.IsInsert && checkOperator(baseItem))) {
			// 	return false;
			// }

			const orderedList = this.getOrderedList([]);
			const baseItemIdx = _.indexOf(orderedList, baseItem);
			//TODO: using the this.isInsert replace creationData.IsInsert first -lnt
			const releatedItem = baseItemIdx < 0 ? null : /*creationData.IsInsert*/ this.isInsert ? orderedList[baseItemIdx - 1] : orderedList[baseItemIdx + 1];
			const selectedBoqItemFk = this.getSelectedBoqItemId();
			const selectedLocationFk = this.getselectedPrjLocationId();

			const sameBoqItemFk = selectedBoqItemFk === -1 || selectedBoqItemFk === baseItem.BoqItemFk;
			const samePrjLocationFk = selectedLocationFk === -1 || selectedLocationFk === baseItem.PrjLocationFk;

			if (releatedItem) {
				return releatedItem.QtoDetailGroupId === baseItem.QtoDetailGroupId || /*!creationData.IsInsert*/ (!this.isInsert && !this.checkOperator(baseItem) && sameBoqItemFk && samePrjLocationFk);
			} else {
				return /*creationData.IsInsert*/ this.isInsert ? false : !this.checkOperator(baseItem) && sameBoqItemFk && samePrjLocationFk;
			}
		};

		//TODO: qto sheet not ready -lnt
		//newItem.QtoSheetFk = sheetItem ? sheetItem.Id : null;

		this.initSomeProperties(newItem);

		if (baseItem && !_.isEmpty(baseItem.QtoFormula)) {
			if (isNewItemInOldGroup()) {
				this.syncQtoDetailGroupProperty(newItem, baseItem, true);
			} else {
				newItem.QtoDetailGroupId = newItem.Id;
			}
		} else {
			newItem.QtoDetailGroupId = newItem.Id;
		}

		this.fireSomeEvents(newItem);

		const qtoDetails = this.getList();
		//TODO: parentService not ready -lnt
		// if (parentService.setRubricCatagoryReadOnly) {
		// 	parentService.getSelected().hasQtoDetal = (qtoDetails && qtoDetails.length);
		// 	parentService.setRubricCatagoryReadOnly.fire();
		// }

		const groupItem = _.filter(qtoDetails, function (detail) {
			return detail.QtoDetailGroupId === newItem.QtoDetailGroupId;
		});

		this.updateQtoLineReferenceReadOnly(groupItem);

		this.finishCreatingItem();

		return newItem;
	}

	public async baseCteate() {
		await super.create();
	}

	//TODO: missing => only readonly -lnt
	// source qto is a root container
	// if (serviceName === 'qtoMainLineLookupService'){
	//     serviceContainer.data.doUpdate = null;
	// }

	protected override checkCreateIsAllowed(entities: IQtoShareDetailEntity[] | IQtoShareDetailEntity | null): boolean {
		// TODO: create button logic
		return true;
	}

	protected override checkDeleteIsAllowed(entities: IQtoShareDetailEntity[] | IQtoShareDetailEntity | null): boolean {
		// TODO: delete button logic
		return true;
	}

	//TODO: missing => handleOnDeleteSucceeded, framework doesn't support it -lnt
	// protected override handleOnDeleteSucceeded(){
	//     if (this.boqType === QtoShareBoqType.QtoBoq){
	//         let sheetList = $injector.get('qtoMainStructureDataService').getList();
	//         parentService.getSelected().hasQtoDetal = !!service.getList().length || !!sheetList.length;
	//         parentService.updateReadOnly(parentService.getSelected(), 'BasGoniometerTypeFk', parentService.getSelected().BasGoniometerTypeFk);
	//     }
	// }

	// events
	//TODO: missing => costgroup -lnt
	//public onCostGroupCatalogsLoaded = new EventEmitter();
	public updateQtoBtnTools: EventEmitter<void> = new EventEmitter();
	public updateQtoLineToolsOnHeaderSelectedChange: EventEmitter<void> = new EventEmitter();

	/**
	 * if filter by all,  doNotLoadOnSelectionChange
	 * @param isFilterActive
	 */
	public hasToLoadOnFilterActiveChange(isFilterActive: boolean) {
		//TODO: missing => doNotLoadOnSelectionChange, framework doesn't support -lnt
		// serviceContainer.data.doNotLoadOnSelectionChange = isFilterActive;
	}

	private setIsAutomaticallyCreateQTO(value: boolean) {
		this.isAutomaticallyCreateQTO = value;
	}

	/**
	 * select boqitem to create qtoline: system option
	 */
	public getIsAutomaticallyCreateQTO(): boolean {
		return this.isAutomaticallyCreateQTO;
	}

	/**
	 * get ParentService
	 */
	public getParentService() {
		return this.parentService;
	}

	private qtoMainHeaderGridSelectionChanged() {
		//selectBoq = null;
		this.selectedPageNumber = null;
		//TODO: missing => qto boq contianer -lnt
		//$injector.get('qtoBoqStructureService').setHighlight(undefined);
	}

	public increaseChar(value: string) {
		let ascii = value.charCodeAt(0);
		if (ascii === 90) {
			return null;
		} else if (ascii < 65 || ascii > 90 || isNaN(ascii)) {
			ascii = 65;
		} else {
			ascii += 1;
		}
		return String.fromCharCode(ascii);
	}

	private getResetLineAddress(lastItem: T, perReference: number, roundIndex: number) {
		const lineAddress: ILastLineAddressInterface = {};
		let pageNumber = lastItem.PageNumber;
		let lineIndex = lastItem.LineIndex;
		let lineReference = (_.isNil(lastItem.LineReference) ? '' : lastItem.LineReference) as string;

		if (roundIndex) {
			const count = lineIndex + roundIndex;
			const lastIndex = this.qtoTypeFk === 1 ? 99 : 9;
			lineAddress.LineIndex = count < lastIndex ? count : (count % lastIndex) - 1;
			lineAddress.PageNumber = pageNumber;
			lineAddress.LineReference = lineReference;
			const maxLineRef = this.increaseChar(lineReference || ' ');
			if (count > lastIndex && maxLineRef !== null) {
				lineAddress.LineReference = maxLineRef;
			} else if (count > lastIndex && maxLineRef === null) {
				lineAddress.PageNumber = pageNumber + 1;
				lineAddress.LineReference = 'A';
			}
		}

		if (perReference) {
			for (let i = 0; i < perReference; i++) {
				lineAddress.PageNumber = pageNumber;
				lineAddress.LineIndex = lineIndex;

				const nextLineReference = this.increaseChar(lineReference || ' ');
				if (nextLineReference === null) {
					lineAddress.PageNumber = pageNumber + 1;
					lineAddress.LineReference = 'A';
				} else {
					lineAddress.LineReference = nextLineReference;
				}

				pageNumber = lineAddress.PageNumber;
				lineIndex = lineAddress.LineIndex;
				lineReference = lineAddress.LineReference;
			}
		}

		return lineAddress;
	}

	/**
	 * RubricCatagory Changed
	 * @param selectedQtoHeader
	 */
	public onQtoHeaderRubricCatagoryChanged(selectedQtoHeader: IQtoShareHeaderEntity) {
		// BasRubricCategoryFk is "Live Take Off"
		if (selectedQtoHeader.BasRubricCategoryFk === 6) {
			const itemList = this.getList();
			_.forEach(itemList, (item) => {
				item.V = null;
				this.setModified(item);
			});
		}

		this.calculateQtoLines();
	}

	/**
	 * calculate qto lines
	 */
	public calculateQtoLines() {
		this.calculateService.calculateQtoLines();
	}

	//TODO: missing => setQtoHeaderInfo -lnt

	private handleBeforeQtoLineResponse(data: object) {
		//TODO: missing => cost group, validations from other module -lnt
	}

	/**
	 * private function updateStatusBarPrjChangeStutasIcon replace as updateIcon
	 * @param showIcon
	 * @private
	 */
	private updateIcon(showIcon: boolean) {
		// TODO: Temporarily commenting out to resolve eslint the error because it never used.
		// const barPrjChangeStutasIcon = {
		// 	id: 'qtoLineStatus',
		// 	type: 'text',
		// 	align: 'right',
		// 	disabled: false,
		// 	cssClass: 'status-icons ico-status33',
		// 	toolTip: this.translateService.instant('qto.main.prjChangeStatusReadOnlyInfo'),
		// 	visible: true,
		// 	ellipsis: true,
		// 	value: showIcon ? '..' : '',
		// };

		//TODO: missing => _scope.getUiAddOns and sb.updateFields -lnt
		// if (_.isFunction(_scope.getUiAddOns)) {
		//     const sb = _scope.getUiAddOns().getStatusBar();
		//     sb.updateFields(barPrjChangeStutasIcon);
		// }
	}

	public updateStatusBarPrjChangeStutasIcon(qtoLine: T) {
		if (!qtoLine) {
			this.updateIcon(false);
			return;
		}

		const selectedQtoHeader = this.getQtoHeaderSelected();

		if (selectedQtoHeader && selectedQtoHeader.PrjChangeStutasReadonly) {
			return;
		}

		this.updateIcon(!!qtoLine.PrjChangeStutasReadonly);
	}

	/**
	 * delete temp qtolines
	 */
	public deleteTemporaryQtos(): boolean {
		let isDelete = false;
		// remove the temporary qto that created by change boqItem
		const temporaryQtos = _.filter(this.getList(), {
			createQtoItemByBoqItemChangeFlag: true,
			Version: 0,
		}) as T[];
		if (temporaryQtos.length) {
			this.delete(temporaryQtos);
			isDelete = true;
		}
		return isDelete;
	}

	/**
	 *  mark formula changed, if select different formula on formula lookup
	 * @param isChanged
	 */

	/**
	 * update the same group qto which qto's readonly is not true
	 * @param currentQto
	 */
	public getTheSameGroupQto(currentQto: T): T[] {
		let result: T[] = [];
		const itemList = this.getList();

		if (!currentQto || !itemList || itemList.length < 1) {
			return result;
		}

		result = _.filter(itemList, { QtoDetailGroupId: currentQto.QtoDetailGroupId }) as T[];

		return result;
	}

	public getCurrentResultSet() {
		//TODO: missing => not ready -lnt
		// let gridData = [];
		// let grid = $injector.get('platformGridAPI').grids.element('id', service.getGridId());
		// if (grid.instance) {
		//     gridData = grid.instance.getData().getRows();
		// }
		// return gridData;
	}

	/**
	 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
	 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
	 */
	private getSelectedItems(): T[] {
		const resultSet = this.getSelection();

		return this.createInquiryResultSet(resultSet);
	}

	/**
	 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
	 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
	 */
	private getResultsSet() {
		const resultSet = this.getList();
		return this.createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
	}

	/**
	 * This function creates Inquiry Resultset from input resultset (busniness partner specific)
	 *
	 * {InquiryItem} containing:
	 *     {  id:   {integer} unique id of type integer
	 *        name: {string}  name of item, will be displayed in inquiry sidebar as name
	 *        description: {string}  description  of item, will be displayed in inquiry sidebar as description
	 *     });
	 *
	 * @param resultSet
	 * @returns {Array} see above
	 */
	private createInquiryResultSet(resultSet: T[]) {
		const resultArr: T[] = [];
		//TODO: missing => sidebarInquiry
		// _.forEach(resultSet, function (item) {
		//     if (item && item.Id) { // check for valid object
		//         resultArr.push({
		//             id: item.Id,
		//             name: item.QtoDetailReference,
		//             description: item.QtoDetailReference,
		//             qtoHeaderId: item.QtoHeaderFk
		//         });
		//     }
		// });

		return resultArr;
	}

	//TODO: mssing => showCreateMultiItemsInProgress, not sure about the progress -lnt

	/**
	 * update info with calculation info
	 * @param selectChange
	 */
	public async updateCalculation(selectChange: boolean) {
		if (this.updateIsInvoking) {
			return;
		}

		const itemList = this.getList();
		const validateResult = this.getValidateResultByItemList(itemList, selectChange);

		if (validateResult) {
			this.updateIsInvoking = true;
			//TODO: missing => moudles: package, pes, boq, bill and wip -lnt
		}
	}

	private getValidateResultByItemList(itemList: T[], selectChange: boolean): boolean {
		let validateResult = false;

		if (itemList.length === 1) {
			if (!selectChange) {
				validateResult = true;
			} else if (selectChange && itemList[0].Version !== 0) {
				validateResult = true;
			}
		}

		if (itemList.length > 1 || itemList.length === 0) {
			validateResult = true;
		}

		// has error or not
		if (itemList.length > 0) {
			validateResult = this.hasError(itemList) ? false : validateResult;
		}

		return validateResult;
	}

	private hasError(itemList: T[]) {
		const item = _.find(itemList, { HasError: true });
		return !!item;
	}

	/**
	 * get qto header by boqId and boqtype
	 * @param value
	 * @private
	 */
	private async getQtoHeaderByBoqId(value: number) {
		const data = {
			BoqHeaderId: value,
			QtoTargetTypeId: null,
			qtoBoqType: this.boqType,
		};

		const url = this.configurationService.webApiBaseUrl + 'qto/main/header/getqtoheaderbyboqheaderid';

		return (await firstValueFrom(this.http.post(url, data))) as IQtoShareHeaderEntity;
	}

	public convertDateToUtcDate(item: T) {
		if (item) {
			// to convert to date utc
			item.PerformedFromWip = _.isString(item.PerformedFromWip) ? this.platformDateService.formatUTC(item.PerformedFromWip as string) : item.PerformedFromWip;
			item.PerformedToWip = _.isString(item.PerformedToWip) ? this.platformDateService.formatUTC(item.PerformedToWip as string) : item.PerformedToWip;
			item.PerformedFromBil = _.isString(item.PerformedFromBil) ? this.platformDateService.formatUTC(item.PerformedFromBil as string) : item.PerformedFromBil;
			item.PerformedToBil = _.isString(item.PerformedToBil) ? this.platformDateService.formatUTC(item.PerformedToBil as string) : item.PerformedToBil;
			item.PerformedDate = _.isString(item.PerformedDate) ? this.platformDateService.formatUTC(item.PerformedDate as string) : item.PerformedDate;
		}
	}

	/**
	 * set select item
	 * @param newItem
	 */
	public setDataSelectedItem(newItem: T) {
		void this.select(newItem);
	}

	public finishCreatingItem() {
		//TODO: missing => not sure how to use -lnt
	}

	/**
	 * create qto line with boqItem selected
	 */
	public createQtoItemByBoqItemChange() {
		this.newItemService.createQtoItemByBoqItemChange();
	}

	/**
	 * create qto line: append
	 */
	public createItem() {
		this.newItemService.createItem(this.qtoTypeFk);
	}

	/**
	 * create qto line: insert
	 */
	public insertItem() {
		this.newItemService.insertItem(this.qtoTypeFk);
	}

	/**
	 * copy qto lines
	 * @param copyParam
	 */
	public async copyPaste(copyParam: IQtoShareDetailCopyParameter<T>) {
		// parameters: will be removed later -lnt
		// (isDrag: boolean, dragItems: T[], toTarget: string, toTargetItemId: number, selectedItem: T, PageNumber: number,
		//  QtoSheetFk: number, isSearchCopy: boolean = false, ordHeaderFk: number = -1)

		await this.copyItemService.copyPaste(copyParam);
	}

	/**
	 * copy qto detail with drag
	 * @param isDrag
	 * @param dragItems
	 * @param toTarget
	 * @param toTargetItemId
	 * @param selectedItem
	 * @param PageNumber
	 * @param QtoSheetFk
	 * @constructor
	 */
	public async CopyQtoDetailByDrag(copyParam: IQtoShareDetailCopyParameter<T>) {
		// parameters: will be removed later -lnt
		// (isDrag: boolean, dragItems: T[], toTarget: string, toTargetItemId: number, selectedItem: T, PageNumber: number,
		//  QtoSheetFk: number)
		await this.copyItemService.CopyQtoDetailByDrag(copyParam);
	}

	private initSomeProperties(newItem: T) {
		this.setQtoDetailAttributeWithFilter(newItem);

		const itemList = this.getList();
		const length = itemList.length;
		const selectItem = this.getSelectedEntity();
		const lastQtoDetail = selectItem ? selectItem : itemList[length - 1];

		if (lastQtoDetail !== null && lastQtoDetail !== undefined && Object.prototype.hasOwnProperty.call(lastQtoDetail, 'Id')) {
			// Assign BoqItemCode and BoqItemFk
			newItem.BoqItemCode = lastQtoDetail.BoqItemCode;
			newItem.BoqItemFk = lastQtoDetail.BoqItemFk;

			if (
				lastQtoDetail.QtoLineTypeFk !== QtoShareLineType.CommentLine &&
				lastQtoDetail.QtoLineTypeFk !== QtoShareLineType.RRefrence &&
				lastQtoDetail.QtoLineTypeFk !== QtoShareLineType.LRefrence &&
				lastQtoDetail.QtoLineTypeFk !== QtoShareLineType.IRefrence
			) {
				newItem.QtoFormula = lastQtoDetail.QtoFormula;
				newItem.QtoFormulaFk = lastQtoDetail.QtoFormulaFk;
			}

			newItem.BasUomFk = lastQtoDetail.BasUomFk;
			newItem.ClassificationFk = lastQtoDetail.ClassificationFk;
			newItem.BudgetCodeFk = lastQtoDetail.BudgetCodeFk;
			newItem.AssetMasterFk = lastQtoDetail.AssetMasterFk;
		}

		const isValidateBoqSplitQuantity: boolean = false;
		//TODO: missing => qto boq not ready -lnt
		// if select boq
		// is boqtype is prjBoq or prcBoq ,use parentserveri.then keep the newitem value
		// if (this.boqType !== QtoShareBoqType.QtoBoq && (this.boqType !== QtoShareBoqType.WipBoq && this.boqType !== QtoShareBoqType.BillingBoq &&
		// 	this.boqType !== QtoShareBoqType.PesBoq)) {
		// 	let boqItem = parentService.getSelected();
		// 	newItem.BoqItemFk = boqItem.Id;
		// 	newItem.BoqItemCode = boqItem.Reference;
		// 	newItem.BasUomFk = boqItem.BasUomFk;
		// } else if (selectBoq && (selectBoq.BoqLineTypeFk === 0 || selectBoq.BoqLineTypeFk === 11)) { // 0: position; 11: CrbSubQuantity
		// 	newItem.BoqItemFk = selectBoq.Id;
		// 	newItem.BoqItemCode = selectBoq.Reference;
		// 	newItem.BasUomFk = selectBoq.BasUomFk;
		// 	isValidateBoqSplitQuantity = true;
		// }

		// if boq item is same, set the split as last qto item.
		if (!newItem.BoqSplitQuantityFk && newItem.HasSplitQuantiy && lastQtoDetail && newItem.BoqItemFk === lastQtoDetail.BoqItemFk) {
			newItem.BoqSplitQuantityFk = lastQtoDetail.BoqSplitQuantityFk;
		}

		// do validate for boq split quantity
		if (isValidateBoqSplitQuantity) {
			const boqSplitQuantityFk = (_.isNil(newItem.BoqSplitQuantityFk) ? 0 : newItem.BoqSplitQuantityFk) as number;
			const info: ValidationInfo<T> = new ValidationInfo<T>(newItem, boqSplitQuantityFk, 'BoqSplitQuantityFk');
			void this.dataValidationService.validateBoqSplitQuantityFk(info);
		}

		if (newItem.QtoTypeFk) {
			const qtoHeader = this.getQtoHeaderSelected();
			if (qtoHeader) {
				newItem.QtoTypeFk = qtoHeader.QtoTypeFk;
			}
		}

		// to convert to date utc
		this.convertDateToUtcDate(newItem);
	}

	private fireSomeEvents(newItem: T, isPush: boolean = false) {
		newItem.IsCalculate = true; // when new item(create, insert and copy), calculate the qto line
		this.append(newItem);
		if (!isPush) {
			this.allQtoDetailEntities.push(newItem);
		}

		//TODO: missing => not ready -lnt
		//platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);

		//TODO: missing => platformGridAPI

		const sortProperty: string[] = ['PageNumber', 'LineReference', 'LineIndex'];
		this.getList().sort(this.sortDetail(sortProperty));
		this.allQtoDetailEntities.sort(this.sortDetail(sortProperty));

		//TODO: missing => data.listLoaded.fire(null, newItem); -lnt

		//TODO: missing
	}

	public setSelectedRowsAfterDrag(newItems: T[]) {
		//TODO: missing => grid not ready -lnt
	}

	private setQtoDetailAttributeWithFilter(newItem: T) {
		//TODO: missing => the filter not ready -lnt
		// if (boqLineTypeFk === 0 && angular.isArray(service.filterBoqs) && service.filterBoqs.length > 0) {
		// 	newItem.BoqItemFk = service.filterBoqs[0];
		// }
		//
		// if (service.filterLocations && service.filterLocations.length > 0) {
		// 	newItem.PrjLocationFk = service.filterLocations[0];
		// }
		//
		// if (service.filterBillTos && service.filterBillTos.length > 0) {
		// 	newItem.BillToFk = service.filterBillTos[0];
		// }
		// let selectedLocation = $injector.get('qtoMainLocationDataService').getSelected();
		// if (selectedLocation) {
		// 	newItem.PrjLocationFk = selectedLocation.Id;
		// }
		//
		// let selectedBillTo = $injector.get('qtoMainBillToDataService').getSelected();
		// if (selectedBillTo && qtoHeader &&  qtoHeader.QtoTargetType === 2) {
		// 	newItem.BillToFk = selectedBillTo.Id;
		// }
	}

	/**
	 * get not lock sheet
	 * @param targetItem
	 * @param qtoSheets
	 */
	public getNotLockNewPageNumber(targetItem: T, qtoSheets: IQtoSheetInterface[]) {
		const qtoSheet = _.find(qtoSheets, { PageNumber: targetItem.PageNumber });
		if (qtoSheet && qtoSheet.IsReadonly) {
			targetItem.PageNumber = targetItem.PageNumber + 1;
			this.getNotLockNewPageNumber(targetItem, qtoSheets);
		}
	}

	public async doCreateQtoSheets(qtoHeaderId: number, targetItems: T[], pageNumberList: number[], qtoTypeFk: number) {
		const creationData = {
			MainItemId: qtoHeaderId,
			Numbers: pageNumberList,
			QtoType: qtoTypeFk,
		};
		const url = this.configurationService.webApiBaseUrl + 'qto/main/structure/createbyqtolines';
		const response = await firstValueFrom(this.http.post(url, creationData));
		if (response) {
			// TODO: Temporarily commenting out to resolve eslint the error because it never used.
			// const qtoSheetItems = response as IQtoSheetInterface;
			//TODO: missing => the sheet not ready -lnt
		}
	}

	/**
	 * not the compelete qto line entities, it only was used for genereate qto detail reference
	 */
	public async getAllQtoDetailEntities() {
		const selectedQtoHeaderEntity = this.getQtoHeaderSelected();
		if (selectedQtoHeaderEntity) {
			const url = this.configurationService.webApiBaseUrl + 'qto/main/detail/getListByQtoHeaderId?qtoHeaderId=' + selectedQtoHeaderEntity.Id;
			const response = await firstValueFrom(this.http.get(url));
			if (response) {
				const data: IQtoDetailListInfoInterface = response as IQtoDetailListInfoInterface;
				const allSavedQtoDetailEntities: IQtoDetailSimpleInterface[] = data.QtoDetailEntityList;
				const allShownQtoDetailEntities = this.getList();
				this.allQtoDetailEntities = [];
				if (allSavedQtoDetailEntities) {
					if (allShownQtoDetailEntities) {
						while (allSavedQtoDetailEntities.length > 0) {
							const qtoDetailDto = allSavedQtoDetailEntities.pop();
							if (qtoDetailDto) {
								const findResult = _.find(allShownQtoDetailEntities, { Id: qtoDetailDto.Id });
								if (!findResult) {
									this.allQtoDetailEntities.push(qtoDetailDto as T);
								}
							}
						}
						this.allQtoDetailEntities = this.allQtoDetailEntities.concat(allShownQtoDetailEntities);
					} else {
						this.allQtoDetailEntities = allSavedQtoDetailEntities as T[];
					}
				} else {
					if (allShownQtoDetailEntities) {
						this.allQtoDetailEntities = allShownQtoDetailEntities;
					}
				}
			}
		}
	}

	/**
	 * sync QtoDetailGroup Property
	 * @param targetItem
	 * @param sourceItem
	 * @param isCopyCostGroup
	 */
	public syncQtoDetailGroupProperty(targetItem: T, sourceItem: T, isCopyCostGroup: boolean) {
		const groupingPorps = [
			'QtoDetailGroupId',
			'BoqItemCode',
			'PerformedFromWip',
			'PerformedToWip',
			'PerformedFromBil',
			'ProgressInvoiceNo',
			'PerformedToBil',
			'QtoLineTypeFk',
			'QtoFormulaFk',
			'BoqItemFk',
			'PesHeaderFk',
			'IsWQ',
			'IsAQ',
			'IsBQ',
			'IsIQ',
			'IsReadonly',
			'IsBlocked',
			'SpecialUse',
			'V',
			'WipHeaderFk',
			'BilHeaderFk',
			'SortCode01Fk',
			'SortCode02Fk',
			'SortCode03Fk',
			'UserDefined1',
			'UserDefined2',
			'UserDefined3',
			'UserDefined4',
			'UserDefined5',
			'SortCode04Fk',
			'SortCode05Fk',
			'SortCode06Fk',
			'SortCode07Fk',
			'SortCode08Fk',
			'SortCode09Fk',
			'SortCode10Fk',
			'OrdHeaderFk',
			'MdcControllingUnitFk',
			'PrcStructureFk',
			'AssetMasterFk',
			'PrjLocationFk',
			'BillToFk',
			'QtoLineTypeFk',
			'QtoLineTypeCode',
		];

		for (let i = 0; i < groupingPorps.length; i++) {
			const value = _.get(sourceItem, groupingPorps[i]);
			_.set(targetItem, groupingPorps[i], value);
		}
		targetItem.IsSynced = true;

		if (isCopyCostGroup) {
			// $timeout(function () {
			// sync cost group
			for (const key in sourceItem) {
				if (Object.prototype.hasOwnProperty.call(sourceItem, key) && key.indexOf('costgroup_') !== -1 && _.get(sourceItem, key)) {
					// TODO: Temporarily commenting out to resolve eslint the error because it never used.
					// const costGroupCol = {
					// 	field: key,
					// 	costGroupCatId: parseInt(key.substring(10)),
					// };

					_.set(targetItem, key, _.get(sourceItem, key));

					//TODO: missing => createCostGroup2Save
					//service.costGroupService.createCostGroup2Save(targetItem, costGroupCol);
				}
			}

			this.setModified(targetItem);
			// }, 100);
		}
	}

	/**
	 * set the QtoFormula from filter By FormulaUom
	 * @param entity
	 * @param formulaFk
	 */
	public filterByFormulaUom(entity: T, formulaFk: number) {
		if (entity && entity.BasUomFk && entity.BasUomFk > 0) {
			//TODO: missing => basicsLookupdataLookupDescriptorService.getData('QtoFormulaAllUom');
			/* var targetUomData = basicsLookupdataLookupDescriptorService.getData('QtoFormulaAllUom');
            var formulaUom = _.find(targetUomData, function (x) {
                return x.UomFk === entity.BasUomFk && x.QtoFormulaFk === (formulaFk || entity.QtoFormulaFk);
            });

            if (formulaUom &&  entity.QtoFormula) {
                entity.QtoFormula.Operator1 = formulaUom.Operator1;
                entity.QtoFormula.Operator2 = formulaUom.Operator2;
                entity.QtoFormula.Operator3 = formulaUom.Operator3;
                entity.QtoFormula.Operator4 = formulaUom.Operator4;
                entity.QtoFormula.Operator5 = formulaUom.Operator5;
                entity.QtoFormula.Value1IsActive = formulaUom.Value1IsActive;
                entity.QtoFormula.Value2IsActive = formulaUom.Value2IsActive;
                entity.QtoFormula.Value3IsActive = formulaUom.Value3IsActive;
                entity.QtoFormula.Value4IsActive = formulaUom.Value4IsActive;
                entity.QtoFormula.Value5IsActive = formulaUom.Value5IsActive;
            } else {
                this.filterByOriginalFormlar(entity, formulaFk || entity.QtoFormulaFk);
            }*/
		} else if (entity && entity.QtoFormulaFk && entity.QtoFormulaFk > 0) {
			this.filterByOriginalFormlar(entity, formulaFk || entity.QtoFormulaFk);
		}
	}

	private filterByOriginalFormlar(entity: T, formulaFk: number) {
		//TODO: missing => basicsLookupdataLookupDescriptorService.getData('QtoFormula')
		//var targetData = _.find(basicsLookupdataLookupDescriptorService.getData('QtoFormula'), {Id: formulaFk});
		//entity.QtoFormula = angular.copy(targetData);
	}

	/**
	 * set the readonly for groups qto lines
	 * @param itemList
	 */
	public updateQtoLineReferenceReadOnly(itemList: T[]) {
		const groups = this.getQtoLineGroups(itemList);

		_.forEach(groups, (group) => {
			if (!group || !_.isArray(group) || group.length <= 0) {
				return;
			}

			// Sheet/Line/Index should be set readonly when quantity of qtodetail is more than 1
			const readOnly: boolean = group.length > 1;

			_.forEach(group, (item) => {
				this.readonlyProcessor.process(item);
				//qtoDetailReadOnlyProcessor.updateLineReferenceReadOnly(item, readOnly);
				item.IsLineReferenceReadOnly = readOnly;
			});
		});
	}

	/**
	 * get qto line groups
	 * @param itemList
	 */
	public getQtoLineGroups(itemList: T[]) {
		const dataList = itemList && itemList.length ? itemList : this.getList();

		return _.groupBy(dataList, 'QtoDetailGroupId');
	}

	/**
	 * get max active value filed index
	 * @param entity
	 */
	public maxActiveValueFieldIndex(entity: T): number {
		if (!entity || !entity.QtoFormula) {
			return 0;
		}

		let maxActiveIdx = 0;
		for (let j = 1; j <= this.detailArray.length; j++) {
			const isActive = _.get(entity.QtoFormula, 'Value' + j + 'IsActive');
			if (isActive) {
				maxActiveIdx = j;
			}
		}
		return maxActiveIdx;
	}

	/**
	 * get Referenced Detail from list
	 * @param entity
	 * @param itemList
	 */
	public getReferencedDetails(entity: T, itemList: T[] = []) {
		let result: T[] = [];

		if (!entity) {
			return result;
		}

		const dataList = itemList && itemList.length ? itemList : this.getList();

		if (dataList.length <= 0 || entity.QtoFormulaFk === null) {
			return result;
		}

		result = _.filter(dataList, function (detail) {
			return detail.QtoDetailGroupId === entity.QtoDetailGroupId;
		});

		return _.sortBy(result, ['PageNumber', 'LineReference', 'LineIndex']);
	}

	/**
	 * get qto detail code: sheet + line + index
	 * @param item
	 */
	public getCode(item: T): string {
		return this.getFormattedLineText(item);
	}

	private getFormattedLineText(item: T): string {
		const placeHolder = '0000';
		const pageNumber = placeHolder.substr(0, 4 - item.PageNumber.toString().length) + item.PageNumber;
		return pageNumber + item.LineReference + item.LineIndex;
	}

	public sortDetail(propertyArray: string[]) {
		const levelCount = propertyArray.length,
			checkLetter = /^[A-Z]$/;

		return (item1: T, item2: T): number => {
			let level = 0;
			const sorting = (): number => {
				const propertyName = propertyArray[level];
				level++;

				let itemCell1 = _.get(item1, propertyName),
					itemCell2 = _.get(item2, propertyName);

				// to check type
				if (!checkLetter.test(itemCell1)) {
					itemCell1 = parseInt(itemCell1, 10);
					itemCell2 = parseInt(itemCell2, 10);
				}

				if (itemCell1 < itemCell2) {
					return -1;
				} else if (itemCell1 > itemCell2) {
					return 1;
				} else if (itemCell1 === itemCell2) {
					if (level === levelCount) {
						return 0;
					} else {
						return sorting();
					}
				}

				return 0;
			};
			return sorting();
		};
	}

	/**
	 * update qto detail group info
	 * @param qtoLines
	 */
	public updateQtoDetailGroupInfo(qtoLines: T[] = []) {
		const orderedQtoLines = this.getOrderedList(qtoLines);

		let currentQtoDetail: T | null;

		_.forEach(orderedQtoLines, (qtoLine) => {
			if (qtoLine.QtoFormula && qtoLine.QtoFormula.IsMultiline) {
				if (currentQtoDetail === null) {
					currentQtoDetail = qtoLine;
				}

				if (this.validateQtoLineIsInGroup(qtoLine, currentQtoDetail)) {
					qtoLine.QtoDetailGroupId = currentQtoDetail.Id;
					if (this.checkOperator(qtoLine)) {
						currentQtoDetail = null;
					}
				} else {
					qtoLine.QtoDetailGroupId = qtoLine.Id;
					currentQtoDetail = qtoLine;
				}
			} else {
				currentQtoDetail = null;
				qtoLine.QtoDetailGroupId = qtoLine.Id;
			}
		});

		return orderedQtoLines;
	}

	public getOrderedList(itemList: T[]): T[] {
		const dataList = itemList && itemList.length ? itemList : this.getList();

		return _.sortBy(dataList, ['PageNumber', 'LineReference', 'LineIndex']);
	}

	private validateQtoLineIsInGroup(item1: T, item2: T) {
		const groupingPorps = [
			'QtoLineTypeFk',
			'QtoFormulaFk',
			'BoqItemFk',
			'PesHeaderFk',
			'IsWQ',
			'IsAQ',
			'IsBQ',
			'IsIQ',
			'IsReadonly',
			'IsBlocked',
			'SpecialUse',
			'V',
			'WipHeaderFk',
			'BilHeaderFk',
			'SortCode01Fk',
			'SortCode02Fk',
			'SortCode03Fk',
			'UserDefined1',
			'UserDefined2',
			'UserDefined3',
			'UserDefined4',
			'UserDefined5',
			'SortCode04Fk',
			'SortCode05Fk',
			'SortCode06Fk',
			'SortCode07Fk',
			'SortCode08Fk',
			'SortCode09Fk',
			'SortCode10Fk',
			'OrdHeaderFk',
			'MdcControllingUnitFk',
			'PrcStructureFk',
			'AssetMasterFk',
			'PrjLocationFk',
			'BillToFk',
			'BoqSplitQuantityFk',
		];
		let result = true;

		// add cost group columns
		_.forOwn(item1, function (value, key) {
			if (key.indexOf('costgroup_') !== -1) {
				groupingPorps.push(key);
			}
		});

		for (const prop in groupingPorps) {
			const item1Value = _.get(item1, groupingPorps[prop]);
			const itemProp1 = item1Value ? item1Value : null;

			const item2Value = _.get(item2, groupingPorps[prop]);
			const itemProp2 = item2Value ? item2Value : null;
			if (itemProp1 !== itemProp2) {
				result = false;
				break;
			}
		}

		return result;
	}

	public checkOperator(item: T) {
		// return item is end by operator = '='
		return (
			(item.Operator1 && item.Operator1 === '=') ||
			(item.Operator2 && item.Operator2 === '=') ||
			(item.Operator3 && item.Operator3 === '=') ||
			(item.Operator4 && item.Operator4 === '=') ||
			(item.Operator5 && item.Operator5 === '=') ||
			(_.isString(item.LineText) && item.LineText.endsWith('='))
		);
	}

	/**
	 * qto detail formula is end with Equal Symbol
	 * @param qtoLine
	 */
	public isEndWithEqualSymbol(qtoLine: T) {
		return this.checkOperator(qtoLine);
	}

	/**
	 * readonly
	 * @param item
	 * @param modelArray
	 * @param value
	 */
	public updateReadOnly(item: T, modelArray: string[], value: boolean) {
		if (item.IsCopySource) {
			value = true;
		}
		const qtostatusItem = item.QtoStatusItem;
		//let qtostatusItem = item.QtoStatusItem ? item.QtoStatusItem : qtoDetailReadOnlyProcessor.getItemStatus(item);
		value = value || !!(qtostatusItem && qtostatusItem.IsReadOnly);

		const readonlyFields: IReadOnlyField<T>[] = [];
		_.forEach(modelArray, (model) => {
			readonlyFields.push({ field: model, readOnly: value });
		});

		this.setEntityReadOnlyFields(item, readonlyFields);
	}

	//TODO: missing => setFilterLocations, location not ready - lnt

	//TODO: missing => setFilterBillTos, billTo not ready - lnt

	//TODO: missing => setFilterBoqs, qto boq not ready - lnt

	//TODO: missing => setSelectBoq, qto boq not ready - lnt

	//TODO: missing => setFilterStructures, sheet not ready - lnt

	/**
	 * set qto detail result as strand
	 * @param qtoDetail
	 */
	public changeQtoLineTypeFromAuxToStd(qtoDetail: T) {
		if (_.isUndefined(qtoDetail.bakResult)) {
			let tempPlaces = 6;

			const qtoHeader = this.getCurrentQtoHeader();
			if (qtoHeader && qtoHeader.NoDecimals) {
				tempPlaces = qtoHeader.NoDecimals;
			}

			//TODO: not sure how to deal with this case -lnt
			// if (_.isString(qtoDetail.Result)) {
			// 	qtoDetail.Result = parseFloat(qtoDetail.Result.replace(/[()]/g, ''));
			// }

			if (_.isNumber(qtoDetail.Result)) {
				qtoDetail.Result = parseFloat(qtoDetail.Result.toFixed(tempPlaces));
			}
		} else {
			qtoDetail.Result = qtoDetail.bakResult ?? 0;
		}
	}

	/**
	 * get project id with selected qtoheader
	 */
	public getSelectedProjectId() {
		//TODO: parentService not ready -lnt
		// if (this.parentService.getSelectedProjectId) {
		// 	var projectId = parentService.getSelectedProjectId();
		// 	return projectId;
		// }
		//s
		// var curr = parentService.getSelected();
		// return parentService.isSelection(curr) && !angular.isUndefined(curr.ProjectFk) ? curr.ProjectFk : -1;
	}

	/**
	 * get qtp formual with selected qto line
	 */
	public getQtoFormula(): IQtoShareFormulaEntity | null | undefined {
		const item = this.getSelectedEntity();
		return item ? item.QtoFormula : null;
	}

	private setDefaultQtoFormula(item: IQtoShareFormulaEntity) {
		this.defaultQtoFormula = item;
	}

	/**
	 * if operator2 set to =, then set value3-5 and operator3-5 to readonly
	 * @param entity
	 * @param operatorFiled
	 * @param operatorValue
	 */
	public setValueOrOperFieldsToDisableByOperator(entity: T, operatorFiled: string, operatorValue: string) {
		if (operatorValue) {
			return;
		}

		const maxActiveIdx = this.maxActiveValueFieldIndex(entity),
			currrentOperIndex = parseInt(operatorFiled.replace('Operator', ''));

		const isReadOnly = operatorValue === '=';
		for (let i = currrentOperIndex + 1; i <= maxActiveIdx; i++) {
			const readonlyFields: IReadOnlyField<T>[] = [
				{ field: this.operatorArray[i - 1], readOnly: isReadOnly },
				{ field: this.detailArray[i - 1], readOnly: isReadOnly },
			];
			this.setEntityReadOnlyFields(entity, readonlyFields);

			if (operatorValue === '=') {
				//TODO: not sure how to replace -lnt
				//$injector.get('platformRuntimeDataService').applyValidationResult({ valid: true }, entity, [operatorArray[i - 1]]);
			}
		}

		if (operatorValue !== '=') {
			this.clearReadOnlyCfgForValueAndOptFile(entity);
		}
	}

	/**
	 * remove readonly config properties if it is set to readonly = false
	 * @param entity
	 */
	public clearReadOnlyCfgForValueAndOptFile(entity: T) {
		// TODO: Temporarily commenting out to resolve eslint the error because it never used.
		// const properties = this.detailArray.concat(this.modelArray);

		//TODO: not sure how to replace -lnt
		// if (entity && entity.__rt$data && entity.__rt$data.readonly) {
		// 	_.forEach(properties, function (field) {
		// 		var idx = _.findIndex(entity.__rt$data.readonly, { field: field, readonly: false });
		// 		if (idx >= 0) {
		// 			entity.__rt$data.readonly.splice(idx, 1);
		// 		}
		// 	});
		// }
	}

	/**
	 * check Address IsUnique
	 * @param postParam
	 */
	public async checkAddressIsUnique(postParam: object): Promise<QtoShareAddressMap> {
		const url = this.configurationService.webApiBaseUrl + 'qto/main/detail/ismapqtoaddress';
		return (await firstValueFrom(this.http.post(url, postParam))) as QtoShareAddressMap;
	}

	/**
	 * sum boq quantity with qto line
	 * @param entity
	 * @param newBoqItemFk
	 */
	public calculateBoqQuantityByQtoLine(entity: T, newBoqItemFk: number) {
		//TODO: missing => qto boq not ready -lnt
	}

	//TODO: missing => updateReadOnlyDetail -lnt

	//TODO: missing => setLookupData -lnt

	//TODO: missing => showForm -lnt

	private async getFormulaImageBlob(entity: T) {
		if (entity.QtoFormula === null || entity.QtoFormula === undefined) {
			entity.Blob = null;
			entity.BasBlobsFk = null;
		}
		//TODO: missing => qtoFormulaImageCache -lnt

		return entity;
	}

	private getReferencedDetailsWithList(entities: T[], itemList: T[]) {
		let result: T[] = [],
			dataList: T[] = [];

		if (entities.length <= 0) {
			return result;
		}

		dataList = itemList && itemList.length ? itemList : this.getList();

		if (dataList.length <= 0) {
			return result;
		}

		const groupIds = _.uniq(_.map(entities, 'QtoDetailGroupId'));

		result = _.filter(dataList, (detail) => {
			return _.indexOf(groupIds, detail.QtoDetailGroupId) !== -1;
		});

		return _.sortBy(result, ['PageNumber', 'LineReference', 'LineIndex']);
	}

	//TODO: missing => syncDataFromUserForm, user form not ready -lnt

	//TODO: missing => getBoqSplitQuantityService, boq split not ready -lnt

	//TODO: missing => getBoqService, boq service not ready -lnt

	/**
	 * set splitno as readonly for qto line
	 * @param selectItem
	 * @param itemList
	 */
	public setQtoLineSplitNoReadonly(selectItem: T, itemList: T[]) {
		if (selectItem) {
			// TODO: Temporarily commenting out to resolve eslint the error because it never used.
			// let mapSplitItemList = _.filter(itemList, (item) => {
			// 	const version = (_.isNil(item.Version) ? 0 : item.Version) as number;
			// 	return version > 0 && item.BoqItemFk === selectItem.BoqItemFk && item.BoqSplitQuantityFk;
			// });
			//
			// let mapItemList = _.filter(itemList, (item) => {
			// 	const version = (_.isNil(item.Version) ? 0 : item.Version) as number;
			// 	return version > 0 && item.BoqItemFk === selectItem.BoqItemFk;
			// });

			//TODO: missing => maybe set readonly at readonly processor
		}
	}

	private async createMultiItems(toCreateEntities: T[], toSaveEntities: T[], selectedItem: T) {
		await this.newItemService.createMultiItems(toCreateEntities, toSaveEntities, selectedItem);
	}

	//TODO: missing => getCreatingPromise, not sure how to use -lnt

	/**
	 * create for split qto line
	 */
	public splitIsBqIqQtoLine() {
		this.newItemService.splitIsBqIqQtoLine();
	}

	private getLineAddressNum(item: T) {
		const pageNumber = item.PageNumber;
		const lineIndex = item.LineIndex;
		let lineReference = (_.isNil(item.LineReference) ? '' : item.LineReference) as string;

		const qtoHeader = this.getQtoHeaderSelected();
		if (qtoHeader && qtoHeader.QtoTypeFk === QtoType.OnormQTO) {
			const QtoDetailReference = (_.isNil(item.QtoDetailReference) ? '' : item.QtoDetailReference) as string;
			return parseInt(QtoDetailReference);
		} else {
			lineReference = lineReference.toUpperCase();
			let ascii = lineReference.charCodeAt(0);

			if (ascii < 65 || ascii > 90 || isNaN(ascii)) {
				ascii = 65;
			}

			return pageNumber * 1000 + ascii * 10 + lineIndex;
		}
	}

	private getUsedAddressScope(itemList: T[] = []): IQtoDetailAddressScrope[] {
		const addressScrope: IQtoDetailAddressScrope[] = [];
		const groups = this.getQtoLineGroups(itemList);

		_.forEach(groups, (group) => {
			if (group && group.length > 0) {
				addressScrope.push({
					minId: group[0].Id,
					maxId: group[group.length - 1].Id,
					min: this.getLineAddressNum(group[0]),
					max: this.getLineAddressNum(group[group.length - 1]),
				});
			}
		});

		return addressScrope;
	}

	/**
	 * the qto line used in other group
	 * @param newQtoLines
	 */
	public isUsedInOtherGroup(newQtoLines: T[]): IQtoDetailValidInfo {
		let isValid: boolean = false,
			inValidLine: string = '';
		const currentListAddressScope = this.getUsedAddressScope();

		if (_.isArray(newQtoLines) && newQtoLines.length > 0) {
			_.forEach(newQtoLines, (qtoLine) => {
				const lineAddressNum = this.getLineAddressNum(qtoLine);

				const group = _.find(currentListAddressScope, function (scope) {
					return scope.min <= lineAddressNum && lineAddressNum <= scope.max && qtoLine.Id !== scope.minId && qtoLine.Id !== scope.maxId;
				});

				if (group) {
					isValid = false;
					inValidLine += '[' + qtoLine.QtoDetailReference + ']';
				}
			});
		}

		return {
			isValid: isValid,
			inValidLine: inValidLine && inValidLine !== '' ? inValidLine : null,
		};
	}

	//TODO: missing => updateQtoLineReferenceReadOnly, can use the readonly processor to replace -lnt

	//TODO: missing => getSelectedGroupEntities, not sure how to use -lnt

	public showFormulaResultDetails(qtoDetail: T) {
		//TODO: missing -lnt
	}

	// region set and get data

	/**
	 * set filter pageNumbers
	 * @param pageNumbers
	 */
	public setFilterPageNumbers(pageNumbers: number[]) {
		this.filterPageNumbers = pageNumbers;
	}

	/**
	 * set boq line type
	 * @param lineTypeFk
	 */
	public setBoqLineType(lineTypeFk: number) {
		this.boqLineTypeFk = lineTypeFk;
	}

	/**
	 * set selected pagenumber
	 * @param value
	 */
	public setSelectedPageNumber(value: number | null) {
		this.selectedPageNumber = value;
	}

	public setIsFormulaChanged(isChanged: boolean) {
		this.isFormulaChanged = isChanged;
	}

	public getIsFormulaChanged() {
		return this.isFormulaChanged;
	}

	public getSelectedBoqItemId() {
		//TODO: missing => getSelectedBoqItem -lnt
		// let selectedBoqItemFk = -1;
		// let selectedBoqItem = service().getSelectedBoqItem();
		// if (selectedBoqItem) {
		//     if (this.boqType === QtoShareBoqType.WipBoq || this.boqType === QtoShareBoqType.BillingBoq || this.boqType === QtoShareBoqType.PesBoq) {
		//         selectedBoqItemFk = selectedBoqItem.BoqItemPrjItemFk;
		//     } else {
		//         selectedBoqItemFk = selectedBoqItem.Id;
		//     }
		// }
		//
		// return selectedBoqItemFk;
		return -1;
	}

	public getSelectedBoqItem() {
		//TODO: missing => qto boq -lnt
	}

	public getselectedPrjLocationId() {
		//TODO: missing => qtoMainLocationDataService -lnt
		// let selectedLocation = $injector.get('qtoMainLocationDataService').getSelected();
		// return selectedLocation ? selectedLocation.Id : -1;
		return -1;
	}

	public setIsCreatedSucceeded(value: boolean) {
		this.isCreatedSucceeded = value;
	}

	public getIsCreatedSucceeded() {
		return this.isCreatedSucceeded;
	}

	public setQtoUserFormDialogFunc(value: boolean) {
		this.showQtoUserFormDialog = value;
	}

	public showQtoUserFormDialogFunc() {
		return this.showQtoUserFormDialog;
	}

	public setPageNumberCell(cell: number) {
		this.pageNumberCell = cell;
	}

	public getPageNumberCel() {
		return this.pageNumberCell;
	}

	public setCurrentCell(cell: number) {
		this.currentCell = cell;
	}

	public getCurrentCell() {
		return this.currentCell;
	}

	public setPageNumberCreated(pageNumber: number) {
		this.pageNumberCreated = pageNumber;
	}

	public getPageNumberCreated() {
		return this.pageNumberCreated;
	}

	public setFilterByNoWipOrBilStatus(value: boolean) {
		this.isFilterByNoWipOrBilActive = value;
	}

	public getFilterByNoWipOrBilStatus() {
		return this.isFilterByNoWipOrBilActive;
	}

	public setFilterStatus(value: boolean) {
		this.isFilterActive = value;
	}

	public getFilterStatus() {
		return this.isFilterActive;
	}

	/**
	 * set sheet area list
	 * @param qtoAddressRange
	 */
	public setSheetAreaList(qtoAddressRange: IQtoAddressRange): number[] {
		this.sheetAreaList = [];
		if (qtoAddressRange && qtoAddressRange.SheetArea) {
			const areaArray = qtoAddressRange.SheetArea.split(',');
			_.forEach(areaArray, (item) => {
				if (item.indexOf('-') >= 0) {
					const _sheetAreaArray = item.trim().split('-');
					if (_sheetAreaArray && _sheetAreaArray.length === 2) {
						const fromValue = parseInt(_sheetAreaArray[0]);
						const toValue = parseInt(_sheetAreaArray[1]);
						let numberList = _.range(fromValue, toValue + 1);

						if (fromValue >= toValue) {
							numberList = _.range(fromValue, toValue - 1);
						}
						this.sheetAreaList = this.sheetAreaList.concat(numberList);
					}
				} else {
					this.sheetAreaList.push(parseInt(item));
				}
			});
		}
		this.sheetAreaList = _.orderBy(this.sheetAreaList);
		return this.sheetAreaList;
	}

	public getSheetAreaList() {
		return this.sheetAreaList;
	}

	public getChangedBoqIds() {
		return _.uniq(this.changedBoqIds);
	}

	public cleanChangedBoqIds() {
		this.changedBoqIds = [];
	}

	public getQtoTypeId() {
		return this.qtoTypeFk;
	}

	public setQtoTypeId(value: number) {
		this.qtoTypeFk = value;
	}
	/**
	 * Gets QtoMainDetai writes to Blobs
	 * @protected
	 */
	public setBlobsToQtoMainDetailItem() {}
	// endregion
}
