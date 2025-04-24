/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSidebarWorkflowSidebarTabComponent } from './workflow-sidebar-tab.component';
import { WorkflowTemplate } from '@libs/workflow/interfaces';
import { ITranslatable, PlatformCommonModule, PlatformLazyInjectorService, TranslatePipe } from '@libs/platform/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class PlatformLazyInjectorServiceMock { }

class UiSidebarWorkflowSidebarTabComponentMock extends UiSidebarWorkflowSidebarTabComponent {
	public override triggerSearch(): void {
		super.triggerSearch();
	}

	public override get searchIcon(): string {
		return super.searchIcon;
	}

	public override processData(): void {
		super.processData();
	}
}

describe('UiSidebarWorkflowSidebarTabComponent', () => {
	let component: UiSidebarWorkflowSidebarTabComponentMock;
	let fixture: ComponentFixture<UiSidebarWorkflowSidebarTabComponentMock>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PlatformCommonModule, HttpClientTestingModule],
			declarations: [UiSidebarWorkflowSidebarTabComponentMock, TranslatePipe],
			providers: [
				{ provide: PlatformLazyInjectorService, useValue: PlatformLazyInjectorServiceMock },
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSidebarWorkflowSidebarTabComponentMock);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize templateAccordionData with an empty array', () => {
		expect(component.templateAccordionData).toEqual([]);
	});

	it('should initialize toolbarData with the correct items', () => {
		if (component.toolbarData.items) {
			expect(component.toolbarData.items.length).toBe(4);
			expect((component.toolbarData.items[0].caption as ITranslatable).key).toBe('cloud.desktop.taskList.refresh');
			expect((component.toolbarData.items[1].caption as ITranslatable).key).toBe('cloud.desktop.filterdefFooterBtnSearch');

			expect(component.toolbarData.items[0].iconClass).toBe('tlb-icons ico-refresh');
			expect(component.toolbarData.items[1].iconClass).toBe('tlb-icons ico-search');
			expect(component.toolbarData.items[2].iconClass).toBe('tlb-icons ico-settings');
			expect(component.toolbarData.items[3].iconClass).toBe('control-icons ico-pin3');
		}
	});

	it('should initialize searchString with an empty string', () => {
		expect(component.searchString).toBe('');
	});

	it('should initialize asyncInProgress as false', () => {
		expect(component.asyncInProgress).toBe(false);
	});

	it('should initialize isSearchVisible as false', () => {
		expect(component.isSearchVisible).toBe(false);
	});

	it('should return the correct search icon', () => {
		expect(component.searchIcon).toBe(component.isSearchVisible ? 'tlb-icons ico-search-active' : 'tlb-icons ico-search');
	});

	it('should call filter method when filter is triggered', () => {
		jest.spyOn(component, 'filter');
		component.filter();
		expect(component.filter).toHaveBeenCalled();
	});

	it('should process workflow templates correctly', () => {
		const workflowTemplates: WorkflowTemplate[] = [
			{ Id: 1, Description: 'Template 1' },
			{ Id: 2, Description: 'Template 2' },
		] as WorkflowTemplate[];

		component.sortSetting = {
			id: 1,
			desc: false,
			value: 'NoSorting',
			property: '',
			displayMember: 'cloud.desktop.taskList.sorting.noSorting'
		};

		component.filteredWorkflowTemplates = workflowTemplates;
		component.processData();
		expect(component.templateAccordionData.length).toBe(2);
		expect(component.templateAccordionData[0].id).toBe(1);
		expect(component.templateAccordionData[0].title).toBe('Template 1');
		expect(component.templateAccordionData[1].id).toBe(2);
		expect(component.templateAccordionData[1].title).toBe('Template 2');
	});
});