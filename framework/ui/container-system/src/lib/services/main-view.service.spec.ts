/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { IEditorPanels } from '../components/container-layouts/interfaces/container-layout.interface';

import { UiContainerSystemMainViewService } from './main-view.service';

describe('UiContainerSystemMainViewService', () => {
	let service: UiContainerSystemMainViewService;
	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(UiContainerSystemMainViewService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should be defined getPaneData()', () => {
		expect(service.getPaneData).toBeTruthy();
		const data = service.getPaneData();
		expect(service.getPaneData).toBeDefined();
		expect(service.getPaneData()).toBe(data);
	});

	it('should be defined setPaneData()', () => {
		const data: IEditorPanels[] = [
			{
				panel: [
					{
						content: ['f01193df20e34b8d917250ad17a433f1', 'c2dd899746024732aa0fc583526f04eb'],
						pane: 'pane-l',
					},
				],
			},
			{
				panel: [
					{
						content: ['8b10861ea9564d60ba1a86be7e7da568', '6122eee3bf1a41ce994e0f1e5c165850', 'dde598002bbf4a2d96c82dc927e3e578'],
						pane: 'pane-r',
					},
				],
			},
		];
		expect(service.setPaneData).toBeTruthy();
		expect(service.setPaneData).toBeDefined();
		const modalId = jest.spyOn(service, 'setPaneData'); // spy first
		service.setPaneData(data);
		expect(modalId).toHaveBeenCalledWith(data);
	});

	
});
