/*
 * Copyright(c) RIB Software GmbH
 */
import { get } from 'lodash';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';

import { ISearchResult, PlatformConfigurationService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IYesNoDialogOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsSharedMaterialCatalogTypeLookupService, IMaterialCatalogEntity, IFilterResponse, MainDataDto } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MaterialCatalogComplete } from '../model/material-catalog-complete.class';
import { BasicsMaterialCatalogReadonlyProcessor } from './basics-material-catalog-readonly-processor.class';
import { BasicsMaterialCatalogCreateDialogService } from './basics-material-catalog-create-dialog.service';

export const BASICS_MATERIAL_CATALOG_DATA_TOKEN = new InjectionToken<BasicsMaterialCatalogDataService>('basicsMaterialCatalogDataToken');

/**
 * Material catalog entity data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCatalogDataService extends DataServiceFlatRoot<IMaterialCatalogEntity, MaterialCatalogComplete> {
	private readonly materialCatalogTypeService = inject(BasicsSharedMaterialCatalogTypeLookupService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);

	public readonly readonlyProcessor = new BasicsMaterialCatalogReadonlyProcessor(this);

	public constructor() {
		const options: IDataServiceOptions<IMaterialCatalogEntity> = {
			apiUrl: 'basics/materialcatalog/catalog',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'searchlist',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<IMaterialCatalogEntity>>{
				role: ServiceRole.Root,
				itemName: 'MaterialCatalog',
			},
			entityActions: {
				createDynamicDialogSupported: true,
			},
		};

		super(options);

		this.processor.addProcessor(this.readonlyProcessor);
	}

	/**
	 * Provide the load payload here
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		return {};
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IMaterialCatalogEntity> {
		const dto = new MainDataDto<IMaterialCatalogEntity>(loaded);
		const fr = dto.getValueAs<IFilterResponse>('FilterResult')!;

		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: dto.Main,
		};
	}

	public override createUpdateEntity(modified: IMaterialCatalogEntity | null): MaterialCatalogComplete {
		return new MaterialCatalogComplete(modified);
	}

	public override getModificationsFromUpdate(complete: MaterialCatalogComplete): IMaterialCatalogEntity[] {
		if (complete) {
			if (complete.MaterialCatalogs) {
				return complete.MaterialCatalogs;
			}
			if (complete.MaterialCatalog) {
				return [complete.MaterialCatalog];
			}
		}

		return [];
	}

	protected override isCreateByFixDialogSupported(): boolean {
		return true;
	}

	protected override async createByFixDialog(): Promise<IMaterialCatalogEntity> {
		const entity: Partial<IMaterialCatalogEntity> = {};
		const defaultType = await firstValueFrom(this.materialCatalogTypeService.getDefault());

		if (defaultType?.IsFramework) {
			entity.MaterialCatalogTypeFk = defaultType.Id;
			return ServiceLocator.injector.get(BasicsMaterialCatalogCreateDialogService).showCreateDialog(entity) as unknown as IMaterialCatalogEntity;
		}

		return entity as IMaterialCatalogEntity;
	}

	protected override provideCreatePayload(): object {
		return {};
	}

	protected override onCreateSucceeded(created: object): IMaterialCatalogEntity {
		return created as IMaterialCatalogEntity;
	}

	public async deepCopy() {
		const currentSelect = this.getSelectedEntity();

		if (!currentSelect) {
			throw new Error('this method should be called when there is material catalog selected');
		}

		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.Yes,
			id: 'enableDisable',
			dontShowAgain: true,
			showCancelButton: true,
			//to-tester:
			// @module: material catalog
			// @container-wizard: material catalog list (deep copy button)
			// add a cancel button in the dialog to provide the possibility for user to cancel the deep copy action.
			headerText: this.translateService.instant('basics.materialcatalog.Wizard.DeepCopyTitle').text,
			bodyText: this.translateService.instant('basics.materialcatalog.deepCopyMessage').text,
		};

		const result = await this.dialogService.showYesNoDialog(options);

		if (result?.closingButtonId !== StandardDialogButtonId.Cancel) {
			const apiUrl = result?.closingButtonId === StandardDialogButtonId.Yes ? 'deepcopyinside' : 'deepcopy';
			const resp = await firstValueFrom(this.http.post(`${this.configService.webApiBaseUrl}basics/materialcatalog/catalog/` + apiUrl, currentSelect));

			if (resp) {
				const deepCopiedEntity = get(resp, 'MaterialCatalog')! as IMaterialCatalogEntity;

				//TODO: need to double in the future, the code below not work in current framework.
				this.append(deepCopiedEntity);
				this.setModified([deepCopiedEntity]);
				deepCopiedEntity.isJustDeepCopied = true;
				await this.select(deepCopiedEntity);
				deepCopiedEntity.isJustDeepCopied = false;
			}
		}
	}

	public override async save(): Promise<void> {
		await super.save();
		this.getList().forEach((e) => this.readonlyProcessor.process(e));
	}
}
