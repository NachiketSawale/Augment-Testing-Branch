/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { HttpClient } from '@angular/common/http';
import { IContainerGroupLayout } from '../container-layouts/interfaces/container-layout.interface';
import { PlatformTranslateService } from '@libs/platform/common';

// TODO: is this class still required?
export abstract class ContainerBase {

	private arr: IContainerGroupLayout[] = [];

	protected panels = [
		{
			panel: this.arr
		},
		{
			panel: this.arr
		},
		{
			panel: this.arr
		}
	];

	public constructor(public http: HttpClient,
										 public translate: PlatformTranslateService
	) {
	}

	/**
	 * This method is declared for accessing property value form perticular language json
	 * @param {string} module module name
	 * @returns object
	 */
	private getTitle(module: string): object {
		return {};
		// TODO: translate.use is used to change language, so moduleName doesn't make sense!
		// return this.translate.use(module + 'en');
	}

	/**
	 * Below methods are defined as per the document.
	 * @param {string} jsonFileName file name
	 * @returns observable
	 */
	protected getTitleIcon(jsonFileName: string) {
		return this.http.get('./mock-data/' + jsonFileName);
	}

	private resize(): void {
	}

	/**
	 * used to toggle isExpandedSplitter variable
	 * @returns boolean
	 */
	private isMinimized(): boolean {
		return false;
	}

	/**
	 * used to toggle isExpandedSplitter variable
	 * @returns boolean
	 */
	private isMaximized(): boolean {
		return true;
	}

}
