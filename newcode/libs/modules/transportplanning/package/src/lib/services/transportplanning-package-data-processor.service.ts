import { Injectable } from '@angular/core';
import { ITransportPackageEntityGenerated } from '../model/models';
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { TransportplanningPackageDataService } from './transportplanning-package-data.service';

@Injectable({
	providedIn: 'root',
})
export class TransportPlanningPackageDataProcessorService<T extends ITransportPackageEntityGenerated> implements IEntityProcessor<T> {
	private dataService!: TransportplanningPackageDataService;

	/**
	 * Dynamically set the data service to avoid circular dependency.
	 */
	public setDataService(dataService: TransportplanningPackageDataService): void {
		this.dataService = dataService;
	}

	/**
	 * Process readonly logic
	 */
	public process(item: ITransportPackageEntityGenerated): void {
		if (!item) {
			return;
		}

		const readonlyFields: IReadOnlyField<ITransportPackageEntityGenerated>[] = [
			{ field: 'TrsPkgTypeFk', readOnly: true},
			{ field: 'ProjectFk', readOnly: true },
			{ field: 'TrsRouteFk', readOnly: true },
			{ field: 'LgmJobSrcFk', readOnly: true },
			{ field: 'LgmJobDstFk', readOnly: true },
			{ field: 'TrsWaypointSrcFk', readOnly: true },
			{ field: 'TrsWaypointDstFk', readOnly: true },
			{ field: 'UomFk', readOnly: true },
			{ field: 'DangerclassFk', readOnly:true },
			{ field: 'PackageTypeFk', readOnly: true },
			{ field: 'DangerQuantity', readOnly: true },
			{ field: 'UomDGFk', readOnly: true },
			{ field: 'Code', readOnly: true },
			{ field: 'TransportPackageFk', readOnly: true },
			{ field: 'LgmDispatchHeaderFk', readOnly: true },
			{ field: 'LgmDispatchRecordFk', readOnly: true },
			{ field: 'Quantity', readOnly: true },
			{ field: 'Good', readOnly: true },
			{ field: 'Weight', readOnly: true },
			{ field: 'UomWeightFk', readOnly: true },
			{ field: 'Length', readOnly: true },
			{ field: 'UomLengthFk', readOnly: true },
			{ field: 'Width', readOnly: true },
			{ field: 'UomWidthFk', readOnly: true },
			{ field: 'Height', readOnly: true },
			{ field: 'UomHeightFk', readOnly: true },
			{ field: 'LengthCalculated', readOnly: true },
			{ field: 'WidthCalculated', readOnly: true },
			{ field: 'HeightCalculated', readOnly: true },
			{ field: 'WeightCalculated', readOnly: true },
		];

		this.dataService.setEntityReadOnlyFields(item, readonlyFields);
	}

	/**
	 * Reverts any processing changes made to transport planning package entities.
	 */
	public revertProcess(): void {}
}
