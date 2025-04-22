/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridComponent } from './grid.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlatformDragDropService, PlatformTranslateService } from '@libs/platform/common';

describe('GridComponent', () => {
	let component: GridComponent<object>;
	let fixture: ComponentFixture<GridComponent<object>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GridComponent,HttpClientTestingModule],
			providers: [PlatformDragDropService, PlatformTranslateService],
			declarations: [],
		}).compileComponents();

		fixture = TestBed.createComponent(GridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
