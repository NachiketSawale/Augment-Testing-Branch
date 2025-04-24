/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, IDialogErrorInfo, IFormConfig, IFormDialogConfig, ILookupEvent, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsSharedSyncProjectToBim360Service } from './sync-project-to-bim360.service';
import { IBasicsSyncProjectToBim360DialogModel } from '../model/entities/dialog/sync-project-to-bim360-dialog-model.interface';
import { IProjectEntity } from '@libs/project/interfaces';
import { IInitializationContext } from '@libs/platform/common';
import { format } from 'date-fns';
import { BasicsSharedBim360SyncProjectParamsService } from './sync-project-params.service';
import { IBasicsSyncProjectToBim360DialogData } from '../model/entities/dialog/sync-project-to-bim360-dialog-data.interface';
import { BasicsBim360ResponseStatusCode } from '../model/enums/basics-bim360-response-status-code.enum';
import { BasicsSharedBim360HelperService } from './basics-shared-bim360-helper.service';
import { IBasicsBim360SourceUserEntity } from '../model/entities/basics-bim360-source-user-entity.interface';
import { IBasicsBim360SourceProjectEntity } from '../model/entities/basics-bim360-source-project-entity.interface';
import { IBasicsBim360ParamSelectItem } from '../lookup/entities/basics-bim360-param-select-item.interface';
import { BasicsSharedBim360ServiceTypeLookupService } from '../lookup/basics-bim360-service-type-lookup.service';
import { EntityRuntimeData, ValidationResult } from '@libs/platform/data-access';
import { IBasicsBim360CreateProjectEntity, IBasicsBim360CreateProjectUserEntity } from '../model/entities/basics-bim360-createproject-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSyncProjectToBim360DialogService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly syncService = inject(BasicsSharedSyncProjectToBim360Service);
	private readonly paramsService = inject(BasicsSharedBim360SyncProjectParamsService);
	private readonly helperService = inject(BasicsSharedBim360HelperService);
	private context!: IInitializationContext;
	private formRuntimeInfo: EntityRuntimeData<IBasicsSyncProjectToBim360DialogModel> = {
		readOnlyFields: [],
		validationResults: [],
		entityIsReadOnly: false,
	};

	private model: IBasicsSyncProjectToBim360DialogModel | undefined;
	private data: IBasicsSyncProjectToBim360DialogData | undefined;

	private get translate() {
		return this.context.translateService;
	}

	public get Model(): IBasicsSyncProjectToBim360DialogModel {
		if (!this.model) {
			this.model = {
				projectTypeId: undefined,
				languageId: undefined,
				projectTemplateId: undefined,
				assignProjectAdminId: undefined,
				activeServiceIds: [],
			};
		}
		return this.model;
	}

	public get Data(): IBasicsSyncProjectToBim360DialogData {
		if (!this.data) {
			this.data = {
				usersItems: [],
				projectTemplateItems: [],

				usersItemsSource: [],
				projectTemplateItemsSource: [],
			};
		}
		return this.data;
	}

	public async showDialog(projectData: IProjectEntity | null, context: IInitializationContext, service: BasicsSharedSyncProjectToBim360DialogService) {
		service.data = undefined; //clear data.
		service.model = undefined;
		if (!projectData || !projectData.ProjectName) {
			service.messageBoxService.showErrorDialog('project.main.autodesk.projectNameIsNullError');
			return;
		}
		if (!projectData || !projectData.StartDate || !projectData.EndDate) {
			service.messageBoxService.showErrorDialog('project.main.autodesk.startDateOrFinishDataIsNullError');
			return;
		}
		service.context = context;
		service.Model.projectData = projectData;
		service.Model.StartDate = format(new Date(projectData.StartDate), 'yyyy-MM-dd');
		service.Model.EndDate = format(new Date(projectData.EndDate), 'yyyy-MM-dd');
		service.Model.activeServiceIds = service.paramsService.getServiceTypes().map((s) => s.id); //Fill with all service types.

		service.syncService.initProjectData$(service.Model).subscribe({
			next: (response) => {
				service.Model.paramsInfo = response.paramsInfo;

				// users.
				if (response.usersInfo?.ResultMsg) {
					const items = JSON.parse(response.usersInfo?.ResultMsg) as unknown as IBasicsBim360SourceUserEntity[];
					service.Data.usersItemsSource = items;
					items.forEach((item) => {
						service.Data.usersItems?.push(service.helperService.toUserSelectItem(item));
					});
				}

				//project template.
				if (response.projectsInfo?.ResultMsg) {
					const items = JSON.parse(response.projectsInfo?.ResultMsg) as unknown as IBasicsBim360SourceProjectEntity[];
					service.Data.projectTemplateItemsSource = items;
					service.Data.projectTemplateItems?.push({ Id: 0, id: '', displayName: '' }); // no template selected.
					items.forEach((item) => {
						service.Data.projectTemplateItems?.push(service.helperService.toProjectSelectItem(item));
					});
				}
			},
			error: (err) => {
				if (err && err.error) {
					service.messageBoxService.showErrorDialog(err.error as IDialogErrorInfo);
				} else {
					service.messageBoxService.showErrorDialog(err);
				}
			},
		});

		const formDialogConfig: IFormDialogConfig<IBasicsSyncProjectToBim360DialogModel> = {
			id: 'synchronize.project.to.bim360',
			headerText: { text: 'Synchronize RIB 4.0 Project to BIM 360', key: 'project.main.autodesk.postProjectToAutodesk360BimTitle' },
			entity: service.Model,
			runtime: service.formRuntimeInfo,
			formConfiguration: service.createFormConfiguration(),
			//resizeable:true, //todo-Any: doesn't support?
			//buttons: //todo-Any: should enable/disable ok button here using isOkDisabled(). Wait for Dev-20518.
		};

		const result = await service.formDialogService.showDialog<IBasicsSyncProjectToBim360DialogModel>(formDialogConfig);
		if (result && result.closingButtonId === StandardDialogButtonId.Ok) {
			service.handleOk();
		}
	}

	private createFormConfiguration(): IFormConfig<IBasicsSyncProjectToBim360DialogModel> {
		return {
			formId: 'synchronize-project-to-bim360',
			showGrouping: false,
			addValidationAutomatically: false,

			groups: [{ groupId: 'baseGroup' }],

			rows: [
				{
					groupId: 'baseGroup',
					id: 'ProjectName',
					model: 'projectData.ProjectName',
					label: { key: 'project.main.projectName' },
					type: FieldType.Description,
					sortOrder: 1,
					readonly: true,
				},
				{
					groupId: 'baseGroup',
					id: 'StartDate',
					model: 'StartDate',
					required: true,
					label: { key: 'project.main.autodesk.startDate' },
					type: FieldType.Description,
					sortOrder: 2,
					readonly: true,
				},
				{
					groupId: 'baseGroup',
					id: 'EndDate',
					model: 'EndDate',
					required: true,
					label: { key: 'project.main.autodesk.finishDate' },
					type: FieldType.Description,
					sortOrder: 3,
					readonly: true,
				},
				{
					groupId: 'baseGroup',
					id: 'projectTemplateId',
					model: 'projectTemplateId',
					label: 'project.main.autodesk.projectTemplate',
					sortOrder: 4,
					type: FieldType.Select,
					itemsSource: {
						items: this.Data.projectTemplateItems ?? [],
					},
					change: (changeInfo) => {
						if (changeInfo.newValue !== changeInfo.oldValue) {
							this.projectTemplateChanged();
						}
					},
				},
				{
					groupId: 'baseGroup',
					id: 'projectTypeId',
					model: 'projectTypeId',
					required: true,
					label: 'project.main.autodesk.projectType',
					type: FieldType.Select,
					itemsSource: {
						items: this.paramsService.getProjectTypes(),
					},
					sortOrder: 5,
				},
				{
					groupId: 'baseGroup',
					id: 'languageId',
					model: 'languageId',
					required: true,
					label: 'project.main.autodesk.language',
					type: FieldType.Select,
					itemsSource: {
						items: this.paramsService.getLanguages(),
					},
					sortOrder: 6,
				},
				{
					groupId: 'baseGroup',
					id: 'assignProjectAdminId',
					model: 'assignProjectAdminId',
					required: true,
					label: 'project.main.autodesk.assignProjectAdmin',
					type: FieldType.Select,
					itemsSource: {
						items: this.Data.usersItems ?? [],
					},
					sortOrder: 7,
				},
				{
					groupId: 'baseGroup',
					id: 'activeServiceIds',
					model: 'activeServiceIds', //todo-Any: array is not supported. wait for framework to support it.
					required: true,
					label: 'project.main.autodesk.activateServices',
					sortOrder: 8,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedBim360ServiceTypeLookupService,
						showClearButton: true,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: (e) => {
									const event = e as ILookupEvent<IBasicsBim360ParamSelectItem, IBasicsSyncProjectToBim360DialogModel>;
									const selectedItem = event.selectedItem as IBasicsBim360ParamSelectItem;
									if (selectedItem && event.context.entity) {
										if (!event.context.entity.activeServiceIds.some((id) => id === selectedItem.id)) {
											event.context.entity.activeServiceIds.push(selectedItem.id);
										}
									}
								},
							},
						],
					}),
					validator: () => {
						return this.validateServiceTypes();
					},
				},
			],
		};
	}

	private projectTemplateChanged(): void {
		if (!this.Model.projectTemplateId) {
			this.setTemplateReadonlyFields(false);
			return;
		}
		this.setTemplateReadonlyFields(true);

		this.syncService.loadProjectDataById$(this.Model.projectTemplateId).subscribe({
			next: (response) => {
				if (response.StateCode === BasicsBim360ResponseStatusCode.OK) {
					if (response?.ResultMsg) {
						const source = JSON.parse(response?.ResultMsg) as unknown as IBasicsBim360SourceProjectEntity;
						this.updateFromNewProjectTemplate(source);
						this.serviceTypesChanged();
					}
				} else {
					this.helperService.showErrorMsgDialog(response.ResultMsg ?? '');
				}
			},
			error: (err) => {
				if (err && err.error) {
					this.messageBoxService.showErrorDialog(err.error as IDialogErrorInfo);
				} else {
					this.messageBoxService.showErrorDialog(err);
				}
			},
		});
	}

	private updateFromNewProjectTemplate(source: IBasicsBim360SourceProjectEntity) {
		let serviceTypeIds: string[] = [];
		let language: IBasicsBim360ParamSelectItem | undefined;
		let projectType: IBasicsBim360ParamSelectItem | undefined;
		if (source.service_types) {
			const srcTypes = source.service_types.split(',');
			serviceTypeIds = this.paramsService.getServiceTypesByIds(srcTypes).map((t) => t.id);
		}
		if (source.language) {
			language = this.paramsService.getLanguageById(source.language);
		}
		if (source.project_type) {
			projectType = this.paramsService.getProjectTypeById(source.project_type);
		}
		this.Model.languageId = language?.id ?? '';
		this.Model.projectTypeId = projectType?.id ?? '';
		this.Model.activeServiceIds = serviceTypeIds;
	}

	private setTemplateReadonlyFields(readonly: boolean) {
		this.formRuntimeInfo.readOnlyFields = [
			{
				field: 'projectTypeId',
				readOnly: readonly,
			},
			{
				field: 'languageId',
				readOnly: readonly,
			},
			{
				field: 'activeServiceIds',
				readOnly: readonly,
			},
		];
	}

	private serviceTypesChanged() {
		const validateResult = this.validateServiceTypes();
		this.formRuntimeInfo.validationResults = [{ field: 'activeServiceIds', result: validateResult }];
	}

	private validateServiceTypes() {
		let msg = '';
		const requiredServices = this.paramsService.getRequiredServiceTypes();
		requiredServices.forEach((requiredService) => {
			if (!this.Model.activeServiceIds?.some((id) => id === requiredService.id)) {
				msg += msg ? ' , ' + requiredService.translatedText : requiredService.translatedText;
			}
		});
		if (msg) {
			msg = this.translate.instant('project.main.autodesk.activeServiceNote', { object: msg }).text;
		}
		return new ValidationResult(msg);
	}

	private handleOk() {
		if (!this.Model.projectData || !this.Model.projectData.EndDate) {
			return;
		}
		if (!this.Model.projectTypeId || !this.Model.languageId || !this.Model.assignProjectAdminId || !this.Model.activeServiceIds) {
			return;
		}
		const user = this.Data.usersItemsSource?.find((u) => u.id === this.Model.assignProjectAdminId);
		if (!user) {
			return;
		}
		let serviceTypeIds: string[] = [];
		if (this.Model.activeServiceIds) {
			//collect service type ids in order.
			serviceTypeIds = this.paramsService
				.getServiceTypesByIds(this.Model?.activeServiceIds)
				.sort(this.helperService.getCompareItemFn())
				.map((s) => s.id);
		}
		const userData: IBasicsBim360CreateProjectUserEntity = {
			company_id: user.company_id,
			email: user.email,
			role: user.default_role_id,
			uid: user.id,
			service_type: serviceTypeIds.toString(),
		};
		const projectData = this.Model.projectData;

		if (!projectData.EndDate) {
			return;
		}
		const prjInfo: IBasicsBim360CreateProjectEntity = {
			name: projectData?.ProjectName,
			service_types: serviceTypeIds.toString(),
			start_date: this.Model.StartDate,
			end_date: this.Model.EndDate,
			project_type: this.paramsService.getProjectTypeById(this.Model.projectTypeId)?.id ?? '',
			value: '0',
			currency: this.Model.paramsInfo?.Currency,
			country: this.Model.paramsInfo?.Country,
			job_number: projectData.ProjectNo,
			language: this.paramsService.getLanguageById(this.Model.projectTypeId)?.id ?? '',
			contract_type: this.paramsService.getContractTypeByValue(this.Model.paramsInfo?.Contract) ?? undefined,
			template_project_id: this.Model.projectTemplateId,
		};
		const address = projectData.AddressEntity;
		if (address) {
			prjInfo.address_line_1 = address.Street;
			prjInfo.city = address.City;
			prjInfo.state_or_province = this.Model.paramsInfo?.State;
			prjInfo.postal_code = address.ZipCode;
		}

		this.syncService.saveProjectToBim360$(prjInfo, userData).subscribe({
			next: (response) => {
				const prjSyncInfo = response.prjSynInfo;
				let msg;
				if (prjSyncInfo?.StateCode !== BasicsBim360ResponseStatusCode.Created) {
					msg = this.translate.instant('project.main.autodesk.syncProjectFail').text + '\n' + prjSyncInfo?.ResultMsg;
					this.helperService.showErrorMsgDialog(msg);
					return;
				}
				msg = this.translate.instant('project.main.autodesk.syncProjectSuccess').text;

				const activeServiceInfo = response.activateServiceInfo;
				if (activeServiceInfo) {
					msg += '\n' + this.translate.instant('project.main.autodesk.activeServiceFail').text;
					for (const [key, value] of Object.entries(activeServiceInfo)) {
						msg += key + ' ' + value.ResultMsg + '\n';
					}
				}
				this.helperService.showMsgDialog(msg, '', 'ico-info');
			},
			error: (err) => {
				if (err && err.error) {
					this.messageBoxService.showErrorDialog(err.error as IDialogErrorInfo);
				} else {
					this.messageBoxService.showErrorDialog(err);
				}
			},
		});
	}

	private isOkDisabled() {
		if (!this.Model.projectTypeId || !this.Model.languageId || !this.Model.assignProjectAdminId || !this.Model.activeServiceIds) {
			return true;
		}
		return this.hasNotAddedRequiredServiceTypes();
	}

	private hasNotAddedRequiredServiceTypes() {
		const requiredServices = this.paramsService.getRequiredServiceTypes();
		for (const requiredService of requiredServices) {
			if (!this.Model.activeServiceIds?.some((id) => id === requiredService.id)) {
				return true;
			}
		}
		return false;
	}
}
