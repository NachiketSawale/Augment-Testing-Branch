/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatNode, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntityProcessor, ServiceRole } from '@libs/platform/data-access';
import { CompleteIdentification, IIdentificationData, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainInstanceDataService } from './construction-system-main-instance-data.service';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { ConstructionSystemMainJobStatus } from '../model/enums/cos-main-job-status.enum';
import { ICosJob2InstanceEntity } from '../model/entities/cos-job-2-instance-entity.interface';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { zonedTimeToUtc } from 'date-fns-tz';
import { ReplaySubject } from 'rxjs';
import { CosInstanceStatus } from '../model/enums/cos-instance-status.enum';
import { ICosInsErrorEntity } from '../model/entities/cos-ins-error-entity.interfae';
import { CosMainComplete } from '../model/entities/cos-main-complete.class';
import { ICosJobEntity } from '../model/entities/cos-job-entity.interface';
import { ConstructionSystemMainOutputDataService } from './construction-system-main-output-data.service';

export const CONSTRUCTION_SYSTEM_MAIN_JOB_DATA_TOKEN = new InjectionToken<ConstructionSystemMainJobDataService>('constructionSystemMainJobDataToken');

export class ICosJobEntityComplete implements CompleteIdentification<ICosJobEntity> {}
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainJobDataService extends DataServiceFlatNode<ICosJobEntity, ICosJobEntityComplete, ICosInstanceEntity, CosMainComplete> {
	private readonly http = inject(PlatformHttpService);
	private readonly msgDialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	protected selectedJobCompleted$ = new ReplaySubject<ICosJobEntity>(1);
	protected onEvaluationDone$ = new ReplaySubject<ICosInstanceEntity>(1);
	protected onCalculationDone$ = new ReplaySubject<ICosInstanceEntity>(1);
	protected onAssignObjectDone$ = new ReplaySubject<ICosInstanceEntity>(1);
	protected onScriptResultUpdated$ = new ReplaySubject<null>();

	public constructor(private instanceService: ConstructionSystemMainInstanceDataService) {
		const options: IDataServiceOptions<ICosJobEntity> = {
			apiUrl: 'constructionsystem/main/job',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: () => {
					return {
						insHeaderId: this.getCurrentInstanceHeaderId(),
					};
				},
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceRoleOptions<'ICosJobEntity'>>{
				role: ServiceRole.Node,
				itemName: 'Job',
				parent: instanceService,
			},
			entityActions: { createSupported: false, deleteSupported: true },
		};
		super(options);
		this.subscriptToInstanceChange();

		//cloudDesktopPinningContextService.onSetPinningContext.register(service.loadJobs);todo waiting cloudDesktopPinningContextService
		//cloudDesktopPinningContextService.onClearPinningContext.register(service.loadJobs);
	}

	public override provideAllProcessor(options: IDataServiceOptions<ICosJobEntity>): IEntityProcessor<ICosJobEntity>[] {
		const allProcessor = super.provideAllProcessor(options);
		//allProcessor.push(this.provideDateProcessor());/// todo seems dateProcessor does not work
		return allProcessor;
	}

	public disableCalculation() {
		return !this.instanceService.getList().some(function (item) {
			return item.IsChecked && !item.IsUserModified;
		});
	}

	public createCalculationJob() {
		this.instanceService
			.updateAndExecute(async () => {
				const item = await this.doCreateItem('executeinstanceasync');
				if (item) {
					this.refreshAll().then(() => {
						this.selectCosJob(item, true);
					});
				}
			})
			.then();
	}

	private selectCosJob(entity: ICosJobEntity, fromCalculation?: boolean) {
		const constructionSystemMainOutputDataService = ServiceLocator.injector.get(ConstructionSystemMainOutputDataService);
		if (constructionSystemMainOutputDataService.isFilterByCalculation) {
			if (fromCalculation) {
				this.select(entity).then();
			}
		} else {
			this.select(entity).then();
		}
	}

	private doCreateItem(action: string, version?: number): Promise<ICosJobEntity | null> {
		const instances = this.instanceService.getList().filter(function (item) {
			return item.IsChecked && !item.IsUserModified;
		});

		if (instances.length) {
			return this.http.post<ICosJobEntity>('constructionsystem/main/job/' + action, {
				InsHeaderId: this.getCurrentInstanceHeaderId(),
				InstanceIds: instances.map((item) => {
					return item.Id;
				}),
				Version: version,
			});
		} else {
			this.msgDialogService.showMsgBox('constructionsystem.main.checkInstanceWarning', 'constructionsystem.main.createJobFailed', 'ico-error');
			return new Promise((resolve) => {
				resolve(null);
			});
		}
	}

	public createEvaluationJob() {
		this.instanceService
			.updateAndExecute(async () => {
				const item = await this.doCreateItem('evalquantityqueryasync');
				if (item) {
					this.refreshAll().then(() => {
						this.selectCosJob(item, true);
					});
				}
			})
			.then();
	}

	/**
	 * Disable Evaluation
	 */

	public disableEvaluation() {
		return this.instanceService.getList().length === 0;
	}

	/**
	 * delete all jobs for current instance header
	 */
	public async deleteAll() {
		const instanceHeaderId = this.instanceService.getCurrentInstanceHeaderId();
		if (instanceHeaderId) {
			await this.http.get('constructionsystem/main/job/deleteall', {
				params: { insHeaderId: instanceHeaderId },
			});
			await this.refreshAll();
		}
	}

	public getCurrentInstanceHeaderId() {
		return this.instanceService.getCurrentInstanceHeaderId();
	}

	public get selectedJobCompleted() {
		return this.selectedJobCompleted$;
	}

	public get onAssignObjectDone() {
		return this.onAssignObjectDone$;
	}

	public get onCalculationDone() {
		return this.onCalculationDone$;
	}

	public get onEvaluationDone() {
		return this.onEvaluationDone$;
	}

	public get onScriptResultUpdated() {
		return this.onScriptResultUpdated$;
	}

	public async doQueryStatus() {
		const updateJobs = (gridList: ICosJobEntity[], cosJobs: ICosJobEntity[], selectedJobCompleted: ReplaySubject<ICosJobEntity>) => {
			let modified = false;
			cosJobs.forEach((cosJob) => {
				const gridItem = gridList.find((item) => item.Id === cosJob.Id);
				if (gridItem) {
					modified = updateGridItem(gridItem, cosJob, selectedJobCompleted) || modified;
				} else {
					const constructionSystemMainOutputDataService = ServiceLocator.injector.get(ConstructionSystemMainOutputDataService);
					modified = true;
					gridList.unshift(cosJob);
					if (!constructionSystemMainOutputDataService.isFilterByCalculation) {
						this.select(cosJob);
					}
				}
			});
			return modified;
		};

		function updateDateTime(item: ICosJobEntity, dateTimeField: 'StartTime' | 'EndTime') {
			const dateTimeValue = item[dateTimeField];
			if (dateTimeValue) {
				item[dateTimeField] = zonedTimeToUtc(dateTimeValue, 'UTC').toDateString();
				return true;
			}
			return false;
		}
		function updateGridItem(gridItem: ICosJobEntity, cosJob: ICosJobEntity, selectedJobCompleted: ReplaySubject<ICosJobEntity>) {
			let modified = false;
			if (updateDateTime(cosJob, 'StartTime') || updateDateTime(cosJob, 'EndTime') || gridItem.JobState !== cosJob.JobState || gridItem.ProgressMessage !== cosJob.ProgressMessage) {
				modified = true;
				gridItem.JobState = cosJob.JobState;
				gridItem.StartTime = cosJob.StartTime;
				gridItem.EndTime = cosJob.EndTime;
				gridItem.ProgressMessage = cosJob.ProgressMessage;

				if (selectedJobCompleted && isJobCompleted(gridItem)) {
					selectedJobCompleted.next(gridItem);
				}
			}
			return modified;
		}

		function updateInstances(cosInstanceList: ICosInstanceEntity[], instances: ICosInstanceEntity[]) {
			instances.forEach((instance) => {
				const target = cosInstanceList.find((e) => e.InstanceHeaderFk === instance.InstanceHeaderFk && e.Id === instance.Id);
				if (target) {
					target.Version = instance.Version;
				}
			});
		}
		function isJobCompleted(gridItem: ICosJobEntity) {
			return gridItem.JobState > ConstructionSystemMainJobStatus.Running && gridItem.JobState !== ConstructionSystemMainJobStatus.Canceling;
		}

		const runningJobs = this.getList().filter((item) => {
			return item.JobState < ConstructionSystemMainJobStatus.Finished || item.JobState === ConstructionSystemMainJobStatus.Canceling;
		});
		if (runningJobs.length === 0) {
			return;
		}
		type queryStatusResponse = {
			CosJobs: ICosJobEntity[];
			CosInstances: ICosJob2InstanceEntity[];
			Instances: ICosInstanceEntity[];
		};
		const response = await this.http.post<queryStatusResponse>('constructionsystem/main/job/querystatus', {
			params: {
				InsHeaderId: this.getCurrentInstanceHeaderId(),
				CosJobIds: runningJobs.map((item) => item.Id),
			},
		});
		const modified = updateJobs(this.getList(), response.CosJobs, this.selectedJobCompleted);
		if (modified) {
			this.refreshAll();
		}
		const cosInstanceList = this.instanceService.getList();
		updateInstances(cosInstanceList, response.Instances);
		//update instance status
		if (response.CosInstances.length > 0) {
			response.CosInstances.forEach((item) => {
				let isStateChanged = false;
				const target = cosInstanceList.find((e) => e.InstanceHeaderFk === item.InstanceHeaderFk && e.Id === item.CosInstanceFk);
				if (target) {
					if (target.Status !== item.JobState) {
						target.Status = item.JobState;
						isStateChanged = true;
					}

					if (isStateChanged) {
						if (item.JobState === CosInstanceStatus.Evaluated) {
							this.onEvaluationDone.next(target);
						} else if (item.JobState === CosInstanceStatus.Calculated) {
							this.onCalculationDone.next(target);
						} else if (item.JobState === CosInstanceStatus.ObjectAssigned || item.JobState === CosInstanceStatus.ObjectAssignFailed || item.JobState === CosInstanceStatus.ObjectUnassigned) {
							this.onAssignObjectDone.next(target);
						}
					}
				}
			});
		}
	}

	/**
	 *
	 * @param assignSelected
	 */
	public createObjectAssignJob(assignSelected: boolean) {
		this.instanceService
			.updateAndExecute(async () => {
				let cosInstances: ICosInstanceEntity[] = [];
				if (assignSelected === true) {
					const selectedCosInstance = this.instanceService.getSelectedEntity();
					if (selectedCosInstance) {
						cosInstances = [selectedCosInstance];
					}
				} else {
					cosInstances = this.instanceService.getList().filter((item) => item.IsChecked);
				}

				if (cosInstances.length === 0) {
					await this.msgDialogService.showMsgBox('cloud.common.informationDialogHeader', 'constructionsystem.main.assignObjectsBySelectionStatement.mustCheck', 'ico-info');
					return;
				}
				const result = await this.msgDialogService.showYesNoDialog({
					bodyText: 'constructionsystem.main.assignObjectsBySelectionStatement.isClear',
					defaultButtonId: StandardDialogButtonId.No,
					headerText: 'constructionsystem.main.assignObjectsBySelectionStatement.wizardName',
				});

				if (result) {
					const newJobEntity = await this.http.post<ICosJobEntity>('constructionsystem/main/job/assignobjectsbyselectionstatement', {
						InsHeaderId: this.getCurrentInstanceHeaderId() ?? 0,
						InstanceIds: cosInstances.map((e) => e.Id),
						IsClear: result.closingButtonId === StandardDialogButtonId.Yes,
					});

					await this.refreshAll();
					if (this.getList().find((s) => s.Id === newJobEntity.Id)) {
						this.selectCosJob(newJobEntity);
					}
				}
			})
			.then();
	}

	public createApplyLineItemJob(newEntity: ICosJobEntity) {
		this.instanceService.updateAndExecute(async () => {
			this.refreshAll().then(() => {
				this.selectCosJob(newEntity);
			});
			/// cosJobEntity do not have property InstanceStatus, then will make status is undefined,do not understand below logic
			// this.instanceService
			// 	.getList()
			// 	.filter((e) => e.IsChecked)
			// 	.forEach((t) => (t.Status = newEntity.InstanceStatus));
		});
	}

	public override delete(entities: ICosJobEntity[] | ICosJobEntity) {
		if (!Array.isArray(entities)) {
			super.delete(entities);
		} else {
			///multiple delete
			const ids = entities.map((e) => e.Id);
			this.http.get('constructionsystem/main/job/deleteitems', {
				params: { ids: ids },
			});
		}
	}

	public getScriptJobLog(selectItemId: number) {
		return this.http.get<ICosInsErrorEntity[]>('constructionsystem/main/job/scriptlog', {
			params: {
				id: selectItemId,
			},
		});
	}

	/**
	 * subscript to instance change
	 */
	public subscriptToInstanceChange() {
		this.instanceService.selectionChanged$.subscribe(() => {
			const currentInstance = this.instanceService.getSelectedEntity();
			if (currentInstance) {
				const constructionSystemMainOutputDataService = ServiceLocator.injector.get(ConstructionSystemMainOutputDataService);
				const isCalculation = constructionSystemMainOutputDataService.isFilterByCalculation;
				this.http
					.get<ICosJobEntity>('constructionsystem/main/job/latestcosjob', {
						params: {
							insHeaderId: currentInstance.InstanceHeaderFk,
							instanceId: currentInstance.Id,
							isCalculation: isCalculation,
						},
					})
					.then((job) => {
						if (job) {
							this.select(job);
						}
						this.onScriptResultUpdated.next(null);
					});
				return;
			}
		});
	}

	/**
	 * we donot load the Entities once instance entity is selected(changed),we fresh container data with its fresh button
	 * @param identificationData
	 */
	public override loadSubEntities(identificationData: IIdentificationData): Promise<void> {
		return new Promise((resolve) => {
			resolve();
		});
	}

	public loadJobs(): Promise<ICosJobEntity[]> {
		const insHeaderId = this.getCurrentInstanceHeaderId();
		return new Promise((resolve) => {
			if (insHeaderId) {
				this.refreshAll().then(() => {
					resolve(this.getList());
				});
			} else {
				resolve([]);
			}
		});
	}

	/**
	 * refresh service
	 */
	public refreshAll() {
		return super.loadSubEntities({ id: 0, pKey1: 0 });
	}
}
