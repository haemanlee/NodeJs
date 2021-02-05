# 실시간 경매 시스템 만들기

1. 서버센트 이벤트 사용 (Server Sent Events, SSE)
 
 - 모든 사람이 같은 시간에 경매가 종료 되어야함
 - 모든 사람에게 같은 시간이 표시되어야 함.
 - 클라이언트 시간은 믿을 수 없음 > 서버 시간을 주기적으로 클라이언트로 내려보내줌.

` sse.js`

 - Name sse > EventStream을 통해서 실시간 서버 시간을 받는 것 sse을 볼 수 있다.


2. 스케줄러 사용 (node-schedule)
 
 - setTimeout은 시간이 정확하지 않고, 서버가 꺼지면 데이터가 날아가는 경우가 생김.
 - 서버가 꺼져도 데이터를 유지할 수 있게 적용.
 - 경매가 끝난 후 DB에 스케줄에 맞게 저장됨.
 - OS의 스케줄러 사용함
 - Windows : schtasks
 - Mac, Linus : cron
 - 노드에서 위 두 명령어를 child_process를 통해 호출할 수 있음.
