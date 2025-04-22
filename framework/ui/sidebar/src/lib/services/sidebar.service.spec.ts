/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { SidebarTab } from '../model/class/sidebar-tab.class';
import { UiSidebarService } from './sidebar.service';
import { SidebarOptions } from '../model/class/sidebar-options.class';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const tabs = [
	new SidebarTab(
	'sidebar-report',
	{ key: 'cloud.desktop.sdCmdBarReport' },
	'sidebar-icons',
	'ico-report',
	8,
	()=>{
		return import('../components/report-sidebar/report-sidebar-tab/report-sidebar-tab.component').then(special => {
		return special.UiSidebarReportTabComponent;
	});
	}
)];

describe('SidebarService', () => {
	let service: UiSidebarService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [UiSidebarService]
		});
		service = TestBed.inject(UiSidebarService);
		service.sidebarOptions = new SidebarOptions();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});


	//Test suit for initializeSidebar
	it('should call initializeSidebar', () => {
		service.initializeSidebar();
	});

	//Test suit for clickTab
	it('should call clickTab', () => {
		service.activeTab$.subscribe(data=>{
			expect(data).toBe('sidebar-lastobjects');

		});
		service.clickTab({
			item: {
				id: 'sidebar-lastobjects'
			},
			context: undefined,
			isChecked: false
		});
	});

	//Test suit for clickTab
	it('should call clickTab for same id', () => {
		service.sidebarOptions.activeValue='sidebar-lastobjects';
		service.activeTab$.subscribe(data=>{
			expect(data).toBe('sidebar-lastobjects');

		});
		service.clickTab({
			item: {
				id: 'sidebar-lastobjects'
			},
			context: undefined,
			isChecked: false
		});
	});

	//Test suit for addSidebarTabs for array of data
	it('should call addSidebarTabs', () => {
		service.sidebarOptions.items=tabs;

		const tabData = [
			new SidebarTab(
			'sidebar-report',
			{ key: 'cloud.desktop.sdCmdBarReport' },
			'sidebar-icons',
			'ico-report',
			8,
			()=>{
				return import('../components/report-sidebar/report-sidebar-tab/report-sidebar-tab.component').then(special => {
				return special.UiSidebarReportTabComponent;
			});
			}
		)];
		service.addSidebarTabs(tabData);
	});

	//Test suit for addSidebarTabs for different tabs data
	it('should call addSidebarTabs', () => {
		service.sidebarOptions.items=tabs;

		const tabData = [
			new SidebarTab(
			'sidebar-report',
			{ key: 'cloud.desktop.sdCmdBarReport' },
			'sidebar-icons',
			'ico-report',
			8,
			()=>{
				return import('../components/report-sidebar/report-sidebar-tab/report-sidebar-tab.component').then(special => {
				return special.UiSidebarReportTabComponent;
			});
			}
		)];
		service.addSidebarTabs(tabData);
	});

	//Test suit for removeSidebarTabs for array of data
	it('should call removeSidebarTabs', () => {
		service.sidebarOptions.items=tabs;

		const tabData = ['sidebar-report'];
		service.removeSidebarTabs(tabData);
	});

	//Test suit for updateSidebarTabs for array of data
	it('should call updateSidebarTabs', () => {
		service.sidebarOptions.items=tabs;

		const tabData = [
			new SidebarTab(
			'sidebar-report',
			{ key: 'cloud.desktop.sdCmdBarReport' },
			'sidebar-icons',
			'ico-report',
			8,
			()=>{
				return import('../components/report-sidebar/report-sidebar-tab/report-sidebar-tab.component').then(special => {
				return special.UiSidebarReportTabComponent;
			});
			}
		)];
		service.updateSidebarTabs(tabData);
	});

	//Test suit for sortSidebarItems for single tab
	it('should call sortSidebarItems', () => {
		// const data=[new SidebarTab(
		// 	'sidebar-lastobjects',
		// 	{ key: 'cloud.desktop.sdCmdBarLastObjects' },
		// 	'sidebar-icons',
		// 	'ico-last-objects',
		// 	1,
		// 	()=>{
		// 		return import('../components/history-sidebar-tab/history-sidebar-tab.component').then(comp=>{
		// 		return comp.UiSidebarHistorySidebarTabComponent;
		// 	});
		// 	}
		// ),
		// new SidebarTab(
		// 	'sidebar-quickstart',
		// 	{ key: 'cloud.desktop.sdCmdBarLastObjects' },
		// 	'sidebar-icons',
		// 	'ico-last-objects',
		// 	3,
		// 	()=>{
		// 		return import('../components/history-sidebar-tab/history-sidebar-tab.component').then(comp=>{
		// 		return comp.UiSidebarHistorySidebarTabComponent;
		// 	});
		// 	}
		// )];
		//service.sortSidebarItems(data);
	});

});
