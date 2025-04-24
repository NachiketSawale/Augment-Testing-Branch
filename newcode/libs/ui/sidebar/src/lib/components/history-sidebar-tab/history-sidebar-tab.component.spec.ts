/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSidebarHistorySidebarTabComponent } from './history-sidebar-tab.component';
import { TranslatePipe } from '@libs/platform/common';
import { HttpClientModule } from '@angular/common/http';

describe('UiSidebarHistorySidebarTabComponent', () => {

	let component: UiSidebarHistorySidebarTabComponent;
	let fixture: ComponentFixture<UiSidebarHistorySidebarTabComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [UiSidebarHistorySidebarTabComponent, TranslatePipe],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSidebarHistorySidebarTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
