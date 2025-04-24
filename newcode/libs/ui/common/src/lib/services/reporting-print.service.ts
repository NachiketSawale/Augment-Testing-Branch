/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';

import { ColumnDef, IGridApi, IGridTreeConfiguration } from '../grid';
import { IGridDto } from '../model/grid-dto.interface';
import { IRowData } from '../model/grid-row.interface';
import { IValueMetadata } from '../model/value-metadata.interface';

interface ITranslatableValue {
	Translated?: string;
}

@Injectable({
	providedIn: 'root',
})
export class ReportingPrintService {
	private readonly configService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(HttpClient);

	/**
	 * Provides metadata and value
	 * @param {string} domain
	 * @param  {string} value
	 * @returns {IValueMetadata} returns value with its domain
	 */
	private valueMetadata(domain: string, value: string) : IValueMetadata  {
		return {
			Domain: domain == '' ? '' : domain,
			Value: value == '' ? '' : value,
		};
	}

	/**
	 * Prints given html in template
	 * @param {string} html html to add in new window
	 */
	private print(html: string) {
		let template = this.getTemplate();

		const newWindow = this.openPrintWindow();
		if (!newWindow) {
			console.error('Unable to open a new print window.');
			return;
		}
		template = template.replace('<!-- template here -->', html);
		newWindow.document.write(template);
	}

	/**
	 * Prints grid and tree
	 * @param {IGridApi} gridApi gridApi from grid container
	 */
	public printGrid <T extends object> (gridApi:IGridApi<T>) {
		const { columns, items: rows, configuration: config } = gridApi;
		const treeConfig = config.treeConfiguration;

		const dto: IGridDto = {
			Headers: columns.filter((column) => column.label).map((column) => this.translateService.instant(column.label!).text),
			Rows: rows.map((row) => this.createRow(row, columns, treeConfig)),
			IsTreegrid: !!treeConfig,
			ContainerName: '',
		};

		this.sendPrintData(dto, false);
	}

	/**
	 * Prints form
	 * @param {HTMLElement} formElement html reference of form element
	 */
	public printForm(formElement: HTMLElement) {
		const template = this.getTemplate();

		if (!formElement) {
			console.error('Form element not found.');
			return;
		}

		const clonedFormElement = formElement.cloneNode(true) as HTMLElement;
		this.removeClassRecursive(clonedFormElement, 'btn-default');

		clonedFormElement.querySelectorAll('label > img').forEach((img) => img.remove());

		const newWindow = this.openPrintWindow();
		if (!newWindow) {
			console.error('Unable to open a new print window.');
			return;
		}

		newWindow.addEventListener('load', () => {
			this.transformInputs(clonedFormElement);
			this.transformTextAreas(clonedFormElement);

			const updatedTemplate = template.replace('<!-- template here -->', clonedFormElement.innerHTML);
			newWindow.document.write(updatedTemplate);
		});
	}


	/**
	 * Gets http response in text format to print as html
	 * @param {IGridDto} data dto for post
	 * @param {boolean} isForm check for form and grid
	 */
	private sendPrintData(data: IGridDto, isForm: boolean) {
		const url = this.configService.webApiBaseUrl + 'basics/printing/' + (isForm ? 'printform' : 'printgrid');
		const head = { ContentType: 'text/plain', Accept: 'text/plain, */*' };

		this.http.post<string>(url, data, { headers: head, responseType: 'text' as 'json' }).subscribe({
			next: (response) => {
				this.print(response);
			},
			error: (error) => {
				console.log(error.text);
			},
		});
	}


	/**
	 * Creates rows for dto to print grid
	 * @param {T} rowData grid data
	 * @param {ColumnDef<T>[]} columns grid columns
	 * @param {IGridTreeConfiguration<T> | undefined} treeConfig tree configuration
	 * @returns {object} row
	 */
	private createRow<T extends IRowData>(rowData: T, columns: ColumnDef<T>[], treeConfig: IGridTreeConfiguration<T> | undefined): object {
		const row = {
			IsGroup: false,
			IsRoot: !treeConfig || !treeConfig.parent ? true : treeConfig.parent(rowData) === null,
			Colspan: 1,
			Level: treeConfig && rowData.nodeInfo ? rowData.nodeInfo.level : 0,
			HasChildren: !!(treeConfig && treeConfig.children && treeConfig.children(rowData).length),
			Values: columns.map((column) => {
				const domain = column.type || '';
				const modelKey = column.model as keyof typeof rowData;
				const value = domain === 'translation' ? (rowData[modelKey] as unknown as ITranslatableValue)?.Translated || '' : rowData[modelKey] || '';
				return this.valueMetadata(domain, value as string);
			}),
		};

		return row;
	}

	/**
	 * Provides template for new window
	 * @returns {string} returns template
	 */
	private getTemplate(): string {
		return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		 <meta charset="UTF-8">
		 <meta http-equiv="X-UA-Compatible" content="IE=Edge">
		 <title></title>
		 <style>code { white-space: pre; }</style>
		 <link rel="stylesheet" href="assets/content/printing_css/printing.css" type="text/css">
	</head>
	<body>
		 <!-- template here -->
	</body>
	</html>
	`;
	}


	/**
	 * Provides new window if opened
	 * @returns {Window} returns Window
	 */
	private openPrintWindow(): Window | null {
		const strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
		return window.open('templates/print_template.html', 'print_window', strWindowFeatures);
	}


	/**
	 * Transforms HTML input elements
	 * @param {HTMLElement} clonedFormElement HTML element
	 */
	private transformInputs(clonedFormElement: HTMLElement): void {
		clonedFormElement.querySelectorAll('input').forEach((input) => {
			const newInput = document.createElement('input');
			const type = input.type === 'checkbox' ? 'checkbox' : 'text';
			const classList = input.className
				.split(' ')
				.filter((className) => !className.match(/\bng-\S+/g))
				.join(' ');
			newInput.setAttribute('type', type);
			if (classList) {
				newInput.setAttribute('class', classList);
			}
			newInput.readOnly = false;
			newInput.disabled = false;
			const value = input.value.toString();
			newInput.setAttribute('value', value);
			if (input.type === 'checkbox' && input.checked) {
				newInput.setAttribute('checked', 'true');
				newInput.setAttribute('disabled', 'true');
			}
			newInput.setAttribute('readonly', 'true');

			input.replaceWith(newInput);
		});
	}

	/**
	 * Transforms HTML textarea elements
	 * @param {HTMLElement} clonedFormElement HTML element
	 */
	private transformTextAreas(clonedFormElement: HTMLElement): void {
		clonedFormElement.querySelectorAll('textarea').forEach((textarea) => {
			const newTextArea = document.createElement('textarea');
			newTextArea.setAttribute('class', textarea.className);
			newTextArea.setAttribute('value', textarea.value);
			newTextArea.setAttribute('readonly', 'true');

			textarea.replaceWith(newTextArea);
		});
	}

	/**
	 * Removes css class from HTML element and its children
	 * @param {Element} element HTML element
	 * @param {string} className class to remove
	 */
	private removeClassRecursive(element: Element, className: string): void {
		element.classList.remove(className);
		Array.from(element.children).forEach((child) => this.removeClassRecursive(child, className));
	}
}
