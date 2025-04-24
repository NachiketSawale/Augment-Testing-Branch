(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	angular.module('procurement.invoice').factory('validationReferenceStructuredService', [ '$translate',
		function ($translate) {
			var service = {};
			service.validationReferenceStructured = function(value){
				var validateResult = { valid:false, error:'', apply:true };
				if(value === null || _.isUndefined(value) || value === '')
				{
					validateResult.valid = true;
				}
				else if(value.startsWith('+') || value.startsWith('*'))
				{
					var ogmValue = value.replace(/\+/g,'').replace(/\*/g,'').replace(/\//g,'');
					var regex = new RegExp('^[0-9]');
					if (regex.test(ogmValue)) {
						var tenNumber = ogmValue.substr(0,(ogmValue.length > 10 ? 10 : ogmValue.length));
						var compareNumber = ogmValue.length >= 12 ? ogmValue.substr(10,2) : 0;
						var dividedNumber = (tenNumber / 97).toString();
						if(dividedNumber.indexOf('.') > 0)
						{
							var multipliedNumber = ('0' + dividedNumber.substr(dividedNumber.indexOf('.'))) * 97;
							validateResult.valid = Math.round(multipliedNumber).toString() === compareNumber;
						}
						else{
							validateResult.valid = true;
						}
					}
					else{
						validateResult.valid = false;
					}
				}
				else if(value.toUpperCase().startsWith('RF')){
					var rfValue = value.substr(4, value.length - 4) + value.substr(0, 4);
					var numberValue = [];
					_.forEach(rfValue,function(item){
						numberValue.push(translationDigit(item));
						validateResult.valid = (numberValue.join('') % 97 === 1);
					});
				}
				else {
					validateResult.valid = false;
				}
				if(!validateResult.valid){
					validateResult.error = $translate.instant('procurement.invoice.error.referenceError');
				}
				return validateResult;
			};

			function translationDigit(item){
				switch (item.toUpperCase()) {
					case 'A': return '10';
					case 'B': return '11';
					case 'C': return '12';
					case 'D': return '13';
					case 'E': return '14';
					case 'F': return '15';
					case 'G': return '16';
					case 'H': return '17';
					case 'I': return '18';
					case 'J': return '19';
					case 'K': return '20';
					case 'L': return '21';
					case 'M': return '22';
					case 'N': return '23';
					case 'O': return '24';
					case 'P': return '25';
					case 'Q': return '26';
					case 'R': return '27';
					case 'S': return '28';
					case 'T': return '29';
					case 'U': return '30';
					case 'V': return '31';
					case 'W': return '32';
					case 'X': return '33';
					case 'Y': return '34';
					case 'Z': return '35';
					default : {
						var regex = new RegExp('^[0-9]');
						if (regex.test(item)) {
							return item;
						} else {
							return '';
						}
					}
				}
			}
			return service;
		}]);
})(angular);