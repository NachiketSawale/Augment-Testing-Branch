import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { MainDataDto } from '@libs/basics/shared';
import { find, forEach, get, isArray, map, set } from 'lodash';
import { Dictionary, IFilterResult, ISearchResult, PlatformConfigurationService, PlatformPermissionService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IEstPriceAdjustmentItemData, IEstPriceAdjustmentItemDataResponse, IEstPriceAdjustmentUrbData } from '@libs/estimate/interfaces';
import { EstPriceAdjustmentComplete } from '../../model/complete/est-price-adjustment-complete.class';
import { EstimatePriceAdjustmentCalculatorService } from '../../services/calculation/estimate-price-adjustment-calculator.service';
import { EstimateMainSyncTenderPriceService } from './toolbar/estimate-main-sync-tender-price.service';


// eslint-disable-next-line angular-file-naming/service-filename-suffix
@Injectable({ providedIn: 'root' })
export class EstimatePriceAdjustmentDataService extends DataServiceHierarchicalRoot<IEstPriceAdjustmentItemData, EstPriceAdjustmentComplete> {
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly platformPermissionService = inject(PlatformPermissionService);
	private readonly injector = inject(Injector);
	private boqHeader2URB: Dictionary<number, string[]> = new Dictionary<number, string[]>();

	/**
	 * Constructor for EstimatePriceAdjustmentDataService.
	 * Initializes the service with specific options and adds a readonly processor.
	 */
	public constructor() {
		const options: IDataServiceOptions<IEstPriceAdjustmentItemData> = {
			apiUrl: 'estimate/main/priceadjustment',
			roleInfo: <IDataServiceRoleOptions<IEstPriceAdjustmentItemData>>{
				role: ServiceRole.Root,
				itemName: 'EstimatePriceAdjustmentToSave',
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getestpriceadjustmentlist',
				usePost: false,
			},
		};
		super(options);
		//this.processor.addProcessor([new EstimatePriceAdjustmentReadonlyProcessor(this)]);
	}

	/**
	 * Handles the successful loading of data.
	 * @param loaded - The loaded data object.
	 * @returns An array of IEstPriceAdjustmentItemData.
	 */
	protected override onLoadSucceeded(loaded: object): IEstPriceAdjustmentItemData[] {
		const responseData = new MainDataDto<IEstPriceAdjustmentItemDataResponse>(loaded);

		const boqTree = responseData.getValueAs<IEstPriceAdjustmentItemData[]>('boqTree') ?? [];

		const priceAdjustments = responseData.getValueAs<IEstPriceAdjustmentItemData[]>('priceAdjustments') ?? [];

		const boqStructure = responseData.getValueAs<IEstPriceAdjustmentUrbData>('boqStructure');

		this.setBoqHeader2URB(boqTree, boqStructure);

		const boqList = this.flatten(boqTree);

		forEach(boqList, (boqItem) => {
			const priceAdjustInfo = find(priceAdjustments, { Id: boqItem.Id });

			const sourceItem = priceAdjustInfo ? priceAdjustInfo : boqItem;

			const propertyNames: (keyof IEstPriceAdjustmentItemData)[] = Object.keys(sourceItem) as (keyof IEstPriceAdjustmentItemData)[];

			forEach(propertyNames, (property) => {
				set(boqItem, property, get(sourceItem, property) ?? null);
			});

			if (!boqItem.BoqItemFk) {
				boqItem.BoqItemFk = -1;
			}
			// todo: depend on 'boqMainCommonService'
			/* if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
				 if (boqItem.AqTenderPrice !== null && boqItem.AqEstimatedPrice !== null && boqItem.AqDeltaPrice === null) {
					boqItem.AqDeltaPrice = boqItem.AqTenderPrice - boqItem.AqEstimatedPrice;
				 }
				 if (boqItem.WqTenderPrice !== null && boqItem.WqEstimatedPrice !== null && boqItem.WqDeltaPrice === null) {
					boqItem.WqDeltaPrice = boqItem.WqTenderPrice - boqItem.WqEstimatedPrice;
				 }
				 }
				if (boqMainCommonService.isItem(boqItem)) {
				$injector.get('estimateMainPriceAdjustmentCalculateService').restItemURB(boqItem, service.getReadOnlyURBFiledName(boqItem));
				}*/
		});

		const vRoot = this.createRootBoq(boqTree);

		return [vRoot];
	}

	/**
	 * Flattens a hierarchical list of items.
	 * @param originItems - The original hierarchical list of items.
	 * @returns A flattened list of items.
	 */
	private flatten(originItems: IEstPriceAdjustmentItemData[]): IEstPriceAdjustmentItemData[] {
		const result: IEstPriceAdjustmentItemData[] = [];
		originItems.forEach((item) => {
			result.push(item);
			result.push(...this.flatten(this.childrenOf(item)));
		});
		return result;
	}

	/**
	 * Creates a root BOQ (Bill of Quantities) item.
	 * @param boqItems - The list of BOQ items.
	 * @returns The root BOQ item.
	 */
	private createRootBoq(boqItems: IEstPriceAdjustmentItemData[]): IEstPriceAdjustmentItemData {
		const vRoot: IEstPriceAdjustmentItemData = {
			Id: -1,
			BoqItems: boqItems,
			BoqItemFk: null,
			BoqHeaderFk: 0,
			HasChildren: boqItems.length > 0,
			image: 'ico-folder-estimate',
			BoqLineTypeFk: 999,
			WqEstimatedPrice: 0,
			WqAdjustmentPrice: 0,
			WqTenderPrice: 0,
			WqDeltaPrice: 0,
			AqEstimatedPrice: 0,
			AqAdjustmentPrice: 0,
			AqTenderPrice: 0,
			AqDeltaPrice: 0,
			Status: 0,
			IsRoot: true,
			EstHeaderFk: 0
		};

		const estHeader = this.estimateMainContextService.getSelectedEstHeaderItem();

		if (estHeader) {
			vRoot.Reference = estHeader.Code;
			vRoot.BriefInfo = estHeader.DescriptionInfo;
			vRoot.EstHeaderFk = estHeader.Id;
			vRoot.IsRoot = true;
		}

		forEach(boqItems, (boqItem) => {
			vRoot.WqEstimatedPrice! += boqItem.WqEstimatedPrice ?? 0;
			vRoot.WqAdjustmentPrice! += boqItem.WqAdjustmentPrice ?? 0;
			vRoot.WqTenderPrice! += boqItem.WqTenderPrice ?? 0;
			vRoot.WqDeltaPrice! += boqItem.WqDeltaPrice ?? 0;
			vRoot.AqEstimatedPrice! += boqItem.AqEstimatedPrice ?? 0;
			vRoot.AqAdjustmentPrice! += boqItem.AqAdjustmentPrice ?? 0;
			vRoot.AqTenderPrice! += boqItem.AqTenderPrice ?? 0;
			vRoot.AqDeltaPrice! += boqItem.AqDeltaPrice ?? 0;
		});

		//$injector.get('estimateMainPriceAdjustmentCalculateService').restStatus(vRoot);

		return vRoot;
	}

	/**
	 * Gets the children of a given BOQ item.
	 * @param element - The BOQ item.
	 * @returns The list of children BOQ items.
	 */
	public override childrenOf(element: IEstPriceAdjustmentItemData): IEstPriceAdjustmentItemData[] {
		if (element && element.BoqItems) {
			return element.BoqItems as IEstPriceAdjustmentItemData[];
		}
		element.BoqItems = [];
		return element.BoqItems as IEstPriceAdjustmentItemData[];
	}

	/**
	 * Gets the parent of a given BOQ item.
	 * @param element - The BOQ item.
	 * @returns The parent BOQ item or null if no parent exists.
	 */
	public override parentOf(element: IEstPriceAdjustmentItemData): IEstPriceAdjustmentItemData | null {
		if (!element.BoqItemFk) {
			return null;
		}
		const parent = this.flatList().find((candidate) => candidate.Id === element.BoqItemFk);
		return parent ? parent : null;
	}

	/**
	 * Provides the payload for loading data by filter.
	 * @returns The payload object.
	 */
	protected override provideLoadByFilterPayload(): object {
		// const projectFk = this.estimateMainContextService.getSelectedProjectId();
		// const estHeaderFk = this.estimateMainContextService.getSelectedEstHeaderId();
		/* return {
		  projectFk: projectFk ?? 0,
		  estHeaderFk: estHeaderFk ?? 0,
		}; */
		return {
			/* projectFk: 1015341,
			estHeaderFk: 1008346 */
			projectFk: 1014119,
			estHeaderFk: 1006744,
		};
	}

	/**
	 * Handles the successful loading of data by filter.
	 * @param loaded - The loaded data object.
	 * @returns The search result containing the list of BOQ items.
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstPriceAdjustmentItemData> {
		const tree: IEstPriceAdjustmentItemData[] = this.onLoadSucceeded(loaded);
		return {
			FilterResult: {} as IFilterResult,
			dtos: tree,
		};
	}

	/**
	 * Sets the BOQ header to URB mapping.
	 * @param boqTree - The BOQ tree.
	 * @param boqStructure - The BOQ structure.
	 */
	private setBoqHeader2URB(boqTree: IEstPriceAdjustmentItemData[], boqStructure?: IEstPriceAdjustmentUrbData) {
		const boqHeaderFks = map(boqTree, 'BoqHeaderFk');
		forEach(boqHeaderFks, (fk) => {
			if (fk) {
				let URBFields = [];
				if (boqStructure && boqStructure[fk]) {
					if (!boqStructure[fk].NameUrb1) {
						URBFields.push('Urb1');
					}
					if (!boqStructure[fk].NameUrb2) {
						URBFields.push('Urb2');
					}
					if (!boqStructure[fk].NameUrb3) {
						URBFields.push('Urb3');
					}
					if (!boqStructure[fk].NameUrb4) {
						URBFields.push('Urb4');
					}
					if (!boqStructure[fk].NameUrb5) {
						URBFields.push('Urb5');
					}
					if (!boqStructure[fk].NameUrb6) {
						URBFields.push('Urb6');
					}
				} else {
					URBFields = ['Urb1', 'Urb2', 'Urb3', 'Urb4', 'Urb5', 'Urb6'];
				}
				this.boqHeader2URB.add(fk, URBFields);
			}
		});
	}

	/**
	 * Gets the read-only URB field names for a given BOQ item.
	 * @param boqItem - The BOQ item.
	 * @returns The list of read-only URB field names.
	 */
	public getReadOnlyURBFiledName(boqItem: IEstPriceAdjustmentItemData) {
		let result = ['Urb1', 'Urb2', 'Urb3', 'Urb4', 'Urb5', 'Urb6'];
		if (boqItem.BoqHeaderFk) {
			result = this.boqHeader2URB.get(boqItem.BoqHeaderFk) || result;
		}
		return result;
	}

	/**
	 * Asynchronously creates price adjustments.
	 * @param count - The number of price adjustments to create.
	 * @returns A promise that resolves to an array of IEstPriceAdjustmentItemData.
	 */
	private async asyncCreatePriceAdjustments(count: number): Promise<IEstPriceAdjustmentItemData[]> {
		const estHeader = this.estimateMainContextService.getSelectedEstHeaderItem();
		if (estHeader) {
			const responseData = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'estimate/main/priceadjustment/create?estHeaderFk=' + estHeader.Id + '&count=' + count));
			return responseData as IEstPriceAdjustmentItemData[];
		}
		return [] as IEstPriceAdjustmentItemData[];
	}

	/**
	 * Checks and creates price adjustments for the given items if necessary.
	 * @param items - The list of items to check.
	 * @returns A promise that resolves when the check is complete.
	 */
	public async checkPriceAdjustment(items: IEstPriceAdjustmentItemData[]) {
		if (isArray(items)) {
			const noFkItems = items.filter((e) => !e.EstPriceAdjustmentFk);
			if (noFkItems.length > 0) {
				const result = await this.asyncCreatePriceAdjustments(noFkItems.length);
				if (result && result.length > 0 && result.length === noFkItems.length) {
					for (let i = 0; i < result.length; i++) {
						noFkItems[i] = { ...noFkItems[i], ...result[i] };
					}
				}
			}
		}
		return Promise.resolve();
	}

	/**
	 * Checks if the user has update permission.
	 * @returns True if the user has update permission, false otherwise.
	 */
	public hasUpdatePermission() {
		return this.platformPermissionService.hasWrite('6e1c35741cbe47269d291ee0a7e09e44');
	}

	/**
	 * Checks if the user has main update permission.
	 * @returns True if the user has main update permission, false otherwise.
	 */
	public estMainUpdatePermission() {
		return this.platformPermissionService.hasWrite('681223e37d524ce0b9bfa2294e18d650');
	}

	/**
	 * Checks if the user has read-only access.
	 * @returns True if the user has read-only access, false otherwise.
	 */
	public hasReadOnly() {
		return !(this.hasUpdatePermission() && !this.estimateMainContextService.getHeaderStatus() && this.estMainUpdatePermission() && this.getList().length > 0);
	}

	/**
	 * Checks if a given BOQ item is read-only.
	 * @param boqItem - The BOQ item.
	 * @returns True if the BOQ item is read-only, false otherwise.
	 */
	public hasReadOnlyItem(boqItem: IEstPriceAdjustmentItemData) {
		if (boqItem && !this.hasReadOnly()) {
			return boqItem.Id === -1 || !boqItem.IsAssignedLineItem;
		} else {
			return true;
		}
	}

	/**
	 * Checks if a given BOQ item has special read-only conditions.
	 * @param boqItem - The BOQ item.
	 * @returns True if the BOQ item has special read-only conditions, false otherwise.
	 */
	public hasSpecialReadOnly(boqItem: IEstPriceAdjustmentItemData) {
		return false;
		// todo: depend on 'estimateMainBoqService'
		//return boqItem.IsDisabled || (estimateMainBoqService.IsLineItemOptional(boqItem) && !estimateMainBoqService.IsLineItemOptionalIt(boqItem));
	}

	/**
	 * Creates an update entity for the given modified item.
	 * @param modified - The modified item.
	 * @returns The complete update entity.
	 */
	public override createUpdateEntity(modified: IEstPriceAdjustmentItemData | null): EstPriceAdjustmentComplete {
		const complete = new EstPriceAdjustmentComplete();
		if (modified) {
			complete.EstimatePriceAdjustmentToSave = [modified];
		}
		return complete;
	}

	/**
	 * Recalculates the price adjustment for the given validation info.
	 * @param info - The validation info.
	 * @returns A promise that resolves to the validation result.
	 */
	public async recalculate(info: ValidationInfo<IEstPriceAdjustmentItemData>): Promise<ValidationResult> {
		await this.checkPriceAdjustment([info.entity]);
		const unCalUrbs = this.getReadOnlyURBFiledName(info.entity);
		const value: number | null = info.value !== null ? (info.value as number) : null;
		const calculator = new EstimatePriceAdjustmentCalculatorService(info.entity, info.field, value, unCalUrbs);
		calculator.recalculate();
		return { valid: true, apply: true };
	}

	/**
	 * Gets the complete list of BOQ items.
	 * @returns The complete list of BOQ items.
	 */
	public getAllList(): IEstPriceAdjustmentItemData[] {
		return this.flatten(this.getList());
	}

	/**
	 * Gets the sync tender price service.
	 * @returns The sync tender price service.
	 */
	public getSyncTenderPriceService() {
		return runInInjectionContext(this.injector, () => {
			return new EstimateMainSyncTenderPriceService();
		});
	}

	/**
	 * Gets the modify price adjustment service.
	 * @returns The modify price adjustment service.
	 */
	public getModifyPriceAdjustmentService() {
		return runInInjectionContext(this.injector, () => {
			//return new EstimateMainModifyPriceAdjustmentService();
		});
	}
}
