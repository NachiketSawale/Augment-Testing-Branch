@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\..\..\..\..\..\BinPool
set myself=%~dp0

call :createSymLink procurement ticketsystem

if not defined NOPAUSE pause
goto :eof


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:removeSymLink
@echo off
set modul=%1
set submodul=%2
set link="%binpool%\Test\%modul%.%submodul%"

@echo off
if exist %link% (
	::echo delete %link%
	rmdir %link%
	if exist %link% (
		echo It's not a link, delete folder delete %link%
		rmdir /s /q %link%
	)	
)
@echo off
goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:createSymLink
@echo off
set modul=%1
set submodul=%2
set link="%binpool%\Test\%modul%.%submodul%"
set target="%myself%\E2E"

call :removeSymLink %1 %2

::echo mklink /j %link% %target%
xcopy %target% %link% /i
echo.


goto :eof