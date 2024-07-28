
aws appsync evaluate-code ^
--region ap-southeast-2 ^
--function request ^
--code file://F:\my_projects\vue\ChatApp\chat-app\backend\src\api\resolvers\user\deleteUser.js ^
--runtime name=APPSYNC_JS,runtimeVersion=1.0.0  ^
--context file://F:\my_projects\vue\ChatApp\chat-app\backend\src\__tests__\delete-user.json