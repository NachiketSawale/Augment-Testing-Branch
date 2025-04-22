/**
 * Copyright(c) RIB Software GmbH
 */

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

//import { ItemType } from '@libs/ui/common';

import { PlatformCommonMainviewService, PlatformPermissionService, PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { ContainerGroupComponent } from './container-group.component';
import { ContainerBaseComponent } from '../container-base/container-base.component';
import { ToolbarComponent } from '@libs/ui/common';
import { UiCommonPopupContainerComponent } from '@libs/ui/common';
import { MenuListComponent } from '@libs/ui/common';
import { UiContainerSystemAccessDeniedContainerComponent } from '../access-denied-container/access-denied-container.component';
import { ContainerDefinition } from '../../model/container-definition.class';
// TODO: Probably, this should not be used and replaced with AccordionComponent instead.
//import { CollapsableListDirective } from '@libs/ui/common';

@Component({
	template: '<div></div>'
})
class HostComponent extends ContainerBaseComponent {
	public constructor() {
		super();
	}
}

describe('ContainerGroupComponent', () => {
	let component: ContainerGroupComponent;
	let fixture: ComponentFixture<ContainerGroupComponent>;
	const activecontainer = [
		new ContainerDefinition({
			containerType: HostComponent,
			id: '1',
			permission: 'f01193df20e34b8d917250ad17a433f1',
			title: { text: 'Clerks', key: 'Clerks' },
			uuid: 'f01193df20e34b8d917250ad17a433f1',
		}),
	];
/*
	const tools = [
		{
			isVisible: true,
			cssClass: 'tools ',
			items: [
				{
					caption: {
						text: 'wizards',
						key: 'wizards',
					},
					iconClass: 'tlb-icons ico-delete',
					permission: {
						f01193df20e34b8d917250ad17a433f1: 8,
					},
					isSet: true,
					hideItem: false,
					id: 't200',
					sort: 300,
					type: ItemType.Item,
				},
			],
			showImages: true,
			showTitles: false,
			overflow: true,
			iconClass: '',
			layoutChangeable: false,
			uuid: 'f01193df20e34b8d917250ad17a433f1',
		},
	];*/
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [ContainerGroupComponent, ToolbarComponent, UiCommonPopupContainerComponent, MenuListComponent, UiContainerSystemAccessDeniedContainerComponent/*, CollapsableListDirective*/, TranslatePipe],
			providers: [PlatformTranslateService, PlatformPermissionService, ChangeDetectorRef, PlatformCommonMainviewService],
		}).compileComponents();
		fixture = TestBed.createComponent(ContainerGroupComponent);
		component = fixture.componentInstance;
		component.containers = activecontainer;
		//component.toolbarListData();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call toolbarData and get list of toolbar items', async () => {
		// TODO: fix based on revised toolbar interface
		/*toolbarService.updateTools.subscribe((res: IMenulistItem[]) => {
			fixture.detectChanges();
			expect(component.toolsList).toStrictEqual(res);
		});*/
	});

	it('should return list of toolbar items from uuid', () => {
		// TODO: fix based on revised toolbar interface
		/*component.getToolListFromUuid(null, tools);
		fixture.detectChanges();
		const toolbarData = component.getToolListFromUuid(activecontainer[0], tools);
		expect(toolbarData).toBeDefined();*/
	});

	it('should return toolbar Instance', () => {
		TestBed.runInInjectionContext(() => {
			inject(PlatformPermissionService);
			inject(PlatformCommonMainviewService);
			const obj = component.toolbarInstance;
			expect(obj).toBeDefined();
		});
	});
});
