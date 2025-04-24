/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { UiSidebarService } from '../../services/sidebar.service';
import { TranslatePipe } from '@libs/platform/common';

import { SidebarOptions } from '../../model/class/sidebar-options.class';
import { SidebarTab } from '../../model/class/sidebar-tab.class';
import { UiSidebarComponent } from './sidebar.component';
import { MenuListComponent } from '@libs/ui/common';
import { MenuListRadioComponent } from '@libs/ui/common';

const obj ={
	isActive:true,
	lastButtonId:'sidebar-lastobjects'
}; 

// const dataObj ={
// 	isActive:false,
// 	lastButtonId:'sidebar-lastobjects'
// }; 
const data=[new SidebarTab(
	'sidebar-lastobjects',
	{ key: 'cloud.desktop.sdCmdBarLastObjects' },
	'sidebar-icons',
	'ico-last-objects',
	1,
	()=>{
		return import('../history-sidebar-tab/history-sidebar-tab.component').then(component=>{
		return component.UiSidebarHistorySidebarTabComponent;
	});
	}
),
new SidebarTab(
	'sidebar-chatBot',
	{ key: 'cloud.desktop.sdCmdBarChatBot' },
	'sidebar-icons',
	'ico-chatbot',
	2,
	()=>{
		return import('../../components/chatbot-sidebar-tab/chatbot-sidebar-tab.component').then(special => {
		return special.UiSidebarChatbotSidebarTabComponent;
	});
	}
)];
describe('UiSidebarComponent', () => {
	// TODO: replace with actual test cases
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
	let component: UiSidebarComponent;
	let fixture: ComponentFixture<UiSidebarComponent>;
	
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiSidebarComponent,MenuListComponent,MenuListRadioComponent,],
			providers:[UiSidebarService,TranslatePipe,HttpClient,HttpHandler]
		}).compileComponents();

		fixture = TestBed.createComponent(UiSidebarComponent);
		component = fixture.componentInstance;

		component.sidebarOptions = new SidebarOptions();
		component.sidebarService.sidebarOptions = new SidebarOptions();
		component.sidebarPinservice.getPinStatus=jest.fn(()=>JSON.parse(JSON.stringify(obj)));
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check the pin status on click',()=>{
		component.sidebarOptions.isPinned=true;
		component.pinSidebar(undefined);
		expect(component.sidebarOptions.isPinned).toBe(false);
	});

	it('check pin status on application load',()=>{
		component.pinSidebar(false);
		expect(component.sidebarOptions.isPinned).toBe(false);
	});

	it('Update menuOptions items when new sidebar tabs added',()=>{
		// const tabInfo = [new SidebarTab(
		// 	'sidebar-lastobjects',
		// 	{ key: 'cloud.desktop.sdCmdBarLastObjects' },
		// 	'sidebar-icons',
		// 	'ico-last-objects',
		// 	1,
		// 	()=>{
		// 		return import('../history-sidebar-tab/history-sidebar-tab.component').then(component=>{
		// 		return component.UiSidebarHistorySidebarTabComponent;
		// 	});
		// 	}
		// ),];
		//component.menuOptions.items = tabInfo;
		component.addNewTabsInMenuOption(data);
	});

	it('check updateMenuOptionItems status when add data emitted',()=>{
		const tabData = {
			added:[
				new SidebarTab(
				'sidebar-report',
				{ key: 'cloud.desktop.sdCmdBarReport' },
				'sidebar-icons',
				'ico-report',
				8,
				()=>{
					return import('../report-sidebar/report-sidebar-tab/report-sidebar-tab.component').then(special => {
					return special.UiSidebarReportTabComponent;
				});
				}
			)],
			modified:undefined,
			removed:undefined
		};
		component.sidebarService.tabUpdate$.emit(tabData);
		component.menuOptions.items=[];
		component.updateMenuOptionItems();
	});

	it('check updateMenuOptionItems status when update data emitted',()=>{
		const tabData = {
			added:undefined,
			modified:[
				new SidebarTab(
				'sidebar-report',
				{ key: 'cloud.desktop.sdCmdBarReport' },
				'sidebar-icons',
				'ico-report',
				8,
				()=>{
					return import('../report-sidebar/report-sidebar-tab/report-sidebar-tab.component').then(special => {
					return special.UiSidebarReportTabComponent;
				});
				}
			)],
			removed:undefined
		};
		component.sidebarService.tabUpdate$.emit(tabData);
		component.menuOptions.items=[];
		component.updateMenuOptionItems();
	});

	it('check updateMenuOptionItems status when update data emitted',()=>{
		const tabData = {
			added:undefined,
			modified:undefined,
			removed:['sidebar-report']
		};
		component.sidebarService.tabUpdate$.emit(tabData);
		component.menuOptions.items = [new SidebarTab(
			'sidebar-report',
			{ key: 'cloud.desktop.sdCmdBarReport' },
			'sidebar-icons',
			'ico-report',
			8,
			()=>{
				return import('../report-sidebar/report-sidebar-tab/report-sidebar-tab.component').then(special => {
				return special.UiSidebarReportTabComponent;
			});
			}
		)];
		component.updateMenuOptionItems();
	});

	it('check the sidebar status on tab click when both lastbuttonID and current id same',()=>{
		jest.spyOn(component.sidebarPinservice,'setPinStatus');
		component.sidebarOptions.lastButtonId='sidebar-favorites';
		component.cmdbarredirectTo('sidebar-favorites');
		expect(component.sidebarOptions.lastButtonId).toBe('');
		expect(component.sidebarPinservice.setPinStatus).toBeCalled();
	});

	it('check the sidebar status on tab click when both lastbuttonID and current id are different',()=>{
		
		jest.spyOn(component.sidebarPinservice,'setPinStatus');
		component.sidebarOptions.lastButtonId='sidebar-favorites';
		component.cmdbarredirectTo('sidebar-quickstart');
		expect(component.sidebarOptions.lastButtonId).toBe('sidebar-quickstart');
		expect(component.sidebarPinservice.setPinStatus).toBeCalled();
	});

	it('check the event subscription state when sidebar tab clicked',()=>{
		jest.spyOn(component,'cmdbarredirectTo');
		component.sidebarService.activeTab$.emit('sidebar-quickstart');
		expect(component.cmdbarredirectTo).toBeCalled();
	});

	it('check openSidebar status',()=>{
		jest.spyOn(component,'openSidebar');
		component.openSidebar('',true);
	});
	
});
