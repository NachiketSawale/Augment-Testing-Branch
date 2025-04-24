/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { IPackageRemarkAccessor, PACKAGE_REMARK_ACCESSOR } from '../../model/entities/package-remark-accessor.interface';
import { PackageRemarkName } from '../../model/enums/package-remark-name.enum';

/**
 * package remark container.
 */
@Component({
	selector: 'procurement-package-remark-container',
	templateUrl: './package-remark-container.component.html',
	styleUrl: './package-remark-container.component.scss',
})
export class ProcurementPackageRemarkContainerComponent<T extends object> extends EntityContainerBaseComponent<T> implements OnInit {
	public selected?: T;
	public remarkName = PackageRemarkName;
	public accessor = inject<IPackageRemarkAccessor<T>>(PACKAGE_REMARK_ACCESSOR);
	public constructor() {
		super();
	}

	public showRemarkGroup = true;
	public showRemark2Group = true;
	public showRemark3Group = true;
	public toggleOpen(index: number) {
		switch (index) {
			case 0:
				this.showRemarkGroup = !this.showRemarkGroup;
				break;
			case 1:
				this.showRemark2Group = !this.showRemark2Group;
				break;
			case 2:
				this.showRemark3Group = !this.showRemark3Group;
				break;
		}
	}
	private updateSelected(selections: T[]) {
		if (selections.length > 0) {
			this.selected = selections[0];
		}
	}

	public handleChange(value: string, remarkName: PackageRemarkName): void {
		this.accessor.setText(remarkName, this.selected!, value);
		this.entityModification!.setModified([this.selected!]);
	}

	public ngOnInit(): void {
		this.updateSelected(this.entitySelection.getSelection());

		const selSub = this.entitySelection.selectionChanged$.subscribe((e) => {
			this.updateSelected(e);
		});

		this.registerFinalizer(() => selSub.unsubscribe());
	}
}
