/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { createLookup, FieldType, FieldValidationInfo, ICustomDialogOptions, IFormConfig, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedProcurementConfigurationLookupService, BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';
import { ValidationResult } from '@libs/platform/data-access';
import { isArray } from 'lodash';
import { IImportPackageResult, IImportPackageResultRow, IMPORT_PACKAGE_RESULT_ROW_TOKEN } from '../../model/entities/import-package-result.interface';
import { ProcurementMaterialXmlData } from '../../model/requests/procurement-material-xml-Data-request-interface';
import { ProcurementPackageImportResultDialogComponent } from '../package-import-result-dialog/package-import-result-dialog.component';
import { ProcurementPackageHeaderDataService } from '../../services/package-header-data.service';
import { IImportPackageFromRow, IImportPackageModalOptions } from '../../model/entities/import-package-modalOptions.interface';
import { ProjectSharedLookupService } from '@libs/project/shared';

@Component({
	selector: 'procurement-package-import-d93-dialog',
	templateUrl: './package-import-d93-dialog.component.html',
	styleUrls: ['./package-import-d93-dialog.component.scss'],
})
export class ProcurementPackageImportD93DialogComponent {
	private readonly httpService = inject(PlatformHttpService);
	private readonly dialog = inject(UiCommonDialogService);
	private readonly translationService = ServiceLocator.injector.get(PlatformTranslateService);
	private readonly packageDataService = inject(ProcurementPackageHeaderDataService);
	protected importPackageResult: IImportPackageResult;
	protected importPackageResultRow: IImportPackageResultRow;
	public formEntity: IImportPackageFromRow;
	public packageImportRequest: ProcurementMaterialXmlData;
	public modalOptions: IImportPackageModalOptions;

	public constructor() {
		this.importPackageResult = {};
		this.formEntity = {
			FileName: {
				data: 'data://',
				name: '',
			},
			PrjProjectFk: 0,
			StructureFk: 0,
			ConfigurationFk: 0,
		};
		this.importPackageResultRow = {
			Id: 0,
			Status: '',
			Error: '',
			Warning: '',
		};
		this.packageImportRequest = {
			FileName: '',
			BasCompany: '',
			PrjProject: '',
			Code: '',
			Description: '',
			BasCurrency: '',
			BasUom: '',
			PrcItemData: [],
			TaxRate: '',
		};
		this.modalOptions = {
			dialogLoading: false,
			oKBtnRequirement: true,
			isError: false,
			errorDetail: '',
		};
	}

	protected configuration: IFormConfig<IImportPackageFromRow> = {
		formId: 'packageImport',
		showGrouping: false,
		addValidationAutomatically: true,
		rows: [
			{
				id: 'fileName',
				label: {
					text: 'FileName',
					key: 'businesspartner.contact.wizard.chooseFile',
				},
				type: FieldType.FileSelect,
				model: 'FileName',
				options: {
					retrieveDataUrl: true,
					retrieveFile: true,
					onSelectionChanged: () => {
						const file = this.formEntity.FileName;
						if (file?.file) {
							const fileName = /\.[^.]+/.exec(file.name);
							if (isArray(fileName) && fileName.length > 0 && fileName[0].toLowerCase() !== '.d93') {
								this.showMessage(null, 'selected file extension must be d93');
								return;
							} else {
								this.packageImportFile(file.file)
									.then((response) => {
										if (response) {
											this.packageImportRequest = response;
											this.packageImportRequest.FileName = file.name;
											if (this.packageImportRequest.ResponseData) {
												this.formEntity.PrjProjectFk = this.packageImportRequest.ResponseData.PrjProjectFk;
											}
											this.validateProjectFk(this.formEntity, 'PrjProjectFk');
											this.showMessage(this.packageImportRequest, '');
										}
									})
									.catch((error) => {
										this.showMessage(null, error);
										return;
									});
							}
						}
					},
					//TODO the file filter seems not working in framework
					//fileFilter: 'd93',
				},
			},
			{
				id: 'PrjProjectFk',
				label: {
					key: 'cloud.common.entityProjectName',
					text: 'Project Name',
				},
				model: 'PrjProjectFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService,
					displayMember: 'ProjectNo',
					showDescription: true,
					descriptionMember: 'ProjectName',
				}),
				change: (changeInfo) => {
					if ((changeInfo.newValue as number) > 0) {
						if (this.packageImportRequest.PackageImportEntity) {
							this.packageImportRequest.PackageImportEntity.WarningMessages = [];
						}
						this.showMessage(this.packageImportRequest, '');
					}
				},
			},
			{
				id: 'StructureFk',
				label: {
					text: 'Procurement Structure',
					key: 'basics.common.entityPrcStructureFk',
				},
				model: 'StructureFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementStructureLookupService,
					descriptionMember: 'DescriptionInfo',
				}),
				validator: (info) => this.validateDialogStructureFk(info),
			},
			{
				id: 'ConfigurationFk',
				label: {
					key: 'procurement.package.entityConfiguration',
					text: 'Configuration',
				},
				type: FieldType.Lookup,
				model: 'ConfigurationFk',
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
					displayMember: 'DescriptionInfo.Translated',
				}),
			},
		],
	};

	public async validateDialogStructureFk(info: FieldValidationInfo<IImportPackageFromRow>) {
		const itemData = info.entity;
		await this.httpService.get<number>('basics/procurementconfiguration/configuration/getByStructure?structureId=' + info.value + '&rubricId=31').then((response) => {
			itemData.ConfigurationFk = response;
		});
		return new ValidationResult();
	}

	public validateProjectFk(entity: IImportPackageFromRow, filed: string) {
		if (entity?.PrjProjectFk > 0) {
			//todo readonly
			//	platformRuntimeDataService.readonly(entity, [{ field: filed, readonly: true }]);
		} else {
			//todo
			//platformRuntimeDataService.readonly(entity, [{field: filed, readonly: false}]);
		}
	}

	public packageImportFile(file: File) {
		const formData = new FormData();
		formData.append('file', file);
		return this.httpService.post<ProcurementMaterialXmlData>('procurement/package/import/importfileinfo', formData);
	}

	public async importPackage() {
		if (this.packageImportRequest.ResponseData) {
			this.packageImportRequest.ResponseData.PrjProjectFk = this.formEntity.PrjProjectFk;
			this.packageImportRequest.ResponseData.StructureFk = this.formEntity.StructureFk;
			this.packageImportRequest.ResponseData.ConfigurationFk = this.formEntity.ConfigurationFk;
		}
		await this.httpService
			.post<IImportPackageResult>('procurement/package/import/importpackage', this.packageImportRequest)
			.then((response: IImportPackageResult) => {
				if (response && response.PrcPackageImportDto) {
					this.importPackageResult = response;
					this.importPackageResultRow = {
						Id: response.PrcPackageImportDto.Id,
						Status: response.PrcPackageImportDto.Status === 3 ? 'Failed' : 'Succeeded',
						Error: response.PrcPackageImportDto.ErrorMessage,
					};
					const WarningMessages = response.PrcPackageImportDto.WarningMessages;
					if (WarningMessages && WarningMessages.length > 0) {
						this.importPackageResultRow.Warning = WarningMessages.join('\n');
					}
				}
			})
			.catch((error) => {
				this.importPackageResultRow = {
					Id: 1,
					Status: 'Failed',
					Error: error,
				};
			});
	}

	public showImportResult() {
		const modalOption: ICustomDialogOptions<StandardDialogButtonId, ProcurementPackageImportResultDialogComponent> = {
			headerText: this.translationService.instant('procurement.package.import.result').text,
			resizeable: true,
			width: '600px',
			buttons: [
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'cloud.common.cancel' },
				},
			],
			bodyComponent: ProcurementPackageImportResultDialogComponent,
			bodyProviders: [
				{
					provide: IMPORT_PACKAGE_RESULT_ROW_TOKEN,
					useValue: this.importPackageResultRow,
				},
			],
		};
		this.dialog.show(modalOption)?.then(() => {
			if (this.importPackageResult?.PrcPackageDto) {
				const packageDto = this.importPackageResult.PrcPackageDto;
				if (packageDto && packageDto.Id) {
					this.packageDataService.setList([packageDto]);
					this.packageDataService.select(packageDto);
				}
			}
		});
	}

	public showMessage(data: ProcurementMaterialXmlData | null, error: string) {
		if (error !== '') {
			this.modalOptions.isError = true;
			this.modalOptions.errorDetail = error;
		} else if (data && data.PackageImportEntity) {
			const warningMsg = data.PackageImportEntity.WarningMessages;
			if (data.PackageImportEntity.ErrorMessage) {
				this.modalOptions.isError = true;
				this.modalOptions.errorDetail = data.PackageImportEntity.ErrorMessage;
			} else if (isArray(warningMsg) && warningMsg.length > 0) {
				this.modalOptions.isError = true;
				this.modalOptions.errorDetail = (warningMsg.length > 1 ? warningMsg.join(';') : warningMsg) as string;
			} else {
				this.modalOptions.isError = false;
				this.modalOptions.errorDetail = '';
			}
		}
	}
}
