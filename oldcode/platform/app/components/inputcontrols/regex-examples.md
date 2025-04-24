	Short list of regex examples.

lower case:               ^[a-z]+$ upper case:               ^[A-Z]+$ only alphabet:            ^[a-zA-Z]+$ only numeric:               ^[0-9]+$ only alphanumeric:         ^[a-zA-Z0-9]+$ exact length(7):            ^[a-zA-Z]{7}$ minimum length(4):
^[a-z]{4,}$ min(1) + maxlength(5):     ^[a-zA-Z]{1,5}$ number max (5):            ^[0-9]{1,5}$ decimal (,2)               ^[0-9]+(\,[0-9]{1,2})?$ regex currency:            ^\$?([0-9]{1,3},([0-9]{3}.)*[0-9]{3}|[0-9]+)(,[0-9][0-9])?$
(^\d+([,.]\d+)?$)|((^\d{1,3}(,\d{3})+(\.\d+)?)$)|((^\d{1,3}(\.\d{3})+(,\d+)?)$)
any char max length:         ^.{4,138}$/s or /^[\s\S]{4,138}$/ date dd-mm-yyyy ^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$ date yyyy-mm-dd ^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$ date mm-dd-yyyy ^(0[1-9]
|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$ time 24 format ^([01]?[0-9]|2[0-3]):[0-5][0-9]$ datetime dd-mm-yyyy hh:mm ^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d ([01]?[0-9]|2[0-3]):[0-5][0-9]$ datetime utc ^\d\d\d\d(
-\d\d(-\d\d(T\d\d:\d\d(:\d\d(\.\d{1,}){0,1}){0,1}){0,1}((Z)|([+-]\d\d:\d\d)){0,1}){0,1}){0,1}$