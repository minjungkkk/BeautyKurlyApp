$(function () {
  // localStorage: 회원가입 정보
  const savedUser = JSON.parse(localStorage.getItem("user"));

  // sessionStorage: 로그인 세션 정보
  const loginUser = JSON.parse(sessionStorage.getItem("loginUser"));

  // 로그인 직후 여부 체크용
  const justLoggedIn = sessionStorage.getItem("justLoggedIn");

// 처음 접속 시 home.html로 이동 (단, 현재 페이지가 home이 아닐 때만)
  const path = window.location.pathname;
  if ((path === "/" || path === "/BeautyKurly/") && !path.endsWith("home.html")) {
    window.location.href = "home.html";
    return;
}

  console.log("savedUser:", savedUser);
  console.log("loginUser:", loginUser);


  // 로그인 안 했는데 마이페이지 접근한 경우 → 로그인 페이지로 이동
  if (!loginUser && path.includes("my_page.html")) {
    location.href = "login.html";
    return;
  }

  // 하단 네비 마이페이지 접근 제어
  $(".nav_mypage").on("click", function (e) {
  if (!loginUser) {
    e.preventDefault(); // a 태그 기본 이동 막기
    location.href = "login.html";
  }
});

  // 로그인 상태에서 로그인 / 회원가입 페이지 접근
  // 로그인 직후 리다이렉트는 예외 처리
  if (
    loginUser &&
    !justLoggedIn &&
    (path.includes("login.html") || path.includes("signup.html"))
  ) {
    location.href = "home.html";
    return;
  }

  // home.html 진입 시 로그인 직후 플래그 제거
  if (path.includes("home.html")) {
    sessionStorage.removeItem("justLoggedIn");
  }


  // 로그인 상태라면 헤더 사용자 이름 표시
  if (loginUser) {
    $("#user_name_display").text(`${loginUser.name}님`);
    $("#logout_button").removeClass("d-none");
  } else {
    $("#user_name_display").text("");
    $("#logout_button").addClass("d-none");
  }

  // 마이페이지 환영 문구 사용자 이름 표시
  if (loginUser && $("#username").length) {
    $("#username").text(loginUser.name);
  }

  // 회원가입 버튼 클릭 시 회원가입 화면으로 이동
  $(".signup_btn").on("click", function () {
  location.href = "signup.html";
});


  // 회원가입 페이지: 회원가입 처리
  $("#signup_form").on("submit", function (e) {
    e.preventDefault();

    const name = $("#user_name").val().trim();
    const id = $("#user_id").val().trim();
    const password = $("#user_password").val().trim();

    if (!name || !id || !password) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const user = {
      name: name,
      id: id,
      password: password
    };

    localStorage.setItem("user", JSON.stringify(user));
    console.log("회원가입 저장:", user);

    location.href = "login.html";
  });


  // 로그인 페이지: 로그인 처리
  $(".login_btn").on("click", function () {

    const id = $("#username").val().trim();
    const password = $("#password").val().trim();

    if (!savedUser) {
      alert("회원가입 정보가 없습니다.");
      return;
    }

    if (id === savedUser.id && password === savedUser.password) {

      sessionStorage.setItem(
        "loginUser",
        JSON.stringify({
          id: savedUser.id,
          name: savedUser.name
        })
      );

      sessionStorage.setItem("justLoggedIn", "true");
      location.href = "home.html";

    } else {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  });


  // 로그아웃 버튼 클릭 시 세션 제거
  $("#logout_button").on("click", function () {
    sessionStorage.removeItem("loginUser");
    sessionStorage.removeItem("justLoggedIn");
    location.href = "login.html";
  });


  // 회원탈퇴 버튼 클릭 시 계정 삭제
  $("#sign_out").on("click", function () {
    if (confirm("회원탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다. 동의하시면 확인 버튼을 눌러주세요.")) {
      localStorage.removeItem("user");
      sessionStorage.removeItem("loginUser");
      alert("탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.");
      location.href = "home.html";
    }
  });
});
