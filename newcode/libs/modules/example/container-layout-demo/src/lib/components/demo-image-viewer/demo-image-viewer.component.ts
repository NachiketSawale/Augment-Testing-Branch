/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { Observable } from 'rxjs';

////TODO: Demo component for image viewer task
@Component({
	selector: 'example-container-layout-demo-image-viewer.component',
	templateUrl: './demo-image-viewer.component.html',
	styleUrls: ['./demo-image-viewer.component.scss'],
})
export class DemoImageViewerComponent extends ContainerBaseComponent implements OnInit {
	/**
	 * image base64 url
	 */
	public url: string[] = [];

	/**
	 * current index of image data
	 */
	public currentIndex: number = 0;

	/**
	 * Represent the image data Observable
	 */
	//TODO: this dataset type will change in future
	//public dataSet: EventEmitter<string | string[]> = new EventEmitter<string | string[]>();
	//public dataSet!: Observable<string | string[]>;
	public dataSet$!: Observable<string[]>;

	/**
	 * represent the operation of image viewer
	 */
	public operation!: string;

	public constructor(public cd: ChangeDetectorRef) {
		super();
	}
	public ngOnInit(): void {
		//this.url = this.imageData;
		console.log();
	}

	/**
	 * this function used for add and change event
	 *
	 * @param {HTMLInputElement}element DOM Element Ref
	 * @param {string}ops  operations
	 */
	public addChangeImage(element: HTMLInputElement, ops: string) {
		this.operation = ops;
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
			if (this.operation === 'add') {
				this.url.push(imageBase64Url as string);
			} else {
				this.url[this.currentIndex] = imageBase64Url as string;
			}
			//this.dataSet.next(this.url);
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
		if (this.url.length - 1 === this.currentIndex) {
			this.currentIndex = 0;
		}
		this.url.splice(this.currentIndex, 1);

		//this.dataSet.next(this.url);
		this.dataSet$ = new Observable((obsever) => {
			obsever.next(this.url);
		});
		this.cd.detectChanges();
	}

	/**
	 * current Index event emitter
	 */
	public getCurrentIndex(index: number) {
		this.currentIndex = index;
	}
}
