/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSidebarReportTabComponent } from './report-sidebar-tab.component';
import { HttpClientModule } from '@angular/common/http';

describe('ReportSidebarTabComponent', () => {
	let component: UiSidebarReportTabComponent;
	let fixture: ComponentFixture<UiSidebarReportTabComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSidebarReportTabComponent],
			imports:[HttpClientModule]
		}).compileComponents();

		fixture = TestBed.createComponent(UiSidebarReportTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
