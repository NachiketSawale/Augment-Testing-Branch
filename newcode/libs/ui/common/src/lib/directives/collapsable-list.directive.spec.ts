/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IMenuItemsList } from '../model/menu-list/interface/menu-items-list.interface';

import { PlatformModuleManagerService } from '@libs/platform/common';

import { UiCommonModule } from '../ui-common.module';
import { CollapsableListDirective } from './collapsable-list.directive';
import { TranslatePipe } from '@libs/platform/common';
import { MenuListOverflowComponent } from '../components/menu-list/menu-list-overflow/menu-list-overflow.component';
import { menu } from '../mock-data/menu-list.mockdata';
let elem: ElementRef;

const tools: IMenuItemsList = menu;
@Component({
	template: `
		<div class="tools">
			<div class="tools" uiCommonCollapsableList [tools]="toolItem"></div>
			<ui-common-menu-list [menu]="toolItem"></ui-common-menu-list>
			<h5 class="title fix font-bold">Clerks</h5>
			<li class="fix">
				<ui-common-menu-list-overflow [menuItem]="toolItem.items[toolItem.items.length-1]">
					<button type="button" title="Viewer Configuration" class="ico-menu dropdown-toggle tlb-icons menu-button"></button>
				</ui-common-menu-list-overflow>
			</li>
			<li class="collapsable" style="width:200px">
				<div><button type="button" title="wizards" name="t200" class="tlb-icons ico-delete"></button></div>
			</li>
			<li class="collapsable" style="width:auto" hidden>
				<div><button type="button" title="wizards" name="t200" class="tlb-icons ico-delete"></button></div>
			</li>
		</div>
	`,
})
class HostComponent {
	public toolItem = tools;
	public constructor(private element: ElementRef) {
		elem = this.element;
	}
	
}
describe('CollapsableListDirective', () => {
	let fixture: ComponentFixture<HostComponent>;
	let directive: CollapsableListDirective;
	let mainview: PlatformModuleManagerService;
	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [UiCommonModule],
			declarations: [HostComponent, CollapsableListDirective,MenuListOverflowComponent ],
			providers: [{ provide: ElementRef, useValue: elem }, PlatformModuleManagerService, TranslatePipe],
		});
		elem = TestBed.inject(ElementRef);
		mainview = TestBed.inject(PlatformModuleManagerService);
		directive = new CollapsableListDirective(elem, mainview);
		fixture = TestBed.createComponent(HostComponent);
		fixture.detectChanges();
	});

	it('should create an instance', () => {
		expect(directive).toBeTruthy();
	});

	it('test setOverflow ', () => {
		directive.tools = tools;
		const spyOn = jest.spyOn(directive, 'setOverflow');
		fixture.detectChanges();
		directive.setOverflow();
		
		expect(spyOn).toHaveBeenCalled();
	});

	it('updateToolsHTML should call calcSize', () => {
		directive.elem = elem;
		const spyOn = jest.spyOn(directive, 'calcSize');
		fixture.detectChanges();
		directive.updateToolsHTML();

		expect(spyOn).toHaveBeenCalled();
	});

	it('test calSize ', () => {
		directive.elem = elem;
		directive.tools = tools;

		const spy1 = jest.spyOn(directive, 'filterTypeDivider');
		const spy2 = jest.spyOn(directive, 'getElementWidth');
		const spy3 = jest.spyOn(directive, 'checkTitleMarkup');
		const spy4 = jest.spyOn(directive, 'getCollapsableElements');
		const spy5 = jest.spyOn(directive, 'checkPossibleElementsInToolbar');
		const spy6 = jest.spyOn(directive, 'setOverflow');

		fixture.detectChanges();
		directive.calcSize();

		expect(spy1).toHaveBeenCalled();
		expect(spy2).toHaveBeenCalled();
		expect(spy3).toHaveBeenCalled();
		expect(spy4).toHaveBeenCalled();
		expect(spy5).toHaveBeenCalled();
		expect(spy6).toHaveBeenCalled();
	});

});
