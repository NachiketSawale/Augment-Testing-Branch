// remark: current file is copied from basics-material-material-catalog-data.service in basics.material, 
// should be replaced by other way(like LazyInjectionToken from basics.material module) in the future
/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { CompleteIdentification, PlatformHttpService } from '@libs/platform/common';
// import { BasicsMaterialMaterialCatalogComplete } from '../model/complete-class/basics-material-material-catalog-complete.class';
import { BasicsSharedMaterialCatalogTypeLookupService, IMainDataDto, IMaterialCatalogEntity } from '@libs/basics/shared';
import { IBasicsCustomizeMaterialCatalogTypeEntity } from '@libs/basics/interfaces';
import { Subject } from 'rxjs';

/**
 * Material catalog data service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsMaterialCatalogDataService extends DataServiceFlatRoot<IMaterialCatalogEntity, CompleteIdentification<IMaterialCatalogEntity>> {
	private http = inject(PlatformHttpService);
	private apiUrl = 'basics/materialcatalog/catalog';
	private materialCatalogTypeLookupService = inject(BasicsSharedMaterialCatalogTypeLookupService);
	private catalogTypes: IBasicsCustomizeMaterialCatalogTypeEntity[] = [];

	public onFilterChanged = new Subject<IMaterialCatalogEntity>();

	/**
	 * The constructor
	 */
	public constructor() {
		const options: IDataServiceOptions<IMaterialCatalogEntity> = {
			apiUrl: 'basics/materialcatalog/catalog',
			readInfo: <IDataServiceEndPointOptions>{
				usePost: false,
				endPoint: 'list',
				prepareParam: (ident) => {
					return { isFilterCompany: true };
				},
			},
			roleInfo: <IDataServiceRoleOptions<IMaterialCatalogEntity>>{
				role: ServiceRole.Root,
				itemName: 'MaterialCatalog',
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false,
			},
		};

		super(options);
		this.processor.addProcessor([
			{
				process: this.addCheckedProcess.bind(this),
				revertProcess() {},
			},
		]);
	}

	/**
	 * Load data
	 */
	public async load(): Promise<IMaterialCatalogEntity[]> {
		const resp = await this.http.get<IMainDataDto<IMaterialCatalogEntity>>(this.apiUrl + '/list', {
			params: {
				isFilterCompany: true,
			},
		});
		const catalogs = resp.Main;
		this.processor.process(catalogs);
		this.setList(catalogs);
		return catalogs;
	}

	/**
	 * createUpdateEntity
	 * return empty BasicsMaterialMaterialCatalogComplete, cause this container is only for filtering
	 * @param modified
	 */
	public override createUpdateEntity(modified: IMaterialCatalogEntity | null): CompleteIdentification<IMaterialCatalogEntity> {
		return {};
	}

	private addCheckedProcess(item: IMaterialCatalogEntity): void {
		if (item) {
			item.IsChecked = false;
		}
	}

	/**
	 * Gather checked catalog ids
	 */
	public getFilteredCatalogIds(): number[] {
		return this.getList()
				.filter((e) => e.IsChecked)
				.map((e) => e.Id);
	}

	/**
	 * Update catalog check status
	 * @param catalogIds
	 */
	public updateFilter(catalogIds: Set<number>) {
		//reset the filter
		this.getList().forEach((e) => (e.IsChecked = false));
		//update the filter
		this.getList()
			.filter((e) => catalogIds.has(e.Id))
			.forEach((e) => (e.IsChecked = true));

		this.updateEntities(this.getList());
	}

	/**
	 * Triggers when the checked state of a catalog item changes.
	 * @param changedCatalog
	 * @param newValue
	 */
	public fireFilterChanged(changedCatalog: IMaterialCatalogEntity, newValue: boolean) {
		changedCatalog.IsChecked = newValue;
		this.onFilterChanged.next(changedCatalog);
	}

	/**
	 * React on when the checked state of groups changes.
	 * @param check
	 */
	public onGroupCheckChanged(check: boolean): void {
		const selection = this.getSelectedEntity();
		if (selection) {
			selection.IsChecked = check;

			this.updateEntities(this.getList());
		}
	}

	/**
	 * Check whether the catalog is readonly
	 * @param catalog
	 * @param id
	 */
	public isReadonlyCatalog(catalog?: IMaterialCatalogEntity, id?: number) {
		let isReadonly = true;
		if (!catalog && !id) {
			const selection = this.getSelectedEntity();
			catalog = selection || undefined;
		}
		const usedCatalog = catalog ? catalog : id ? this.getList()?.find((item) => item.Id === id) : undefined;
		if (usedCatalog) {
			const type = this.catalogTypes.find((t) => t.Id === usedCatalog.MaterialCatalogTypeFk);
			isReadonly = !!(usedCatalog.ConHeaderFk && type?.IsFramework);
		}
		return isReadonly;
	}

	/**
	 * Get catalog types
	 */
	public getCatalogTypes() {
		this.materialCatalogTypeLookupService.getList().subscribe((types: IBasicsCustomizeMaterialCatalogTypeEntity[]) => {
			this.catalogTypes = types;
		});
	}
}
