/*
 * Copyright(c) RIB Software GmbH
 */

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSelectComponent } from './file-select.component';

import { ControlContextInjectionToken } from '../../model/control-context.interface';
import { IFileSelectControlContext } from '../../model/file-select-control-context.interface';
import {IEntityContext, MinimalEntityContext} from '@libs/platform/common';

const singleFileData = {
	data: 'data://',
	file: new File([], 'img_test1.png', {
		type: 'image/png',
	}),
	name: 'img_test1.png',
};
const controlContext: IFileSelectControlContext = {
	value: singleFileData,
	fieldId: '',
	readonly: false,
	validationResults: [],
	options: {
		retrieveDataUrl: true,
		retrieveFile: true,
	},
	get entityContext(): IEntityContext<object> {
		return new MinimalEntityContext();
	}
};

const multiControlContext: IFileSelectControlContext = {
	value: [
		singleFileData,
		{
			data: 'data://',
			file: new File([], 'img_test2.png', {
				type: 'image/png',
			}),
			name: 'img_test2.png',
		},
	],
	fieldId: '',
	readonly: false,
	validationResults: [],
	options: {
		maxSize: '300KB',
		multiSelect: true,
		fileFilter: 'image/png',
	},
	get entityContext(): IEntityContext<object> {
		return new MinimalEntityContext();
	}
};
describe('FileSelectComponent with multi file select', () => {
	let component: FileSelectComponent;
	let fixture: ComponentFixture<FileSelectComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, MatDialogModule, HttpClientModule],
			declarations: [FileSelectComponent],

			providers: [{ provide: ControlContextInjectionToken, useValue: controlContext }],
		}).compileComponents();

		fixture = TestBed.createComponent(FileSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check if getFileSize function returns correct conversion', () => {
		let size = 0;

		component['maxSize'] = '1BY';
		size = component['getFileSize']();
		expect(size).toBe(1);

		component['maxSize'] = '1KB';
		size = component['getFileSize']();
		expect(size).toBe(1024);

		component['maxSize'] = '1MB';
		size = component['getFileSize']();
		expect(size).toBe(1024 ** 2);
	});

	it('check if deleteData function deletes the data', () => {
		component['name'] = ['rib.png', 'winjit.png'];
		component.deleteData();
		expect(component['name']).toStrictEqual([]);
		expect(component.controlContext.value).toBeUndefined();
	});

	it('check if getDataUrl function returns base64 format data', async () => {
		const file = new File([], 'img_test.png', {
			type: 'image/png',
		});
		await component['getDataUrl'](file).then((result) => {
			expect(result).toBeTruthy;
		});
	});

	it('check if getFileResultData function is returning the result', async () => {
		const file = new File([], 'img_test.png', {
			type: 'image/png',
		});
		component['getFileResultData'](file);
	});

	it('check if onFileSelected function selects the file', () => {
		const event = {
			target: {
				files: {
					0: new File([], 'img_test1.png', {
						type: 'image/png',
					}),
					length: 1,
				} as unknown as FileList,
			},
		} as unknown as Event;
		component.onFileSelected(event);
	});
});

describe('FileSelectComponent with single file select', () => {
	let component: FileSelectComponent;
	let fixture: ComponentFixture<FileSelectComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormsModule, MatDialogModule, HttpClientModule],
			declarations: [FileSelectComponent],

			providers: [{ provide: ControlContextInjectionToken, useValue: multiControlContext }],
		}).compileComponents();

		fixture = TestBed.createComponent(FileSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check if onFileSelected function selects the file', () => {
		const event = {
			target: {
				files: {
					0: new File([], 'img_test1.png', {
						type: 'image/png',
					}),

					length: 1,
				} as unknown as FileList,
			},
		} as unknown as Event;
		component.onFileSelected(event);
	});
});
