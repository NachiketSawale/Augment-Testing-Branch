/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions, EntityArrayProcessor } from '@libs/platform/data-access';
import { ProjectMainDataService } from '@libs/project/shared';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ProjectCostCodesDataService } from './project-cost-codes-data.service';
import { HttpClient } from '@angular/common/http';
import { get } from 'lodash';
import { IPrjCostCodesEntity, IProjectCostCodesComplete, IProjectCostCodesJobRateEntity } from '@libs/project/interfaces';
import { EntityReadonlyProcessorBase } from '@libs/basics/shared';
import { ProjectCostcodesJobRateDynamicUserDefinedColumnService } from './project-costcodes-job-rate-dynamic-user-defined-column.service';
import * as _ from 'lodash';
import { ProjectCostCodesDynamicUserDefinedColumnService } from './project-costcodes-dynamic-user-defined-column.service';
import { map, of } from 'rxjs';

export const PROJECT_COST_CODES_JOB_RATE_DATA_TOKEN = new InjectionToken<ProjectCostCodesJobRateDataService>('projectCostCodesJobRateDataToken');

export interface IProjectCostCodeApiResponse {
	data: IProjectCostCodesJobRateEntity[];
}

@Injectable({
	providedIn: 'root',
})
/**
 * ProjectCostCodes Data service
 */
export class ProjectCostCodesJobRateDataService extends DataServiceFlatLeaf<IProjectCostCodesJobRateEntity, IPrjCostCodesEntity, IProjectCostCodesComplete> {
	private projectMainDataService = inject(ProjectMainDataService);
	private projectCostCodesDataService = inject(ProjectCostCodesDataService);
	private jobRateDynUserDefinedServ = inject(ProjectCostcodesJobRateDynamicUserDefinedColumnService);
	private dynamicUserDefinedColService = inject(ProjectCostCodesDynamicUserDefinedColumnService);

	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);

	private firstJobRateId = null;
	private jobIds = null;
	private showFilterBtn = false;
	private initFilterMenuFlag = true;
	private isManuallyFilter = false;
	private factorFieldsToRecalculate: { [key: string]: string } = {
		FactorCosts: 'RealFactorCosts',
		FactorQuantity: 'RealFactorQuantity',
	};
	public costCodeJobRateCache: IProjectCostCodesJobRateEntity[] = [];
	public costCodeJobRateToSave: IProjectCostCodesJobRateEntity[] = [];

	// private onToolsUpdated = new PlatformMessenger(); TODO Platform Messanger
	// private hightLightNGetJob = new PlatformMessenger(); TODO Platform Messanger

	public constructor(projectCostCodesDataService: ProjectCostCodesDataService) {
		const options: IDataServiceOptions<IProjectCostCodesJobRateEntity> = {
			apiUrl: 'project/costcodes/job/rate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listCostCodeByFitler',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endpoint: 'createbyfilter',
				usePost: true,
				prepareParam: (ident) => {
					const ProjectId = this.projectMainDataService.getSelection()[0];
					const CurrencyId = this.projectCostCodesDataService.getSelection()[0];
					return {
						ProjectId: ProjectId.Id,
						MainItemId: ident.pKey1,
						CurrencyId: CurrencyId.CurrencyFk,
					};
				},
			},

			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			updateInfo: {
				endPoint: 'update',
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectCostCodesJobRateEntity, IPrjCostCodesEntity, IProjectCostCodesComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PrjCostCodesJobRate',
				parent: projectCostCodesDataService,
				filter: 'prjCostCodeId',
			},
			processors: [new EntityArrayProcessor<IProjectCostCodesJobRateEntity>(['ProjectCostCodesJobRate'])],
		};

		super(options);		
	}

	/**
	 *  Handles the event when the creation of a project cost codes job rate entity succeeds.
	 * It simply returns the created entity.
	 */
	protected override onCreateSucceeded(created: IProjectCostCodesJobRateEntity): IProjectCostCodesJobRateEntity {
		const readonlyProcessor = this.processor.getProcessors().find((p) => p instanceof EntityReadonlyProcessorBase);
		if (readonlyProcessor) {
			readonlyProcessor.process(created);
		}

		this.attachMasterCostCode(created);
		this.initFactorValues(created);

		const prjCostCode = this.projectCostCodesDataService.getSelection()[0];
		if (prjCostCode) {
			this.projectCostCodesDataService.getModifiedFor(prjCostCode);
		}

		this.jobRateDynUserDefinedServ.handleCreatedItem(created);

		return created;
	}

	/**
	 * Handles the event when loading of project cost codes job rate entities succeeds.
	 * It extracts and returns the array of entities from the loaded data object.
	 */
	protected override onLoadSucceeded(loaded: object): IProjectCostCodesJobRateEntity[] {
		const readItems = get(loaded, 'dtos') as unknown as IProjectCostCodesJobRateEntity[];

		this.attachMasterCostCode(readItems);

		const selectedProjectItem = this.projectMainDataService.getSelection()[0];

		this.jobRateDynUserDefinedServ.setProjectId(selectedProjectItem ? selectedProjectItem.Id : -1);
		// TODO This function are in basic common factory
		// this.jobRateDynUserDefinedServ.clearValueComplete();
		// this.jobRateDynUserDefinedServ.attachDataToColumn(this.getList()).then(() => {
		// 	this.load();
		// });

		this.loadFilterMenu();
		this.setReadOnly(readItems);
		// this.firstJobRateId = readItems.firstJobRateId;

		this.mergeCostCodeJobs(readItems);

		return readItems;
	}

	/**
	 *  Provides the payload required for loading project cost codes job rate entities.
	 */
	protected override provideLoadPayload() {
		const projectId = this.projectMainDataService.getSelection()[0];
		const PrjCostCodeId = this.projectCostCodesDataService.getSelection()[0];
		return { ProjectId: projectId.Id, PrjCostCodeId: PrjCostCodeId.Id, LgmJobIds: this.jobIds, InitFilterMenuFlag: this.initFilterMenuFlag && !this.isManuallyFilter };
	}

	protected override provideCreatePayload(): object {
		const selectedCostCodeItem = this.projectCostCodesDataService.getSelection()[0];
		const selectedProjectItem = this.projectMainDataService.getSelection()[0];

		const creationData: {
			ParentPrjCostCode: IPrjCostCodesEntity;
			ProjectId: number;
			CurrencyId: number;
			LgmJobIds: number[];
		} = {
			ParentPrjCostCode: selectedCostCodeItem,
			ProjectId: 0,
			CurrencyId: 0,
			LgmJobIds: [],
		};

		creationData.ProjectId = selectedProjectItem ? selectedProjectItem.Id : 0;
		creationData.CurrencyId = selectedCostCodeItem && selectedCostCodeItem.CurrencyFk ? selectedCostCodeItem.CurrencyFk : selectedProjectItem ? selectedProjectItem.CurrencyFk : 0;

		const list = this.getList();
		const filteredJobRates =
			list && list.length && selectedCostCodeItem
				? list.filter((item) => {
						return item.ProjectCostCodeFk === selectedCostCodeItem.Id;
					})
				: [];

		creationData.LgmJobIds = filteredJobRates.map((jobRate) => jobRate.LgmJobFk).filter((jobId): jobId is number => jobId !== null && jobId !== undefined);

		return creationData;
	}

	/**
	 *  Attaches the master cost code to the selected parent item.
	 */
	public attachMasterCostCode(items: IProjectCostCodesJobRateEntity | IProjectCostCodesJobRateEntity[]) {
		const selectedParentItem = this.projectCostCodesDataService.getSelection()[0]; // TODO  Dependancy on cloudCommonGridService
		if (selectedParentItem) {
			//   items.forEach((item) => {
			//    basCostCode = cloudCommonGridService.addPrefixToKeys(selectedParentItem.BasCostCode, 'BasCostCode');
			//   Object.assign(item, basCostCode);
			// });
			//}
			//return items;
		}
	}

	/**
	 * Initializes the factor values for the given project cost codes entity based on the selected parent item.
	 */
	public initFactorValues(item: IProjectCostCodesJobRateEntity) {
		const selectedParentItem = this.projectCostCodesDataService.getSelection()[0];
		if (selectedParentItem) {
			item.NewFactorCosts = selectedParentItem.NewFactorCosts;
			item.NewRealFactorCosts = selectedParentItem.NewRealFactorCosts;
			item.NewFactorQuantity = selectedParentItem.NewFactorQuantity;
			item.NewRealFactorQuantity = selectedParentItem.NewRealFactorQuantity;
		}
	}

	public loadFilterMenu() {
		// TODO
		//	return $injector.get ('projectCommonFilterButtonService').initFilterMenu (service,highlightJobIds);            // TODO  dependancy projectCommonFilterButtonService
	}

	public setReadOnly(jobRateList: IProjectCostCodesJobRateEntity[]) {
		// TODO
		// let versionEstHeaderJobIds = $injector.get ('projectCommonFilterButtonService').getJobFksOfVersionEstHeader ();
		// _.forEach (jobRateList, function (item) {
		// 	let readOnly = versionEstHeaderJobIds.includes (item.LgmJobFk);                                                  // TODO  dependancy projectCommonFilterButtonService
		// 	let fields = [];
		// 	_.forOwn(item, function (value, key) {
		// 		let field = {field: key, readonly: readOnly};
		// 		fields.push(field);
		// 	});
		// 	fields.push({field: 'ColVal1', readonly: item.readOnlyByJob});
		// 	fields.push({field: 'ColVal2', readonly: item.readOnlyByJob});
		// 	fields.push({field: 'ColVal3', readonly: item.readOnlyByJob});
		// 	fields.push({field: 'ColVal4', readonly: item.readOnlyByJob});
		// 	fields.push({field: 'ColVal5', readonly: item.readOnlyByJob});
		// 	platformRuntimeDataService.readonly(item,fields);
		// });
	}

	public calRealFactorOrQuantity(arg: unknown) {
		// TODO
		// let item = arg.item;
		// let column = arg.grid.getColumns()[arg.cell].field;
		// if(!item){
		// 	return $q.when(null);
		// }
		let item!: IProjectCostCodesJobRateEntity;
		const column = '';
		if (item && this.factorFieldsToRecalculate[column]) {
			return this.http.get<IProjectCostCodeApiResponse>(`${this.configService.webApiBaseUrl}project/costcodes/job/rate/getparentcostcodesjobrate?prjCostCodeId=${item.ProjectCostCodeFk}&lgmJobId=${item.LgmJobFk}`).pipe(
				map((response: IProjectCostCodeApiResponse) => {
					const parentJobRateList: IProjectCostCodesJobRateEntity[] = response.data || [];
					if (item.ModifiedJobRate && item.ModifiedJobRate.length > 0) {
						item.ModifiedJobRate.forEach((jobRate: IProjectCostCodesJobRateEntity) => {
							const rate = parentJobRateList.find((i: { Id: number }) => i.Id === jobRate.Id);
							if (rate) {
								this.deepMerge(rate, jobRate);
							}
						});
					}
					this.calTreeFactorsAndQuantity(item, column, parentJobRateList);
					return item;
				}),
			);
		} else {
			return of(null);
		}
	}

	private deepMerge(target: IProjectCostCodesJobRateEntity, source: IProjectCostCodesJobRateEntity): void {
		if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
			return;
		}

		for (const key of Object.keys(source)) {
			if (source[key] instanceof Object && target[key] instanceof Object) {
				this.deepMerge(target[key] as IProjectCostCodesJobRateEntity, source[key] as IProjectCostCodesJobRateEntity);
			} else {
				target[key] = source[key];
			}
		}
	}

	public calTreeFactorsAndQuantity(currentItem: IProjectCostCodesJobRateEntity, column: string, parentJobRateList: IProjectCostCodesJobRateEntity[]) {
		if (!currentItem) {
			return;
		}

		const realFactorColumn = this.factorFieldsToRecalculate[column];

		const currentJobId = currentItem.LgmJobFk ?? 0;

		if (!currentItem['CostCodeParentFk']) {
			if (currentItem[realFactorColumn] !== currentItem[column]) {
				currentItem[realFactorColumn] = currentItem[column];
			}
		} else {
			const parentItemJobRate = parentJobRateList && parentJobRateList.length ? parentJobRateList.find((i) => i.ProjectCostCodeFk === currentItem['CostCodeParentFk'] && i.LgmJobFk === currentJobId) : null;
			const parentValue = parentItemJobRate?.[realFactorColumn];
			const itemValue = currentItem?.[column];

			if (parentItemJobRate) {
				if (typeof parentValue === 'number' && typeof itemValue === 'number') {
					const newFactor = parentValue * itemValue;
					if (currentItem[realFactorColumn] !== newFactor) {
						currentItem[realFactorColumn] = newFactor;
					}
				}
			}
		}
		this.calChildrenFactorAndQuantity(parentJobRateList, currentItem, currentJobId, realFactorColumn, column);
		currentItem.ModifiedJobRate = parentJobRateList.filter((i) => i['hasModified'] === true);
	}

	public calChildrenFactorAndQuantity(parentJobRateList: IProjectCostCodesJobRateEntity[], currentItem: IProjectCostCodesJobRateEntity, currentJobId: number, realFactorColumn: string, column: string) {
		const childrenJobRate = parentJobRateList && parentJobRateList.length ? parentJobRateList.filter((i) => i.ParentPrjCostCodeId === currentItem.ProjectCostCodeFk && i.LgmJobFk === currentJobId) : null;
		childrenJobRate &&
			childrenJobRate.length > 0 &&
			childrenJobRate.forEach((jobRate) => {
				const realFactorColumnVar = currentItem?.[realFactorColumn] ?? 0;
				const jobRateVar = jobRate?.[column] ?? 0;
				if (typeof realFactorColumnVar === 'number' && typeof jobRateVar === 'number') {
					jobRate[realFactorColumn] = realFactorColumnVar * jobRateVar;
				}
				jobRate['hasModified'] = true;
				this.calChildrenFactorAndQuantity(parentJobRateList, jobRate, currentJobId, realFactorColumn, column);
			});
	}

	public calcRealFactors(item: IProjectCostCodesJobRateEntity) {
		if (!item) {
			return;
		}

		this.calculateHierarchy(item);
		// TODO this.projectMainDataService.updateAndExecute(this.calculateHierarchy(item));
	}

	public calculateHierarchy(item: IProjectCostCodesJobRateEntity) {
		// let column = arg.grid.getColumns()[arg.cell].field;    // TODO  column is not getting
		const column = '';
		if (item && this.factorFieldsToRecalculate[column]) {
			return this.http.get<IProjectCostCodeApiResponse>(this.configService.webApiBaseUrl + 'project/costcodes/job/rate/getparentcostcodesjobrate?prjCostCodeId=' + item['ProjectCostCodeFk'] + '&lgmJobId=' + item.LgmJobFk)
			.pipe(
				map((response) => {
					const updatedItems: IProjectCostCodesJobRateEntity[] = [];
					const parentJobRateList = response.data;
					this.calculateHierarchyFactors(item, column, null, updatedItems, parentJobRateList);
					if (updatedItems && updatedItems.length) {
						return this.http.post(this.configService.webApiBaseUrl + 'project/costcodes/job/rate/savejobrates', updatedItems).subscribe((response) => {
							// TODO platformDataServiceModificationTrackingExtension
							// let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
							// modTrackServ.clearModificationsInLeaf(service, container.data, response.data);
							this.getList();
							// container.data.listLoaded.fire();
						});
					} else {
						return of([]);
					}
				}),
			);
		} else {
			return null;
		}
	}

	public isRecalculate(column: string) {
		return this.factorFieldsToRecalculate[column];
	}

	public calcRealFactorsNew(item: IProjectCostCodesJobRateEntity, value: string | number, column: string) {
		const result = this.getCostCodeJobRateData(item);
		if (result) {
			// result[column] = value;
			// const updatedItems: IProjectCostCodesJobRateEntity[] = [];
			// this.calculateHierarchyFactors(result, column, null, updatedItems, this.costCodeJobRateCache);
			// this.mergeCostCodeJobsSets(this.costCodeJobRateToSave, updatedItems, true);
			// this.sysncPrjCostCode(column, result, updatedItems);
			// this.mergeCostCodeJob(item, result, false);
			// this.Refresh();
			// this.projectCostCodesDataService.load(result);
			return of(this.costCodeJobRateToSave);
		} else {
			return of([]);
		}
	}

	public mergeCostCodeJobs(source: IProjectCostCodesJobRateEntity[]) {
		if (this.costCodeJobRateToSave.length > 0) {
			this.costCodeJobRateToSave.forEach((tItem) => {
				const sItem = this.findJobRate(source, tItem);
				this.mergeCostCodeJob(sItem, tItem, true);
			});
		}
	}

	public calculateHierarchyFactors(selectedItem: IProjectCostCodesJobRateEntity | null, column: string, parentItem: IPrjCostCodesEntity | null, updatedItems: IProjectCostCodesJobRateEntity[], parentJobRateList: IProjectCostCodesJobRateEntity[]) {
		if (!selectedItem) {
			return;
		}
		const realFactorColumn = this.factorFieldsToRecalculate[column];
		const item = parentJobRateList.find((i) => i.Id === selectedItem.Id); // container.service.getItemById(selectedItem.Id);

		if (!item) {
			return;
		}
		//let prjCostCode = this.projectCostCodesDataService.getItemById(item.ProjectCostCodeFk); // TODO getItemById is not yet available
		let prjCostCode!: IPrjCostCodesEntity;

		if (!prjCostCode) {
			return;
		}
		const currentJobId = item.LgmJobFk;

		if (!prjCostCode.CostCodeParentFk) {
			if (item[realFactorColumn] !== item[column]) {
				item[realFactorColumn] = item[column];
				updatedItems.push(item);
			}
		} else {
			if (!parentItem) {
				// parentItem = this.projectCostCodesDataService.getItemById(prjCostCode.CostCodeParentFk);// TODO getItemById is not yet available
			}

			const parentItemJobRate =
				parentJobRateList && parentJobRateList.length
					? _.find(parentJobRateList, {
							ProjectCostCodeFk: parentItem?.Id,
							LgmJobFk: currentJobId,
						})
					: null;

			if (parentItem && parentItemJobRate) {
				const realFactorValue = parentItemJobRate[realFactorColumn] ?? 0;
				const columnValue = item[column] ?? 0;
				if (typeof realFactorValue === 'number' && typeof columnValue === 'number') {
					const newFactor = realFactorValue * columnValue;
					if (item[realFactorColumn] !== newFactor) {
						item[realFactorColumn] = newFactor;
						updatedItems.push(item);
					}
				}
			}
		}

		if (Array.isArray(prjCostCode.ProjectCostCodes) && prjCostCode.ProjectCostCodes.length > 0) {
			prjCostCode.ProjectCostCodes.forEach((cc) => {
				const jobRate = parentJobRateList && parentJobRateList.length ? parentJobRateList.find((j) => j.ProjectCostCodeFk === cc.Id && j.LgmJobFk === currentJobId) : null;
				if (typeof jobRate !== 'undefined') {
					this.calculateHierarchyFactors(jobRate, column, prjCostCode, updatedItems, parentJobRateList);
				}
			});
		}
	}

	public getCostCodeJobRateData(item: IProjectCostCodesJobRateEntity) {
		const resultItem = this.findJobRate(this.costCodeJobRateCache, item);
		if (resultItem) {
			return of(resultItem);
		} else {
			return this.getCostCodeJobRateAsync(item);
		}
	}

	public getCostCodeJobRateAsync(item: IProjectCostCodesJobRateEntity) {
		return this.http.get<IProjectCostCodeApiResponse>(this.configService.webApiBaseUrl + 'project/costcodes/job/rate/getparentcostcodesjobrate?prjCostCodeId=' + item.ProjectCostCodeFk + '&lgmJobId=' + item.LgmJobFk).subscribe((response) => {
			const parentJobRateList = response.data;
			this.mergeCostCodeJobsSets(this.costCodeJobRateCache, parentJobRateList, false);
			if (!item.Version) {
				if (!this.findJobRate(this.costCodeJobRateCache, item)) {
					this.costCodeJobRateCache.push(item);
				}
				return of(item);
			}
			return this.findJobRate(this.costCodeJobRateCache, item);
		});
	}

	public sysncPrjCostCode(field: string, item: IProjectCostCodesJobRateEntity, updatedItems: IProjectCostCodesJobRateEntity[]) {
		const isFirstJobRate = !this.firstJobRateId || (this.firstJobRateId && item.Id === this.firstJobRateId);
		if (isFirstJobRate) {
			const list = this.getList();
			const prjCostCode = this.projectCostCodesDataService.getSelection();
			if (prjCostCode) {
				const firstJobRate = this.firstJobRateId ? list.find((i) => i.Id === this.firstJobRateId) : _.head(_.sortBy(list, ['Id']));
				const value = firstJobRate ?? firstJobRate?.[field];

				if (field.indexOf('ColVal') !== -1) {
					prjCostCode.forEach((prjCostcode: IPrjCostCodesEntity) => {
						if (prjCostcode) {
							// TODO - Can not copy readonly properties Error
							//prjCostcode[field as keyof IPrjCostCodesEntity] = value;
						}
					});

					// this.dynamicUserDefinedColService.fieldChange(prjCostCode, field, value); // TODO fieldChange is in common factory
					this.projectCostCodesDataService.setModified(prjCostCode);
				} else {
					if (field === 'SalesPrice') {
						prjCostCode.forEach((prjCostcode: IPrjCostCodesEntity) => {
							if (prjCostcode && typeof value === 'number') {
								prjCostcode.DayWorkRate = value;
							}
						});
						this.projectCostCodesDataService.setModified(prjCostCode);
					} else if (updatedItems && this.factorFieldsToRecalculate[field]) {
						// const prjCostCodeList:IPrjCostCodesEntity[] = [];
						// TODO cloudCommonGridService
						// cloudCommonGridService.flatten([prjCostCode], prjCostCodeList, 'ProjectCostCodes');
						// _.forEach(prjCostCodeList, function (costCodeItem) {
						// 	let pItem = _.find(updatedItems, {'ProjectCostCodeFk': costCodeItem.Id});
						// 	if (pItem) {
						// 		costCodeItem[factorFieldsToRecalculate[field]] = pItem[factorFieldsToRecalculate[field]];
						// 		projectCostCodesMainService.markItemAsModified(costCodeItem);
						// 	}
						// });
					} else {
						prjCostCode.forEach((prjCostcode: IPrjCostCodesEntity) => {
							if (prjCostcode) {
								// prjCostCode[field] = value;
							}
						});
						this.projectCostCodesDataService.setModified(prjCostCode);
					}
				}
			}
		}
	}

	public mergeCostCodeJobsSets(sourceList: IProjectCostCodesJobRateEntity[], targetList: IProjectCostCodesJobRateEntity[], isMergePro: boolean) {
		if (sourceList && targetList) {
			if (Array.isArray(targetList) && targetList.length > 0) {
				targetList.forEach((tItem) => {
					const sItem = this.findJobRate(sourceList, tItem);
					if (!sItem) {
						sourceList.push(tItem);
					} else if (isMergePro) {
						this.mergeCostCodeJob(sItem, tItem, false);
					}
				});
			}
		}
	}

	public findJobRate(costCodeJobRates: IProjectCostCodesJobRateEntity[], item: IProjectCostCodesJobRateEntity) {
		if (costCodeJobRates && Array.isArray(costCodeJobRates)) {
			return costCodeJobRates.find((i) => i.ProjectCostCodeFk === item.ProjectCostCodeFk && i.LgmJobFk === item.LgmJobFk);
		}
		return null;
	}

	public mergeCostCodeJob(source: IProjectCostCodesJobRateEntity | undefined | null, target: IProjectCostCodesJobRateEntity, isMergeFactorPro: boolean) {
		if (source && target) {
			Object.keys(this.factorFieldsToRecalculate).forEach((key) => {
				source[this.factorFieldsToRecalculate[key]] = target[this.factorFieldsToRecalculate[key]];
				if (isMergeFactorPro) {
					source[key] = target[key];
				}
			});
		}
	}

	public setSelectedJobsIds(ids: IPrjCostCodesEntity[]) {
		ids.filter((d) => {
			return d;
		});
	}

	public setIsManuallyFilter(value: boolean) {
		this.isManuallyFilter = value;
	}

	public setInitFilterMenuFlag(value: boolean) {
		this.initFilterMenuFlag = value;
	}

	public getInitFilterMenuFlag() {
		return this.initFilterMenuFlag;
	}

	public setShowFilterBtn(value: boolean) {
		this.showFilterBtn = value;
	}
	public getShowFilterBtn() {
		return this.showFilterBtn;
	}

	public clear() {
		this.jobIds = null;
		this.showFilterBtn = false;
	}

	public clearCostCodeJobRateCacheData() {
		this.costCodeJobRateCache = [];
		this.costCodeJobRateToSave = [];
	}
}
