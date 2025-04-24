import { Component, inject, OnInit } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';
import { createLookup, FieldType, FieldValidationInfo, FormRow, getCustomDialogDataToken, IFormConfig, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementPackageProjectAssetMasterFkFilterService } from '../../services/filters/package-header-project-asset-master-filter.service';
import { BasicsSharedAssetMasterLookupService, BasicsSharedClerkLookupService, BasicsSharedDataValidationService, BasicsSharedPrcPackageTemplateLookupService } from '@libs/basics/shared';
import { IPackageCreatePackageFromTemplate } from '../../model/entities/dialog-wizard/package-create-package-from-template.interface';
import { ProcurementPackageHeaderProjectAssetMasterFkFilterService } from '../../services/filters/package-basics-asset-master-dialog-filter.service';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { isNil } from 'lodash';
import { ICanGenerateCodeResult } from '../../model/entities/can-generate-code-result.interface';
import { IPackageCreateComplete } from '../../model/responses/package-create-complete-interface';
import { firstValueFrom } from 'rxjs';
import { CREATE_PACKAGE_FROM_TEMPLATE_DATA_TOKEN } from '../../wizards/procurement-package-create-package-from-template-wizard.service';
import { ProjectSharedLookupService } from '@libs/project/shared';




@Component({
	selector: 'procurement-package-create-package-from-template-dialog',
	templateUrl: './package-create-package-from-template.component.html',
	styleUrls: ['./package-create-package-from-template.component.scss'],
})
export class ProcurementPackageCreatePackageFromTemplateDialogComponent implements OnInit {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly packageDataService = inject(ProcurementPackageHeaderDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly createPackageFromData = inject(CREATE_PACKAGE_FROM_TEMPLATE_DATA_TOKEN);

	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly assetMasterLookupService = inject(BasicsSharedAssetMasterLookupService);
	private readonly dialogWrapper = inject(getCustomDialogDataToken<StandardDialogButtonId, ProcurementPackageCreatePackageFromTemplateDialogComponent>());
	private readonly projectSharedLookupService = inject(ProjectSharedLookupService);

	// region setting
	public dataCreatePackage: IPackageCreatePackageFromTemplate = {
		AssetMasterFk: null,
		ProjectFk: this.createPackageFromData.ProjectFk,
		PrcPackageTemplateFk: this.createPackageFromData.PrcPackageTemplateFk,
		ClerkReqFk: null,
		ClerkPrcFk: this.createPackageFromData.ClerkPrcFk,
		AssetMasterList: [],
		packageCreationShowAssetMaster: this.createPackageFromData.packageCreationShowAssetMaster,
	};
	public configuration: IFormConfig<IPackageCreatePackageFromTemplate> = {
		formId: 'procurement.package.create.package',
		showGrouping: false,
		addValidationAutomatically: true,
		groups: [
			{
				groupId: 'basicData',
				header: this.translateService.instant('procurement.package.wizard.createPackageFromTemplate.caption').text,
				open: true,
				visible: true,
				sortOrder: 1,
			},
		],
		rows: [
			{
				id: 'ProjectFk',
				groupId: 'basicData',
				label: {
					text: 'Project No.',
					key: 'cloud.common.entityProjectNo',
				},
				type: FieldType.Lookup,
				model: 'ProjectFk',
				validator: (info) => this.validateProjectFk(info),
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					displayMember: 'ProjectNo',
					descriptionMember: 'ProjectName',
					serverSideFilterToken: ProcurementPackageProjectAssetMasterFkFilterService,
					disableInput: false,
					showClearButton: true,
					showEditButton: true,
				}),
			},
			{
				id: 'PrcPackageTemplateFk',
				groupId: 'basicData',
				label: {
					text: 'Package Template',
					// todo:translation
					//  key: '',
				},
				type: FieldType.Lookup,
				model: 'PrcPackageTemplateFk',
				validator: (info) => this.validatePrcPackageTemplateFk(info),
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPrcPackageTemplateLookupService,
					showClearButton: false,
				}),
			},
			{
				id: 'ClerkReqFk',
				groupId: 'basicData',
				label: {
					text: 'Requisition Owner',
					key: 'cloud.common.entityRequisitionOwner',
				},
				type: FieldType.Lookup,
				model: 'ClerkReqFk',
				lookupOptions: createLookup({
					showDescription: true,
					dataServiceToken: BasicsSharedClerkLookupService,
					descriptionMember: 'Description',
					disableInput: false,
					showClearButton: true,
					showEditButton: true,
				}),
			},
			{
				id: 'clerkprcfk',
				groupId: 'basicData',
				label: {
					text: 'Responsible',
					key: 'cloud.common.entityResponsible',
				},
				type: FieldType.Lookup,
				model: 'ClerkPrcFk',
				lookupOptions: createLookup({
					showDescription: true,
					dataServiceToken: BasicsSharedClerkLookupService,
					descriptionMember: 'ClerkPrcDescription',
					disableInput: false,
					showClearButton: true,
					showEditButton: true,
				}),
			},
		],
	};
	public loading: boolean = false;
	// endregion
	// region init event
	public ngOnInit() {
		this.InitAddFormRow();
		this.InitData();
	}

	private async InitData() {
		const dataAssetMaster = await firstValueFrom(this.assetMasterLookupService.getList());
		if (dataAssetMaster) {
			this.dataCreatePackage.AssetMasterList = dataAssetMaster;
		}
		// todo check AssetMasterFk need to binding project?
		if (this.createPackageFromData.ProjectFk) {
			const dataProject = await firstValueFrom(this.projectSharedLookupService.getItemByKey({ id: this.createPackageFromData.ProjectFk }));
			if (dataProject) {
				this.dataCreatePackage.AssetMasterFk = dataProject.AssetMasterFk;
			}
		}
	}

	private InitAddFormRow() {
		if (this.dataCreatePackage.packageCreationShowAssetMaster) {
			const assetMasterFk: FormRow<IPackageCreatePackageFromTemplate> = {
				id: 'AssetMasterFk',

				groupId: 'basicData',
				label: {
					text: 'Assert Master',
					key: 'procurement.package.entityAssetMaster',
				},
				type: FieldType.Lookup,
				model: 'AssetMasterFk',
				validator: (info) => this.validateAssetMasterFk(info),
				lookupOptions: createLookup({
					showDescription: true,
					dataServiceToken: BasicsSharedAssetMasterLookupService,
					serverSideFilterToken: ProcurementPackageHeaderProjectAssetMasterFkFilterService,
					descriptionMember: 'Description',
					showClearButton: true,
				}),
			};
			this.configuration.rows.splice(1, 0, assetMasterFk);
		}
	}

	// endregion
	// region validation
	private async validateAssetMasterFk(info: FieldValidationInfo<IPackageCreatePackageFromTemplate>): Promise<ValidationResult> {
		// if (!info.value) {
		// this.dataCreatePackage.AssetMasterFk = undefined;
		// }
		// todo wait apply fix will delete
		const fieldName = this.translateService.instant('procurement.package.entityAssetMaster').text;
		return this.validationUtils.isMandatory(new ValidationInfo(info.entity, info.value, fieldName));
	}

	private async validateProjectFk(info: FieldValidationInfo<IPackageCreatePackageFromTemplate>): Promise<ValidationResult> {
		// todo wait apply fix will delete
		// if (!info.value) {
		// this.dataCreatePackage.ProjectFk = undefined;
		// }
		if (info.entity && info.value) {
			await this.setClerkPrcFkAndClerkReqFk(<number>info.value);
		}

		const fieldName = this.translateService.instant('cloud.common.entityProjectNo').text;
		return this.validationUtils.isMandatory(new ValidationInfo(info.entity, info.value, fieldName));
	}

	private async setClerkPrcFkAndClerkReqFk(projectFk: number) {
		const clerkData = {
			projectFk: projectFk,
		};
		this.loading = true;
		const result = await this.http.post<number[]>('procurement/common/data/getClerkFk', clerkData);
		this.loading = false;
		if (result.length > 0) {
			if (!isNil(result[0])) {
				this.dataCreatePackage.ClerkPrcFk = result[0];
			}
			if (!isNil(result[1])) {
				this.dataCreatePackage.ClerkReqFk = result[1];
			}
		}
	}

	private async validatePrcPackageTemplateFk(info: FieldValidationInfo<IPackageCreatePackageFromTemplate>): Promise<ValidationResult> {
		const result = new ValidationResult();
		result.apply = true;
		if (!info.value || <number>info.value <= 0) {
			// todo Package Template translate
			// todo wait apply fix
			return this.validationUtils.isMandatory(new ValidationInfo(info.entity, info.value, 'Package Template'));
		} else {
			let errorMessage = this.translateService.instant('procurement.package.cannotgeneratecodefromtemplate').text;
			const data = await this.http.get<ICanGenerateCodeResult>('procurement/package/package/cangeneratecodefromtemplate' + '?templateFk=' + info.value);

			if (!data.Result) {
				if (data.TemplateItemCount <= 0) {
					errorMessage = this.translateService.instant('procurement.package.hasnottemplateitem').text;
				}
				result.valid = false;
				result.error = errorMessage;
			}
		}
		return result;
		// return Promise.resolve(result);
	}

	// endregion
	// region dialog function
	public isDisabled(): boolean {
		const AssetMasterFk = this.dataCreatePackage.AssetMasterFk;
		const ProjectFk = this.dataCreatePackage.ProjectFk;
		const PrcPackageTemplateFk = this.dataCreatePackage.PrcPackageTemplateFk;
		let disableSwitch: boolean;
		if (this.createPackageFromData.packageCreationShowAssetMaster) {
			disableSwitch = !AssetMasterFk || !ProjectFk || !PrcPackageTemplateFk || AssetMasterFk === -1 || ProjectFk === -1 || PrcPackageTemplateFk === -1;
		} else {
			disableSwitch = !ProjectFk || !PrcPackageTemplateFk || ProjectFk === -1 || PrcPackageTemplateFk === -1;
		}
		return disableSwitch;
	}

	public async onOk() {
		if (
			this.dataCreatePackage &&
			(this.dataCreatePackage.ProjectFk || 0) > 0 &&
			this.dataCreatePackage.PrcPackageTemplateFk &&
			(!this.createPackageFromData.packageCreationShowAssetMaster || (this.createPackageFromData.packageCreationShowAssetMaster && (this.dataCreatePackage.AssetMasterFk || 0) > 0))
		) {
			// control ok btn .when waiting request.
			// $scope.options.dialogLoading = true;
			const packageCount = await this.http.get<number>('procurement/package/package/getpackagebyprojectfk?projectfk=' + this.dataCreatePackage.ProjectFk);
			if (packageCount === 0) {
				await this.createFromTemplate(this.dataCreatePackage);
			} else {
				let bodyText = this.translateService.instant('procurement.package.wizard.createPackageFromTemplate.warningMsg').text;
				if (packageCount > 1) {
					bodyText = bodyText.replace('(number)', packageCount.toString()).replace('(s)', 's').replace('(isORare)', 'are');
				} else {
					bodyText = bodyText.replace('(number)', packageCount.toString()).replace('(s)', '').replace('(isORare)', 'is');
				}
				const resultMessageBox = await this.messageBoxService.showYesNoDialog({
					headerText: this.translateService.instant('procurement.package.wizard.createPackageFromTemplate.caption').text,
					bodyText: bodyText,
					dontShowAgain: true,
					id: '1c23078976dd41178e723390c110a7e5',
				});
				if (resultMessageBox && resultMessageBox.closingButtonId === StandardDialogButtonId.Yes) {
					await this.createFromTemplate(this.dataCreatePackage);
				}
			}
		}
	}

	public async createFromTemplate(result: IPackageCreatePackageFromTemplate) {
		const param = {
			PrjProjectFk: result.ProjectFk,
			PrcPackageTemplateFk: result.PrcPackageTemplateFk,
			ClerkReqFk: result.ClerkReqFk,
			ClerkPrcFk: result.ClerkPrcFk,
			AssetMasterFk: result.AssetMasterFk,
		};
		this.loading = true;
		const dataPackageCreateComplete = await this.http.post<IPackageCreateComplete[]>('procurement/package/package/createfromtemplate', param);
		this.loading = false;
		if (dataPackageCreateComplete && dataPackageCreateComplete.length > 0) {
			this.dialogWrapper.close();
			await this.createFromTemplateSucceeded(dataPackageCreateComplete);
		} else {
			throw new Error('Create Package Template failed');
		}
	}

	private async createFromTemplateSucceeded(newData: IPackageCreateComplete[]) {
		newData.forEach((packageData) => {
			this.packageDataService.append(packageData.Package);
		});
		const length = this.packageDataService.getList().length;
		// todo serviceContainer.data.listLoaded.fire();

		const dataSelect = this.packageDataService.getList()[length - 1];
		await this.packageDataService.select(dataSelect);
	}

	// endregion
}
