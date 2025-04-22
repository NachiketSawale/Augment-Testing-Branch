import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSidebarSearchSidebarTabComponent } from './search-sidebar-tab.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslatePipe } from '@libs/platform/common';

describe('UiSidebarSearchSidebarTabComponent', () => {
	let component: UiSidebarSearchSidebarTabComponent;
	let fixture: ComponentFixture<UiSidebarSearchSidebarTabComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [UiSidebarSearchSidebarTabComponent, TranslatePipe],
			imports: [HttpClientModule]
		});
		fixture = TestBed.createComponent(UiSidebarSearchSidebarTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
