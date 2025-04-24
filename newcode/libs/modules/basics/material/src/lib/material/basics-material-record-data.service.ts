/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IMaterialEntity, IBasicsPriceConditionHeaderService, IMaterialSimpleLookupEntity } from '@libs/basics/interfaces';
import { ISearchPayload, ISearchResult, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { union } from 'lodash';
import { BasicsMaterialMaterialCatalogDataService } from '../material-catalog/basics-material-material-catalog-data.service';
import { BasicsMaterialMaterialGroupDataService } from '../material-group/basics-material-material-group-data.service';
import { Subject } from 'rxjs';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsMaterialCalculationService, BasicsSharedMainStatusLookupService, BasicsSharedMaterialSimpleLookupService } from '@libs/basics/shared';
import { MaterialComplete } from '../model/complete-class/material-complete.class';
import { BasicsMaterialRecordReadonlyProcessor } from './basics-material-record-readonly-processor.class';
import { IBasicsMaterialTemplateFieldSettingEntity } from '../interfaces/basics-material-template-field-setting.interface';

/**
 * Material record data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialRecordDataService extends DataServiceFlatRoot<IMaterialEntity, MaterialComplete> implements IBasicsPriceConditionHeaderService<IMaterialEntity, MaterialComplete> {
	private materialCatalogFilterDataService = inject(BasicsMaterialMaterialCatalogDataService);
	private materialGroupFilterDataService = inject(BasicsMaterialMaterialGroupDataService);
	private readonly calculationService = inject(BasicsMaterialCalculationService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(PlatformHttpService);
	private readonly materialStatusLookup = inject(BasicsSharedMainStatusLookupService);
	public readonly readonlyProcessor = new BasicsMaterialRecordReadonlyProcessor(this);
	private readonly materialLookupService = inject(BasicsSharedMaterialSimpleLookupService);

	/**
	 * If the loading is triggered from clicking on catalog\group check box it will be true
	 */
	private isLoadingByFiltering = false;

	/**
	 * Emitter for priceCondition change
	 */
	public priceConditionChanged$ = new Subject<number | null>();

	/**
	 * Emitter for materialTempFk change
	 */
	public materialTempChangedEmitter = new Subject<void>();

	/**
	 * Emitter for materialPortion change
	 */
	public materialPortionChanged = new Subject<{ entity: IMaterialEntity; model: string }>();

	/**
	 * The constructor
	 */
	public constructor(private injector: Injector) {
		const options: IDataServiceOptions<IMaterialEntity> = {
			apiUrl: 'basics/material',
			readInfo: <IDataServiceEndPointOptions>{
				usePost: true,
				endPoint: 'list',
			},
			roleInfo: <IDataServiceRoleOptions<IMaterialEntity>>{
				role: ServiceRole.Root,
				itemName: 'Materials',
			},
		};
		super(options);
		this.processor.addProcessor(this.readonlyProcessor);
	}

	/**
	 * create update entity
	 * @param modified
	 */
	public override createUpdateEntity(modified: IMaterialEntity | null): MaterialComplete {
		const complete = new MaterialComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.SelectedMaterialId = modified.Id;
			complete.Materials = [modified];
		}

		return complete;
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		return {
			MaterialCatalogIds: this.isLoadingByFiltering ? this.materialCatalogFilterDataService.getFilteredCatalogIds() : [],
			GroupIds: this.isLoadingByFiltering ? this.materialGroupFilterDataService.getFilteredGroupIds() : [],
			IsRefresh: false,
			CatalogId: null, //Not sure this field is really needed or not. Please double check other places whether we can remove this parameter
			...payload,
		};
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IMaterialEntity> {
		//TODO: we may need a general interface not using the interface from material catalog.
		const result = loaded as {
			FilterResult: {
				ExecutionInfo: string;
				RecordsFound: number;
				RecordsRetrieved: number;
				ResultIds: number[];
			};
			Main: {
				//TODO: should correct the typo here
				Materails: IMaterialEntity[];
			};
			materialTempUpdateStatus: IBasicsMaterialTemplateFieldSettingEntity[];
		};

		if (result.materialTempUpdateStatus) {
			this.readonlyProcessor.updateMaterialTemplateReadonlyFieldsMapping(result.materialTempUpdateStatus ?? []);
		}

		//Update the catalog/group filtering check box only when loading from fresh button\search sidebar
		if (!this.isLoadingByFiltering) {
			this.updateFiltering(result.Main.Materails);
		}

		//because the MaterialGroupFk in IMaterialSimpleLookupEntity and IMaterialEntity do not match, a conversion is performed.
		const simpleEntities = result.Main.Materails.map((material) => ({
			...material,
			MdcMaterialGroupFk: material.MaterialGroupFk,
		})) as unknown as IMaterialSimpleLookupEntity[];

		this.materialLookupService.cache.setItems(simpleEntities);

		return {
			FilterResult: {
				ExecutionInfo: result.FilterResult.ExecutionInfo,
				RecordsFound: result.FilterResult.RecordsFound,
				RecordsRetrieved: result.FilterResult.RecordsRetrieved,
				ResultIds: result.FilterResult.ResultIds,
			},
			dtos: result.Main.Materails,
		};
	}

	public override canCreate(): boolean {
		if (this.materialCatalogFilterDataService.isReadonlyCatalog()) {
			return false;
		}

		const selGroup = this.materialGroupFilterDataService.getSelectedEntity();
		if (!selGroup) {
			return false;
		}

		return super.canCreate();
	}

	protected override provideCreatePayload(): object {
		const selGroup = this.materialGroupFilterDataService.getSelectedEntity();
		if (selGroup) {
			return { groupId: selGroup.Id };
		}

		throw new Error('A meterial group should be selected');
	}

	protected override onCreateSucceeded(created: object): IMaterialEntity {
		const createdDTO = created as { Material: IMaterialEntity; MaterialTempUpdateStatus: IBasicsMaterialTemplateFieldSettingEntity };

		if (createdDTO.MaterialTempUpdateStatus) {
			this.readonlyProcessor.updateMaterialTemplateReadonlyFieldsMapping([createdDTO.MaterialTempUpdateStatus]);
		}

		//TODO also need to handle the characteristics

		return createdDTO.Material;
	}

	private updateFiltering(materials: IMaterialEntity[]) {
		const catalogIds = new Set(materials.map((m) => m.MaterialCatalogFk));
		const groupIds = new Set(materials.map((m) => m.MaterialGroupFk));

		this.materialCatalogFilterDataService.updateFilter(catalogIds);
		this.materialGroupFilterDataService.updateFilter(groupIds);
	}

	/**
	 * Get modifications from update
	 * @param complete
	 */
	public override getModificationsFromUpdate(complete: MaterialComplete): IMaterialEntity[] {
		if (complete) {
			if (complete.Materials) {
				return complete.Materials;
			}
			if (complete.Material) {
				return [complete.Material];
			}
		}

		return [];
	}

	/**
	 * React on the check state of group change
	 */
	public onGroupCheckChanged() {
		if (this.materialGroupFilterDataService.getFilteredGroupIds().length > 0) {
			this.isLoadingByFiltering = true;
			this.refreshAllLoaded().finally(() => {
				this.isLoadingByFiltering = false;
			});
		} else {
			//TODO enhance the case uncheck all group
			this.setList([]);
		}
	}

	/**
	 * Recalculate CostPriceGross
	 * @param itemList
	 */
	public setCostPriceGross(itemList: IMaterialEntity[]) {
		this.calculationService.calculateCostPriceGross(itemList);
	}

	/**
	 * Recalculate Cost and other fields
	 * @param entity
	 */
	public recalculateCostByCostPriceGross(entity: IMaterialEntity) {
		this.calculationService.calculateCostByCostPriceGross(entity);
	}

	/**
	 * Recalculate Cost by pointed fields
	 * @param item
	 * @param value
	 * @param model
	 * @param fireModify
	 */
	public recalculateCost(item: IMaterialEntity, value?: number, model?: string, fireModify = false) {
		item = item ?? this.getSelectedEntity();
		if (!item) {
			return;
		}
		this.calculationService.calculateCost(item, value, model);
		this.materialPortionChanged.next({ entity: item, model: model ? model : '' });
		this.setCostPriceGross([item]);
		if (fireModify) {
			this.setModified([item]);
		}
	}

	/**
	 * Deep copy material
	 */
	public async deepCopy(): Promise<void> {
		const selection = this.getSelectedEntity();
		if (!selection) {
			return;
		}
		const response = await this.http.post<{ ErrorMessage: string; Material: IMaterialEntity }>('basics/material/deepcopy', selection);
		if (response.ErrorMessage) {
			await this.dialogService.showMsgBox(response.ErrorMessage, this.translateService.instant('basics.common.taskBar.warning').text, 'ico-warning');
			return;
		} else if (response.Material) {
			this.readonlyProcessor.process(response.Material);
			//TODO update it after common DatesProcessor ready
			/*var dataProcessor = new DatesProcessor(['UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5']);
			dataProcessor.processItem(response.data.Material);*/
			this.setList(union(this.getList(), [response.Material]));
			return this.goToLast();
		}
	}

	public isReadonlyMaterial(selected: IMaterialEntity) {
		const selectedMaterial = selected || this.getSelectedEntity();
		if (!selectedMaterial) {
			return true;
		}

		const isCatalogReadonly = this.materialCatalogFilterDataService.isReadonlyCatalog(undefined, selectedMaterial.MaterialCatalogFk);
		const isStatusReadonly = this.materialStatusLookup.cache.getList().some((status) => status.Id === selectedMaterial.MaterialStatusFk && status.IsReadOnly);

		return isCatalogReadonly || isStatusReadonly;
	}

	public getProcessors() {
		return this.processor.getProcessors();
	}
}
