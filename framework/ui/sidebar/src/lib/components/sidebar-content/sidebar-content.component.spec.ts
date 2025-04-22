/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarOptions } from '../../model/class/sidebar-options.class';
import { UiSidebarService } from '../../services/sidebar.service';
import { SidebarContentComponent } from './sidebar-content.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const obj ={
	isActive:true,
	lastButtonId:'sidebar-lastobjects'
};
describe('SidebarContentComponent', () => {
	let component: SidebarContentComponent;
	let fixture: ComponentFixture<SidebarContentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports:[HttpClientTestingModule],
			declarations: [SidebarContentComponent],
			providers:[UiSidebarService]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SidebarContentComponent);
		component = fixture.componentInstance;

		component.sidebarOptions = new SidebarOptions();
		component.sidebarService.sidebarOptions = new SidebarOptions();
		component.sidebarPinservice.getPinStatus=jest.fn(()=>JSON.parse(JSON.stringify(obj)));
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('test active tab subcription', () => {
		component.sidebarService.activeTab$.emit('data');
	});
});
