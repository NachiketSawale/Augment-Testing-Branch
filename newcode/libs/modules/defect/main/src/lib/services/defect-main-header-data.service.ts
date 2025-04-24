/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntityProcessor, IReadOnlyField, ServiceRole } from '@libs/platform/data-access';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { DefectMainComplete } from '../model/defect-main-complete.class';
import { IFilterResult, ISearchPayload, ISearchResult, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedDefectStatusLookupService, BasicsSharedNewEntityValidationProcessorFactory, BasicsSharedNumberGenerationService, IFilterResponse, MainDataDto } from '@libs/basics/shared';
import { DefectMainHeaderReadonlyProcessorService } from './processors/defect-main-header-readonly-processor.service';
import { DefectMainHeaderValidationService } from './validations/defect-main-header-validation.service';
import { ReplaySubject } from 'rxjs';
import { ProcurementCommonCascadeDeleteConfirmService, ProcurementOverviewSearchlevel } from '@libs/procurement/common';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';

export const DEFECT_MAIN_HEADER_DATA_TOKEN = new InjectionToken<DefectMainHeaderDataService>('defectMainHeaderDataToken');

@Injectable({
	providedIn: 'root',
})
export class DefectMainHeaderDataService extends DataServiceFlatRoot<IDfmDefectEntity, DefectMainComplete> {
	private readonly defectStatusLookupSvc = inject(BasicsSharedDefectStatusLookupService);
	private readonly http = inject(PlatformHttpService);
	public readonly readonlyProcessor: DefectMainHeaderReadonlyProcessorService;
	private readonly translateService = inject(PlatformTranslateService);
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);
	public readonly rootDataCreated$ = new ReplaySubject<IDfmDefectEntity>(1);
	private readonly cascadeDeleteHelperService = inject(ProcurementCommonCascadeDeleteConfirmService);
	private readonly msgDialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);

	public constructor() {
		const options: IDataServiceOptions<IDfmDefectEntity> = {
			apiUrl: 'defect/main/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletedefects',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IDfmDefectEntity>>{
				role: ServiceRole.Root,
				itemName: 'DfmDefect',
			},
		};

		super(options);
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([this.readonlyProcessor, this.modelProcessor(), this.provideNewEntityValidationProcessor()]);
		this.init();
	}

	private createReadonlyProcessor() {
		return new DefectMainHeaderReadonlyProcessorService(this);
	}

	private provideNewEntityValidationProcessor() {
		const newEntityValidationProcessorFactory = inject(BasicsSharedNewEntityValidationProcessorFactory);
		return newEntityValidationProcessorFactory.createProcessor(DefectMainHeaderValidationService, {
			moduleSubModule: 'Defect.Main',
			typeName: 'DfmDefectDto',
		});
	}

	private modelProcessor() {
		return {
			process: (item: IDfmDefectEntity) => {
				this.setEntityReadOnlyFields(item, [
					{
						field: 'ModelFk',
						readOnly: !!item.MdlModelFk,
					},
				]);
			},
			revertProcess() {},
		};
	}

	private init() {
		this.selectionChanged$.subscribe(() => {
			this.onSelectionChanged();
		});
	}

	private onSelectionChanged() {
		const currentItem = this.getSelectedEntity();
		if (currentItem) {
			this.updateBlobContent(currentItem);
			this.setEntityReadOnly(currentItem, this.getReadonlyStatus());
		}
	}

	private async updateBlobContent(entity: IDfmDefectEntity) {
		if (!entity.BlobContent) {
			const basBlobsDetailFk = entity.BasBlobsDetailFk;
			if (basBlobsDetailFk) {
				const result = await this.http.get<string>('defect/main/header/getblob', {
					params: {
						blobId: basBlobsDetailFk,
					},
				});
				entity.BlobContent = result;
			} else {
				entity.BlobContent = null;
			}
		}
	}
	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IDfmDefectEntity> {
		/// todo basicsCostGroupAssignmentService is not ready
		// $injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
		// 	basicsCostGroupAssignmentService.process(response, service, {
		// 		mainDataName: 'dtos',
		// 		attachDataName: 'Defect2CostGroups', // name of MainItem2CostGroup
		// 		dataLookupType: 'Defect2CostGroups',// name of MainItem2CostGroup
		// 		identityGetter: function identityGetter(entity) {
		// 			return {
		// 				Id: entity.MainItemId
		// 			};
		// 		}
		// 	});
		// }]);
		const dto = new MainDataDto<IDfmDefectEntity>(loaded);
		const fr = dto.getValueAs<IFilterResponse>('FilterResult')!;
		this.goToFirst();
		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: dto.getValueAs<IDfmDefectEntity[]>('dtos')!,
		};
	}

	public override createUpdateEntity(modified: IDfmDefectEntity | null): DefectMainComplete {
		return new DefectMainComplete(modified);
	}

	public override getModificationsFromUpdate(complete: DefectMainComplete): IDfmDefectEntity[] {
		if (complete) {
			if (complete.DfmDefect) {
				return complete.DfmDefect;
			}
		}

		return [];
	}

	public getReadonlyStatus() {
		const selectedDfm = this.getSelectedEntity();
		if (selectedDfm) {
			const dfmStatus = this.defectStatusLookupSvc.cache.getItem({ id: selectedDfm.DfmStatusFk });
			if (dfmStatus) {
				return dfmStatus.IsReadOnly;
			}
		}

		return true;
	}

	public createDeepCopy() {
		const itemSelected = this.getSelectedEntity();
		if (itemSelected) {
			this.http.post('defect/main/header/deepcopy', itemSelected).then((response) => {
				const copiedData = response as IDfmDefectEntity;
				if (copiedData) {
					this.append(copiedData);
					this.refreshAll().then();
				}
			});
		}
	}

	/**
	 * Todo waiting for sideBarSearch function completed
	 * @param payload
	 */
	public override executeSidebarSearch(payload: ISearchPayload): Promise<IFilterResult> {
		// var sidebarSearchOptions = {
		// moduleName: moduleName,  // required for filter initialization
		// 	enhancedSearchEnabled: true,
		// 	pattern: '',
		// 	pageSize: 100,
		// 	useCurrentClient: null,
		// 	includeNonActiveItems: null,
		// 	showOptions: true,
		// 	showProjectContext: false, // TODO: rei remove it
		// 	pinningOptions: {
		// 	isActive: true,
		// 		showPinningContext: [{ token: 'project.main', show: true }, { token: 'model.main', show: true }],
		// 		setContextCallback: setCurrentPinningContext // may own context service
		// },
		// withExecutionHints: false,
		// 	enhancedSearchVersion: '2.0',
		// 	includeDateSearch: true
		// };
		return super.executeSidebarSearch(payload);
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IDfmDefectEntity>): IEntityProcessor<IDfmDefectEntity>[] {
		const allProcessor = super.provideAllProcessor(options);
		//allProcessor.push(this.provideDateProcessor());/// todo seems dateProcessor does not work
		return allProcessor;
	}

	// private provideDateProcessor(): IEntityProcessor<IHsqCheckListEntity> {
	// 	const dateProcessorFactory = ServiceLocator.injector.get(EntityDateProcessorFactory);
	// 	return dateProcessorFactory.createProcessorFromSchemaInfo<IHsqCheckListEntity>({ moduleSubModule: MODULE_INFO_CHECKLIST.ChecklistMainModuleName, typeName: 'HsqCheckListDto' });
	// }

	protected override provideCreatePayload(): object {
		return {};
		// 	// todo waiting for cloudDesktopPinningContextService
		// var pinProjectEntity = _.find(cloudDesktopPinningContextService.getContext(), { token: 'project.main' });
		// var pinModelEntity = _.find(cloudDesktopPinningContextService.getContext(), { token: 'model.main' });
		// if (!_.isNil(pinProjectEntity)) {
		// 	param.ProjectFk = pinProjectEntity.id;
		// }
		// if (!_.isNil(pinModelEntity)) {
		// 	param.ModelFk = pinModelEntity.id;
		// }
	}

	public override onCreateSucceeded(created: IDfmDefectEntity) {
		const validationService = ServiceLocator.injector.get(DefectMainHeaderValidationService);
		const basRubricCategoryFk = created.RubricCategoryFk;
		const readonlyFields: IReadOnlyField<IDfmDefectEntity>[] = [
			{
				field: 'Code',
				readOnly: this.genNumberSvc.hasNumberGenerateConfig(basRubricCategoryFk),
			},
		];
		this.setEntityReadOnlyFields(created, readonlyFields);
		created.Code = this.getCodeForNewEntity(basRubricCategoryFk, created.Code);
		validationService.validateGeneratedCode(created.Code);
		this.rootDataCreated$.next(created);
		return created;
	}

	private getCodeForNewEntity(rubId: number, currentCode: string | null) {
		const defaultCode = this.translateService.instant('cloud.common.isGenerated').text;
		const generatedCode = this.genNumberSvc.provideNumberDefaultText(rubId);
		if (!generatedCode && currentCode && currentCode !== defaultCode) {
			return currentCode;
		}
		return generatedCode;
	}

	public override canDelete(): boolean {
		return super.canDelete() && !this.getReadonlyStatus();
	}

	public override async delete(entities: IDfmDefectEntity[] | IDfmDefectEntity) {
		const selectedItem = this.getSelectedEntity()!;
		await this.cascadeDeleteHelperService ///todo Ul is different.check package module lager
			.openDialog({
				filter: '',
				mainItemId: selectedItem.Id,
				moduleIdentifier: 'defect.main',
				searchLevel: ProcurementOverviewSearchlevel.RootContainer,
			})
			.then((res) => {
				if (res) {
					if (res.closingButtonId === StandardDialogButtonId.Yes) {
						super.delete(entities);
					}
				}
			});
	}

	public override async create() {
		const statusId = await this.http.get<number>('defect/main/header/getstatusbydefaultcategory');
		if (statusId <= 0) {
			this.msgDialogService.showMsgBox('hsqe.checklist.wizard.readOnlyRecord', 'defect.main.NoDefaultStatus', 'warning')?.then();
			return Promise.reject('No Default Status');
		} else {
			return new Promise<IDfmDefectEntity>((resolve) => {
				resolve(super.create());
			});
		}
	}

	protected override provideLoadPayload(): object {
		/// todo: I think there is no need to update CheckListStatus cache data?
		/// todo: waiting for cloudDesktopSidebarService ready
		// var fRequest = cloudDesktopSidebarService.filterRequest;
		// var lookupDataService = $injector.get('basicsLookupdataLookupDataService');
		// lookupDataService.getSearchList('CheckListStatus', 'IsDefect=true').then(
		// 	function (data) {
		// 		if (data.length > 0) {
		// 			basicsLookupdataLookupDescriptorService.updateData('CheckListStatus', data);
		// 		}
		// 	}
		// );
		// if (fRequest && fRequest.pinnedFilter && fRequest.pinnedFilter.moduleName !== moduleName) {
		// 	cloudDesktopSidebarService.filterRequest.pinnedFilter = null;
		// }
		return {};
	}

	/***
	 *
	 * update readOnlyField once editField is updated
	 * @param item
	 * @param readOnlyField
	 * @param value
	 * @param editField
	 */
	public updateReadOnly(item: IDfmDefectEntity, readOnlyField: keyof IDfmDefectEntity, value: number | undefined, editField: keyof IDfmDefectEntity) {
		const readonlyFields: IReadOnlyField<IDfmDefectEntity>[] = [];
		readonlyFields.push({ field: readOnlyField, readOnly: !!value });
		this.setEntityReadOnlyFields(item, readonlyFields);
	}

	public async getCode(rubId: number) {
		return await this.http.get<string>('defect/main/header/getcode?rubricCategoryId=', {
			params: {
				rubricCategoryId: rubId,
			},
		});
	}

	public async getModel(modelId: number) {
		return await this.http.get<string>('model/project/model/getbyid', {
			params: {
				id: modelId,
			},
		});
	}

	public getSelectedProjectId() {
		const defect = this.getSelectedEntity();
		//var project = cloudDesktopPinningContextService.getPinningItem('project.main');//todo waiting for pinning context service
		//const projectId = defect ?defect?.PrjProjectFk : (project ? project?.Id):-1;
		return defect ? defect?.PrjProjectFk : null;
	}

	// todo specialTreatmentService.adjustCreateConfiguration（defectCreationInitialDialogService） not support yet
	// todo： show project header: showProjectHeader -> {getProject: getProject}
	// todo:setCurrentPinningContext
	// todo:all model related function
	// todo:createObjectSet
}
