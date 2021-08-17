# 나만의 문제집(Web)
- 문제만 등록하면 자동으로 문제를 출제해주는 웹서비스.  
- 같은 문제라도 다양한 순서로 문제를 풀어볼 수 있어 시험을 준비하는 많은 사람들에게 도움이 될 수 있는 웹사이트입니다.  

## Developer
|경은하|장재은|한수현|  
|:----------:|:-------------:|:------:|  
|Back-end|Front-end|Front-end|  
|[EunhaKyeong](https://github.com/EunhaKyeong)|[jaeeunchang](https://github.com/jaeeunchang)|[Suhyeon0322](https://github.com/Suhyeon0322)|  

## Tool
|Front-end|Back-end|  
|:----------:|:-------------:|  
|React.js|Express.js<br>MySQL<br>AWS-EC2<br>AWS-S3|  

## 주요기능

### Home
<p align="center"><img src="https://user-images.githubusercontent.com/66666533/129498264-82962801-b960-497d-90c8-71eed675c17b.png" width="650" height="400"></p>

### Login
- 네이버, 구글 로그인
<p align="center"><img src="https://user-images.githubusercontent.com/66666533/129498769-8c056945-5e43-451b-a725-648756dadb08.gif" width="650"></p>

### 문제 폴더 조회/추가/수정/삭제
<p align="center"><img src="https://user-images.githubusercontent.com/66666533/129499261-b4f2559d-445b-4583-9089-d5f92a264e4f.gif"></p>

### 문제 조회/추가/수정/삭제
<p align="center"><img src="https://user-images.githubusercontent.com/66666533/129506930-18a77cac-53f9-45cd-a2bc-2cd1f1de98c1.gif"></p>  

### 시험 진행 화면
- 시험 시작 버튼을 누르면 순서를 섞어 시험을 출제.  
- 시험을 진행하다 중간에 그만할 수도 있고, 일시 정지 버튼을 클릭해 잠시 시험을 중단할 수도 있음.  
- 시험을 마쳤으면 내가 입력한 답과 실제 정답과 비교해 정/오를 표시하면 기록 페이지 화면으로 이동.  
<p align="center"><img src="https://user-images.githubusercontent.com/66666533/129507378-1ae1f044-5349-4407-9125-bf52321c54e3.gif"></p>  

### 마이페이지-회원 정보
- 회원 정보를 확인하고 회원 탈퇴를 진행할 수 있는 화면.  
<p align="center"><img src="https://user-images.githubusercontent.com/66666533/129507839-55cefc79-d768-4d1a-b565-7028919b1722.gif"></p>  

### 마이페이지-나의 학습 관리
- 최근 학습한 테스트 : 사용자가 가장 최근에 진행했던 시험을 확인할 수 있고, 다시 학습하기 버튼을 누르면 시험 진행 페이지로 이동.  
- 테스트 기록 : 가장 최근의 테스트 기록 3개를 보여줌. 더보기 버튼을 클릭하면 테스트 기록 페이지로 이동.  
- 나만의 문제 Box : 사용자가 생성한 문제 폴더 박스를 최대 5개 보여줌. 더보기 버튼을 클릭하면 문제 폴더 박스 화면으로 이동.  
<p align="center"><img src="https://user-images.githubusercontent.com/66666533/129508177-d3d1784a-9d4a-4396-80e7-4d11af4632d8.gif"></p>   
 
 ### 테스트 기록
 - 지금까지 진행한 테스트 기록을 확인하는 페이지.  
 - 삭제하고 싶은 기록은 삭제 버튼을 눌러 삭제할 수 있음.  
 <p align="center"><img src="https://user-images.githubusercontent.com/66666533/129508340-539c9215-6afe-49b2-af59-5b1d13c84438.gif"></p>

## 1. git clone
```
git clone https://github.com/EunhaKyeong/myWorkbook.git
```

## 2. install yarn
```
npm install -g yarn
```

## 3. npm install
```
npm install
cd client
npm install
```

## 4-1. 클라이언트 실행(3000포트) - http://localhost:3000
```
yarn client
```

## 4-2. 백엔드 실행(5000 포트) - http://localhost:5000/api
```
yarn server
```

## 4-3. 클라이언트&백엔드 실행
```
yarn dev
```
