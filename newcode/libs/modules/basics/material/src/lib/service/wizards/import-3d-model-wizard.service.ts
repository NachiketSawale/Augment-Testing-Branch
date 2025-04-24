/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IFileSelectControlResult, PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';

import { FieldType, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsMaterialRecordDataService } from '../../material/basics-material-record-data.service';
import JSZip from 'jszip';
import { IMaterialEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class Import3dModelWizardService {
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly dataService = inject(BasicsMaterialRecordDataService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(PlatformHttpService);
	protected configService = inject(PlatformConfigurationService);

	public async onStartWizard() {
		const material = this.dataService.getSelectedEntity();
		if (material) {
			const result = await this.formDialogService.showDialog<{ selFile?: IFileSelectControlResult }>({
				id: 'import-3d-dialog',
				headerText: {
					key: 'basics.material.wizard.import3dModel',
				},
				formConfiguration: {
					formId: 'basics.material.wizard.import3D',
					showGrouping: false,
					rows: [
						{
							id: 'file',
							model: 'selFile',
							type: FieldType.FileSelect,
							required: true,
							options: {

								//fileFilter: 'cpixml/*.cpixml',
								multiSelect: false,
								retrieveFile: true,
								maxSize: '200000MB',//TODO should be able to define the file size unlimited.
							},
							label: {
								text: 'Choose File',
								key: 'basics.material.wizard.chooseFile',
							},
						},
					],
				},
				entity: {},
				customButtons: [],
			});

			const file = result?.value?.selFile?.file;
			if (file) {
				const reader = new FileReader();
				//TODO: Need to show progress dialog
				reader.onload = (e) => {
					const contents = e.target?.result;
					if (contents) {
						this.doImport3DModel(file, contents, material).then(() => {
							console.log('import 3d file success');
						});
					}
				};

				reader.readAsText(file);
			}
		} else {
			await this.dialogService.showMsgBox('basics.material.warning.import3dModelWarningMsg', 'basics.material.warning.warningTitle', 'ico-error');
		}
	}

	private async doImport3DModel(file: File, contents: string | ArrayBuffer, material: IMaterialEntity) {
		const zip = new JSZip();
		const newFile = file.name.replace('cpixml', 'zip');
		zip.file(file.name, contents);
		const zipped = await zip.generateAsync({
			type: 'blob',
			compression: 'DEFLATE',
		});

		if (zipped) {
			const formData = new FormData();
			formData.append('fileName', JSON.stringify(file.name));
			formData.append('blob', zipped, newFile);
			const resultUuid = await this.http.post<string>('model/main/scs/createscsfile', formData, {responseType: 'text' as 'json'});
			material.ObsoleteUuid = material.Uuid;
			material.Uuid = resultUuid;
			this.dataService.setModified(material);
			await this.dataService.updateAndExecute(() => {
				//TODO update the 3d viewer here.
			});
		}
	}
}
