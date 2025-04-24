import { ConstructionSystemMainEstimateCompareFlags } from '../model/enums/cos-estimate-compare-flags-enum';

interface IItem {
	compareFlags: ConstructionSystemMainEstimateCompareFlags;
}
/**
 * image processor for constructionsystem main Line Item/Resource (field 'CompareFlag') container.
 */
export class ConstructionSystemMainCompareFlagImageService {
	public selectImage(item: IItem) {
		let image = 'cloud.style/content/images/status-icons.svg#';
		switch (item.compareFlags) {
			case ConstructionSystemMainEstimateCompareFlags.Unmodified:
				image += 'ico-status23';
				break;
			case ConstructionSystemMainEstimateCompareFlags.New:
				image += 'ico-status04';
				break;
			case ConstructionSystemMainEstimateCompareFlags.Delete:
				image += 'ico-status01';
				break;
			case ConstructionSystemMainEstimateCompareFlags.Modified:
				image += 'ico-status25';
				break;
			default:
				image += 'ico-status33';
				break;
		}
		return image;
	}
}
