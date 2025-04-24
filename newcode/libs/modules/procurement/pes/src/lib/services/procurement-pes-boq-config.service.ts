import { Injectable } from '@angular/core';
import { BoqCompositeConfigService } from '@libs/boq/main';
import { EntityDomainType } from '@libs/platform/data-access';
import { IInitializationContext, prefixAllTranslationKeys, Translatable } from '@libs/platform/common';
import { ContainerLayoutConfiguration } from '@libs/ui/business-base';
import { IPesBoqEntity } from '../model/entities/pes-boq-entity.interface';

// TODO-BOQ-Pes module is currently not working. So not able to test. Need to add the missing fields and overloads and test once pes module is working.
@Injectable({providedIn: 'root'})
export class ProcurementPesBoqConfigService extends BoqCompositeConfigService<IPesBoqEntity> {
	protected properties = {
		...this.getBoqItemProperties(),
		...this.getBoqHeaderProperties(),
		...{
			'PrcBoq.PackageFk':            { domain: EntityDomainType.Integer, mandatory: false },
			'PrcBoq.MdcControllingunitFk': { domain: EntityDomainType.Integer, mandatory: false },
		}
	};

	protected override getLabels(): {[key: string]: Translatable} {
		return {
			...super.getLabels(),
			...prefixAllTranslationKeys('cloud.common.', {
				'PrcBoq.PackageFk':            'entityPackageCode',
				'PrcBoq.MdcControllingunitFk': 'entityControllingUnitCode'
			}),
		};
	}

	public getPesBoqLayoutConfiguration(ctx: IInitializationContext): ContainerLayoutConfiguration<IPesBoqEntity> {
		return {
			groups: this.getLayoutGroups(),
			labels: this.getLabels(),
			additionalOverloads: {
				...this.getOverloads(),
				// 'PrcBoq.PackageFk':
				// 'PrcBoq.MdcControllingunitFk':
			},
		};
	}
}