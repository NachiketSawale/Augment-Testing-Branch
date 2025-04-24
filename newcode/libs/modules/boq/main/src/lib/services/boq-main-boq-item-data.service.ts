import { Injectable, Injector, inject, } from '@angular/core';
import { BasicsSharedTaxCodeLookupService, BasicsSharedSystemOptionLookupService, ITaxCodeEntity } from '@libs/basics/shared';
import { CompleteIdentification, PlatformPermissionService, PlatformTranslateService, prefixAllTranslationKeys } from '@libs/platform/common';
import {
	DataServiceHierarchicalNode,
	DataServiceHierarchicalRoot,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { ContainerLayoutConfiguration, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType, UiCommonMessageBoxService } from '@libs/ui/common';
import { Subject } from 'rxjs';
import { IBoqCompositeEntity, IBoqItemEntity, IBoqStructureEntity } from '@libs/boq/interfaces';
import { ICrbBoqItemEntity } from '../model/entities/crb-boq-item-entity.interface';
import { IOenBoqItemEntity } from '../model/entities/oen-boq-item-entity.interface';
import { BoqItemComplete } from '../model/boq-item-complete.class';
import { BoqItemHelper, BoqItemTreeHelper, BoqStandard } from '../model/boq-main-boq-constants';
import { IBoqItemCalculateOptions } from '../model/boq-main-boq-item-calculate-logic.class';
import { OenDataService } from './5oenorm/boq-main-oen-data.service';
import { CrbDataService } from '../services/4crb/boq-main-crb-data.service';
import { CrbEcoDevisService } from '../services/4crb/boq-main-crb-ecodevis.service';
import { CrbRevisionInfoService } from '../services/4crb/boq-main-crb-revisioninfo.service';
import { BoqMainBoqPropertiesDialogService } from '../services/boq-main-boq-properties-dialog.service';
import { BoqMainCopyoptionsDialogService } from '../services/boq-main-copyoptions-dialog.service';
import { BoqStructureDataService } from './boq-main-boq-structure-data.service';
import { BoqDummyRootDataService } from './boq-main-dummy-root-data.service';

export abstract class BoqItemDataServiceBase extends DataServiceHierarchicalNode<IBoqItemEntity,CompleteIdentification<IBoqItemEntity>,object,BoqItemComplete> {
	private crbDataService = inject(CrbDataService);
	private oenDataService = inject(OenDataService);
	protected readonly translateService = inject(PlatformTranslateService);

	// Saving the currently loaded boq structure definition for later reuse in the sevice
	private selectedBoqStructure?: IBoqStructureEntity;

	// Selected project
	private selectedProjectId: number | null = null;

	// Selected exchange rate usually coming from the calling context of this service
	private selectedExchangeRate: number = 1;

	// Determines the readonly mode of the service
	private readOnly: boolean = false;

	// Has to be created in the constructor or has to be injected.
	private boqStructureService: BoqStructureDataService;

	public constructor(options: IDataServiceOptions<IBoqItemEntity>) {
		super(options);
		this.boqStructureService = new BoqStructureDataService();
	}

	// Reusable method for creating options
	protected static createDataServiceOptions(parentService: unknown): IDataServiceOptions<IBoqItemEntity> {
		return {
			apiUrl: 'boq/main',
			roleInfo: <IDataServiceRoleOptions<IBoqItemEntity>>{
				role: ServiceRole.Node,
				itemName: 'BoqItem',
				parent: parentService
			},
			readInfo: <IDataServiceEndPointOptions> {
				endPoint: 'getCompositeBoqItems'
			}
		};
	}

	//  region CRUD operations
	// #region

	protected override provideLoadPayload(): object {
		return { headerid: this.getSelectedBoqHeaderId() };
	}

	protected override onLoadSucceeded(loaded: object): IBoqItemEntity[] {
		const loadedBoqItems = (loaded as { dtos: IBoqItemEntity[] }).dtos;

		this.boqStructureService.loadBoqStructure(this.getSelectedBoqHeaderId() as number).then(boqStructureEntity => {
			this.selectedBoqStructure = boqStructureEntity;
		});

		// TODO-BOQ: This fits the BOQ items to be presented in the tree grid. To be checked again the performance and if that can be implemented in the backend.
		const fitBoqTree = (boqitem: IBoqItemEntity) => {
			if (boqitem.BoqItems == null) {
				boqitem.BoqItems = [];
			}
			boqitem.BoqItems.forEach(function(childBoqItem) {
				// childBoqItem.BoqItemParent = boqitem; TODO-BOQ: The saving complains because of cycles to 'BoqItems'
				fitBoqTree(childBoqItem);
			});
		};
		fitBoqTree(loadedBoqItems[0]);

		// Todo-BH: activate calculation logic for testing
		//	if (this.selectedBoqStructure) {
		//		new BoqItemCalculateLogic(this.selectedBoqStructure, BoqItemTreeHelper.flatten(this.rootEntities()), this.getDefaultBoqItemCalculateOptions()).calcBoq(this.rootEntities()[0], 2);
		//	}

		// TODO-BOQ-DEV-31658: Need a formatter as in javascript
		BoqItemTreeHelper.flatten(loadedBoqItems).forEach(boqItem => {
			boqItem.ItemInfo = this.buildItemInfo(boqItem);
		});

		return loadedBoqItems;
	}

	public override isParentFn(parent: IBoqCompositeEntity, boqItem: IBoqItemEntity): boolean {
		return parent.BoqRootItem.BoqHeaderFk === boqItem.BoqHeaderFk;
	}

	// TODO-BOQ: To be checked together with function 'registerNodeModificationsToParentUpdate'
	public override createUpdateEntity(modifiedBoqItem: IBoqItemEntity | null): BoqItemComplete {
		const completeBoqItem = new BoqItemComplete();
		if (modifiedBoqItem !== null) {
			completeBoqItem.BoqItems = [modifiedBoqItem];
		}

		return completeBoqItem;
	}

	// #endregion
	//  endregion

	public override childrenOf(boqItem: IBoqItemEntity): IBoqItemEntity[] {
		return boqItem.BoqItems ?? [];
	}

	public override parentOf(boqItem: IBoqItemEntity): IBoqItemEntity | null {
		return boqItem.BoqItemParent ?? null;
	}

	public refreshAll(): Promise<void> {
		// TODO-BOQ: to be completed
		return Promise.resolve();
	}

	/**
	 * @ngdoc function
	 * @name getReadOnly
	 * @function
	 * @description gets the read only mode of the service
	 * @returns {Boolean} flag telling if read only is active or not
	 */
	public getReadOnly(): boolean {
		return this.readOnly;
	}

	/**
	 * @ngdoc function
	 * @name setReadOnly
	 * @function
	 * @description sets the read only mode of the service
	 * @param {Boolean} readOnly telling if read only is active or not
	 */
	public setReadOnly(readOnly: boolean) {
		this.readOnly = readOnly;
	}

	/**
	 * @ngdoc function
	 * @name getSelectedBoqHeaderId
	 * @description gets the boq header ID of the currently loaded  boq
	 * @returns the boq header ID
	 */
	public abstract getSelectedBoqHeaderId() : number | undefined;

	/**
	 * @ngdoc function
	 * @name getRootBoqItem
	 * @function
	 * @description Gets the root BOQ item
	 * @returns {IBoqItemEntity}
	 */
	public getRootBoqItem() : IBoqItemEntity {
		return this.rootEntities()[0];
	}

	/**
	 * @ngdoc
	 * @name getSelectedBoqStructure
	 * @description Get the selected project
	 * @returns {IBoqStructureEntity} returns object representing the currently loaded structure definition
	 */
	public getSelectedBoqStructure() : IBoqStructureEntity | undefined {
		return this.selectedBoqStructure;
	}

	/**
	 * @ngdoc function
	 * @name getSelectedProjectId
	 * @function
	 * @description Get the selected project
	 * @returns  {Number} selected project
	 */
	public getSelectedProjectId() : number | null {
		return this.selectedProjectId;
	}

	/**
	 * @ngdoc function
	 * @name setSelectedProjectId
	 * @function
	 * @description Set the selected project
	 * @param {Number} projectId: to be set
	 */
	public setSelectedProjectId(projectId: number) {
		this.selectedProjectId = projectId;
	}

	/**
	 * @ngdoc function
	 * @name getSelectedExchangeRate
	 * @function
	 * @description Get the selected exchange rate
	 * @returns  {Number} selected exchange rate
	 */
	public getSelectedExchangeRate() : number {
		return this.selectedExchangeRate;
	}

	/**
	 * @ngdoc function
	 * @name setSelectedExchangeRate
	 * @function
	 * @description Set the selected exchange rate
	 * @param {Number} exchangeRate: to be set
	 */
	public setSelectedExchangeRate(exchangeRate: number) {
		this.selectedExchangeRate = exchangeRate;
	}

	private buildItemInfo(boqItem: IBoqItemEntity) : string {
		const itemInfos: string[] = [];
		let result: string;

		if (this.isCrbBoq()) { // (boqItem is ICrbBoqItemEntity) {
			result = this.crbDataService.buildItemInfo(boqItem as ICrbBoqItemEntity);
		} else if (this.isOenBoq()) { // (boqItem is IOenBoqItemEntity) {
			result = this.oenDataService.buildItemInfo(boqItem as IOenBoqItemEntity);
		} else {
			// TODO-BOQ-DEV-31658
			/*
			var itemType = getItemTypeById(boqItem.BasItemTypeFk);
			if (itemType && itemType.Code!==null) {
				itemInfos.push(itemType.Code);
			}

			var itemType2 = getItemType2ById(boqItem.BasItemType2Fk);
			if (itemType2 && itemType2.Code!==null) {
				itemInfos.push(itemType2.Code);
			}
			*/

			if (boqItem.IsDisabled) { 
				itemInfos.push('X');
			}

			if (boqItem.IsNotApplicable) {
				itemInfos.push('(X)');
			}

			if (boqItem.IsKeyitem) {
				itemInfos.push(this.translateService.instant('boq.main.itemInfoKeyItem').text);
			}

			if (boqItem.HasOwnerTextComplements) {
				itemInfos.push(this.translateService.instant('boq.main.itemInfoOwnerTextComplements').text);
			}
			if (boqItem.HasBidderTextComplements) {
				itemInfos.push(this.translateService.instant('boq.main.itemInfoBidderTextComplements').text);
			}

			result = itemInfos.join();
		}

		return result;
	}

	/** Is GAEB BoQ */
	public isGaebBoq() : boolean {
		return this.selectedBoqStructure ? this.selectedBoqStructure.BoqStandardFk===BoqStandard.Gaeb : false;
	}

	/** Is Free BoQ */
	public isFreeBoq() : boolean {
		return this.selectedBoqStructure ? this.selectedBoqStructure.BoqStandardFk===BoqStandard.Free : false;
	}

	/** Is CRB BoQ */
	public isCrbBoq() : boolean {
		return this.selectedBoqStructure ? this.selectedBoqStructure.BoqStandardFk===BoqStandard.Crb : false;
	}

	/** Is OENORM BoQ */
	public isOenBoq() : boolean {
		return this.selectedBoqStructure ? this.selectedBoqStructure.BoqStandardFk===BoqStandard.OeNorm : false;
	}

	/** Is WIC BoQ */
	public isWicBoq(){
		return this.getRootBoqItem().IsWicItem === true;
	}
}

// TODO-BOQ: To be used (with another name) in boq.wic and boq.main
@Injectable({providedIn: 'root'})
export class BoqItemDataService extends BoqItemDataServiceBase {
	// Property for saving the BoqHeaderFk of the currently loaded boq
	private selectedBoqHeaderId?: number;

	public constructor(private parentService: BoqDummyRootDataService) {
		const options = BoqItemDataServiceBase.createDataServiceOptions(parentService);
		super(options);
	}

	//  region CRUD operations
	// #region

	public override isParentFn(): boolean {
		return true;
	}

	// TODO-BOQ: Incomplete, really necessary?
	public override registerNodeModificationsToParentUpdate(completeBoqItem: BoqItemComplete, modifiedBoqItems: BoqItemComplete[], deletedBoqItems: IBoqItemEntity[]) {
		if (modifiedBoqItems && modifiedBoqItems.length>0) {
			completeBoqItem.BoqItems = modifiedBoqItems[0].BoqItems;
		}
	}

	// Ensures the call of function 'registerNodeModificationsToParentUpdate'
	public override registerByMethod(): boolean {
		return true;
	}

	// #endregion
	//  endregion

	public override getSelectedBoqHeaderId() : number | undefined {
		return this.selectedBoqHeaderId;
	}

	/**
	 * @ngdoc function
	 * @name setSelectedBoqHeaderId
	 * @description sets a new boq header ID and loads the corresponding boq
	 * @param boqHeaderId to be set
	 * @param forceLoading forces loading of boq by given headerfk
	 * @param  doRefresh triggers a refresh of the already loaded data in case the given boq header is already set
	 */
	public setSelectedBoqHeaderId(boqHeaderId: number) {
		this.selectedBoqHeaderId = boqHeaderId;
	}
}

// TODO-BOQ: Not all of the functions are moved to class 'BoqItemDataServiceBase'. Some implmenetations seem to be not necessary, this should be discussed.
@Injectable({providedIn: 'root'})
export class BoqItemDataServiceOld extends DataServiceHierarchicalRoot<IBoqItemEntity, IBoqItemEntity> {
	// Handling permissions
	private platformPermissionService: PlatformPermissionService;

	// Carry the container UUID of the related container
	private containerUUID: string | null;

	// Map of currently loaded boq items for quick id based access
	private loadedBoqItemDictionary?: Map<number, IBoqItemEntity>;

	// Lookup services
	private mdcTaxCodeLookupService: BasicsSharedTaxCodeLookupService<ITaxCodeEntity>;
	public basicsSharedSystemOptionLookupService: BasicsSharedSystemOptionLookupService;

	// Section for so-called Subjects that seem to be a possible replacement for events as Platform.Messenger in the old client
	public boqItemPriceChanged = new Subject<IBoqItemEntity | undefined>();

	public constructor() {
		const options: IDataServiceOptions<IBoqItemEntity> = {
			apiUrl: 'boq/main',
			roleInfo: <IDataServiceRoleOptions<IBoqItemEntity>>{
				role: ServiceRole.Root,
				itemName: 'BoqItem'
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getCompositeBoqItems',
				usePost: false,
				prepareParam: ident => {
					return { headerid: ident.id };
				}
			}
		};
		super(options);

		this.platformPermissionService = inject(PlatformPermissionService);
		this.containerUUID = null;

		this.mdcTaxCodeLookupService = inject(BasicsSharedTaxCodeLookupService);
		this.basicsSharedSystemOptionLookupService = inject(BasicsSharedSystemOptionLookupService);
	}

	/**
	 * @ngdoc function
	 * @name setSelectedBoqHeaderId
	 * @description sets a new boq header ID and loads the corresponding boq
	 * @param boqHeaderId to be set
	 * @param forceLoading forces loading of boq by given headerfk
	 * @param  doRefresh triggers a refresh of the already loaded data in case the given boq header is already set
	 */
	/*
	public setSelectedBoqHeaderId(boqHeaderId: number, forceLoading: boolean=false) : Promise<IBoqItemEntity[]> {
		let returnValue = Promise.resolve(new Array<IBoqItemEntity>());

		if (typeof boqHeaderId === 'number' && (forceLoading || this.selectedBoqHeaderId !== boqHeaderId) && this.boqStructureService) {
			// First clear possibly existing previously loaded data
			this.reset();

			returnValue = this.boqStructureService.loadBoqStructure(boqHeaderId).then(boqStructureEntity => {
				this.selectedBoqStructure = boqStructureEntity;

				// TODO-BOQ: At the moment there is no direct loading call on the root data services other than the "filter" call that uses a ISearchPayload parameter
				// TODO-BOQ: that is meant for loading via the sidebar search. As an intermediate solution we use the "load" call of the attached data provider and by this
				// TODO-BOQ: can call the "getCompositeBoqItems" endpoint the way we need it.
				return this.provider.load({id: boqHeaderId}).then((compositeBoqItems) => {
					this.selectedBoqHeaderId = boqHeaderId; // Save the currently selected BoqHeaderFk

					const loadedBoqItems = (<any>compositeBoqItems).dtos as IBoqItemEntity[];
					this.setList(loadedBoqItems); // TODO-BOQ: calling "setList" and possibly calling the processors is usually done by the base data service.

					// TODO-BOQ: This fits the bOQ items to be presented in the tree grid. To be checked again the performance and if that can be implemented in the backend.
					let fitBoqTree = (boqitem: IBoqItemEntity) => {
						if (boqitem.BoqItems == null) {
							boqitem.BoqItems = [];
						}
						boqitem.BoqItems.forEach(function(childBoqItem) {
							childBoqItem.BoqItemParent = boqitem;
							fitBoqTree(childBoqItem);
						});
					}
					fitBoqTree(loadedBoqItems[0]);

					// Todo-BH: activate calculation logic for testing
//					if (this.selectedBoqStructure) {
//					 	new BoqItemCalculateLogic(this.selectedBoqStructure, BoqItemTreeHelper.flatten(this.rootEntities()), this.getDefaultBoqItemCalculateOptions()).calcBoq(this.rootEntities()[0], 2);
//					}

					return loadedBoqItems;
				});
			});
		}

		return returnValue;
	}
	*/

	/**
	 * @name getLoadedBoqItemByDictionary
	 * @function
	 * @description The loaded boq items are saved into a dictionary (boqItemId -> boqItem) and can easily be accessed now
	 * @param {Number} boqItemId : id of the boqItem that is requested
	 * @returns {Object} boqItem : with the given boqItemId
	 */
	protected getLoadedBoqItemByDictionary(boqItemId: number) {

		let loadedBoqItem = null;

		if(boqItemId && this.getList() && this.getList().length > 0) {

			if(!this.loadedBoqItemDictionary) {
				// The dictionary hasn't been loaded yet or has been emptied before, so load it now
				this.loadedBoqItemDictionary = new Map<number, IBoqItemEntity>();
				this.getList().forEach(boqItem => {
					if (boqItem && boqItem.Id && !this.loadedBoqItemDictionary?.get(boqItem.Id)) {
						this.loadedBoqItemDictionary?.set(boqItem.Id, boqItem);
					}
				});

				if(this.loadedBoqItemDictionary.has(boqItemId)) {
					loadedBoqItem = this.loadedBoqItemDictionary.get(boqItemId);
				}
			}
		}

		return loadedBoqItem;
	}

	/*
	protected reset() {
		this.selectedBoqHeaderId = undefined;

		// Clears all loaded items and related states from the service
		// Only temporary solution until clear function is implemented in platformDataServiceFactory
		this.clearModifications();
		this.deselect();
		this.setList([]);

		delete this.loadedBoqItemDictionary;
	};
	*/

	public getParentBoqItem(boqItem: IBoqItemEntity) : IBoqItemEntity | null | undefined {

		if(!boqItem || !boqItem.BoqItemFk) {
			return null;
		}

		let parentBoqItem = boqItem.BoqItemParent;

		if(!parentBoqItem) {
			parentBoqItem = this.getLoadedBoqItemByDictionary(boqItem.BoqItemFk);

			if(!parentBoqItem) {
				// As a fallback iterate over the loaded item list and find corresponding boqItem
				parentBoqItem = this.getList().find(item => {
					return item.Id === boqItem.BoqItemFk;
				});
			}
		}

		return parentBoqItem;
	}

	/**
	 * @ngdoc function
	 * @name setContainerUUID
	 * @function
	 * @description sets the container UUID of the underlying boq container
	 * @param {String} containerUUID identifying the container UUID of the underlying boq container
	 */
	public setContainerUUID(containerUUID: string) {

		if (this.containerUUID && this.containerUUID !== '' && containerUUID !== this.containerUUID) {
			this.platformPermissionService.restrict(this.containerUUID, false); // Reset possible restrictions
		}

		this.containerUUID = containerUUID;
	}

	/**
	 * @ngdoc function
	 * @name getContainerUUID
	 * @function
	 * @description gets the container UUID of the underlying boq container
	 * @returns {String} containerUUID identifying the container UUID of the underlying boq container
	 */
	public getContainerUUID() {
		return this.containerUUID;
	}

	/**
	 * @ngdoc function
	 * @name setReadOnly
	 * @function
	 * @description sets the read only mode of the service
	 * @param {Boolean} flag telling if read only is active or not
	 */
	/*
	public setReadOnly(flag: boolean) {

		let oldValue = this.readOnly;

		if (this.readOnly === flag) {
			return; // Nothing has changed -> nothing to be done
		}

		this.readOnly = flag;

		// !!! Temporary workaround to fix ALM 127974 (-> Boq Sturcture Container cannot show data on contract sale Module).
		// !!! There currently is a timing issue when restricting the permission to the boq structure container in the way that the data is loaded into the
		// !!! grid although reinitializing the container with new permissions isn't finished yet. This leads to calling the grid tree formatter with scope = null
		// !!! which in turn prevents the grid from properly loading the data.
		setTimeout( () => {
			let containerUUID = this.getContainerUUID();
			if (containerUUID !== null && containerUUID !== "") {
				if (flag && containerUUID) {
					this.platformPermissionService.restrict(containerUUID, Permissions.Read);
				} else if (oldValue) { // Only do this if readonly was set before
					this.platformPermissionService.restrict(containerUUID, false); // Reset restriction
				}
			}
		}, 300);
	}
	*/

	//  region Calculation Support ==>  functions added to support the new BoqItemCalculateLogic
	// #region

	private getTaxCode(taxCodeFk: number | null | undefined) : ITaxCodeEntity | undefined | null {

		let taxCode : ITaxCodeEntity | undefined | null = null;

		// Todo-Boq: Curenntly we don't have a "TaxCodeMatrix" lookup
		// Todo-Boq: Activate the following code sections once it's given.
/*
		let taxCodeMatrix = basicsLookupdataLookupDescriptorService.getData('TaxCodeMatrix');
		let parentService = service.parentService();
		let vatGroupFk = null;
		if (parentService) {
			if (taxCodeMatrix) {
				vatGroupFk = this.getVatGroupFk();

				taxCode = _.find(taxCodeMatrix, function (item) {
					return item.VatGroupFk === vatGroupFk && item.TaxCodeFk === taxCodeFk;
				});
			}
		}
*/
		if (!taxCode) {
			const taxCodes = this.mdcTaxCodeLookupService.syncService?.getListSync(); // Todo-Boq: Seems like synchronous isn't working yet
			taxCode = taxCodes?.find((taxCode: { Id: number }) => {
				return taxCode.Id === taxCodeFk;
			});
		}

		return taxCode;
	}

	private getDefaultTaxCodeFk() : number | null {
		const defaultTaxCodeFk = null;

		// Todo-Boq: Currently I couldn't figure out a way to access the parent service, so I'm not able to access the default taxCodeFk of a parent entity
/*
		var parentService = service.parentService();

		if (parentService) {
			var headerSelected = parentService.getSelected();
			if (headerSelected) {
				defaultTaxCodeFk = headerSelected.TaxCodeFk ? headerSelected.TaxCodeFk : headerSelected.MdcTaxCodeFk;
			}
		}
*/
		return defaultTaxCodeFk;
	}

	private getValidTaxCodeFk(boqItem: IBoqItemEntity) : number | null | undefined {
		let validTaxCodeFk = boqItem ? boqItem.MdcTaxCodeFk : null;
		let parentItem = null;

		if (!boqItem) {
			return null;
		}

		if (!validTaxCodeFk) {
			// No valid tax code on item level
			// -> look in for valid tax code in parent items
			parentItem = this.getParentBoqItem(boqItem);
			if (parentItem) {
				if (parentItem.MdcTaxCodeFk) {
					validTaxCodeFk = parentItem.MdcTaxCodeFk;
				} else {
					validTaxCodeFk = this.getValidTaxCodeFk(parentItem); // Walk the parent chain to get a valid taxCodeFk
				}
			}
		}

		if (!validTaxCodeFk && BoqItemHelper.isRoot(boqItem)) {
			// When reaching the root item and still haven't found a valid tax code fk we search the header entity for a valid tax code fk
			validTaxCodeFk = this.getDefaultTaxCodeFk();
		}

		return validTaxCodeFk;
	}

	/**
	 * @ngdoc function
	 * @name getVatPercentForBoqItem
	 * @function
	 * @description Determines the valid TaxCodeFk for the given boqItem and returns the related percentage for VAT
	 * @returns {number} returns the determined vat percentage
	 */
	public getVatPercentForBoqItem = (boqItem: IBoqItemEntity): number => {

		let vatPercent = 0;
		let taxCodeFk: number | null | undefined = null;
		let taxCode: ITaxCodeEntity | undefined | null = null;

		if (!boqItem) {
			return vatPercent;
		}

		taxCodeFk = this.getValidTaxCodeFk(boqItem);
		if (taxCodeFk) {
			taxCode = this.getTaxCode(taxCodeFk);
			vatPercent = taxCode ? taxCode.VatPercent : 0;
		}

		return vatPercent;
	};

	/**
	 * @ngdoc function
	 * @name getVatGroupFk
	 * @function
	 * @description Determine and return the vat group assignment
	 * @returns {number} returns foreign key of vat group assignment
	 */
	private getVatGroupFk() : number | null {

		const vatGroupFk : number | null = null;

		// Todo-Boq: Currently I couldn't figure out a way to access the parent service, so I'm not able to access the default VatGroupFk of a parent entity
/*
		var parentService = this.parentService();

		if (parentService) {
			if (_.isFunction(parentService.getVatGroupFk)) {
				vatGroupFk = parentService.getVatGroupFk();
			} else {
				var headerSelected = parentService.getSelected();
				if (headerSelected) {
					vatGroupFk = headerSelected.BpdVatGroupFk ? headerSelected.BpdVatGroupFk : headerSelected.VatGroupFk;
				}
			}
		}
*/
		return vatGroupFk;
	}

	/**
	 * @ngdoc function
	 * @name getDefaultBoqItemCalculateOptions
	 * @function
	 * @description Get the currenty exchange rate
	 * @returns  {Number} currently set exchange rate
	 */
	private getDefaultBoqItemCalculateOptions() : IBoqItemCalculateOptions {
		const sysOpt = this.basicsSharedSystemOptionLookupService.syncService?.getListSync().find((item: { Id: number; }) => {
			return item.Id === 12;
		});

		return {
			getVatPercentFunc: this.getVatPercentForBoqItem,
			fixedBudgetTotal: sysOpt ? sysOpt.ParameterValue === '1': false
		};
	}

	// #endregion
	//  endregion
}

@Injectable({providedIn: 'root'})
export class BoqItemBehavior implements IEntityContainerBehavior<IGridContainerLink<IBoqItemEntity>, IBoqItemEntity> {
	private boqItemDataService : BoqItemDataServiceBase;
	private messageBoxService:  UiCommonMessageBoxService;
	private boqMainCopyoptionsDialogService: BoqMainCopyoptionsDialogService;
	private boqMainBoqPropertiesDialogService : BoqMainBoqPropertiesDialogService;
	private crbDataService : CrbDataService;
	private crbEcoDevisService : CrbEcoDevisService;
	private crbRevisionInfoService : CrbRevisionInfoService;

	public constructor(boqItemDataService: BoqItemDataServiceBase, injector: Injector) {
		this.boqItemDataService = boqItemDataService;
		this.messageBoxService = injector.get(UiCommonMessageBoxService);
		this.boqMainCopyoptionsDialogService = injector.get(BoqMainCopyoptionsDialogService);
		this.boqMainBoqPropertiesDialogService = injector.get(BoqMainBoqPropertiesDialogService);
		this.crbDataService = injector.get(CrbDataService);
		this.crbEcoDevisService = injector.get(CrbEcoDevisService);
		this.crbRevisionInfoService = injector.get(CrbRevisionInfoService);
	}

	public onCreate(containerLink: IGridContainerLink<IBoqItemEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'boq.main.copyOptions' },
				iconClass: 'tlb-icons ico-copy-settings',
				id: 'copyOption',
				type: ItemType.Item,
				fn: () => {
					this.boqMainCopyoptionsDialogService.openCopyOptionsDialog();
					return this.boqMainCopyoptionsDialogService.start();
				},
				disabled: () => {
					return this.boqMainCopyoptionsDialogService.isDisabled();
				}
			},
			{
				caption: { key: 'boq.main.boqProperties' },
				cssClass: 'tlb-icons ico-settings-doc',
				hideItem: false,
				iconClass: 'tlb-icons ico-settings-doc',
				id: 'boqProperties',
				type: ItemType.Item,
				fn: () => {
					// TODO: call this.boqStructureService.loadBoqStructure(loadedBoqHeaderFk).then(boqStructureEntity) and resolve promise and pass this structure entity in openBoqPropertiesDialog
					const boqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId();
					new BoqStructureDataService().loadBoqStructure(boqHeaderId as number).then(boqStructureEntity => {
						this.boqMainBoqPropertiesDialogService.openBoqPropertiesDialog(boqStructureEntity as IBoqStructureEntity);
					});
				},
			},
			{
				type: ItemType.Item,
				id: 'crbAbschnitt000',
				caption: { key: 'boq.main.crbAbschnitt000' },
				iconClass: 'tlb-icons ico-crb-000',
				fn: () => {
					if (this.boqItemDataService.isCrbBoq()) {
						this.crbDataService.attachAbschnitt000s(this.boqItemDataService);
					} else { // TODO-BOQ
						this.messageBoxService.showInfoBox('TODO: The button should only appear if (boqMainService.isCrbBoq() && !boqMainService.isCopySource)', 'info', false);
					}
				},
			},
			{
				type: ItemType.Item,
				id: 'crbImportantInformation',
				caption: { key: 'boq.main.crbImportantInformation' },
				iconClass: 'tlb-icons ico-preview-form',
				fn: () => {
					if (this.boqItemDataService.isCrbBoq()) {
						this.crbDataService.showImportantInformation(this.boqItemDataService, true);
					} else { // TODO-BOQ
						this.messageBoxService.showInfoBox('TODO: The button should only appear if (boqMainService.isCrbBoq() && (boqMainService.isWicBoq() || boqMainService.isCopySource))', 'info', false);
					}
				},
			},
			/* TODO-BOQ: Temporarily deactivated because of 'this.boqItemDataService'
			{
				type: ItemType.Item,
				id: 'crbCostgrpCatAssign',
				caption: { key: 'boq.main.crbCostgrpCatAssign' },
				iconClass: 'tlb-icons icco-config-crb-cost-group',
				permission: '#c',
				disabled: () => {
					return !this.boqItemDataService.getSelectedBoqHeaderId();
				},
				fn: () => {
					if (this.boqItemDataService.isCrbBoq()) {
						this.crbDataService.assignCostGrpCats(this.boqItemDataService);
					}
					else { // TODO-BOQ
						this.messageBoxService.showInfoBox('TODO: The button should only appear if (boqMainService.isCrbBoq() && !(boqMainService.isWicBoq() || boqMainService.isCopySource))', 'info', false);
					}
				},
			},
			*/
			{
				// TODO-BOQ-DEV-7051: only in CRB - if (boqMainService.isCopySource && boqMainService.isWicBoq() && boqMainService.isCrbBoq())
				type: ItemType.DropdownBtn,
				id:               'crbEcodevis',
				groupId:          'crbEcodevis',
				caption: 'boq.main.crbEcodevis',
				iconClass: 'tlb-icons ico-eco-devis',
				list: {
					showTitles: true,
					items: [
						{
							id:               'crbEcodevisMark2',
							caption: 'boq.main.crbEcodevisMark2',
							type: ItemType.Item,
							fn: () => {
								this.crbEcoDevisService.setEcoDevisMarks(this.boqItemDataService);
							},
						},
						{
							id:               'crbEcodevisInfo',
							caption: 'boq.main.crbEcodevisInfo',
							type: ItemType.Item,
							fn: () => {
								this.crbEcoDevisService.showEcoDevisInformation(this.boqItemDataService);
							},
						},
						{
							id:               'crbEcodevisRating',
							caption: 'boq.main.crbEcodevisRating',
							type: ItemType.Item,
							fn: () => {
								this.crbEcoDevisService.showEcoDevisRating(this.boqItemDataService);
							},
						},
						{
							id:               'crbEcodevisComparison',
							caption: 'boq.main.crbEcodevisComparison',
							type: ItemType.Item,
							fn: () => {
								this.crbEcoDevisService.showEcoDevisComparison(this.boqItemDataService);
							},
						},
						{
							id:               'crbEcodevisFiles',
							caption: 'boq.main.crbEcodevisFiles',
							type: ItemType.Item,
							fn: () => {
								this.crbEcoDevisService.showEcoDevisFiles(this.boqItemDataService);
							},
						},
						{
							id:               'crbEcodevisLinks',
							caption: 'boq.main.crbEcodevisLinks',
							type: ItemType.Item,
							fn: () => {
								this.crbEcoDevisService.showEcoDevisLinks(this.boqItemDataService);
							},
						},
					]
				}
			},
			{
				// TODO-BOQ-DEV-7053: only in CRB - if (boqMainService.isCopySource && boqMainService.isWicBoq() && boqMainService.isCrbBoq())
				type: ItemType.DropdownBtn,
				id:               'crbRevisioninfo',
				groupId:          'crbRevisioninfo',
				caption: 'boq.main.crbRevisioninfo',
				iconClass: 'tlb-icons ico-crb-correction',
				list: {
					showTitles: true,
					items: [
						{
							id:               'crbRevisioninfoMark',
							caption: 'boq.main.crbRevisioninfoMark',
							type: ItemType.Item,
							fn: () => {
								this.crbRevisionInfoService.setRevisionInfoMarks(this.boqItemDataService);
							},
						},
						{
							id:               'crbRevisionDetails',
							caption: 'boq.main.crbRevisionDetails',
							type: ItemType.Item,
							fn: () => {
								this.crbRevisionInfoService.showRevisionDetails(this.boqItemDataService);
							},
						},
						{
							id:               'crbRevisioninfoFiles',
							caption: 'boq.main.crbRevisioninfoFiles',
							type: ItemType.Item,
							fn: () => {
								this.crbRevisionInfoService.showRevisioninfoFiles(this.boqItemDataService);
							},
						},
						{
							id:               'crbRevisioninfoLinks',
							caption: 'boq.main.crbRevisioninfoLinks',
							type: ItemType.Item,
							fn: () => {
								this.crbRevisionInfoService.showRevisioninfoLinks(this.boqItemDataService);
							},
						},
					]
				}
			},
		]);
	}
}

@Injectable({providedIn: 'root'})
export class BoqItemConfigService {
	public getLayoutConfiguration(): ContainerLayoutConfiguration<IBoqItemEntity> {
		return {
			groups: [
				{
					gid: 'default-group',
					attributes: ['BoqLineTypeFk', 'Reference', 'ItemInfo', 'BriefInfo', 'Quantity', 'Price', 'Finalprice']
				},
			],
			labels: prefixAllTranslationKeys('boq.main.', {
				Reference: 'Reference',
				Quantity: 'Quantity',
				Price: 'Price',
				Finalprice: 'Finalprice',
				BoqDivisionTypeFk: 'BoqDivisionTypeFk',
				ItemInfo: 'ItemInfo',
				BriefInfo: 'BriefInfo',
				ANN: 'ANN',
				AGN: 'AGN',
				Reference2: 'Reference2',
				PrjCharacter: 'PrjCharacter',
				WorkContent: 'WorkContent',
				BoqLineTypeFk: 'BoqLineTypeFk',
				DesignDescriptionNo: 'DesignDescriptionNo',
				BoqItemWicBoqFk: 'WicNumber',
				FactorDetail: 'FactorDetail',
				DiscountText: 'DiscountText',
				BoqItemReferenceFk: 'BoqItemReferenceFk',
				CommentContractor: 'CommentContractor',
				CommentClient: 'CommentClient',
				Userdefined1: 'Userdefined1',
				Userdefined2: 'Userdefined2',
				Userdefined3: 'Userdefined3',
				Userdefined4: 'Userdefined4',
				Userdefined5: 'Userdefined5',
				ExternalCode: 'ExternalCode',
				ExternalUom: 'ExternalUom',
				Factor: 'Factor',
				Cost: 'Cost',
				Correction: 'Correction',
				Pricegross: 'Pricegross',
				DiscountedPrice: 'DiscountedPrice',
				Finaldiscount: 'Finaldiscount',
				Urb1: 'Urb1',
				Urb2: 'Urb2',
				Urb3: 'Urb3',
				Urb4: 'Urb4',
				Urb5: 'Urb5',
				Urb6: 'Urb6',
				UnitRateFrom: 'UnitRateFrom',
				UnitRateTo: 'UnitRateTo',
				LumpsumPrice: 'LumpsumPrice',
				Discount: 'Discount',
				QuantityAdj: 'QuantityAdj',
				QuantityAdjDetail: 'QuantityAdjDetail',
				HoursUnit: 'HoursUnit',
				Hours: 'Hours',
				DiscountPercent: 'DiscountPercent',
				IsUrb: 'IsUrb',
				IsLumpsum: 'IsLumpsum',
				IsDisabled: 'IsDisabled',
				IsNotApplicable: 'IsNotApplicable',
				IsKeyitem: 'IsKeyitem',
				IsSurcharged: 'IsSurcharged',
				IsFreeQuantity: 'IsFreeQuantity',
				IsUrFromSd: 'IsUrFromSd',
				IsFixedPrice: 'IsFixedPrice',
				IsNoMarkup: 'IsNoMarkup',
				IsCostItem: 'IsCostItem',
				Included: 'Included',
				PrcStructureFk: 'PrcStructureFk',
				MdcTaxCodeFk: 'TaxCodeFk',
				BpdAgreementFk: 'BpdAgreementFk',
				BasItemTypeFk: 'BasItemTypeFk',
				BasItemType2Fk: 'BasItemType2Fk',
				MdcMaterialFk: 'MdcMaterialFk',
				MdcCostCodeFk: 'MdcCostCodeFk',
				MdcControllingUnitFk: 'MdcControllingUnitFk',
				PrcItemEvaluationFk: 'PrcItemEvaluationFk',
				PrjLocationFk: 'PrjLocationFk',
				CalculateQuantitySplitting: 'CalculateQuantitySplitting',
				BudgetFixedUnit: 'BudgetFixedUnit',
				BudgetFixedTotal: 'BudgetFixedTotal',
				BudgetDifference: 'BudgetDifference',
				WicNumber: 'WicNumber',
				BasUomFk: 'BasUomFk',
				Stlno: 'Stlno',
				BasItemStatusFk: 'BasItemStatusFk',
				StatusComment: 'StatusComment',
				DeliveryDate: 'DeliveryDate',
				CopyInfo: 'CopyInfo',
				BoqItemFlagFk: 'BoqItemFlagFk',
				QuantityDetail: 'QuantityDetail',
				CostOc: 'CostOc',
				CorrectionOc: 'CorrectionOc',
				PriceOc: 'PriceOc',
				SurchargeFactor: 'SurchargeFactor',
				PricegrossOc: 'PricegrossOc',
				DiscountedUnitprice: 'DiscountedUnitprice',
				DiscountedUnitpriceOc: 'DiscountedUnitpriceOc',
				DiscountedPriceOc: 'DiscountedPriceOc',
				FinalpriceOc: 'FinalpriceOc',
				FinaldiscountOc: 'FinaldiscountOc',
				Finalgross: 'Finalgross',
				FinalgrossOc: 'FinalgrossOc',
				ItemTotal: 'ItemTotal',
				ItemTotalOc: 'ItemTotalOc',
				QuantityMax: 'QuantityMax',
				ExtraIncrement: 'ExtraIncrement',
				PreEscalation: 'PreEscalation',
				ExtraIncrementOc: 'ExtraIncrementOc',
				PreEscalationOc: 'PreEscalationOc',
				NotSubmitted: 'NotSubmitted',
				Urb1Oc: 'Urb1Oc',
				Urb2Oc: 'Urb2Oc',
				Urb3Oc: 'Urb3Oc',
				Urb4Oc: 'Urb4Oc',
				Urb5Oc: 'Urb5Oc',
				Urb6Oc: 'Urb6Oc',
				UnitRateFromOc: 'UnitRateFromOc',
				UnitRateToOc: 'UnitRateToOc',
				LumpsumPriceOc: 'LumpsumPriceOc',
				DiscountOc: 'DiscountOc',
				DiscountPercentIt: 'DiscountPercentIt',
				ExSalesTaxGroupFk: 'ExSalesTaxGroupFk',
				IsLeadDescription: 'IsLeadDescription',
				IsDaywork: 'IsDaywork',
				UseSubQuantityPrice: 'UseSubQuantityPrice',
				RecordingLevel: 'RecordingLevel',
				VobDirectCostPerUnit: 'VobDirectCostPerUnit',
				VobDirectCostPerUnitOc: 'VobDirectCostPerUnitOc',
				VobIsIndirectCostBalancing: 'VobIsIndirectCostBalancing',
				VobIsSpecialIndirectCostBalancing: 'VobIsSpecialIndirectCostBalancing',
				Rule: 'Rule',
				Param: 'Param',
				RuleFormula: 'RuleFormula',
				RuleFormulaDesc: 'RuleFormulaDesc',
				DivisionTypeAssignment: 'DivisionTypeAssignment',
				BudgetPerUnit: 'BudgetPerUnit',
				BudgetTotal: 'BudgetTotal',
				PrjChangeFk: 'PrjChangeFk',
				PrjChangeStatusFk: 'PrjChangeStatusFk',
				PrjChangeStatusFactorByReason: 'PrjChangeStatusFactorByReason',
				PrjChangeStatusFactorByAmount: 'PrjChangeStatusFactorByAmount',
				BoqRevenueTypeFk: 'BoqRevenueTypeFk',
			})
		};
	}
}