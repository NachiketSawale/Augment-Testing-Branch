/**
 * Created by zwz on 7/16/2018.
 */
(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'transportplanning.package';
	angular.module(moduleName).constant('packageTypes', {
		Product: 1,
		Bundle: 2,
		Resource: 3,
		ResourceReservation: 4,
		Material: 5,
		MaterialRequisition: 6,//because packagetypes ResourceReservation(4),MaterialRequisition(6) have been referenced this packagetype,keep these two packagetypes at the moment.(by zwz)
		//PackageSelection: 7,
		TransportRequisition: 10,
		Package: 11,
		Plant: 12,
		properties: {
			1: {
				directive: 'productionplanning-common-product-lookup-new',
				lookupType: 'CommonProduct',
				displayMember: 'Code',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				weightPropertyName: 'Weight',
				weightUomPropertyName: 'BasUomWeightFk',
				lengthPropertyName: 'Length',
				lengthUomPropertyName: 'BasUomLengthFk',
				widthPropertyName: 'Width',
				widthUomPropertyName: 'BasUomWidthFk',
				heightPropertyName: 'Height',
				heightUomPropertyName: 'BasUomHeightFk',
				version: 3
			},
			2: {
				directive: 'transportplanning-bundle-lookup',
				lookupType: 'TrsBundleWithDocLookup',
				displayMember: 'Code',
				weightPropertyName: 'ProductCollectionInfo.ProductsWeightSum.Value',
				weightUomPropertyName: 'BasUomWeightFk',
				lengthPropertyName: 'ProductCollectionInfo.ProductsMaxLength.Value',
				lengthUomPropertyName: 'BasUomLengthFk',
				widthPropertyName: 'ProductCollectionInfo.ProductsMaxWidth.Value',
				widthUomPropertyName: 'BasUomWidthFk',
				heightPropertyName: 'ProductCollectionInfo.ProductsHeightSum.Value',
				heightUomPropertyName: 'BasUomHeightFk',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				assignedRecordKey: 'transportplanningBundleToPackage'
			},
			3: {
				directive: 'transportplanning-package-resource-lookup',//'resource-master-resource-lookup-dialog-new',
				lookupType: 'ResourceMasterResource',
				displayMember: 'Code',
				uomFkPropertyName: 'UomBasisFk',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				version: 3
			},
			4: {
				directive: 'resource-reservation-lookup-dialog-new',
				lookupType: 'ResourceReservation',
				displayMember: 'Description',
				uomFkPropertyName: 'UomFk',
				resourceFkPropertyName: 'ResourceFk',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				version: 3
			},
			5: {
				directive: 'basics-material-material-lookup',
				lookupType: 'MaterialCommodity',
				displayMember: 'DescriptionInfo.Translated',
				weightPropertyName: 'Weight',
				uomFkPropertyName: 'BasUomFk',
				weightUomPropertyName: 'BasUomWeightFk',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				// dangerClassPropertyName: 'DangerClassFk',
				// packageTypePropertyName: 'PackageTypeFk',
				// dangerQuantityPropertyName: 'Volume',
				// dangerUomProperty: 'UomVolumeFk'
			},
			6: {
				directive: 'transportplanning-requisition-mat-requisition-lookup',
				lookupType: 'TrsMaterialRequisition',
				displayMember: 'Id',
				materialFkPropertyName: 'MdcMaterialFk',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				version: 3
			},
			//7:{directive:'transportplanning-package-selection-lookup', lookupType: 'TrsPackageLookup',displayMember: 'Code', version: 3},
			10: {
				//directive: 'transportplanning-requisition-for-package-lookup',
				directive: 'transportplanning-requisition-lookup-dialog',
				lookupType: 'TrsRequisition',
				displayMember: 'Code',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				weightPropertyName: 'BundleCollectionInfo.ProductsWeightSum.Value',
				weightUomPropertyName: 'BasUomWeightFk',
				lengthPropertyName: 'BundleCollectionInfo.ProductsMaxLength.Value',
				lengthUomPropertyName: 'BasUomLengthFk',
				widthPropertyName: 'BundleCollectionInfo.ProductsMaxWidth.Value',
				widthUomPropertyName: 'BasUomWidthFk',
				heightPropertyName: 'BundleCollectionInfo.ProductsHeightSum.Value',
				heightUomPropertyName: 'BasUomHeightFk',
				version: 3
			},
			//11:{directive:null}
			12: {
				directive: 'resource-equipment-plant-lookup-dialog-new',
				lookupType: 'equipmentPlant',
				displayMember: 'Code',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				uomFkPropertyName: 'UoMFk',
				dangerClassPropertyName: 'DangerClassFk',
				packageTypePropertyName: 'PackageTypeFk',
				dangerQuantityPropertyName: 'DangerCapacity',
				dangerUomProperty: 'UomDcFk',
				version: 3
			}
		}
	});
})(angular);

