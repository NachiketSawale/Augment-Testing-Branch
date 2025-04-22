/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {IPrcPacMasterRestrictionEntity} from '../model/entities/prc-pac-master-restriction-entity.interface';
import {IPrcPackageEntity} from '@libs/procurement/interfaces';
import {PrcPackageCompleteEntity} from '../model/entities/package-complete-entity.class';
import {ProcurementPackageHeaderDataService} from './package-header-data.service';
import {IMasterRestrictionLoadedEntity} from '../model/entities/master-restriction-loaded-entity.interface';
import {
	ProcurementPackageMasterRestrictionReadonlyProcessorService
} from './processors/master-restriction-readonly-processor.service';
import {difference, extend, includes, isArray} from 'lodash';
import {
	MasterRestrictionType,
	ProcurementCommonWicBoqRootItemLookupService,
	ProcurementCopyMode
} from '@libs/procurement/common';
import {IProjectBoqEntity} from '@libs/boq/project';
import {IProcurementPackageLookupEntity} from '@libs/basics/interfaces';
import {IContractLookupEntity} from '@libs/procurement/shared';
import {
	PackageMasterRestrictionBoqHeaderLookupServiceProvider
} from '../model/lookup-providers/package-master-restriction-boq-header-lookup-service-provider.class';
import {IBoqHeaderLookupEntity} from '@libs/boq/main';
import {UiCommonLookupEndpointDataService} from '@libs/ui/common';

interface IBoqFilterInfo {
	wicGroupIds: number[];
	oriWicGroupIds: number[];
	projectIds: number[];
	oriProjectIds: number[];
	packageIds: number[];
	oriPackageIds: number[];
	materialCatalogIds: number[];
	oriMaterialCatalogIds: number[];
	contractIds: number[];
	oriContractIds: number[];
	mainItemId2BoqHeaderIds: Map<number, number[]> | null;
	oriMainItemId2BoqHeaderIds: Map<number, number[]> | null;
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageMasterRestrictionDataService extends DataServiceFlatLeaf<IPrcPacMasterRestrictionEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {
	public readonly readonlyProcessor: ProcurementPackageMasterRestrictionReadonlyProcessorService;
	private readonly isPortalMode = false; // TODO globals.portal
	private readonly prjBoqLookups = new Map<number, IProjectBoqEntity>();
	private readonly packageLookups = new Map<number, IProcurementPackageLookupEntity>();
	private readonly contractLookups = new Map<number, IContractLookupEntity>();
	private readonly packageBoqHeaderLookupService = PackageMasterRestrictionBoqHeaderLookupServiceProvider.getPackageBoqHeaderLookupService();
	private readonly contractBoqHeaderLookupService = PackageMasterRestrictionBoqHeaderLookupServiceProvider.getContractBoqHeaderLookupService();
	private readonly wicBoqRootItemLookupService = inject(ProcurementCommonWicBoqRootItemLookupService);

	public constructor(public readonly packageService: ProcurementPackageHeaderDataService) {
		const options: IDataServiceOptions<IPrcPacMasterRestrictionEntity> = {
			apiUrl: 'procurement/package/prcpacmasterrestriction',
			readInfo: {
				endPoint: 'listByParent',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcPacMasterRestrictionEntity, IPrcPackageEntity, PrcPackageCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcPacMasterRestriction',
				parent: packageService,
			},
		};
		super(options);
		this.readonlyProcessor = new ProcurementPackageMasterRestrictionReadonlyProcessorService(this);
		this.processor.addProcessor([this.readonlyProcessor]);
		this.packageService.onHeaderUpdated$.subscribe({
			next: () => {
				this.updateBoqFilter();
			}
		});
	}

	protected override provideLoadPayload(): object {
		const parentSelected = this.packageService.getSelectedEntity();
		return {
			PKey1: parentSelected?.Id,
		};
	}

	protected override onLoadSucceeded(loaded: IMasterRestrictionLoadedEntity): IPrcPacMasterRestrictionEntity[] {
		this.cacheBoqHeaderLookupData(loaded.boqHeadsBasePackage, this.packageBoqHeaderLookupService);
		this.cacheBoqHeaderLookupData(loaded.conBoqHeaders, this.contractBoqHeaderLookupService);
		this.wicBoqRootItemLookupService.cache.setItems(loaded.wicBoqHeaders || []);
		this.updateLookupData(loaded);
		this.updateBoqFilter();
		return loaded.Main;
	}

	public isHeaderContextReadonly() {
		return this.packageService.getHeaderContext().readonly;
	}

	public override canDelete(): boolean {
		return super.canDelete() && !this.isHeaderContextReadonly();
	}

	public override canCreate(): boolean {
		return super.canCreate() && !this.isHeaderContextReadonly();
	}

	public updateBoqFilter() {
		let wicGroupIds: number[] = [];
		let projectIds: number[] = [];
		let packageIds: number[] = [];
		const materialCatalogIds: number[] = [];
		let mainItemId2BoqHeaderIds: Map<number, number[]> | null = null;
		let contractIds: number[] = [];
		// todo chi: common logic is not available
		const oriWicGroupIds: number[] = []; // boqMainLookupFilterService.boqHeaderLookupFilter.wicGroupIds;
		const oriProjectIds: number[] = []; // boqMainLookupFilterService.boqHeaderLookupFilter.projectIds;
		const oriPackageIds: number[] = []; // boqMainLookupFilterService.boqHeaderLookupFilter.packageIds;
		const oriMaterialCatalogIds: number[] = []; // boqMainLookupFilterService.boqHeaderLookupFilter.materialCatalogIds;
		const oriContractIds: number[] = []; // boqMainLookupFilterService.boqHeaderLookupFilter.contractIds;
		const oriMainItemId2BoqHeaderIds = new Map<number, number[]>(); // boqMainLookupFilterService.boqHeaderLookupFilter.mainItemId2BoqHeaderIds;

		const parentItem = this.packageService.getSelectedEntity();
		if (!(parentItem &&
			((parentItem.PrcCopyModeFk === ProcurementCopyMode.OnlyAllowedCatalogs) ||
				(parentItem.PrcCopyModeFk === ProcurementCopyMode.NoRestrictions4StandardUser && this.isPortalMode)))) {
			// todo chi: common logic is not available
			// boqMainLookupFilterService.setSelectedWicGroupIds(wicGroupIds);
			// boqMainLookupFilterService.setSelectedProjectIds(projectIds);
			// boqMainLookupFilterService.setSelectedPackageIds(packageIds);
			// boqMainLookupFilterService.setSelectedMaterialCatalogIds(materialCatalogIds);
			// boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(mainItemId2BoqHeaderIds);
			// boqMainLookupFilterService.setSelectedContractIds(contractIds);
			return;
		}

		const list = this.getList();
		const boqType: number = 1; // boqMainLookupFilterService.boqHeaderLookupFilter.boqType;
		const selectedWicGroupId: number = -1; // boqMainLookupFilterService.boqHeaderLookupFilter.boqGroupId;
		let selectedProjectId: number = -1; // boqMainLookupFilterService.boqHeaderLookupFilter.projectId;
		let isFilterCaseChanged = false;

		if (boqType === 1) {
			wicGroupIds = [-1]; // To force empty wic group and boq list
		} else if (boqType === 2 || boqType === 4 || boqType === 7) {
			projectIds = [-1];
			if (boqType === 4) {
				packageIds = [-1];
			} else if (boqType === 7) {
				contractIds = [-1];
			}
		}

		if (!list || list.length === 0 || (boqType !== 1 && boqType !== 2 && boqType !== 4 && boqType !== 7)) {
			isFilterCaseChanged = this.getIsFilterCaseChanged({
				wicGroupIds: wicGroupIds,
				oriWicGroupIds: oriWicGroupIds,
				projectIds: projectIds,
				oriProjectIds: oriProjectIds,
				packageIds: packageIds,
				oriPackageIds: oriPackageIds,
				materialCatalogIds: materialCatalogIds,
				oriMaterialCatalogIds: oriMaterialCatalogIds,
				contractIds: contractIds,
				oriContractIds: oriContractIds,
				mainItemId2BoqHeaderIds: mainItemId2BoqHeaderIds,
				oriMainItemId2BoqHeaderIds: oriMainItemId2BoqHeaderIds
			});

			if (isFilterCaseChanged) {
				// todo chi: common logic is not available
				// boqMainLookupFilterService.setSelectedProject(null);
				// boqMainLookupFilterService.boqHeaderLookupFilter.projectId = 0;
				// boqMainLookupFilterService.setSelectedBoqHeader(null);
			}

			// todo chi: common logic is not available
			// boqMainLookupFilterService.setSelectedWicGroupIds(wicGroupIds);
			// boqMainLookupFilterService.setSelectedProjectIds(projectIds);
			// boqMainLookupFilterService.setSelectedPackageIds(packageIds);
			// boqMainLookupFilterService.setSelectedMaterialCatalogIds(materialCatalogIds);
			// boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(mainItemId2BoqHeaderIds);
			// boqMainLookupFilterService.setSelectedContractIds(contractIds);
			return;
		}

		const visibilities = this.isPortalMode ? [2, 3] : [1, 3];

		list.forEach((item) => {
			if (!includes(visibilities, item.Visibility)) {
				return;
			}

			if (boqType === 1) {
				if (item.CopyType === MasterRestrictionType.wicBoq) {
					if (item.BoqWicCatFk) {
						if (!includes(wicGroupIds, item.BoqWicCatFk)) {
							wicGroupIds.push(item.BoqWicCatFk);
						}

						if (item.BoqHeaderFk && (selectedWicGroupId === 0 || item.BoqWicCatFk === selectedWicGroupId)) {
							mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds || new Map<number, number[]>;
							let boqWicCat2BoqHeaderIds = mainItemId2BoqHeaderIds.get(item.BoqWicCatFk);
							if (!Array.isArray(boqWicCat2BoqHeaderIds)) {
								boqWicCat2BoqHeaderIds = [];
								mainItemId2BoqHeaderIds.set(item.BoqWicCatFk, boqWicCat2BoqHeaderIds);
							}
							if (!includes(boqWicCat2BoqHeaderIds, item.BoqHeaderFk)) {
								boqWicCat2BoqHeaderIds.push(item.BoqHeaderFk);
							}
						}
					}

				} else if (item.CopyType === MasterRestrictionType.material) {
					if (item.MdcMaterialCatalogFk && !includes(materialCatalogIds, item.MdcMaterialCatalogFk)) {
						materialCatalogIds.push(item.MdcMaterialCatalogFk);
					}
				}
			} else if (boqType === 2 && item.CopyType === MasterRestrictionType.prjBoq) {
				if (item.PrjProjectFk) {
					if (!includes(projectIds, item.PrjProjectFk)) {
						projectIds.push(item.PrjProjectFk);
					}

					if (item.PrjBoqFk) {
						let prjBoq: IProjectBoqEntity | null | undefined = null;
						let boqHeaderId: number | null = null;
						if (this.prjBoqLookups) {
							prjBoq = this.prjBoqLookups.get(item.PrjBoqFk);
						}
						if (!prjBoq) {
							// todo chi: common logic is not available
							// prjBoq = procurementCommonMasterRestrictionPrjBoqLookupDataService.getItemById(item.PrjBoqFk, {lookupType: 'procurementCommonMasterRestrictionPrjBoqLookupDataService'});
							// boqHeaderId = (prjBoq && prjBoq.BoqHeader && prjBoq.BoqHeader.Id) || null;
						} else {
							boqHeaderId = prjBoq.BoqHeaderFk || null;
						}
						if (boqHeaderId) {
							mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds || new Map<number, number[]>();
							let project2BoqHeaderIds = mainItemId2BoqHeaderIds.get(item.PrjProjectFk);
							if (!Array.isArray(project2BoqHeaderIds)) {
								project2BoqHeaderIds = [];
								mainItemId2BoqHeaderIds.set(item.PrjProjectFk, project2BoqHeaderIds);
							}
							if (!includes(project2BoqHeaderIds, boqHeaderId)) {
								project2BoqHeaderIds.push(boqHeaderId);
							}
						}
					}
				}
			} else if (boqType === 4 && item.CopyType === MasterRestrictionType.packageBoq) {
				if (item.PrcPackageBoqFk) {
					if (this.packageLookups) {
						const packagelookup = this.packageLookups.get(item.PrcPackageBoqFk);
						if (packagelookup && packagelookup.ProjectFk) {
							if (!includes(projectIds, packagelookup.ProjectFk)) {
								projectIds.push(packagelookup.ProjectFk);
							}

							if (!includes(packageIds, item.PrcPackageBoqFk)) {
								packageIds.push(item.PrcPackageBoqFk);
							}

							if (item.BoqHeaderFk) {
								mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds || new Map<number, number[]>();
								let package2BoqHeaderIds = mainItemId2BoqHeaderIds.get(item.PrcPackageBoqFk);
								if (!Array.isArray(package2BoqHeaderIds)) {
									package2BoqHeaderIds = [];
									mainItemId2BoqHeaderIds.set(item.PrcPackageBoqFk, package2BoqHeaderIds);
								}
								if (!includes(package2BoqHeaderIds, item.BoqHeaderFk)) {
									package2BoqHeaderIds.push(item.BoqHeaderFk);
								}
							}
						}
					}
				}
			} else if (boqType === 7 && item.CopyType === MasterRestrictionType.contractBoq) {
				if (item.ConHeaderFk) {
					if (this.contractLookups) {
						const contractLookup = this.contractLookups.get(item.ConHeaderFk);
						if (contractLookup && contractLookup.ProjectFk) {
							if (!includes(projectIds, contractLookup.ProjectFk)) {
								projectIds.push(contractLookup.ProjectFk);
							}

							if (!includes(contractIds, item.ConHeaderFk)) {
								contractIds.push(item.ConHeaderFk);
							}

							if (item.ConBoqHeaderFk) {
								mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds || new Map<number, number[]>();
								let contract2BoqHeaderIds = mainItemId2BoqHeaderIds.get(item.ConHeaderFk);
								if (!Array.isArray(contract2BoqHeaderIds)) {
									contract2BoqHeaderIds = [];
									mainItemId2BoqHeaderIds.set(item.ConHeaderFk, contract2BoqHeaderIds);
								}
								if (!includes(contract2BoqHeaderIds, item.ConBoqHeaderFk)) {
									contract2BoqHeaderIds.push(item.ConBoqHeaderFk);
								}
							}
						}
					}
				}
			}
		});

		if (boqType === 1 && wicGroupIds.length > 0 && selectedWicGroupId) { // if the selected Wic Group is not defined in the master restriction and master restriction has value with copy type wic group, no boq shows.
			const isWicGroupIdIncluded = includes(wicGroupIds, selectedWicGroupId);
			if (!isWicGroupIdIncluded) {
				mainItemId2BoqHeaderIds = new Map<number, number[]>();
				wicGroupIds.forEach((groupId) => {
					mainItemId2BoqHeaderIds?.set(groupId, [-1]);
				});
				mainItemId2BoqHeaderIds.set(selectedWicGroupId, [-1]);
			}
		} else if (boqType === 4 && isArray(projectIds) && projectIds.length > 0 && selectedProjectId) { // if the seleced Project is not defined in the master restriction and master restriction has value with copy type project or package, no boq shows.
			const isProjectIdIncluded = includes(projectIds, selectedProjectId);
			if (!isProjectIdIncluded) {
				packageIds = [-1];
			}
		} else if (boqType === 7 && isArray(projectIds) && projectIds.length > 0 && selectedProjectId) {
			const isProjectIdIncluded2 = includes(projectIds, selectedProjectId);
			if (!isProjectIdIncluded2) {
				contractIds = [-1];
			}
		}

		if (boqType === 2) {
			if (selectedProjectId && !projectIds.includes(selectedProjectId)) {
				mainItemId2BoqHeaderIds = mainItemId2BoqHeaderIds ? mainItemId2BoqHeaderIds : new Map<number, number[]>();
				const project2BoqHeaderId = mainItemId2BoqHeaderIds.get(selectedProjectId);
				if (mainItemId2BoqHeaderIds && project2BoqHeaderId) {
					mainItemId2BoqHeaderIds.delete(selectedProjectId);
				}
				const parentSelected = this.packageService.getSelectedEntity();
				if ((projectIds.length > 0 && !projectIds.includes(selectedProjectId)) || (projectIds.length === 0 && parentSelected && parentSelected.ProjectFk !== selectedProjectId)) {
					// todo chi: common logic is not available
					// boqMainLookupFilterService.filterCleared.fire();
					selectedProjectId = 0;
					// boqMainLookupFilterService.setSelectedProject(null);
					// boqMainLookupFilterService.boqHeaderLookupFilter.projectId = 0;
				}
			}
		}

		isFilterCaseChanged = this.getIsFilterCaseChanged({
			wicGroupIds: wicGroupIds,
			oriWicGroupIds: oriWicGroupIds,
			projectIds: projectIds,
			oriProjectIds: oriProjectIds,
			packageIds: packageIds,
			oriPackageIds: oriPackageIds,
			materialCatalogIds: materialCatalogIds,
			oriMaterialCatalogIds: oriMaterialCatalogIds,
			contractIds: contractIds,
			oriContractIds: oriContractIds,
			mainItemId2BoqHeaderIds: mainItemId2BoqHeaderIds,
			oriMainItemId2BoqHeaderIds: oriMainItemId2BoqHeaderIds
		});

		if (isFilterCaseChanged) {
			// todo chi: common logic is not available
			// boqMainLookupFilterService.setSelectedProject(null);
			// boqMainLookupFilterService.boqHeaderLookupFilter.projectId = 0;
			// boqMainLookupFilterService.setSelectedBoqHeader(null);
		}

		// todo chi: common logic is not available
		// boqMainLookupFilterService.setSelectedWicGroupIds(wicGroupIds);
		// boqMainLookupFilterService.setSelectedProjectIds(projectIds);
		// boqMainLookupFilterService.setSelectedPackageIds(packageIds);
		// boqMainLookupFilterService.setSelectedMaterialCatalogIds(materialCatalogIds);
		// boqMainLookupFilterService.setSelectedMainItemId2BoqHeaderIds(mainItemId2BoqHeaderIds);
		// boqMainLookupFilterService.setSelectedContractIds(contractIds);
	}


	private getIsFilterCaseChanged(filter: IBoqFilterInfo) {
		let isFilterCaseChanged = false;
		if (!filter) {
			return isFilterCaseChanged;
		}

		const wicGroupIds = filter.wicGroupIds;
		const oriWicGroupIds = filter.oriWicGroupIds;
		const projectIds = filter.projectIds;
		const oriProjectIds = filter.oriProjectIds;
		const packageIds = filter.packageIds;
		const oriPackageIds = filter.oriPackageIds;
		const materialCatalogIds = filter.materialCatalogIds;
		const oriMaterialCatalogIds = filter.oriMaterialCatalogIds;
		const contractIds = filter.contractIds;
		const oriContractIds = filter.oriContractIds;
		const mainItemId2BoqHeaderIds = filter.mainItemId2BoqHeaderIds;
		const oriMainItemId2BoqHeaderIds = filter.oriMainItemId2BoqHeaderIds;

		let differ = difference(wicGroupIds, oriWicGroupIds);
		if (differ.length === 0) {
			differ = difference(oriWicGroupIds, wicGroupIds);
		}

		isFilterCaseChanged = difference.length > 0;

		if (!isFilterCaseChanged) {
			differ = difference(projectIds, oriProjectIds);
			if (differ.length === 0) {
				differ = difference(oriProjectIds, projectIds);
			}

			isFilterCaseChanged = difference.length > 0;
		}

		if (!isFilterCaseChanged) {
			differ = difference(packageIds, oriPackageIds);
			if (differ.length === 0) {
				differ = difference(oriPackageIds, packageIds);
			}

			isFilterCaseChanged = differ.length > 0;
		}

		if (!isFilterCaseChanged) {
			differ = difference(materialCatalogIds, oriMaterialCatalogIds);
			if (differ.length === 0) {
				differ = difference(oriMaterialCatalogIds, materialCatalogIds);
			}

			isFilterCaseChanged = differ.length > 0;
		}

		if (!isFilterCaseChanged) {
			differ = difference(contractIds, oriContractIds);
			if (differ.length === 0) {
				differ = difference(oriContractIds, contractIds);
			}

			isFilterCaseChanged = differ.length > 0;
		}

		if (!isFilterCaseChanged) {
			if ((mainItemId2BoqHeaderIds && !oriMainItemId2BoqHeaderIds) || (!mainItemId2BoqHeaderIds && oriMainItemId2BoqHeaderIds)) {
				isFilterCaseChanged = true;
			} else if (mainItemId2BoqHeaderIds && oriMainItemId2BoqHeaderIds) {
				for (const [key, value] of mainItemId2BoqHeaderIds) {
					if (!oriMainItemId2BoqHeaderIds.has(key)) {
						isFilterCaseChanged = true;
						break;
					} else {
						const boqHeaderIds = value;
						const oriBoqHeaderIds = oriMainItemId2BoqHeaderIds.get(key) || [];
						differ = difference(boqHeaderIds, oriBoqHeaderIds);
						if (differ.length === 0) {
							differ = difference(oriBoqHeaderIds, boqHeaderIds);
						}

						isFilterCaseChanged = differ.length > 0;

						if (isFilterCaseChanged) {
							break;
						}
					}
				}
			}
		}

		return isFilterCaseChanged;
	}

	private updateLookupData(loaded: IMasterRestrictionLoadedEntity) {
		if (loaded.PrcPackage) {
			loaded.PrcPackage.forEach((item) => {
				const entity = this.packageLookups.get(item.Id);
				if (entity) {
					extend(entity, item);
				} else {
					this.packageLookups.set(item.Id, item);
				}
			});
		}

		if (loaded.PrjBoq) {
			loaded.PrjBoq.forEach((item) => {
				const entity = this.prjBoqLookups.get(item.Id);
				if (entity) {
					extend(entity, item);
				} else {
					this.prjBoqLookups.set(item.Id, item);
				}
			});
		}

		if (loaded.conheaderview) {
			loaded.conheaderview.forEach((item) => {
				const entity = this.contractLookups.get(item.Id);
				if (entity) {
					extend(entity, item);
				} else {
					this.contractLookups.set(item.Id, item);
				}
			});
		}
	}

	public override isParentFn(parentKey: IPrcPackageEntity, entity: IPrcPacMasterRestrictionEntity): boolean {
		return parentKey.Id === entity.PrcPackageFk;
	}

	private cacheBoqHeaderLookupData(boqRootItemLookupData: IBoqHeaderLookupEntity[], lookupService: UiCommonLookupEndpointDataService<IBoqHeaderLookupEntity, IPrcPacMasterRestrictionEntity>) {
		boqRootItemLookupData.forEach(function(b) {
			b.Id = b.BoqHeaderFk;
			b.BoqHeaderFk = null;
		});
		lookupService.cache.setItems(boqRootItemLookupData);
	}
}