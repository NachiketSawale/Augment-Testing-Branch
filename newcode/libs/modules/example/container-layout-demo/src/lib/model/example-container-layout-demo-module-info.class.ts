import { ContainerDefinition, ContainerModuleInfoBase } from '@libs/ui/container-system';
import { BasicsClerkAbsenceDetailComponent } from '../components/basics-clerk-absence-detail/basics-clerk-absence-detail.component';
import { BasicsClerkAbsenceProxyDetailComponent } from '../components/basics-clerk-absence-proxy-detail/basics-clerk-absence-proxy-detail.component';
import { BasicsClerkAbsenceProxyListComponent } from '../components/basics-clerk-absence-proxy-list/basics-clerk-absence-proxy-list.component';
import { BasicsClerkCharacteristicComponent } from '../components/basics-clerk-characteristic/basics-clerk-characteristic.component';
import { BasicsClerkDependentDataGenericComponent } from '../components/basics-clerk-dependent-data-generic/basics-clerk-dependent-data-generic.component';
import { BasicsClerkForEstimateDetailComponent } from '../components/basics-clerk-for-estimate-detail/basics-clerk-for-estimate-detail.component';
import { BasicsClerkForEstimateListComponent } from '../components/basics-clerk-for-estimate-list/basics-clerk-for-estimate-list.component';
import { BasicsClerkForPackageDetailComponent } from '../components/basics-clerk-for-package-detail/basics-clerk-for-package-detail.component';
import { BasicsClerkForProjectDetailComponent } from '../components/basics-clerk-for-project-detail/basics-clerk-for-project-detail.component';
import { BasicsClerkForScheduleDetailComponent } from '../components/basics-clerk-for-schedule-detail/basics-clerk-for-schedule-detail.component';
import { BasicsClerkForWicdEtailComponent } from '../components/basics-clerk-for-wicd-etail/basics-clerk-for-wicd-etail.component';
import { BasicsClerkAbsenceListComponent } from '../components/clerk-absence-list/clerk-absence-list.component';
import { BasicsClerkDetailComponent } from '../components/clerk-detail/clerk-detail.component';
import { BasicsClerkListComponent } from '../components/clerk-list/clerk-list.component';
import { BasicsClerkPhotoComponent } from '../components/clerk-photo/clerk-photo.component';
import { DemoImageViewerComponent } from '../components/demo-image-viewer/demo-image-viewer.component';


export class ExampleContainerLayoutDemoModuleInfo extends ContainerModuleInfoBase {

	public static readonly instance = new ExampleContainerLayoutDemoModuleInfo();

	private constructor(){
		super();
	}


	public override get internalModuleName(): string {
		return 'example.container-layout-demo';
	}

	/**
	 * Returns containers data
	 */
	protected override get containers(): ContainerDefinition[] {
		return [
			new ContainerDefinition(
				'6122eee3bf1a41ce994e0f1e5c165850',
				{
					text: 'Absence Details'
				},BasicsClerkAbsenceDetailComponent,
				'dde598002bbf4a2d96c82dc927e3e578',
				'basics.clerk.detailClerkAbsenceTitle'
			),
			new ContainerDefinition(
				'dde598002bbf4a2d96c82dc927e3e578',
				{
					text: 'Absences'
				},BasicsClerkAbsenceListComponent,
				'dde598002bbf4a2d96c82dc927e3e578',
				'3'
			),
			new ContainerDefinition(
				'c2dd899746024732aa0fc583526f04eb',
				{
					text: 'Characteristics'
				},BasicsClerkCharacteristicComponent,
				'c2dd899746024732aa0fc583526f04eb',
				'basics.clerk.characteristic.container'
			),
			new ContainerDefinition(
				'b5f01723e4c34b8d8f5b90262d7f0288',
				{
					text: 'Clerk Absence Proxies'
				},BasicsClerkAbsenceProxyListComponent,
				'b5f01723e4c34b8d8f5b90262d7f0288',
				'clerkabsenceproxylist'
			),
			new ContainerDefinition(
				'dcb1b0d146af4bec84d574de19a9f01b',
				{
					text: 'Clerk Absence Proxy Details'
				},BasicsClerkAbsenceProxyDetailComponent,
				'b5f01723e4c34b8d8f5b90262d7f0288',
				'clerkabsenceproxydetail'
			),
			new ContainerDefinition(
				'8b10861ea9564d60ba1a86be7e7da568',
				{
					text: 'Clerk Details'
				},BasicsClerkDetailComponent,
				'f01193df20e34b8d917250ad17a433f1',
				'2'
			),
			new ContainerDefinition(
				'8b10861ea9564d60ba1a86be7e7da569',
				{
					text: 'Demo Image Viewer'
				},DemoImageViewerComponent,
				'f01193df20e34b8d917250ad17a433f1',
				'7'
			),
			new ContainerDefinition(
				'874e6bfd2cad48bca4a578699a51ee81',
				{
					text: 'Clerk For Estimate Details'
				},BasicsClerkForEstimateDetailComponent,
				'd0919db314094f058b6eca179f017e6d',
				'clerkforestimatedetail'
			),
			new ContainerDefinition(
				'f8e0f47316db4f628e0f3c394e0bda2f',
				{
					text: 'Clerk For Package Details'
				},BasicsClerkForPackageDetailComponent,
				'4fefcbe307f14fb09e7371b5726e8b85',
				'clerkforpackagedetail'
			),
			new ContainerDefinition(
				'5af6320d446b4945a1d4f7daa9eb1013',
				{
					text: 'Clerk For Project Details'
				},BasicsClerkForProjectDetailComponent,
				'81de3f7a458942018890cd82b2333e5b',
				'clerkforprojectdetail'
			),
			new ContainerDefinition(
				'be18520a1fb34649bf3c4ebcd6da2eea',
				{
					text: 'Clerk For Schedule Details'
				},BasicsClerkForScheduleDetailComponent,
				'e84e703543fd4cb2b8d9bd8e48ecce94',
				'clerkforscheduledetail'
			),
			new ContainerDefinition(
				'6042e0bf1d66478da8042b3a207d77bf',
				{
					text: 'Clerk For WIC Details'
				},BasicsClerkForWicdEtailComponent,
				'9f5b6cfd39114a25b04b7ea69ef0ddc7',
				'clerkforwicdetail'
			),
			new ContainerDefinition(
				'880ec74c43cc4778b94cd26f1b6115e3',
				{
					text: 'Clerk Photo'
				},BasicsClerkPhotoComponent,
				'880ec74c43cc4778b94cd26f1b6115e3',
				'4'
			),
			new ContainerDefinition(
				'63e8434947da4497a2df4032bf8bc192',
				{
					text: 'Clerk User Container'
				},BasicsClerkDependentDataGenericComponent,
				'63e8434947da4497a2df4032bf8bc192',
				'1263'
			),
			new ContainerDefinition(
				'f01193df20e34b8d917250ad17a433f1',
				{
					text: 'Clerks'
				},BasicsClerkListComponent,
				'f01193df20e34b8d917250ad17a433f1',
				'1'
			),
			new ContainerDefinition(
				'd0919db314094f058b6eca179f017e6d',
				{
					text: 'Clerks For Estimate'
				},BasicsClerkForEstimateListComponent,
				'd0919db314094f058b6eca179f017e6d',
				'clerkforestimatelist'
			),
		];
	}

}