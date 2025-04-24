/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IBasicsSharedImportDataEntity } from '../models/basics-import-data-entity.interface';
import { BasicsSharedSimpleFileImportService } from './basics-file-import.service';
import { IImportVCardData, IVCardsValidateResult, IVCardTestResult } from '../models/basics-import-vcard-data.interface';

/**
 * It provides methods for handling the import of VCard files.
 */
@Injectable({
	providedIn: 'root',
})
export abstract class BasicsSharedVCardFileImportService<TEntity extends IBasicsSharedImportDataEntity> extends BasicsSharedSimpleFileImportService<TEntity> {
	protected abstract validateVCards(vCards: IImportVCardData[], results: IVCardTestResult[], entity: TEntity, formData?: FormData): Promise<IVCardsValidateResult>;

	public override async doImportFiles(entity: TEntity, formData: FormData): Promise<void> {
		const files: File[] = [];
		const selectedFiles = Array.isArray(entity.file) ? entity.file : [entity.file];
		selectedFiles.forEach((selFile) => {
			if (selFile && selFile?.file) {
				files.push(selFile?.file);
			}
		});

		await this.testReadFiles(files, entity, formData);
	}

	private async testReadFiles(files: File[], entity: TEntity, formData: FormData) {
		if (!files || files.length === 0) {
			return;
		}

		const results: IVCardTestResult[] = [];
		let readCount = 0;

		files.forEach((file) => {
			this.readFile(file, async (fileResult: IVCardTestResult) => {
				results.push(fileResult);

				// reading file completed.
				if (++readCount === files.length) {
					const vCards = this.collectVCardsAndReset(results);
					const result = await this.validateVCards(vCards, results, entity, formData);
					if (result.isValid) {
						await super.doImportFiles(entity, formData);
					} else {
						this.publishImportFilesPreCheckFailed(result.error);
					}
				}
			});
		});
	}

	private readFile(file: File, processFn: (result: IVCardTestResult) => void) {
		const reader = new FileReader();
		reader.onload = (res) => {
			const content = res.target?.result as string;
			const charset = this.getCharSet(content);
			const fileResult: IVCardTestResult = {
				fileName: file.name,
				charset: charset ?? '',
			};
			if (fileResult.charset && fileResult.charset !== 'utf-8') {
				this.readFileAgain(file, fileResult, processFn);
			} else {
				fileResult.vCard = this.getVCardInfo(content);
				processFn(fileResult);
			}
		};
		reader.readAsText(file, 'utf-8');
	}

	private readFileAgain(file: File, fileResult: IVCardTestResult, processFn: (result: IVCardTestResult) => void) {
		const reader = new FileReader();
		reader.onload = (res) => {
			const content = res.target?.result as string;
			fileResult.vCard = this.getVCardInfo(content);
			processFn(fileResult);
		};
		reader.readAsText(file, fileResult.charset);
	}

	private getVCardInfo(content: string): IImportVCardData | undefined {
		const vCardData: Partial<IImportVCardData> = {};
		const lines = content.split('\r\n');

		for (const line of lines) {
			const [propertyName, propertyValue] = line.split(':');
			const cleanName = propertyName.split(';')[0];

			if (cleanName === 'N') {
				// Read N property, family (last) name, given (first) name,  middle name, prefix, e.g. Mr, suffix, e.g. Jr.
				const nameParts = propertyValue.split(';');
				if (nameParts.length < 2) {
					continue;
				}
				[vCardData.familyName, vCardData.givenName, vCardData.additionalName, vCardData.namePrefix, vCardData.nameSuffix] = nameParts;
			} else if (cleanName === 'FN') {
				// Read FN property
				vCardData.FN = propertyValue;
			} else if (cleanName === 'ORG') {
				// Read ORG property
				vCardData.ORG = propertyValue;
			}

			if (vCardData.familyName && vCardData.FN && vCardData.ORG) {
				// Break when read completed
				break;
			}
		}

		return {
			N: vCardData.N || '',
			familyName: vCardData.familyName || '',
			givenName: vCardData.givenName || '',
			additionalName: vCardData.additionalName || '',
			namePrefix: vCardData.namePrefix || '',
			nameSuffix: vCardData.nameSuffix || '',
			FN: vCardData.FN || '',
			ORG: vCardData.ORG || '',
		};
	}

	private getCharSet(content: string): string | undefined {
		const lines = content.split('\r\n');

		for (const line of lines) {
			const properties = line.split(':');
			const subProperties = properties[0].split(';');

			for (const subProperty of subProperties) {
				const [key, value] = subProperty.split('=');
				if (key.trim() === 'CHARSET') {
					return value.trim();
				}
			}
		}
		return;
	}

	private collectVCardsAndReset(results: IVCardTestResult[]): IImportVCardData[] {
		const vCards: IImportVCardData[] = [];
		results.forEach((result) => {
			if (result.vCard) {
				vCards.push(result.vCard as IImportVCardData);
				result.vCard = undefined;
			}
		});
		return vCards;
	}
}
