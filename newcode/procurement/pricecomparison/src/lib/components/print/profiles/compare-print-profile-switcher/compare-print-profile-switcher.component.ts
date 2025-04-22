/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IAdditionalSelectOptions, IControlContext, LookupEvent, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IComparePrintProfileEntity } from '../../../../model/entities/print/compare-print-profile-entity.interface';
import { ComparePrintConstants } from '../../../../model/constants/print/compare-print-constats';
import { DomainControlContext } from '../../../../model/classes/domain-control-context.class';

@Component({
	selector: 'procurement-pricecomparison-compare-print-profile-switcher',
	templateUrl: './compare-print-profile-switcher.component.html',
	styleUrls: ['./compare-print-profile-switcher.component.scss'],
})
export class ProcurementPricecomparisonComparePrintProfileSwitcherComponent {
	private readonly lookupFactory = inject(UiCommonLookupDataFactoryService);

	public fieldType = FieldType;
	public loadModelContext: IControlContext = ((owner: ProcurementPricecomparisonComparePrintProfileSwitcherComponent) => {
		return new DomainControlContext('print_profile_load_model', false, {
			get value(): string | undefined {
				return owner.loadModeValue;
			},
			set value(v: string) {
				owner.loadModeValue = v;
				owner.loadModeChanged.next(v);
			}
		});
	})(this);

	public loadDefaultOptions: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [{
				id: ComparePrintConstants.loadMode.default,
				displayName: {key: 'procurement.pricecomparison.printing.loadDefaultProfile'}
			}]
		}
	};

	public loadCurrentOptions: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [{
				id: ComparePrintConstants.loadMode.current,
				displayName: {key: 'procurement.pricecomparison.printing.loadCurrentView'}
			}]
		}
	};

	public genericSvc = this.lookupFactory.fromItems<IComparePrintProfileEntity, object>([], {
		uuid: '15552e4703354e40998522fff3909657',
		valueMember: 'Id',
		displayMember: 'DisplayText'
	});

	public rfqSvc = this.lookupFactory.fromItems<IComparePrintProfileEntity, object>([], {
		uuid: '471df1c3f14c4846825d7d9d450f46ec',
		valueMember: 'Id',
		displayMember: 'DisplayText'
	});

	@Input()
	public loadModeValue?: string;

	@Input()
	public genericSelectedValue?: number;

	@Input()
	public rfqSelectedValue?: number;

	@Input()
	public set genericProfiles(profiles: IComparePrintProfileEntity[]) {
		this.genericSvc.setItems(profiles);
	}

	@Input()
	public set rfqProfiles(profiles: IComparePrintProfileEntity[]) {
		this.rfqSvc.setItems(profiles);
	}

	@Output()
	public loadModeChanged = new EventEmitter<string>();

	@Output()
	public genericProfileChanged = new EventEmitter<IComparePrintProfileEntity>();

	@Output()
	public rfqProfileChanged = new EventEmitter<IComparePrintProfileEntity>();

	public onGenericProfileChanged(event: LookupEvent<IComparePrintProfileEntity, object>) {
		this.genericProfileChanged.next(event.selectedItem as IComparePrintProfileEntity);
	}

	public onRfqProfileChanged(event: LookupEvent<IComparePrintProfileEntity, object>) {
		this.rfqProfileChanged.next(event.selectedItem as IComparePrintProfileEntity);
	}
}
