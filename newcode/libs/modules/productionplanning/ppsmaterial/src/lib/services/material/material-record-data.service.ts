/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ISearchPayload, ISearchResult } from '@libs/platform/common';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IMaterialNewEntity, PpsMaterialComplete } from '../../model/models';
import { PpsMaterialRecordProcessor } from './material-record-readonly.processor';
import { PpsMaterialCatalogDataService } from '../material-catalog/material-catalog-data.service';
import { PpsMaterialGroupDataService } from '../material-group/material-group-data.service';
import { PpsMaterialToMdlProductTypeDataService } from '../material-to-producttype/pps-material-to-mdl-product-type-data.service';
import { PpsCadToMaterialDataService } from '../cad-to-material/pps-cad-to-material-data.service';

/**
 * PPS Material record data service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsMaterialRecordDataService extends DataServiceFlatRoot<IMaterialNewEntity, PpsMaterialComplete> {

	private _ppsMaterialToMdlProductTypeDataService = inject(PpsMaterialToMdlProductTypeDataService);
	private _ppsCadToMaterialDataService = inject(PpsCadToMaterialDataService);

	private materialCatalogFilterDataService = inject(PpsMaterialCatalogDataService);
	private materialGroupFilterDataService = inject(PpsMaterialGroupDataService);
	/**
	 * If the loading is triggered from clicking on catalog\group check box it will be true
	 */
	private isLoadingByFiltering = false;

	/**
	 * The constructor
	 */
	public constructor(/*private injector: Injector*/) {
		const options: IDataServiceOptions<IMaterialNewEntity> = {
			apiUrl: 'productionplanning/ppsmaterial',
			readInfo: <IDataServiceEndPointOptions>{
				usePost: true,
				endPoint: 'newlist',
			},
			roleInfo: <IDataServiceRoleOptions<IMaterialNewEntity>>{
				role: ServiceRole.Root,
				itemName: 'Material',
			},
		};
		super(options);
		this.processor.addProcessor(new PpsMaterialRecordProcessor(this));
	}

	/**
	 * create update entity
	 * @param modified
	 */
	public override createUpdateEntity(modified: IMaterialNewEntity | null): PpsMaterialComplete {
		const complete = new PpsMaterialComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Material = modified;
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
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IMaterialNewEntity> {
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
				Materails: IMaterialNewEntity[];
			};
			//	materialTempUpdateStatus: IBasicsMaterialTemplateFieldSettingEntity[];
		};

		//Update the catalog/group filtering check box only when loading from fresh button\search sidebar
		if (!this.isLoadingByFiltering) {
			this.updateFiltering(result.Main.Materails);
		}

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



	protected override provideCreatePayload(): object {
		const selGroup = this.materialGroupFilterDataService.getSelectedEntity();
		if (selGroup) {
			return { groupId: selGroup.Id };
		}

		throw new Error('A meterial group should be selected');
	}

	// protected override onCreateSucceeded(created: object): IMaterialNewEntity {
	// 	const createdDTO = created as { Material: IMaterialNewEntity; MaterialTempUpdateStatus: IBasicsMaterialTemplateFieldSettingEntity };

	// 	if (createdDTO.MaterialTempUpdateStatus) {
	// 		this.readonlyProcessor.updateMaterialTemplateReadonlyFieldsMapping([createdDTO.MaterialTempUpdateStatus]);
	// 	}

	// 	//TODO also need to handle the characteristics

	// 	return createdDTO.Material;
	// }

	private updateFiltering(materials: IMaterialNewEntity[]) {
		const catalogIds = new Set(materials.map((m) => m.MaterialCatalogFk));
		const groupIds = new Set(materials.map((m) => m.MaterialGroupFk));

		this.materialCatalogFilterDataService.updateFilter(catalogIds);
		this.materialGroupFilterDataService.updateFilter(groupIds);
	}

	/**
	 * Get modifications from update
	 * @param complete
	 */
	public override getModificationsFromUpdate(complete: PpsMaterialComplete): IMaterialNewEntity[] {
		if (complete) {
			if (complete.Material) {
				return [complete.Material];
			}
		}

		return [];
	}

	/**
	 * React on the check state of group change, will be called in method fireGroupCheckedChangedForMaterial of in PpsMaterialGroupDataService
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

	// public getProcessors() {
	// 	return this.processor.getProcessors();
	// }

	//TODO: a workaround for multiple root containers
	public override refreshAll(): Promise<void> {
		this._ppsCadToMaterialDataService.refreshAll();
		this._ppsMaterialToMdlProductTypeDataService.refreshAll();

		return super.refreshAll();
	}
}
