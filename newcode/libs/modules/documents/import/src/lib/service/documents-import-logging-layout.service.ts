/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IDocumentImportedLogInfo } from '../model/entities/document-info.interface';
/**
 * document import logging layout service
 */
@Injectable({
	providedIn: 'root',
})
export class DocumentsImportLoggingLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IDocumentImportedLogInfo>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'ImportStatus',
						'BarCode',
						'XmlName',
						'File',
						'ErrMsg',
						'WarningMessage'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('documents.import.', {
					ImportStatus: { key: 'importStatus', text: 'Import Status'},
					BarCode: {key: 'barCode', text: 'BarCode'},
					XmlName: {key: 'xmlName', text: 'Xml Name(s)'},
					File: {key: 'file', text: 'File Name'},
					ErrMsg: {key: 'errorMessage', text: 'Error Message'},
					WarningMessage:{key: 'warningMessage', text: 'Warning Message'}
				}),
			},
			overloads: {
				ImportStatus: {readonly: true},
				BarCode: {readonly: true},
				XmlName: {readonly: true},
				File: {readonly: true},
				ErrMsg: {readonly: true},
				WarningMessage: {readonly: true},
			}
		};
	}
}