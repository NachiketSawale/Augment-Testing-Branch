/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { PlatformCommonModule, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedUserFormService, UserFormDisplayMode } from '@libs/basics/shared';
import { ItemType, UiCommonModule } from '@libs/ui/common';

@Component({
	selector: 'constructionsystem-main-user-form',
	templateUrl: './cos-user-form.component.html',
	styleUrls: ['./cos-user-form.component.scss'],
	standalone: true,
	imports: [NgIf, UiCommonModule, PlatformCommonModule],
})
export class CosUserFormComponent<T extends ICosInstanceEntity> extends EntityContainerBaseComponent<T> implements OnInit {
	private readonly userFormService = ServiceLocator.injector.get(BasicsSharedUserFormService);
	private readonly translateService = inject(PlatformTranslateService);
	protected hasForm: boolean = false;
	protected userFormLoading: boolean = false;

	public constructor(private elementRef: ElementRef) {
		super();
		this.entitySelection.selectionChanged$.subscribe(() => {
			this.loadUserFormByInstance().then();
		});
	}

	public ngOnInit(): void {
		this.updateTools();
	}

	private updateTools() {
		this.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'constructionsystem.main.taskBarFilter2QOff' },
				hideItem: false,
				iconClass: 'tlb-icons ico-maximized',
				id: 't1',
				fn: () => {
					const userFormContent = document.getElementById('user-form-container');
					if (userFormContent?.requestFullscreen) {
						userFormContent?.requestFullscreen().then();
					}
				},
				sort: 1,
				type: ItemType.Item,
			},
		]);
	}

	private async loadUserFormByInstance() {
		const selectedItem = this.entitySelection.getSelectedEntity();
		const container = this.elementRef.nativeElement.querySelector('div.user-form-container') as HTMLDivElement;
		if (!selectedItem || (!selectedItem?.FormId && !selectedItem?.FormDataFk)) {
			this.hasForm = false;
			this.userFormLoading = false;
			container.innerHTML = this.translateService.instant('constructionsystem.main.noUserForm').text;
			return;
		}
		this.hasForm = true;
		this.userFormLoading = true;
		this.userFormService
			.show({
				formId: selectedItem.FormId!,
				formDataId: selectedItem.FormDataFk ?? undefined,
				contextId: selectedItem.Id,
				isReadonly: false,
				modal: true,
				editable: true,
				displayMode: UserFormDisplayMode.Container,
				container: container,
			})
			.then(
				() => {
					this.userFormLoading = false;
				},
				(reason) => {
					this.userFormLoading = false;
					throw new Error(reason);
				},
			);
	}
}
