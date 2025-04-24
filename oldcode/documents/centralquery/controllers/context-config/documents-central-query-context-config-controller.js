	/**
	 * Created by jie on 2024.09.03.
	 */
	(function () {
		'use strict';
		var moduleName = 'documents.centralquery';
		angular.module(moduleName).controller('DocumentsCentralQueryContextConfigController',
			['$scope',
				'$translate',
				'invoiceHeaderElementValidationService',
				'basicsLookupdataLookupFilterService',
				'procurementContextService',
				'basicsLookupdataLookupDescriptorService',
				'procurementInvoiceHeaderDataService',
				'procurementCommonCodeHelperService',
				'platformRuntimeDataService',
				'$timeout',
				'$http',
				'basicsCommonUniqueFieldsProfileService',
				'documentsCentralQueryContextConfigFieldsValue',
				'dialogUserSettingService',
				'globals',
				function (
					$scope,
					$translate,
					invoiceHeaderElementValidationService,
					basicsLookupdataLookupFilterService,
					procurementContextService,
					basicsLookupdataLookupDescriptorService,
					procurementInvoiceHeaderDataService,
					codeHelperService,
					platformRuntimeDataService,
					$timeout,
					$http,
					basicsCommonUniqueFieldsProfileService,
					documentsCentralQueryContextConfigFieldsValue,
					dialogUserSettingService,
					globals) {
					$scope.entity ={};
					$scope.updateOptions = {
						uniqueFieldsProfile:'',
						radioValue: {
							selectedStructure: 'structure',
							selectedCusField: 'customize'
						},
						radioOption:null
					};

					const dialogId = '20E3EE2645A14E7E813DD787E9A17A4F';
					let identityName = 'documents.centralquery.context.config';
					let title ='documents.centralquery.contextTitle'
					let uniqueFieldsProfileService = basicsCommonUniqueFieldsProfileService.getService(identityName,title);
					$scope.serviceoptions = {service: uniqueFieldsProfileService};

					init();

					function init() {
						uniqueFieldsProfileService.load().then(e=>{
							loadModalInfo();
						});
						uniqueFieldsProfileService.selectItemChanged.register(onSelectItemChanged);
						updateDynamicUniqueFields();
					}

					function loadModalInfo() {
						$http.get(globals.webApiBaseUrl + 'basics/common/option/getprofile?groupKey=' + identityName + '&appId=' + dialogId.toLowerCase()).then((e)=>{
								if(e.data && e.data.length > 0) {
									const profileData =e.data[0].PropertyConfig ? JSON.parse(e.data[0].PropertyConfig) : {};
									$scope.updateOptions.radioOption = profileData.radioOption;
									uniqueFieldsProfileService.setSelectedItemDesc(profileData.uniqueFieldsProfile);
								}
						});
					}

					function saveProfile() {
						const dataInfo =  {
							radioOption:$scope.updateOptions.radioOption,
							uniqueFieldsProfile:$scope.updateOptions.uniqueFieldsProfile,
							profile:uniqueFieldsProfileService.getSelectedItem()
						}
						let profile={};
						profile.ProfileName= 'documents.centralquery.unique.profile';
						profile.ProfileAccessLevel= 'User';
						profile.GroupKey = identityName;
						profile.AppId = dialogId.toLowerCase();
						profile.PropertyConfig = JSON.stringify(dataInfo);
						$http.post(globals.webApiBaseUrl + 'basics/common/option/saveprofile',profile);

						const radioOption = $scope.updateOptions.radioOption;
						const uniqueFieldsProfile = $scope.updateOptions.uniqueFieldsProfile;
						dialogUserSettingService.setCustomConfig(dialogId, 'radioOption', radioOption);
						dialogUserSettingService.setCustomConfig(dialogId, 'uniqueFieldsProfile', uniqueFieldsProfile);
					}

					function onSelectItemChanged() {
						let profile = uniqueFieldsProfileService.getSelectedItem();
						$scope.updateOptions.uniqueFieldsProfile = uniqueFieldsProfileService.getDescription(profile);
					}

					$scope.modalOptions.headerText = $scope.modalTitle = $translate.instant('documents.centralquery.contextConfigTitle');

					$scope.enableOK = function () {
						return _.isNil($scope.updateOptions.radioOption);
					};

					$scope.modalOptions.ok = async function onOK() {
						try {
							saveProfile();
						} catch (error) {
							console.error('An error occurred:', error);
						} finally {
							$scope.$parent.$close(false);
						}
					};

					function getUniqueFields(){
						return angular.copy(documentsCentralQueryContextConfigFieldsValue.getWithDynamicFields());
					}

					function updateDynamicUniqueFields() {
						const fields= getUniqueFields();
						$scope.entity.uniqueFields = getUniqueFields(fields);
						uniqueFieldsProfileService.updateDefaultFields(fields);
					}

					$scope.close = function () {
						$scope.$parent.$close(false);
					};
					$scope.modalOptions.cancel = $scope.close;

					$scope.$on('$destroy', function () {
						uniqueFieldsProfileService.reset();
						uniqueFieldsProfileService.selectItemChanged.unregister(onSelectItemChanged);
					});
				}
			]);
	})(angular);