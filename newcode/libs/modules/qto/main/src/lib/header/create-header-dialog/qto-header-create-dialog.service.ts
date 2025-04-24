/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { QtoMainHeaderCreationConfigEntity } from '../../model/qto-main-header-creation-config-entity.class';
import { QtoMainHeaderCreationEntity } from '../../model/qto-main-header-creation-entity.class';
import { EntityRuntimeData, ValidationInfo } from '@libs/platform/data-access';
import {
	createLookup,
	FieldType,
	FieldValidationInfo,
	FormRow,
	IEditorDialogResult,
	IFieldValueChangeInfo,
	IFormConfig,
	ILookupContext,
	ILookupEvent,
	ServerSideFilterValueType,
	UiCommonFormDialogService,
	UiCommonLookupDataFactoryService,
} from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { map, firstValueFrom } from 'rxjs';
import { PrcContractHeader, QtoHeaderProcurementContractLookupDialogService } from '../../services/lookup-service/qto-header-procurement-contract-lookup-dialog.service';
import { IEntityContext, PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedClerkLookupService, BasicsSharedDataValidationService, BasicsSharedRubricCategoryByRubricAndCompanyLookupService, Rubric } from '@libs/basics/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { ProcurementPackageLookupService } from '@libs/procurement/shared';
import { IProcurementPackageLookupEntity } from '@libs/basics/interfaces';
import { QtoMainHeaderGridDataService } from '../qto-main-header-grid-data.service';
import { IBoqHeaderEntity } from '@libs/boq/interfaces';
import {
	QtoShareBoqType, QtoShareSalesContractLookupService,
	QtoTargetTypeEntity,
	QtoTargetTypeLookupService,
	QtoTypeEntity,
	QtoTypeLookupService, SalesContractsEntity
} from '@libs/qto/shared';
import { IQtoMainHeaderGridEntity } from '../../model/qto-main-header-grid-entity.class';
import { QtoMainProjectBoqExtendedLookupService } from '../../services/lookup-service/qto-main-project-boq-extended-lookup.service';

/**
 * prcpackage2header info get by api: getSubPackage
 */
export interface IPrcPackage2HeaderInfo {
	Id: number;
	PrcHeaderFk: number;
}

export interface IBoqLookupInfo {
	Id: number;
	BoqHeaderFk?: number;
}

/**
 * create qto header dialog service
 */
@Injectable({
	providedIn: 'root',
})
export class QtoHeaderCreateDialogService {
	private translateService = inject(PlatformTranslateService);
	private configurationService = inject(PlatformConfigurationService);
	public formDialogService = inject(UiCommonFormDialogService);
	public lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	protected http = inject(HttpClient);

	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected dataService = inject(QtoMainHeaderGridDataService);

	private apiUrl = this.configurationService.webApiBaseUrl + 'qto/main/header/preparedatabeforecreateqtoheader';

	private runtimeInfo: EntityRuntimeData<QtoMainHeaderCreationEntity> = {
		readOnlyFields: [],
		validationResults: [],
		entityIsReadOnly: false,
	};

	private hasCodeGenerated: boolean = false;
	private hasPinnedProject: boolean = false;

	public createQtoHeader() {
		this.http
			.get(this.apiUrl)
			.pipe(
				map((response) => {
					//TODO: missing => cloudDesktopSidebarService, projectContextId -lnt
					//TODO: missing => ClerkFk, get by project id, if has no projectid, should get by userId -lnt
					return response as QtoMainHeaderCreationConfigEntity;
				}),
			)
			.subscribe((e) => {
				this.showCreationDialog(e);
			});
	}

	/**
	 * show create qto header dialog
	 * @param config
	 */
	private showCreationDialog(config: QtoMainHeaderCreationConfigEntity): void {
		this.hasCodeGenerated = config.HasCodeGenerated;
		this.hasPinnedProject = config.ProjectFk > 0;

		const entity: QtoMainHeaderCreationEntity = {
			BasRubricCategoryFk: config.BasRubricCategoryFk,
			QtoTargetType: config.DefaultQtoPurposeType?.Id ?? 0,
			QtoType: config.QtoTypeFk,
			BasGoniometerTypeFk: config.BasGoniometerTypeFk,
			Code: this.hasCodeGenerated ? this.translateService.instant('cloud.common.isGenerated').text : '',
			ProjectFk: config.ProjectFk,
			ClerkFk: config.ClerkFk,
			IsGenerated: this.hasCodeGenerated,
		};

		this.formDialogService
			.showDialog<QtoMainHeaderCreationEntity>({
				id: 'create-QTO-dialog',
				headerText: 'Create Quantity Takeoff Header',
				formConfiguration: this.createFormCfg,
				entity: entity,
				runtime: this.runtimeInfo,
				customButtons: [],
			})
			?.then((result: IEditorDialogResult<QtoMainHeaderCreationEntity>) => {
				if (result.closingButtonId === 'ok' && result.value) {
					//TODO: missing canCreate logic -lnt
					//TODO: missing disable Ok button logic -lnt
					this.dataService.setCreateInfo(result.value);
					this.dataService.create();
				}
			});
	}

	private createFormCfg: IFormConfig<QtoMainHeaderCreationEntity> = {
		formId: 'qto.main.createQtoHeaderDialog',
		showGrouping: false,
		groups: [
			{
				groupId: 'baseGroup',
			},
		],
		rows: [
			{
				id: 'QtoTargetType',
				type: FieldType.Lookup,
				label: {
					text: 'QTO Purpose',
					key: 'qto.main.QtoTargetType',
				},
				model: {
					getValue(obj: QtoMainHeaderCreationEntity): number | undefined {
						return obj.QtoTargetType;
					},
					setValue(obj: QtoMainHeaderCreationEntity, value: number) {
						obj.QtoTargetType = value;
						obj.PrcBoqFk = null;
						obj.PrjBoqFk = null;
						//TODO: missing => onSelectedQtoTargetTypeChanged, form-config-updated not ready -lnt
					},
				},
				required: true,
				groupId: 'baseGroup',
				lookupOptions: createLookup<QtoMainHeaderCreationEntity, QtoTargetTypeEntity>({
					dataServiceToken: QtoTargetTypeLookupService,
					descriptionMember: 'Description',
				}),
				change: (info: IFieldValueChangeInfo<QtoMainHeaderCreationEntity>) => {
					this.setRowsVisable(this.createFormCfg.rows, info.newValue as number);
				},
			},
			{
				id: 'QtoType',
				type: FieldType.Lookup,
				label: {
					text: 'Qto Type',
					key: 'qto.main.qtoTypeFk',
				},
				model: 'QtoType',
				required: true,
				groupId: 'baseGroup',
				lookupOptions: createLookup<QtoMainHeaderCreationEntity, QtoTypeEntity>({
					dataServiceToken: QtoTypeLookupService,
					showDescription: false,
					descriptionMember: 'DescriptionInfo',
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e) => {
								if (e.context.entity && e.context.lookupInput?.selectedItem) {
									e.context.entity.BasRubricCategoryFk = e.context.lookupInput.selectedItem.BasRubricCategoryFk;
									e.context.entity.BasGoniometerTypeFk = e.context.lookupInput.selectedItem.BasGoniometerTypeFk;
								}
							},
						},
					],
				}),
			},
			{
				id: 'BasRubricCategoryFk',
				type: FieldType.Lookup,
				label: {
					text: 'Rubric Category',
					key: 'qto.main.BasRubricCategoryFk',
				},
				model: 'BasRubricCategoryFk',
				required: true,
				groupId: 'baseGroup',
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
					serverSideFilter: {
						key: 'qto-main-rubric-category-lookup-filter',
						execute() {
							return {
								Rubric: Rubric.QTO,
							};
						},
					},
				}),
			},
			{
				id: 'ProjectFk',
				type: FieldType.Lookup,
				label: {
					text: 'Project',
					key: 'cloud.common.entityProject',
				},
				model: 'ProjectFk',
				required: true,
				readonly: this.hasPinnedProject,
				groupId: 'baseGroup',
				lookupOptions: createLookup<QtoMainHeaderCreationEntity, IProjectEntity>({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					descriptionMember: 'ProjectNo',
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e) => {
								if (e.context.entity && e.context.lookupInput?.selectedItem?.ClerkFk) {
									e.context.entity.ClerkFk = e.context.lookupInput.selectedItem.ClerkFk;
								}
							},
						},
					],
				}),
				validator: (info) => {
					return this.validateMandatory(info, 'ProjectFk');
				},
			},
			{
				id: 'Code',
				type: FieldType.Code,
				label: {
					text: 'Code',
					key: 'cloud.common.entityCode',
				},
				model: 'Code',
				required: true,
				groupId: 'baseGroup',
				validator: (info) => {
					return this.validateMandatory(info, 'Code');
				},
				readonly: this.hasCodeGenerated,
			},
			{
				id: 'Description',
				type: FieldType.Description,
				label: {
					text: 'Description',
					key: 'cloud.common.entityDescription',
				},
				model: 'Description',
				required: true,
				groupId: 'baseGroup',
			},
			{
				id: 'ConHeaderFk',
				type: FieldType.Lookup,
				label: {
					key: 'qto.main.ConHeaderFk',
					text: 'Contract / PO',
				},
				model: 'ConHeaderFk',
				required: true,
				groupId: 'baseGroup',
				lookupOptions: createLookup<QtoMainHeaderCreationEntity, PrcContractHeader>({
					serverSideFilter: {
						key: 'qto-main-create-header-procurment-contract-filter',
						execute: (context: IEntityContext<QtoMainHeaderCreationEntity>) => {
							return {
								ProjectFk: context.entity?.ProjectFk,
								FilterOutByPrjChangeStatus: true,
							};
						},
					},
					dataServiceToken: QtoHeaderProcurementContractLookupDialogService,
					showDescription: true,
					descriptionMember: 'Description',
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e) => {
								void this.onConHeaderFkChanged(e);
							},
						},
					],
				}),
			},
			{
				id: 'OrdHeaderFk',
				type: FieldType.Lookup,
				label: {
					key: 'qto.main.OrdHeaderFk',
					text: 'Contract',
				},
				model: 'OrdHeaderFk',
				required: true,
				groupId: 'baseGroup',
				visible: false,
				lookupOptions: createLookup<QtoMainHeaderCreationEntity, SalesContractsEntity>({
					serverSideFilter: {
						key: 'qto-main-header-sales-contract-filter',
						execute: (context: IEntityContext<QtoMainHeaderCreationEntity>) => {
							const companyId = this.configurationService.clientId;
							const searchString = '(CompanyFk=' + companyId + ')';
							if (context.entity?.ProjectFk) {
								return {
									Filters: searchString + ' AND (ProjectFk=' + context.entity.ProjectFk + ' AND OrdHeaderFk = null)',
								};
							} else {
								return { Filters: '' };
							}
						},
					},
					dataServiceToken: QtoShareSalesContractLookupService,
					showDescription: true,
					descriptionMember: 'Description',
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e) => {
								if (e.context.entity && e.context.lookupInput?.selectedItem) {
									const selectedItem = e.context.lookupInput.selectedItem;
									e.context.entity.BusinessPartnerFk = selectedItem.BusinesspartnerFk;
									e.context.entity.PrcStructureFk = selectedItem.PrcStructureFk;
									e.context.entity.ContractCode = selectedItem.Code;
									e.context.entity.ClerkFk = selectedItem.ClerkFk ? selectedItem.ClerkFk : e.context.entity.ClerkFk;
								}
							},
						},
					],
				}),
			},
			{
				id: 'PackageFk',
				type: FieldType.Lookup,
				label: {
					text: 'Package',
					key: 'qto.main.Package',
				},
				model: 'PackageFk',
				required: true,
				groupId: 'baseGroup',
				lookupOptions: createLookup({
					dataServiceToken: ProcurementPackageLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description',
					serverSideFilter: {
						key: 'qto-main-header-package-filter',
						execute(context: ILookupContext<IProcurementPackageLookupEntity, QtoMainHeaderCreationEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
							const targetProjectId = context.entity?.ProjectFk;
							return {
								ProjectFk: targetProjectId,
							};
						},
					},
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e) => {
								if (e.context.entity && e.context.lookupInput?.selectedItem) {
									if (e.context.entity.ConHeaderFk) {
										// has package contract
										if (!e.context.entity.ClerkFk) {
											e.context.entity.ClerkFk = e.context.lookupInput.selectedItem.ClerkPrcFk;
										}
									} else {
										if (e.context.lookupInput.selectedItem.ClerkPrcFk) {
											e.context.entity.ClerkFk = e.context.lookupInput.selectedItem.ClerkPrcFk;
										}
									}

									void this.autoAssignPackage2HeaderFk(e.context.entity);
								}
							},
						},
					],
				}),
				validator: (info) => {
					return this.validateMandatory(info, 'PackageFk');
				},
			},
			{
				id: 'Description',
				type: FieldType.Description,
				label: {
					text: 'Description',
				},
				model: 'Description',
				groupId: 'baseGroup',
			},
			{
				//TODO: missing => procurement-package-package2-header-combobox will be handled by cici -lnt
				id: 'Package2HeaderFK',
				type: FieldType.Integer,
				label: {
					text: 'Package2HeaderFK',
				},
				model: 'Package2HeaderFK',
				required: true,
				groupId: 'baseGroup',
				validator: (info) => {
					return this.validateMandatory(info, 'Package2HeaderFK');
				},
			},
			{
				//TODO: missing => procurement-common-prc-boq-extended-Lookup will be handled by cici -lnt
				id: 'PrcBoqFk',
				type: FieldType.Integer,
				label: {
					text: 'PrcBoqFk',
				},
				model: 'PrcBoqFk',
				required: true,
				groupId: 'baseGroup',
				validator: (info) => {
					return this.validateBoqHeaderFk(info, 'PrcBoqFk');
				},
			},
			{
				id: 'PrjBoqFk',
				type: FieldType.Lookup,
				label: {
					text: 'PrjBoqFk',
					key: 'qto.main.PrcBoq',
				},
				model: 'PrjBoqFk',
				groupId: 'baseGroup',
				lookupOptions: createLookup<QtoMainHeaderCreationEntity, IBoqHeaderEntity>({
					serverSideFilter: {
						key: 'qto-main-project-boq-filter',
						execute: (context: IEntityContext<QtoMainHeaderCreationEntity>) => {
							if (context.entity?.OrdHeaderFk) {
								return {
									OrdHeaderFk: context.entity.OrdHeaderFk,
								};
							} else {
								return {
									PrjProjectFk: 'PrjProjectFk=' + context.entity?.ProjectFk,
								};
							}
						},
					},
					dataServiceToken: QtoMainProjectBoqExtendedLookupService,
					showDescription: true,
					descriptionMember: 'Description',
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e) => {
								if (e.context.entity) {
									const selectedItem = e.context.lookupInput?.selectedItem;
									e.context.entity.BoqHeaderFk = selectedItem ? selectedItem.BoqHeaderFk : null;
								}
							},
						},
					],
				}),
				validator: (info) => {
					return this.validateBoqHeaderFk(info, 'PrjBoqFk');
				},
				visible: false,
			},
			{
				id: 'ClerkFk',
				type: FieldType.Lookup,
				label: {
					text: 'Clerk',
					key: 'qto.main.customerCode',
				},
				model: 'ClerkFk',
				groupId: 'baseGroup',
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: true,
					descriptionMember: 'Description',
				}),
			},
		],
	};

	private setRowsVisable(rows: FormRow<QtoMainHeaderCreationEntity>[], qtoTargetType: number) {
		if (qtoTargetType === 2) {
			rows.forEach((row) => {
				row.visible = ['ProjectFk', 'QtoTargetType', 'QtoType', 'BasRubricCategoryFk', 'PrjBoqFk', 'ClerkFk', 'Code', 'Description', 'OrdHeaderFk'].indexOf(row.model as string) >= 0;
			});
		} else if (qtoTargetType === 3) {
			rows.forEach((row) => {
				row.visible = !(row.model === 'PrjBoqFk' || row.model === 'OrdHeaderFk' || row.model === 'ConHeaderFk');
			});
		} else if (qtoTargetType === 4) {
			rows.forEach((row) => {
				row.visible = ['ProjectFk', 'QtoTargetType', 'QtoType', 'BasRubricCategoryFk', 'PrjBoqFk', 'ClerkFk', 'Code', 'Description'].indexOf(row.model as string) >= 0;
			});
		} else {
			rows.forEach((row) => {
				row.visible = !(row.model === 'PrjBoqFk' || row.model === 'OrdHeaderFk');
			});
		}
	}

	private async onProjectFkChanged(e: ILookupEvent<IProjectEntity, QtoMainHeaderCreationEntity>) {
		const item = e.context.entity;
		const selectedItem = e.context.lookupInput?.selectedItem;
		if (item && selectedItem) {
			// set the clerk
			const prjSharedLookupService = e.context.injector.get(ProjectSharedLookupService);
			const projectList = (await firstValueFrom(prjSharedLookupService.getList())) as IProjectEntity[];
			void this.setClerkFkByProjectId(item, selectedItem.Id, projectList);

			// set as null, when change project
			item.OrdHeaderFk = null;
			item.ConHeaderFk = null;
			item.PackageFk = null;

			// set defualt package by project
			const prcPackageLookupService = e.context.injector.get(ProcurementPackageLookupService);
			const prcPackageList = (await firstValueFrom(prcPackageLookupService.getList())) as IProcurementPackageLookupEntity[];
			const filterItems = prcPackageList.filter((item) => item.ProjectFk === selectedItem?.Id);
			if (filterItems && filterItems.length === 1) {
				item.PackageFk = filterItems[0].Id;

				void this.autoAssignPackage2HeaderFk(item);
				this.updateReadonly('Package2HeaderFK', !!item.PackageFk);
			}

			this.autoAssignProjectBoq(item);
		}
	}

	private async setClerkFkByProjectId(item: QtoMainHeaderCreationEntity, projectId: number, projectList: IProjectEntity[]) {
		let matchProject = projectList.length > 0 ? projectList.find((item) => item.Id === projectId) : null;
		if (!matchProject) {
			const postData = {
				ProjectContextId: projectId,
			};
			const url = this.configurationService.webApiBaseUrl + 'project/main/GetProjectOfBPContract';
			const items = (await firstValueFrom(this.http.post(url, postData))) as IProjectEntity[];
			if (items && items.length > 0) {
				matchProject = items.find((item) => item.Id === projectId);
			}
		}

		if (matchProject) {
			item.ClerkFk = matchProject.ClerkFk;
		}
	}

	private async autoAssignPackage2HeaderFk(item: QtoMainHeaderCreationEntity) {
		const url = this.configurationService.webApiBaseUrl + 'procurement/package/prcpackage2header/getSubPackage?prcPackage=' + item.PackageFk + '&projectId=' + item.ProjectFk;
		const PrcPackage2Headers = (await firstValueFrom(this.http.get(url))) as IPrcPackage2HeaderInfo[];
		if (PrcPackage2Headers && PrcPackage2Headers.length > 0) {
			// validate packageFK before set the subPackage
			//TODO: not sure how to do vilidation for form - lnt
			//qtoMainHeaderValidationService.validatePackageFk(item, item.PackageFk, 'PackageFk');
			item.Package2HeaderFK = PrcPackage2Headers[0].Id;
			item.PrcHeaderFkOriginal = PrcPackage2Headers[0].PrcHeaderFk;
			this.updateReadonly('PrcBoqFk', !!item.Package2HeaderFK);
			//TODO: not sure how to do vilidation for form - lnt
			//qtoMainHeaderValidationService.validatePackage2HeaderFK(item, item.Package2HeaderFK, 'Package2HeaderFK');
			if (item.ConHeaderFk) {
				void this.checkConHeaderFk(item, item.ConHeaderFk);
			}
		} else if (item.ConHeaderFk) {
			this.updateReadonly('PackageFk', !!item.PackageFk);
			this.updateReadonly('PrcBoqFk', !!item.Package2HeaderFK);
		}
	}

	private async checkConHeaderFk(entity: QtoMainHeaderCreationEntity, value: number) {
		entity.PrcBoqFk = null;
		const contractBoqHeaderIds = await this.dataService.getContractBoqHeaderId(value);
		if (contractBoqHeaderIds.length > 0) {
			entity.BoqHeaderFk = contractBoqHeaderIds[0];
			this.updateReadonly('PrcBoqFk', !!entity.Package2HeaderFK);

			// If there is only one BOQ, automatically assigned
			const boqInfo = (await this.dataService.getBoqReferenceNo(true)) as IBoqLookupInfo[];
			if (boqInfo && boqInfo.length === 1) {
				entity.BoqHeaderFk = boqInfo[0].BoqHeaderFk ? boqInfo[0].BoqHeaderFk : entity.BoqHeaderFk;
				entity.PrcBoqFk = boqInfo[0].Id;
				entity.BoqHeaderFk = boqInfo[0].BoqHeaderFk ? boqInfo[0].BoqHeaderFk : entity.BoqHeaderFk;
				//TODO: not sure how to do vilidation for form - lnt
				//qtoMainHeaderValidationService.validatePrcBoqFk(entity, entity.PrcBoqFk, 'PrcBoqFk');
			}
		}
	}

	private autoAssignProjectBoq(item: QtoMainHeaderCreationEntity) {
		//TODO: missing, the qto boq not ready -lnt
	}

	private async onConHeaderFkChanged(e: ILookupEvent<PrcContractHeader, QtoMainHeaderCreationEntity>) {
		if (e.context.entity && e.context.lookupInput?.selectedItem) {
			e.context.entity.BusinessPartnerFk = e.context.lookupInput.selectedItem.BusinessPartnerFk;
			e.context.entity.Package2HeaderFK = e.context.lookupInput.selectedItem.Package2HeaderFk;
			e.context.entity.PrcStructureFk = e.context.lookupInput.selectedItem.PrcStructureFk;
			e.context.entity.PrcHeaderFk = e.context.lookupInput.selectedItem.PrcHeaderFk;
			e.context.entity.ContractCode = e.context.lookupInput.selectedItem.Code;
			e.context.entity.PrcCopyModeFk = e.context.lookupInput.selectedItem.PrcCopyModeFk;
			if (e.context.lookupInput.selectedItem.ClerkPrcFk) {
				e.context.entity.ClerkFk = e.context.lookupInput.selectedItem.ClerkPrcFk;
			}

			// refresh the package lookup
			e.context.entity.PackageFk = e.context.lookupInput.selectedItem.PackageFk;
			const packageLookupService = e.context.injector.get(ProcurementPackageLookupService);
			const packageList = (await firstValueFrom(packageLookupService.getList())) as IProcurementPackageLookupEntity[];
			const itemPackage = packageList.find((item) => item.Id === e.context.entity?.PackageFk);
			if (!itemPackage) {
				packageLookupService.cache.clear();
			}

			//TODO: missing => create collect prc boq info logic -lnt
			// const selectedItemId = e.context.lookupInput.selectedItem.Id;
			// const response = await firstValueFrom(this.http.get(this.configurationService.webApiBaseUrl + 'procurement/contract/masterrestriction/list?mainItemId='+ selectedItemId));

			void this.autoAssignPackage2HeaderFk(e.context.entity);
		}
	}

	private updateReadonly(model: string, value: boolean) {
		for (let i = 0; i < this.createFormCfg.rows.length; i++) {
			const row = this.createFormCfg.rows[i];
			if (row.model === model) {
				row.readonly = value;
				break;
			}
		}
	}

	private validateMandatory(info: FieldValidationInfo<QtoMainHeaderCreationEntity>, field: string) {
		const value = info.value === 0 ? undefined : info.value;

		return this.validationUtils.isMandatory(new ValidationInfo<QtoMainHeaderCreationEntity>(info.entity, value, field));
	}

	private async validateBoqHeaderFk(info: FieldValidationInfo<QtoMainHeaderCreationEntity>, field: string) {
		let result = this.validationUtils.isMandatory(new ValidationInfo<QtoMainHeaderCreationEntity>(info.entity, info.value, field));
		if (result.valid) {
			const postParam = {
				BoqHeaderId: info.entity.BoqHeaderFk,
				QtoTargetTypeId: info.entity.QtoTargetType,
				qtoBoqType: QtoShareBoqType.QtoBoq,
			};
			const url = this.configurationService.webApiBaseUrl + 'qto/main/header/getqtoheaderbyboqheaderid';
			const res = (await firstValueFrom(this.http.post(url, postParam))) as IQtoMainHeaderGridEntity;
			if (res) {
				result = this.validationUtils.createErrorObject({
					key: 'qto.main.existWqAqQtoByBoq',
				});
			}
		}

		return result;
	}
}
