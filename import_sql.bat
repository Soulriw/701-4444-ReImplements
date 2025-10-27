@echo off
echo Connecting to Railway MySQL...
echo.
echo Entering SQL commands...
echo.

mysql -h shuttle.proxy.rlwy.net -P 36089 -u root -pYSjgQqunLfGCFLBqYoQusHqmqXuSMJUf railway < database_setup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ SQL script executed successfully!
    echo.
) else (
    echo.
    echo ❌ Error occurred. Please check the connection details.
    echo.
    pause
)

pause

