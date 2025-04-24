(function (angular) {

	'use strict';

	angular.module('basics.common').directive('basicsCommonTelephoneDialog', ['$window', '$http', 'globals', 'basicsCommonInputDialogDirectiveFactory', 'basicsLookupdataLookupDescriptorService',
		function ($window, $http, globals, createDirective, basicsLookupdataLookupDescriptorService) {

			const defaults = {
				UUID: 'D42704A59B394C8383602161D8E4FA88',
				title: 'TelephoneDialog',
				title$tr$: 'cloud.common.telephoneDialogTitle',
				valueMember: 'Id',
				dialogTemplateId: 'telephone.template',
				cssClass: 'multiline',
				createOptions: {
					urlCreateGet: 'basics/common/telephonenumber/create',
					succeedCreate: function (item, getLocalStorage) {
						item.CountryFk = getLocalStorage('CountryFk') || item.CountryFk;
					}
				},
				formatterOptions: {
					displayMember: 'Telephone'
				},
				rows: [
					{
						'label': 'Country',
						'label$tr$': 'cloud.common.TelephoneDialogCountry',
						'model': 'CountryFk',
						'directive': 'basics-lookupdata-country-combobox',
						'type': 'directive'
					},
					{
						'label': 'Area Code',
						'label$tr$': 'cloud.common.TelephoneDialogAreaCode',
						'model': 'AreaCode',
						'type': 'description'
					},
					{
						'label': 'Phone Number',
						'label$tr$': 'cloud.common.TelephoneDialogPhoneNumber',
						'model': 'PhoneNumber',
						'type': 'description'
					},
					{
						'label': 'Extention',
						'label$tr$': 'cloud.common.TelephoneDialogExtention',
						'model': 'Extention',
						'type': 'description'
					},
					{
						'label': 'Telephone',
						'label$tr$': 'cloud.common.TelephoneDialogTelephone',
						'model': 'Telephone',
						'type': 'description',
						'readonly': true
					},
					{
						'label': 'Comment',
						'label$tr$': 'cloud.common.TelephoneDialogCommentText',
						'model': 'CommentText',
						'type': 'comment',
						'options': {}
					}
				],
				controllerFun: function (scope) {
					const isLookupDisplayColumn = scope.config ? scope.config.lookupDisplayColumn : false;

					const getPhoneImage = function () {
						const imgPos = globals.telephoneScheme.css.indexOf('ico-phone');
						return globals.telephoneScheme.css.substring(imgPos);
					};

					const getTelephoneNo = function () {
						let telephoneNo;
						if (isLookupDisplayColumn) {
							telephoneNo = scope.options.getItemText ? scope.options.getItemText(scope.ngModel) : '';
						} else {
							telephoneNo = scope.ngModel ? scope.ngModel.Telephone : '';
						}
						return telephoneNo;
					};

					if (isLookupDisplayColumn) {
						scope.options.displayMember = null;
					}

					if (globals.telephoneScheme && globals.telephoneScheme.id > 0) {
						scope.buttons2 = [
							{
								img: 'cloud.style/content/images/control-icons.svg#' + getPhoneImage(),
								execute: function () {
									const telephoneNo = getTelephoneNo();
									let link = globals.telephoneScheme.scheme + ':' + telephoneNo;
									if (globals.telephoneScheme.id === 2) {
										link += '?call';
									}
									$window.location.href = link;
								},
								canExecute: function () {
									return true;
								}
							}
						];
					}
				}
			};

			let isShowBracketInTelephone = 1;

			$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/showbracketintelephonemode')
				.then(function (response) {
					isShowBracketInTelephone = response.data;
				});

			return createDirective(defaults, controllerFun);

			function updateItem(item) {
				const counties = basicsLookupdataLookupDescriptorService.getData('country');
				let areaCode = item.AreaCode;
				let countryAreaCode = '';
				if (item.CountryFk && counties && counties[item.CountryFk]) {
					countryAreaCode = counties[item.CountryFk].AreaCode;
				}
				if (areaCode) {
					// remove leading zero from area code
					let ZeroCode='';

					while (areaCode[0] === '0') {
						if (isShowBracketInTelephone === 3) {
							ZeroCode+=areaCode[0];
						}
						areaCode = areaCode.slice(1);
					}
					if (isShowBracketInTelephone===1) {
						areaCode = '(' + (areaCode || 0) + ')';
					}
					else if (isShowBracketInTelephone === 3) {
						if(ZeroCode.length>0)
						{
							areaCode ='('+ZeroCode+')'+areaCode;
						}
					}
				}
				/** @namespace item.PhoneNumber */
				return {
					Telephone: formatter('@1 @2 @3 @4', countryAreaCode, areaCode, item.PhoneNumber, item.Extention ? ('- ' + item.Extention) : ''),
					Pattern: formatter('@1@2@3@4', countryAreaCode, item.AreaCode, item.PhoneNumber, item.Extention)
				};

				function formatter(str) {
					for (let i = 1; i < arguments.length; i++) {
						str = str.replace('@' + i, arguments[i] || '');
					}
					return str;
				}
			}

			function controllerFun($scope, validationService, httpService) {

				const updateOptions = httpService.updateOptions($scope, updateItem);

				const unwatchCountryFk = $scope.$watch('currentItem.CountryFk', updateOptions.updateFmt);
				const unwatchAreaCode = $scope.$watch('currentItem.AreaCode', updateOptions.updateFmt);
				const unwatchPhoneNumber = $scope.$watch('currentItem.PhoneNumber', updateOptions.updateFmt);
				const unwatchExtention = $scope.$watch('currentItem.Extention', updateOptions.updateFmt);
				const unwatchCommentText = $scope.$watch('currentItem.CommentText', updateOptions.updateFmt);

				$scope.beforeOk = function (item, setLocalStorage) {
					setLocalStorage({CountryFk: item.CountryFk});
					updateOptions.updateItemFormat();
				};
				$scope.$on('$destroy', function () {
					$scope.$close();
					unwatchCountryFk();
					unwatchAreaCode();
					unwatchPhoneNumber();
					unwatchExtention();
					unwatchCommentText();
				});

			}
		}
	]);

})(angular);