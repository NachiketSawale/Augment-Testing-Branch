/* eslint-disable prefer-const */
import { inject, Injectable } from '@angular/core';
import { FieldType, IFormConfig, StandardDialogButtonId, TextDisplayType, UiCommonFormDialogService, UiCommonLongTextDialogService } from '@libs/ui/common';
import { IInitializationContext } from '@libs/platform/common';
import * as _ from 'lodash';
import { split } from 'lodash';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { BoqWizardUuidConstants } from '@libs/boq/interfaces';

interface IExportBoqResponse {
	Uri: string;
	FileName: string;
	ErrorText: string;
}

@Injectable({providedIn: 'root'})
export abstract class BoqExportOenOnlbWizardService extends BoqWizardServiceBase {
	private boqItemDataService!: BoqItemDataServiceBase;

	private readonly longTextDialogService = inject(UiCommonLongTextDialogService);

	public getUuid(): string {
		return BoqWizardUuidConstants.ExportOenOnlbWizardUuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.exportOenOnlb();
	}

	public exportOenOnlb() {
		let boqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId();
		if (!boqHeaderId) {
			this.showImportFailedWarning('boq.main.gaebImportBoqMissing');
			return;
		} else if (!this.boqItemDataService.isWicBoq()) {
			this.showImportFailedWarning('boq.main.wicExclisiveFunc');
			return;
		}

		this.http.post$('boq/main/oen/exportonlb' + '?boqHeaderId=' + boqHeaderId, null).subscribe(res => {
			let response = res as IExportBoqResponse;
			if (_.isEmpty(response.ErrorText)) {
				const link = document.createElement('a');
				document.body.appendChild(link);
				link.setAttribute('display', 'none');
				link.href = response.Uri;
				link.download = response.FileName;
				link.type = 'application/octet-stream';
				link.click();
				this.messageBoxService.showInfoBox('boq.main.exportSucceeded', 'ico-info', false);
			} else {
				this.longTextDialogService.show({
					headerText: 'boq.main.oen.onlbExport',
					topDescription: {text: 'boq.main.exportFailed', iconClass: 'tlb-icons ico-info'},
					text: response.ErrorText,
					type: TextDisplayType.Plain
				});
			}
		});
	}

	private showImportFailedWarning(message: string) {
		this.messageBoxService.showMsgBox(this.translateService.instant(message).text, this.translateService.instant('boq.main.warning').text, 'ico-warning');
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainExportOenOnlbWizardService extends BoqExportOenOnlbWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export abstract class BoqImportOenOnlvWizardService extends BoqWizardServiceBase {
	private boqItemDataService!: BoqItemDataServiceBase;

	private longTextDialogService = inject(UiCommonLongTextDialogService);

	public getUuid(): string {
		return BoqWizardUuidConstants.ImportOenOnlvWizardUuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				this.importOenOnlv();
			}
		});
	}

	private showImportFailedWarning(message: string) {
		this.messageBoxService.showMsgBox(this.translateService.instant(message).text, this.translateService.instant('boq.main.warning').text, 'ico-warning');
	}

	public importOenOnlv() {
		let boqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId();
		if (!boqHeaderId) {
			this.showImportFailedWarning('boq.main.gaebImportBoqMissing');
			return;
		} else if (this.boqItemDataService.isWicBoq()) {
			this.showImportFailedWarning('boq.main.wicDisabledFunc');
			return;
		}

		let input = document.createElement('input');
		input.type = 'file';
		input.accept = '.onlv';
		input.multiple = false;

		input.onchange = () => {
			let files = input.files;
			if (files) {
				this.importOnlv(files[0], boqHeaderId);
			}
		};

		input.click();
	}

	private importOnlv(selectedFile: File, boqHeaderId: number | undefined) {
		let fileReader;
		fileReader = new FileReader();
		fileReader.readAsDataURL(selectedFile);
		fileReader.onload = (e) => {

			let request = new OnlvImportRequest();
			request.BoqHeaderId = boqHeaderId;
			request.FileName = selectedFile.name;
			request.FileContent = new FileContent();
			request.FileContent.Content = split(e.target?.result?.toString(), ',')[1];

			this.http.post$('boq/main/oen/importonlv', request).subscribe(res => {
				let response = res as OenImportResponse;
				if (response) {
					if (response.ErrorDescription) {
						this.longTextDialogService.show({
							headerText: 'boq.main.oen.onlvImport',
							topDescription: {text: 'boq.main.importFailed', iconClass: 'tlb-icons ico-info'},
							text: response.ErrorDescription,
							type: TextDisplayType.Plain
						});
					} else {
						this.boqItemDataService.refreshAll();

						if (_.some(response.Warnings)) {
							this.longTextDialogService.show({
								headerText: 'boq.main.oen.onlvImport',
								topDescription: {text: 'boq.main.importSucceeded', iconClass: 'tlb-icons ico-info'},
								text: response.Warnings.toString(),
								type: TextDisplayType.Plain
							});
						} else {
							this.messageBoxService.showInfoBox(this.translateService.instant('boq.main.importSucceeded').text, 'info', false);
						}
					}
				}
			});
		};
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainImportOenOnlvWizardService extends BoqImportOenOnlvWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}

@Injectable({providedIn: 'root'})
export abstract class BoqExportOenOnlvWizardService extends BoqWizardServiceBase {
	private boqItemDataService!: BoqItemDataServiceBase;
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly longTextDialogService = inject(UiCommonLongTextDialogService);

	public getUuid(): string {
		return BoqWizardUuidConstants.ExportOenOnlvWizardUuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.exportOenOnlv();
	}

	public exportOenOnlv() {
		let boqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId();
		if (!boqHeaderId) {
			this.showImportFailedWarning('boq.main.gaebImportBoqMissing');
			return;
		}	else if (this.boqItemDataService.isWicBoq()) {
			this.showImportFailedWarning('boq.main.wicDisabledFunc');
			return;
		}

		this.openExportBoqDialog();
	}

	public oenExportRequest: OenExportRequest = {
		BoqHeaderId: 0,
		OenLvType: 1,
		OenSchema: 3
	};

	public async openExportBoqDialog() {

		const exportBoqFormConfig: IFormConfig<OenExportRequest> = {
			formId: 'export-boq',
			showGrouping: false,
			rows: [
				{
					id: 'oenSchemas',
					type: FieldType.Radio,
					model: 'OenSchema',
					itemsSource: {
						items: [
							{
								id: 3,
								displayName: 'boq.main.oen.version.2021',
							}
						],
					},
				},
				{
					id: 'OenLvType',
					type: FieldType.Radio,
					model: 'OenLvType',
					itemsSource: {
						items: [
							{
								id: 1,
								displayName: 'boq.main.oen.lvTypes.Draft',
							},
							{
								id: 2,
								displayName: 'boq.main.oen.lvTypes.CostEstimate',
							},
							{
								id: 3,
								displayName: 'boq.main.oen.lvTypes.CostEstimate',
							},
							{
								id: 4,
								displayName: 'boq.main.oen.lvTypes.Bid',
							},
							{
								id: 5,
								displayName: 'boq.main.oen.lvTypes.AlternativeBid',
							},
							{
								id: 6,
								displayName: 'boq.main.oen.lvTypes.ModifiedBid',
							},
							{
								id: 7,
								displayName: 'boq.main.oen.lvTypes.Contract',
							},
							{
								id: 8,
								displayName: 'boq.main.oen.lvTypes.Invoice',
							},
							{
								id: 9,
								displayName: 'boq.main.oen.lvTypes.AdditionalBid',
							},
							{
								id: 10,
								displayName: 'boq.main.oen.lvTypes.AdjustedContract',
							},
						],
					},
				}
			],
		};

		await this.formDialogService.showDialog<OenExportRequest>({
			id: 'exportBoq',
			headerText: 'boq.main.oen.onlvExport',
			formConfiguration: exportBoqFormConfig,
			entity: this.oenExportRequest,
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				let request = {
					'BoqHeaderId': this.boqItemDataService.getSelectedBoqHeaderId(),
					'OenSchema': result.value?.OenSchema,
					'OenLvType': result.value?.OenLvType
				};

				this.http.post$('boq/main/oen/exportonlv', request).subscribe(res => {
					let response = res as IExportBoqResponse;
					if (_.isEmpty(response.ErrorText)) {
						const link = document.createElement('a');
						document.body.appendChild(link);
						link.setAttribute('display', 'none');
						link.href = response.Uri;
						link.download = response.FileName;
						link.type = 'application/octet-stream';
						link.click();
						this.messageBoxService.showInfoBox('boq.main.exportSucceeded', 'ico-info', false);
					} else {
						this.longTextDialogService.show({
							headerText: 'boq.main.oen.onlvExport',
							topDescription: {text: 'boq.main.exportFailed', iconClass: 'tlb-icons ico-info'},
							text: response.ErrorText,
							type: TextDisplayType.Plain
						});
					}
				});
			}
		});
	}

	private showImportFailedWarning(message: string) {
		this.messageBoxService.showMsgBox(this.translateService.instant(message).text, this.translateService.instant('boq.main.warning').text, 'ico-warning');
	}

}

@Injectable({providedIn: 'root'})
export class BoqMainExportOenOnlvWizardService extends BoqExportOenOnlvWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}

class OnlvImportRequest {
	public BoqHeaderId?: number;
	public FileName?: string;
	public FileContent?: FileContent;
}

class OenImportResponse {
	public Warnings: string[] = [];
	public ErrorDescription?: string;
}

class OenExportRequest {
	public BoqHeaderId!: number;
	public OenSchema!: number;
	public OenLvType!: number;
}

class FileContent {
	public Content: string | ArrayBuffer | null | undefined;
}
