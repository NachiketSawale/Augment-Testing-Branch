/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSidebarChatbotSidebarTabComponent } from './chatbot-sidebar-tab.component';

describe('UiSidebarChatbotSidebarTabComponent', () => {
	
	let component: UiSidebarChatbotSidebarTabComponent;
	let fixture: ComponentFixture<UiSidebarChatbotSidebarTabComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSidebarChatbotSidebarTabComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSidebarChatbotSidebarTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
