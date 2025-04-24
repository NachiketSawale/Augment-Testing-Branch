/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ChangeDetectorRef, Component } from '@angular/core';

import { ContainerBaseComponent } from '@libs/ui/container-system';
import { Observable } from 'rxjs';

@Component({
	selector: 'example-container-layout-demo-list',
	templateUrl: './clerk-list.component.html',
	styleUrls: ['./clerk-list.component.scss'],
})
export class BasicsClerkListComponent extends ContainerBaseComponent {
	public url!: string;
	/**
	 * represent the operation of image viewer
	 */
	public operation!: string;

	/**
	 * Represent the image data Observable
	 */
	//TODO: this dataset type will change in future
	//public dataSet: EventEmitter<string | string[]> = new EventEmitter<string | string[]>();
	public dataSet$!: Observable<string>;

	public constructor(public cd: ChangeDetectorRef) {
		super();
	}

	/**
	 * this function used for add and change event
	 *
	 * @param {HTMLInputElement}element DOM Element Ref
	 * @param {string}ops  operations
	 */
	public addChangeImage(element: HTMLInputElement, ops: string) {
		element.click();
	}
	/**
	 * this function used for file change event
	 *
	 * @param {Event} event evnet file change
	 */
	public addImage(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files as FileList;

		if (files[0].type.indexOf('image') === -1) {
			throw new Error('Wrong file type.');
		}
		const reader = new FileReader();
		reader.onload = () => {
			const imageBase64Url = reader.result;
			//ImageViewerOperation
			this.url = imageBase64Url as string;
			//	this.dataSet.next(this.url);
			this.dataSet$ = new Observable((obsever) => {
				obsever.next(this.url);
			});
			this.cd.detectChanges();
		};

		reader.readAsDataURL(files[0]);
	}
	/**
	 * delete the image button click
	 */
	public deleteImage() {
		this.url = '';
		//this.dataSet.next(this.url);
		this.dataSet$ = new Observable((obsever) => {
			obsever.next(this.url);
		});
		this.cd.detectChanges();
	}
}
