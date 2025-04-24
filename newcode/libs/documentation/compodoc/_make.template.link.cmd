@echo off
%~d0
cd %~dp0

set myself=%~dp0
set partials=%myself%..\..\..\node_modules\@compodoc\compodoc\src\templates\partials
set target=%myself%\templates

echo %myself% --^> partials path=%partials%

call :createSymLink

echo symbolic link done ...
if not defined NOPAUSE pause
goto :eof


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:removeSymLink
@echo off
if exist %partials% (
	::echo delete %link%
	rmdir %partials%
	if exist %partials% (
		echo It's not a link, we delete whole folder 
		rmdir /s /q %partials% >>mklink.log
	)	
)
@echo off
goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:createSymLink
@echo off
call :removeSymLink

mklink /j %partials% %target% >>mklink.log
echo. >>mklink.log

goto :eof