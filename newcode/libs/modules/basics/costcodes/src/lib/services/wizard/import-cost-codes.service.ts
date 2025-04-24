/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IFileSelectControlResult, PlatformConfigurationService } from '@libs/platform/common';
import { FieldType, FormRow, IEditorDialogResult, IFormConfig, IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonInputDialogService, UiCommonMessageBoxService } from '@libs/ui/common';

export interface ICostCodeImport {
	fileName: IFileSelectControlResult;
}
export const singleFileData = {
	data: 'data://',
	file: new File([], '', {
		type: 'text/xml'
	}),
	name: ''
};

export type HttpRequestOptions = {
	headers?:
		| HttpHeaders
		| {
				[header: string]: string | string[];
		  };
	context?: HttpContext;
	reportProgress?: boolean;
	params?:
		| HttpParams
		| {
				[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
		  };
	responseType?: 'json';
	withCredentials?: boolean;
};

@Injectable({
	providedIn: 'root'
})
export class ImportCostCodesService {
	private readonly http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly inputDialogService = inject(UiCommonInputDialogService);
	private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);

	public importCostCodesWizard() {
		const config: IFormDialogConfig<ICostCodeImport> = {
			headerText: { key: 'Import Cost Codes' },
			formConfiguration: this.generateEditOptionRows(),
			customButtons: [],
			entity: this.formEntity
		};

		this.formDialogService.showDialog(config)?.then((result: IEditorDialogResult<ICostCodeImport>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				/* empty */
			}
		});
	}

	//basicsCommonImportDataService.execute(basicsCostCodesMainService, moduleName);   :TODO
	private generateEditOptionRows(): IFormConfig<ICostCodeImport> {
		const endPoint: string = 'basics/common/file/importfileinfo';
		const Options: HttpRequestOptions = {
			headers: {
				'Content-Type': 'undefined'
			}
		};
		const formRows: FormRow<ICostCodeImport>[] = [
			{
				id: 'fileName',
				label: {
					text: 'File Name'
				},
				type: FieldType.FileSelect,
				model: 'fileName',
				options: {
					retrieveDataUrl: true,
					retrieveFile: true,
					fileFilter: 'text/xml',
					onSelectionChanged: async (): Promise<void> => {
						try {
							const response = await this.http.post(this.configService.webApiBaseUrl + endPoint, null, Options).toPromise();

							console.log('File upload successful:', response);
						} catch (error) {
							console.error('Error during file selection HTTP request:', error);
						}
					}
				}
			}
		];
		const formConfig: IFormConfig<ICostCodeImport> = {
			formId: 'importCostCode',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: formRows
		};
		return formConfig;
	}

	private formEntity: ICostCodeImport = {
		fileName: singleFileData
	};
}
