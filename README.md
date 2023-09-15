# license-management
- 라이선스 관리 Web
- [Confluence](https://stclab.atlassian.net/wiki/spaces/RC/pages/508198946/License+APP?atlOrigin=eyJpIjoiM2U1MjhmZGNlNDBlNGMyYmE3NmFiZTE5ZDdlN2UzOWUiLCJwIjoiYyJ9) 참고

## Architecture
<br/>

![Architecture](https://github.com/STCLab-Internship/LicenseManagement/assets/67617475/1f279620-7252-40ca-a76e-e386dd156ea0)


## API URL 수정
```
cd backend
vi .env
LICENSE_KEY_URL=licens키 발급 API URL 수정
```

## 서버 다운되었을 시
```
ssh license_management@clover.stclab.com
docker exec -it lic_mgmt_docker bash
cd license_management
./license_management.sh
```

## Test
```
cd backend
npm install
node index.js
``` 
---
```
cd client
npm install
npm run build
serve -s build -l 8006
```
## DB
#### dbscript.sql 파일에서 스크립트를 확인하실 수 있습니다.

