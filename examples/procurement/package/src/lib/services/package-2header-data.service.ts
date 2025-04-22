
import {inject, Injectable} from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { IPrcPackageEntity,IPackage2HeaderEntity,IPackage2HeaderCreateCompleteEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { IPackage2HeaderCreateRequest } from '../model/requests/package-2header-create-request.interface';
import { PrcPackage2HeaderComplete, } from '../model/entities/package-2header-complete.class';
import { get, forEach, isEmpty } from 'lodash';
import { lastValueFrom, ReplaySubject, Subject } from 'rxjs';
import { IExchangeRateChangedEvent, IOriginalData, IPaymentTermChangedEvent, IPrcHeaderDataService, IPrcModuleValidatorService } from '@libs/procurement/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { EntityProxy, FieldKind, ProcurementInternalModule } from '@libs/procurement/shared';
import { BasicsSharedProcurementConfigurationLookupService } from '@libs/basics/shared';
import { PlatformHttpService } from '@libs/platform/common';


@Injectable({
	providedIn: 'root'
})
export class Package2HeaderDataService
	extends DataServiceFlatNode<IPackage2HeaderEntity, PrcPackage2HeaderComplete,
	IPrcPackageEntity, PrcPackageCompleteEntity>
	implements IPrcHeaderDataService<IPackage2HeaderEntity, PrcPackage2HeaderComplete>,
	IPrcModuleValidatorService<IPackage2HeaderEntity, PrcPackage2HeaderComplete> {

	private readonly httpService = inject(PlatformHttpService);
	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	public readonly exchangeRateChanged$ = new Subject<IExchangeRateChangedEvent>();
	protected readonly rootDataCreated$ = new ReplaySubject<IPackage2HeaderCreateCompleteEntity>(1);
	public readonly entityProxy = new EntityProxy(this, []);

	public constructor(protected procurementPackageHeaderDataService: ProcurementPackageHeaderDataService) {
		const options: IDataServiceOptions<IPackage2HeaderEntity> = {
			apiUrl: 'procurement/package/prcpackage2header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createdata',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IPackage2HeaderEntity, IPrcPackageEntity, PrcPackageCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'PrcPackage2Header',
				parent: procurementPackageHeaderDataService
			}
		};
		super(options);

		this.processor.addProcessor({
			revertProcess() {
			},
			process: () => {
				// todo dataProcessor: [new PackagePackage2HeaderCommonItemsProcessor(parentService), readonlyProcessor],
			}
		});

		this.init();
	}

	// region advance override
	public override isParentFn(parentKey: IPrcPackageEntity, entity: IPackage2HeaderEntity): boolean {
		return entity.PrcPackageFk === parentKey.Id;
	}
	public override createUpdateEntity(modified: IPackage2HeaderEntity | null): PrcPackage2HeaderComplete {
		const complete = new PrcPackage2HeaderComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PrcPackage2Header = modified;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: PrcPackage2HeaderComplete): IPackage2HeaderEntity[] {
		return complete.PrcPackage2Header ? [complete.PrcPackage2Header] : [];
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PrcPackageCompleteEntity): IPackage2HeaderEntity[] {
		if (parentUpdate.PrcPackage2HeaderToSave) {
			const dataPackage2Header = [] as IPackage2HeaderEntity[];
			parentUpdate.PrcPackage2HeaderToSave.forEach(updated => {
				if (updated.PrcPackage2Header) {
					dataPackage2Header.push(updated.PrcPackage2Header);
				}
			});
			return dataPackage2Header;
		}
		return [];
	}

	public override registerByMethod(): boolean {
		return true;
	}



	public override registerNodeModificationsToParentUpdate(parentUpdate: PrcPackageCompleteEntity, modified: PrcPackage2HeaderComplete[], deleted: IPackage2HeaderEntity[]) {
		const parentSelected = this.getSelectedParent();
		if (parentSelected) {
			parentUpdate.MainItemId=parentSelected.Id;
			if (modified && modified.length > 0) {
				parentUpdate.PrcPackage2HeaderToSave = modified;
			}

			if (deleted && deleted.length > 0) {
				parentUpdate.PrcPackage2HeaderToDelete = deleted;
			}
		}

	}
	// endregion
	// region basic override
	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		// todo other logic
		return {
			mainItemId: -1
		};
	}

	protected override onLoadSucceeded(loaded: object): IPackage2HeaderEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		// todo other logic
		return [];
	}

	protected override provideCreatePayload(): IPackage2HeaderCreateRequest {
		const parentSelected = this.getSelectedParent();
		if (parentSelected && parentSelected.ConfigurationFk) {
			return {
				StructureFk: parentSelected.StructureFk,
				ConfigurationFk: parentSelected.ConfigurationFk,
				MdcTaxCodeFk: parentSelected.TaxCodeFk,
				ProjectFk: parentSelected.ProjectFk,
				// TODO complete ProjectFk
				// ProjectFk :  parentSelected.ProjectFk || moduleContext.loginProject,
				MainItemId: parentSelected.Id,

			};
		}
		throw new Error('Please select a package and configuration data frist');
	}

	protected override onCreateSucceeded(created: IPackage2HeaderCreateCompleteEntity): IPackage2HeaderEntity {
		return created.Package2Header;
	}

	// endregion

	public init() {
		this.procurementPackageHeaderDataService.exchangeRateChanged$.subscribe({
			next: (event) => {
				this.exchangeRateChanged$.next(event);
			}
		});

		this.procurementPackageHeaderDataService.entityProxy.propertyChanged$.subscribe({
			next: (event) => {
				if (event.fieldKind === FieldKind.StructureFk && event.entity.Version === 0) {
					const list = this.getList();
					forEach(list, (item) => {
						const oldValue = event.oldValue ? event.oldValue as number : null;
						if (item.PrcHeaderEntity && !oldValue) {
							const originalEntity: IOriginalData = {
								originalConfigurationFk: item.PrcHeaderEntity.ConfigurationFk,
								originalStructureFk: oldValue
							};
							item.PrcHeaderEntity.StructureFk = event.newValue ? event.newValue as number : undefined;
							this.setModified(item);
							this.doGeneralsAndCertificates(item, originalEntity);

							// todo chi: common logic is not available
							// reloadHeaderText(item, {
							// 	isOverride: true
							// });
						}
					});
				} else if (event.fieldKind === FieldKind.PrcConfigurationFk) {
					const list = this.getList();
					forEach(list, (item) => {
						const oldValue = event.oldValue ? event.oldValue as number : null;
						if (item.PrcHeaderEntity && item.PrcHeaderEntity.ConfigurationFk !== oldValue) {
							const originalEntity: IOriginalData = {
								originalConfigurationFk: oldValue,
								originalStructureFk: item.PrcHeaderEntity.StructureFk
							};
							this.doGeneralsAndCertificates(item, originalEntity);

							// todo chi: common logic is not available
							// reloadHeaderText(item, {
							// 	isOverride: true
							// });
							this.entityProxy.apply(item);
						}
					});
				} else if (event.fieldKind === FieldKind.AllConfigurationFk) {
					const reloadArgs: object[] = [];
					const entity = event.entity;
					const blobAction = entity.BlobAction;
					const list = this.getList();
					const oldValue = event.oldValue ? event.oldValue as number : null;
					const newValue = event.newValue ? event.newValue as number : null;

					forEach(list, async (item) => {
						if (item.PrcHeaderEntity && item.PrcHeaderEntity.ConfigurationFk !== oldValue) {

							const config = newValue ? await lastValueFrom(this.configurationLookupService.getItemByKey({id: newValue})) : null;
							const argsEntity: object = {
								SubPackageId: item.Id,
								MainItemId: item.PrcHeaderEntity.Id,
								OriginalStructureFk: item.PrcHeaderEntity.StructureFk,
								OriginalConfigurationFk: item.PrcHeaderEntity.ConfigurationFk,
								MdcControllingunitFk: entity.MdcControllingUnitFk,
								StructureFk: item.PrcHeaderEntity.StructureFk,
								ConfigurationFk: newValue,
								ProjectFk: this.getHeaderContext().projectFk,
								PrcHeaderFk: item.PrcHeaderFk,
								PrcConfigHeaderFk: config?.PrcConfigHeaderFk,
								UpdateAction: blobAction
							};
							reloadArgs.push(argsEntity);
							this.setModified(item);
						}
					});

					if (!isEmpty(reloadArgs)) {
						// todo chi: need? it seems no other operation to do after loading
						// reloadAllGeneralsAndCertificatesAndHeaderText(reloadArgs); $http.post(globals.webApiBaseUrl + 'procurement/common/data/loadbywizard', reloadArgs);
					}
				} else if (event.fieldKind === FieldKind.ProjectFk) {
					const list = this.getList();
					forEach(list, (item) => {
						// todo chi: common logic is not available
						// reloadHeaderText(item, {
						// 	isOverride: true
						// });
					});
				}

				this.entityProxy.propertyChanged$.next({
					entity: this.getSelectedEntity()!,
					oldValue: event.oldValue,
					newValue: event.newValue,
					fieldKind: event.fieldKind
				});
			}
		});

		this.procurementPackageHeaderDataService.rootDataCreated$.subscribe({
			next: (newData) => {

				if (!newData.Package2HeaderComplete) {
					return;
				}
				this.setList([newData.Package2HeaderComplete.Package2Header]);
				this.loadAfterCreateSucceeded(newData.Package2HeaderComplete.Package2Header);
				this.rootDataCreated$.next(newData.Package2HeaderComplete);
			}
		});
	}

	public getHeaderContext(entity?: IPackage2HeaderEntity) {
		const context = this.procurementPackageHeaderDataService.getHeaderContext();
		const subPackage = entity ?? this.getSelectedEntity();
		if (!subPackage) {
			throw new Error('please selected record first');
		}

		context.prcHeaderFk = subPackage.PrcHeaderFk;
		return context;
	}

	public reloadGeneralsAndCertificates(entity: IPackage2HeaderEntity, originalEntity: IOriginalData) {
		// todo chi: common logic is not available
		// var generalsDataService = procurementCommonGeneralsDataService.getService(service);
		// var certificateDataService = procurementCommonCertificateDataService.getService(service);
		// certificateDataService.clearConfiguration2certCache();
		// if (originalEntity && originalEntity.originalConfigurationFk && originalEntity.originalStructureFk) {
		// 	generalsDataService.reloadData(originalEntity);
		// 	certificateDataService.reloadData(originalEntity);
		// } else if (entity && entity.PrcHeaderEntity.ConfigurationFk && entity.PrcHeaderEntity.StructureFk) {
		// 	generalsDataService.reloadData();
		// 	certificateDataService.reloadData();
		// }
	}

	private doGeneralsAndCertificates(entity: IPackage2HeaderEntity, originalEntity: IOriginalData) {
		const selected = this.getSelectedEntity();
		if (selected && selected.Id === entity.Id) {
			this.reloadGeneralsAndCertificates(entity, originalEntity);
		} else {
			this.select(entity).then(() => {
				this.reloadGeneralsAndCertificates(entity, originalEntity);
			});
		}
	}

	private loadAfterCreateSucceeded(created: IPackage2HeaderEntity) {
		// const requestData = {
		// 	mainItemId: 0
		// };

		// todo chi: common service is not available
		// this.httpService.post('procurement/common/overview/tree', requestData);
		//
		// 	if (response.data) {
		// 		var overviewService = procurementCommonOverviewDataService.getService(moduleContext.getMainService(), moduleContext.getLeadingService());
		// 		overviewService.addRow(response.data[0]);
		// 	}

		this.setModified(created);// when create done the set selected will call by grid which will make selection changed and do clear all modifications.

	}
	// region prc item setting
	public getHeaderEntity(): IPrcHeaderEntity {
		const subPackage = this.getSelectedEntity()!;
		return subPackage.PrcHeaderEntity!;
	}

	public readonly paymentTermChanged$ = new Subject<IPaymentTermChangedEvent>();

	public readonly readonlyChanged$ = new Subject<boolean>();

	public updateTotalLeadTime() {
		// endregion
	}

	public isValidForSubModule(): boolean {
		const entity = this.getSelectedEntity()!;
		return entity !== null && entity.Id !== undefined;
	}

	public getInternalModuleName(): string {
		return ProcurementInternalModule.Package;
	}

}