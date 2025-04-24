/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

import { cssClass } from '../../model/enum/web-api-help-style-class.enum';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

import { WebApiHelpMainLeftMenuComponent } from './webapihelp-main-leftmenu.component';

describe('WebApiHelpMainLeftMenuComponent', () => {
	let component: WebApiHelpMainLeftMenuComponent;
	let fixture: ComponentFixture<WebApiHelpMainLeftMenuComponent>;

	let entityTags = [{
		name: 'Clerk',
		urls: ['', ''],
	}];
	const mockSubmodules = [
		{
			name: 'Public',
			urls: ['', ''],
			entityTags: entityTags,
		}
	];
	const modules = [
		{
			name: 'Basic',
			subModules: mockSubmodules,
		}
	];
	const mockMenu = {
		apiRoutes: [],
		initialized: true,
		modules: modules,
		swaggerUINeedInit: false,
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [WebApiHelpMainLeftMenuComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(WebApiHelpMainLeftMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});


	it('leftMenubar should open', () => {
		jest.spyOn(component, 'leftMenubarToggle');
		component.leftMenubarToggle();
		expect(component.leftMenubarToggle).toBeDefined();
	});

	it('leftMenubar should close', () => {
		component.leftMenuStyle = cssClass.toggleIn;
		jest.spyOn(component, 'leftMenubarToggle');
		component.leftMenubarToggle();
		expect(component.leftMenubarToggle).toBeDefined();
	});

	it('leftMenubarGetData', inject([WebApiHelpMainService], (WebApiHelpService: WebApiHelpMainService) => {
		const spy = jest.spyOn(WebApiHelpService, 'getLeftMenubarData').mockReturnValue(of(mockMenu));
		const subspy = jest.spyOn(WebApiHelpService.getLeftMenubarData(), 'subscribe');
		component.leftMenubarGetData();
		expect(spy).toHaveBeenCalled();
		expect(subspy).toHaveBeenCalled();
	}));

	it('openChildNode', () => {
		component.accordianRotateFlag = true;
		component.childMenuToggle = true;
		jest.spyOn(component, 'openChildNode');
		component.openChildNode(mockSubmodules, 2);
		expect(component.openChildNode).toBeDefined();
	});
	it('openChildNode => accordianRotateFlag is false ', () => {
		jest.spyOn(component, 'openChildNode');
		component.openChildNode(mockSubmodules, 2);
		expect(component.openChildNode).toBeDefined();
	});


	it('swaggerLoadFromApi ', () => {
		jest.spyOn(component, 'swaggerLoadFromApi');
		component.swaggerLoadFromApi('Boq', 'PublicApi', 'Boq Item');
		expect(component.swaggerLoadFromApi).toBeDefined();
	});

	it('swaggerLoadFromApi for empty entity tag name', () => {
		jest.spyOn(component, 'swaggerLoadFromApi');
		component.swaggerLoadFromApi('Boq', 'PublicApi', '');
		expect(component.swaggerLoadFromApi).toBeDefined();
	});

	it('openSubChildNode ', () => {
		jest.spyOn(component, 'openSubChildNode');
		component.openSubChildNode(entityTags, 1, 'Boq', 'PublicApi');
		expect(component.openSubChildNode).toBeDefined();
	});

	it('openSubChildNode => entityTags is empty', () => {
		entityTags = [];
		jest.spyOn(component, 'openSubChildNode');
		component.openSubChildNode(entityTags, 1, 'Boq', 'PublicApi');
		expect(component.openSubChildNode).toBeDefined();
	});

	it('filterSidebar', () => {
		jest.spyOn(component, 'filterSidebar');
		component.leftMenubarData = modules;
		component.leftMenubarItems = modules;
		fixture.detectChanges();
		component.filterSidebar('basic');
		expect(component.filterSidebar).toBeDefined();
	});

	it('filterSidebar', () => {
		jest.spyOn(component, 'filterSidebar');
		component.leftMenubarData = modules;
		component.leftMenubarItems = modules;
		fixture.detectChanges();
		component.filterSidebar('Address');
		expect(component.filterSidebar).toBeDefined();
	});

	it('filterSidebar for submodule', () => {
		jest.spyOn(component, 'filterSidebar');
		component.leftMenubarData = modules;
		component.leftMenubarItems = modules;
		fixture.detectChanges();
		component.filterSidebar('public');
		expect(component.filterSidebar).toBeDefined();
	});

	it('filterSidebar for entitytag', () => {
		jest.spyOn(component, 'filterSidebar');
		component.leftMenubarData = modules;
		component.leftMenubarItems = modules;
		fixture.detectChanges();
		component.filterSidebar('clerk');
		expect(component.filterSidebar).toBeDefined();
	});

	it('removeElementStyleClass', () => {
		jest.spyOn(component, 'removeElementStyleClass');
		component.leftMenubarItems = modules;
		fixture.detectChanges();
		component.removeElementStyleClass(modules[0], 0);
		expect(component.removeElementStyleClass).toBeDefined();
	});
});
