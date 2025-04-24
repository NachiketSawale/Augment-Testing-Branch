/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ConstructionSystemSharedTemplateLookupService, ICosInstanceEntity, ICosTemplateEntity } from '@libs/constructionsystem/shared';
import { CosMainComplete } from '../model/entities/cos-main-complete.class';
import { ISearchPayload, ISearchResult, PlatformHttpService, PlatformModuleNavigationService, ServiceLocator } from '@libs/platform/common';
import { CostGroupCompleteEntity, IBasicMainItem2CostGroup, PinningContextToken } from '@libs/basics/shared';
import { CosInstanceDto } from '../model/cos-instance-dto.class';
import { ConstructionSystemMainCommonLookupService } from './construction-system-main-common-lookup.service';
import { InstanceHeaderProjectInfo } from '../model/entities/Instance-header-project-info.interface';
import { ConstructionSystemMainInitFilterService } from './filter-structure/construction-system-main-init-filter.service';
import { IInstanceFilterRequest } from '../model/entities/filter-request/instance-filter-request.interface';
import { ConstructionSystemMainFilterService } from './filter-structure/construction-system-main-filter.service';
import { ReplaySubject } from 'rxjs';
import { ICosTemplateChangeData } from '../model/entities/cos-template-change-data.interface';
import { IEstimateCompositeEntity } from '@libs/estimate/shared';
import { CosInstanceStatus } from '../model/enums/cos-instance-status.enum';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { ITokenValueFilter } from '../model/entities/filter-request/instance-token-value-filter.interface';
import { ConstructionSystemMainInstanceHeaderParameterDataService } from './construction-system-main-instance-header-parameter-data.service';
import { ConstructionSystemCommonPropertyNameLookupService } from '@libs/constructionsystem/common';

export const CONSTRUCTION_SYSTEM_MAIN_INSTANCE_DATA_TOKEN = new InjectionToken<ConstructionSystemMainInstanceDataService>('constructionSystemMainInstanceDataToken');

interface IsyncCostGroup {
	dtos: ICosInstanceEntity[];
	CostGroupCats?: CostGroupCompleteEntity;
	Header2CostGroups: IBasicMainItem2CostGroup[];
}
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceDataService extends DataServiceFlatRoot<ICosInstanceEntity, CosMainComplete> {
	private readonly constructionSystemMainCommonLookupService = inject(ConstructionSystemMainCommonLookupService);
	private readonly constructionSystemMainInitFilterService = inject(ConstructionSystemMainInitFilterService);
	private readonly constructionSystemMainFilterService = inject(ConstructionSystemMainFilterService);
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);
	private readonly msgDialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private readonly instanceHeaderParameterService = ServiceLocator.injector.get(ConstructionSystemMainInstanceHeaderParameterDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly constructionSystemCommonPropertyNameLookupService = ServiceLocator.injector.get(ConstructionSystemCommonPropertyNameLookupService);
	protected templateChanged$ = new ReplaySubject<ICosTemplateChangeData>(1);
	private selectedProjectInfo?: InstanceHeaderProjectInfo;
	private currentSelectedProjectId?: number;
	private currentSelectedModelId?: number;
	private currentInstanceHeaderId?: number;
	private currentSelectedEstimateHeaderId?: number;
	private currentBoqHeaderId?: number;
	private isDeepCopyAllowed: boolean = true;
	private customFurtherFilter: ITokenValueFilter[] = [];
	private instanceHeaderDto?: unknown;

	public constructor() {
		const options: IDataServiceOptions<ICosInstanceEntity> = {
			apiUrl: 'constructionsystem/main/instance',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<ICosInstanceEntity>>{
				role: ServiceRole.Root,
				itemName: 'Instances',
			},
			entityActions: { createSupported: false, deleteSupported: true },
		};
		super(options);
		this.initContext();
		this.subscriptToTemplateChange();
	}

	///todo waiting for cloudDesktopPinningContextService.getContext() ready
	private initContext() {
		this.instanceHeaderParameterService.setInstanceHeaderId(this.currentInstanceHeaderId);
		this.constructionSystemCommonPropertyNameLookupService.setCurrentModelId(this.currentSelectedModelId);
	}

	public override createUpdateEntity(modified: ICosInstanceEntity | null): CosMainComplete {
		const complete = new CosMainComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Instance = modified;
		}
		return complete;
		///todo InstanceHeaderParameter
		// function onUpdateRequested(d) {
		// 	if (d.InstanceHeaderParameter && d.InstanceHeaderParameter.length !== 0) {
		// 		instanceHeaderParameterService.markEntitiesAsModified(d.InstanceHeaderParameter);
		// 		delete d.InstanceHeaderParameter;
		// 	}
		// }
	}

	public override getModificationsFromUpdate(complete: CosMainComplete): ICosInstanceEntity[] {
		if (complete.Instance) {
			complete.Instances = [complete.Instance];
		}
		return complete.Instances ?? [];
	}

	/**
	 * If not project is pinned, then stop the procedure
	 * @param payload
	 */
	public override filter(payload: ISearchPayload): Promise<ISearchResult<ICosInstanceEntity>> {
		const projectContext = payload.pinningContext.find((e) => e.Token === PinningContextToken.Project);
		const headerContext = payload.pinningContext.find((e) => e.Token === PinningContextToken.Cos);
		const estimateContext = payload.pinningContext.find((e) => e.Token === PinningContextToken.Estimate);
		const modelContext = payload.pinningContext.find((e) => e.Token === PinningContextToken.Model);
		const boqContext = payload.pinningContext.find((e) => e.Token === PinningContextToken.Boq);

		if (!projectContext) {
			this.msgDialogService.showErrorDialog('constructionsystem.main.entryError');
			throw new Error('No project is pinned');
		}

		payload.projectContextId = projectContext.Id;

		// navigation from cos instance header container
		if (headerContext) {
			// we need to clear pKeys which stores instance header ids because backend logic recognize it as instance ids.
			payload.pKeys = undefined;
		}

		this.currentSelectedProjectId = projectContext.Id;
		this.currentInstanceHeaderId = headerContext?.Id;
		this.currentSelectedEstimateHeaderId = estimateContext?.Id;
		this.currentSelectedModelId = modelContext?.Id;
		this.currentBoqHeaderId = boqContext?.Id;

		return super.filter(payload);
	}

	public override provideLoadByFilterPayload(payload: ISearchPayload): object {
		///todo Jump from favorites case
		///if (data.searchFilter && data.searchFilter.furtherFilters && angular.isArray(data.searchFilter.furtherFilters) && data.searchFilter.furtherFilters.length === 1 && data.searchFilter.furtherFilters[0].Token === 'COS_INS_HEADER') {
		const filterRequest: IInstanceFilterRequest = {};
		filterRequest.StructuresFilters = this.constructionSystemMainFilterService.getFilters();
		filterRequest.CustomFurtherFilter = this.customFurtherFilter;
		return { ...filterRequest, ...payload };
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<ICosInstanceEntity> {
		//	InstanceHeaderProjectInfoDto
		const dto = new CosInstanceDto(loaded);
		if (dto.SystemOptions) {
			this.constructionSystemMainCommonLookupService.setSysOpts(dto.SystemOptions);
		}
		const cosTemplates = dto.getValueAs<ICosTemplateEntity[]>('CosTemplate');
		if (cosTemplates && cosTemplates.length > 0) {
			const templateLookupService = ServiceLocator.injector.get(ConstructionSystemSharedTemplateLookupService);
			templateLookupService.cache.setList(cosTemplates);
		}
		if (dto.InstanceHeaderProjectInfoDto) {
			this.setSelectedProjectInfo(dto.InstanceHeaderProjectInfoDto);
			//this.setTitleShowData(dto.InstanceHeaderProjectInfoDto);
			if (dto.IsFavoritesJump) {
				this.setCurrentInstanceHeader(dto.InstanceHeaderProjectInfoDto, true);
			}
			//	platformContextService.setPermissionObjectInfo(readData.InstanceHeaderProjectInfoDto.PermissionObjectInfo || null); //todo
		}
		const fr = dto.FilterResult!;
		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds,
			},
			dtos: dto.dtos!, //dto.dtos!,
		};
	}

	private setSelectedProjectInfo(projectEntity: InstanceHeaderProjectInfo) {
		this.selectedProjectInfo = projectEntity;
	}

	private getSelectedProjectInfo() {
		return this.selectedProjectInfo;
	}

	public getCurrentSelectedProjectId() {
		return this.currentSelectedProjectId;
	}

	public getCurrentBoqHeaderId() {
		return this.currentBoqHeaderId;
	}

	public getCurrentSelectedModelId() {
		return this.currentSelectedModelId;
	}
	public getCurrentInstanceHeaderId() {
		return this.currentInstanceHeaderId;
	}
	private setCurrentInstanceHeader(projectHeaderInfo: InstanceHeaderProjectInfo, isFavoritesJump: boolean) {
		this.currentSelectedProjectId = projectHeaderInfo.ProjectId || projectHeaderInfo.ProjectFK;
		this.currentSelectedModelId = projectHeaderInfo.ModelId || projectHeaderInfo.ModelFk;
		this.currentInstanceHeaderId = projectHeaderInfo.Id || projectHeaderInfo.HeaderId;
		this.currentSelectedEstimateHeaderId = projectHeaderInfo.EstimateHeaderId || projectHeaderInfo.EstimateHeaderFk;
		this.currentBoqHeaderId = projectHeaderInfo.BoqHeaderId || projectHeaderInfo.BoqHeaderFk;
		this.updateHeaderId();
		if (isFavoritesJump) {
			//	setPinningContext(instanceHeaderInfo, dataService); //todo waiting for piningContext
		} else if (this.currentInstanceHeaderId) {
			this.setCurrentPinningContext(this.currentInstanceHeaderId, true).then();
		}
	}

	private updateHeaderId() {
		this.constructionSystemMainInitFilterService.setEstHeaderId(this.currentSelectedEstimateHeaderId, this.currentSelectedProjectId);
		//setLeadingStructuresFilters(currentSelectedProjectId, currentBoqHeaderId); //todo structure is not ready
		//instanceHeaderParameterService.setInstanceHeaderId(currentInstanceHeaderId); //todo waiting for instanceHeaderParameterService
		this.constructionSystemCommonPropertyNameLookupService.setCurrentModelId(this.currentSelectedModelId);
	}

	private async setCurrentPinningContext(instanceHeaderId: number, isSetCurrentContextData: boolean) {
		const instanceHeaderInfo = await this.getInstanceHeaderInfo(instanceHeaderId);
		if (isSetCurrentContextData) {
			this.currentSelectedProjectId = instanceHeaderInfo.ProjectId;
			this.currentSelectedModelId = instanceHeaderInfo.ModelId;
			this.currentInstanceHeaderId = instanceHeaderInfo.HeaderId;
			this.currentSelectedEstimateHeaderId = instanceHeaderInfo.EstimateHeaderId;
			this.currentBoqHeaderId = instanceHeaderInfo.BoqHeaderId;
			this.updateHeaderId();
		}
		// setPinningContext(instanceHeaderInfo, dataService);
		// cloudDesktopSidebarService.filterStartSearch(true);
	}

	/**
	 * request instance header info
	 * @param instanceHeaderId
	 * @private
	 */
	private async getInstanceHeaderInfo(instanceHeaderId: number) {
		return await this.http.get<InstanceHeaderProjectInfo>('constructionsystem/project/instanceheader/getprojectinfo', {
			params: {
				instanceHeaderId: instanceHeaderId,
			},
		});
	}

	public createDeepCopy() {
		if (this.isDeepCopyAllowed && this.getSelectedEntity()) {
			this.isDeepCopyAllowed = false;
			this.http.post$<CosMainComplete>('constructionsystem/main/instance/execute', this.getSelectedEntity()).subscribe((item) => {
				if (item && item.Instance) {
					this.syncCostGroups([item.Instance], [item]);
					this.append([item.Instance]);
					this.goToLast();
				}
				this.isDeepCopyAllowed = true;
			});
		}
	}

	/**
	 * sync cost groups data
	 * @param dtos
	 * @param completeDatas
	 */
	public syncCostGroups(dtos: ICosInstanceEntity[], completeDatas: CosMainComplete[]) {
		const syncCostGroupData: IsyncCostGroup = {
			dtos: dtos,
			Header2CostGroups: completeDatas.flatMap((item) => item.CostGroupToSave || []),
		};

		this.assignCostGroups(syncCostGroupData);
	}

	private assignCostGroups(syncCostGroupData: IsyncCostGroup) {
		// basicsCostGroupAssignmentService.process(readData, service, { ///todo
		// 	mainDataName: 'dtos',
		// 	attachDataName: 'Header2CostGroups',
		// 	dataLookupType: 'Header2CostGroups',
		// 	identityGetter: function (entity) {
		// 		return {
		// 			InstanceHeaderFk: entity.RootItemId,
		// 			Id: entity.MainItemId
		// 		};
		// 	}
	}
	public extendCustomFurtherFilters(token: string, value: string) {
		if (this.customFurtherFilter.length > 0) {
			const found = this.customFurtherFilter.find((item) => item.Token === token);
			if (found) {
				found.Value = value;
				return;
			}
		}
		this.customFurtherFilter.push({
			Token: token,
			Value: value,
		});
	}

	public getCustomFurtherFilters() {
		return this.customFurtherFilter;
	}

	/**
	 * TODO get instance header dto
	 * waiting for construction-system.project
	 */
	public async getInstanceHeaderDto() {
		if (this.instanceHeaderDto) {
			return this.instanceHeaderDto;
		}
		const selectedInstanceDto = this.getSelectedEntity();
		if (!selectedInstanceDto) {
			return null;
		}
		this.instanceHeaderDto = await this.http.get('constructionsystem/project/instanceheader/getInstanceHeaderById', {
			params: {
				cosInsHeaderId: selectedInstanceDto.InstanceHeaderFk,
			},
		});

		return this.instanceHeaderDto;
	}

	public get templateChange() {
		return this.templateChanged$;
	}

	/**
	 * TODO Waiting fro constructionSystemMasterTemplateCombobox lookup and constructionSystemMainHeaderService service
	 * @private
	 */
	private subscriptToTemplateChange() {
		this.templateChange.subscribe((templateChangeData) => {
			// var isSelectStatementChanged = false;
			// var template = _.find(basicsLookupdataLookupDescriptorService.getData('CosTemplate'), {Id: args.templateId});
			// if(template){
			// 	args.entity.SelectStatement = template.SelectStatement;
			// 	isSelectStatementChanged = true;
			// }
			// else{
			// 	var cosMaster = _.find(constructionSystemMainHeaderService.getAllData(), {'Id': args.entity.HeaderFk});
			// 	if(cosMaster){
			// 		args.entity.SelectStatement = cosMaster.SelectStatement;
			// 		isSelectStatementChanged = true;
			// 	}
			// }
			//
			// if(isSelectStatementChanged){
			// 	service.markItemAsModified(args.entity);
			// 	service.fireSelectStatementChanged(null, args.entity);
			// }
		});
	}

	public async gotToEstimate() {
		if (!this.currentInstanceHeaderId) {
			return;
		}
		const instanceHeaderInfo = await this.getInstanceHeaderInfo(this.currentInstanceHeaderId);
		if (!instanceHeaderInfo.EstimateHeaderId) {
			console.error('estimateHeaderId NOT Exist! Therefore, [Go To Estimate] failed to work!!');
			return;
		}
		const items = await this.http.post<IEstimateCompositeEntity[]>('estimate/project/list', { projectFk: instanceHeaderInfo.ProjectId });
		const filteredItems = items.filter((item) => item.EstHeader.Id === instanceHeaderInfo.EstimateHeaderId);
		if (!filteredItems) {
			console.error('Filtered item not found! Therefore, [Go To Estimate] failed to work!!');
			return;
		}
		// $injector.get('estimateProjectRateBookConfigDataService').setClearDataFlag(false);
		// $injector.get('constructionSystemProjectInstanceHeaderService').setFilterByCurrentInstance(true); todo
		//filteredItems[0].projectInfo.ProjectNo = instanceHeaderInfo.ProjectNo; /// todo Is it necessary??
		//filteredItems[0].projectInfo.ProjectName = instanceHeaderInfo.ProjectName;
		///todo navigation seems not working
		await this.platformModuleNavigationService.navigate({
			internalModuleName: 'estimate.main',
			entityIdentifications: [{ id: filteredItems[0].Id }],
		});
	}

	public override takeOverUpdatedChildEntities(updated: CosMainComplete) {
		super.takeOverUpdatedChildEntities(updated);
		/// todo ModelValidateError
		if (updated.EstLineItemsToSave) {
			//$injector.get('constructionsystemMainLineItemService').gridRefresh();
		}
	}

	/**
	 * update status to modified
	 */
	public updateStatusToModified() {
		const selectedInstance = this.getSelectedEntity();
		if (selectedInstance) {
			const ignoreStatusIds = [CosInstanceStatus.New, CosInstanceStatus.Calculating, CosInstanceStatus.Calculated];
			if (selectedInstance.Id && ignoreStatusIds.indexOf(selectedInstance.Status) === -1) {
				selectedInstance.Status = CosInstanceStatus.Modified;
				this.entitiesUpdated(selectedInstance);
			}
		}
	}

	public updateIsUserModified(isModified: boolean) {
		const selectedInstance = this.getSelectedEntity();
		if (selectedInstance && selectedInstance.Id) {
			selectedInstance.IsUserModified = isModified;
			selectedInstance.Status = CosInstanceStatus.Modified; /// original is 26, but seems 26 is duplicated with 25
		}
	}

	public override async delete(entities: ICosInstanceEntity[] | ICosInstanceEntity) {
		const deleteEntities: ICosInstanceEntity[] = !Array.isArray(entities) ? [entities] : entities;
		type DeleteResponse = {
			Result: boolean;
			ValidationErrors: string[];
		};
		const deleteResponse = await this.http.post<DeleteResponse>('constructionsystem/main/instance/delete', deleteEntities);
		if (deleteResponse.Result) {
			const newList = this.getList().filter((item) => !deleteEntities.includes(item));
			this.setList(newList); /// todo this should use remove function, but it is not ready now
			return;
		}
		if (deleteResponse.ValidationErrors && deleteResponse.ValidationErrors.length > 0) {
			const modalOption = {
				headerText: 'constructionsystem.main.deleteInstanceWithLineItemDialog.title',
				bodyText: deleteResponse.ValidationErrors.join('\n'),
				defaultButtonId: StandardDialogButtonId.Yes,
			};
			const result = await this.msgDialogService.showYesNoDialog(modalOption);
			if (result?.closingButtonId === StandardDialogButtonId.Yes) {
				this.http.post<boolean>('constructionsystem/main/instance/deleteInstanceWithLineItem', deleteEntities);
			}
		}
	}

	/**
	 * convert selected entity to Identification
	 * @param selected
	 */
	public convertSelectedToIdentification(selected: ICosInstanceEntity) {
		return this.converter.convert(selected);
	}
}

///todo sidebarSearchOptions
///todo showProjectHeader
/// todo setPinningContext
/// todo dynamic column
/// todo syncModelViewWithCheckedInstances
/// todo sync3DViewerIfSelectedIsChecked
/// todo handleUpdateDone ModelValidateError
/// todo updateModuleHeaderInfo

/// delete
/// addSortCodeChangeInfo is useless
