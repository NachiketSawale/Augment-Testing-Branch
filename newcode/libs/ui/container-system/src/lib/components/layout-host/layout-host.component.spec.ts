/*
 * Copyright(c) RIB Software GmbH
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orientation } from '@libs/platform/common';

import { UiContainerSystemLayoutHostComponent } from './layout-host.component';

import { IPaneDefinition, IPaneLayout } from '../../model/container-pane.model';
import { HttpClientModule } from '@angular/common/http';
import { FormContainerComponent } from '../form-container/form-container.component';
import { ContainerDefinition } from '../../model/container-definition.class';


describe('LayoutHostComponent', () => {
	// TODO: replace with actual test cases
	// it('is successful', () => {
	// 	expect(true).toBeTruthy();
	// });

	const activeTab: IPaneDefinition = {
		'name': 'pane-l',
		'no': 1,
		'size': 37.71551724137931,
		'activeTab': 0,
		'containers': [
			new ContainerDefinition({
				containerType: FormContainerComponent,
				uuid: 'cd1fc59aa30149c487bedcfc38704ab5',
				title: { text: 'basics.country.detailCountryTitle', key: 'Country Details' },
			}),
			new ContainerDefinition({
				containerType: FormContainerComponent,
				uuid: 'cd1fc59aa30149c487bedcfc38704ab5',
				title: { text: 'basics.country.detailCountryTitle', key: 'Country Details' },
			}),
		],
		'collapsed': false
	};

	let component: UiContainerSystemLayoutHostComponent;
	let fixture: ComponentFixture<UiContainerSystemLayoutHostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule],
			declarations: [UiContainerSystemLayoutHostComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UiContainerSystemLayoutHostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	
	it('should called handleContainerSize for maximize', () => {
		const panelName = 'pane-l';
		const paneData: IPaneLayout = {
			'layout': 'layout1',
			'selectorName': 'horizontal',
			'panes': [
				{
					'activeTab': 1,
					'name': 'pane-l',
					'no': 1,
					'size': 50,
					'containers': [
						new ContainerDefinition({
							containerType: FormContainerComponent,
							uuid: 'cd1fc59aa30149c487bedcfc38704ab5',
							title: { text: 'basics.country.detailCountryTitle', key: 'Country Details' },
						}),
						new ContainerDefinition({
							containerType: FormContainerComponent,
							uuid: 'cd1fc59aa30149c487bedcfc38704ab5',
							title: { text: 'basics.country.detailCountryTitle', key: 'Country Details' },
						}),
					]
				},
				{
					'name': 'pane-r',
					'no': 2,
					'size': 50,
					'containers': []
				}
			],
			orientation: Orientation.Horizontal
		};
		component.layoutService.paneActiveTab = activeTab;
		component.paneLayout = paneData;
		expect(component.handleContainerSize(panelName));
	});

	it('should called handleContainerSize for maximize with child panes', () => {
		const panelName = 'pane-lt';
		const paneData: IPaneLayout = {
			'layout': 'layout2',
			'orientation': Orientation.Horizontal,
			'selectorName': 'horizontal',
			'panes': [
				{
					'activeTab': 1,
					'name': 'pane-l',
					'no': 1,
					'size': 50,
					'containers': [
						new ContainerDefinition({
							containerType: FormContainerComponent,
							uuid: 'cd1fc59aa30149c487bedcfc38704ab5',
							title: { text: 'basics.country.detailCountryTitle', key: 'Country Details' },
						}),
						new ContainerDefinition({
							containerType: FormContainerComponent,
							uuid: 'cd1fc59aa30149c487bedcfc38704ab5',
							title: { text: 'basics.country.detailCountryTitle', key: 'Country Details' },
						}),
					]
				},
				{
					'name': 'pane-r',
					'no': 2,
					'size': 50,
					'containers': []
				}
			]
		};
		component.paneLayout = paneData;
		component.layoutService.paneActiveTab = activeTab;
		expect(component.handleContainerSize(panelName));
	});

	it('should called updateActiveTabdata', () => {
		const paneData: IPaneLayout = {
			'layout': 'layout1',
			'selectorName': 'horizontal',
			'panes': [
				{
					'activeTab': 1,
					'name': 'pane-l',
					'no': 1,
					'size': 50,
					'containers': [
						new ContainerDefinition({
							containerType: FormContainerComponent,
							uuid: 'cd1fc59aa30149c487bedcfc38704ab5',
							title: { text: 'basics.country.detailCountryTitle', key: 'Country Details' },
						}),
						new ContainerDefinition({
							containerType: FormContainerComponent,
							uuid: 'cd1fc59aa30149c487bedcfc38704ab5',
							title: { text: 'basics.country.detailCountryTitle', key: 'Country Details' },
						}),
					]
				},
				{
					'name': 'pane-r',
					'no': 2,
					'size': 50,
					'containers': []
				}
			],
			orientation: Orientation.Horizontal
		};

		component.paneLayout = paneData;
		component.layoutService.paneActiveTab = activeTab;
		expect(component.updateActiveTabData(activeTab));
	});
});
