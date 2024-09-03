const kakaoLoginButton = document.querySelector('#kakao');
const naverLoginButton = document.querySelector('#naver');
const userImage = document.querySelector('img');
const userName = document.querySelector('#user_name');
const logoutButton = document.querySelector('#logout_button');

let currentOAuthService = '';

function renderUserInfo(imgUrl, name) {
  userImage.src = imgUrl;
  userName.textContent = name;
}

const kakaoClientId = '09df6759fca037838361f5bdcf7e5e8e';
const redirectURI = 'http://127.0.0.1:5500';
let kakaoAcceseToken = '';

const naverClientId = '3Gak2eE9e7nDwFWFtcFB';
const naverClientSecret = 'njL1FYwamG';
const naverSecret = 'it_is_me';
let naverAcceseToken = '';

kakaoLoginButton.onclick = () => {
  /** 
   * 사용자가 Kakao 로그인 버튼을 클릭할 때 Kakao 인증 페이지로 리디렉션시켜,
   * 로그인 및 권한 부여를 진행할 수 있도록 한다.
   */
  location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectURI}&response_type=code`
}

naverLoginButton.onclick = () => {
  location.href = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverClientId}&response_type=code&redirect_uri=${redirectURI}&state=${naverSecret}`  
}

window.onload = () => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const authorizationCode = urlParams.get('code');
  const naverState = urlParams.get('state');
  
  if (authorizationCode) {
    if (naverState) {
      axios.post('http://localhost:3000/naver/login', { authorizationCode })
        .then(res => {
          naverAcceseToken = res.data
          return axios.post('http://localhost:3000/naver/userinfo', { naverAcceseToken })
            .then(res => {
              renderUserInfo(res.data.profile_image, res.data.name),
              currentOAuthService = 'naver'
            })
        })
    } else {
      axios.post('http://localhost:3000/kakao/login', { authorizationCode })
        .then(res => {
          kakaoAcceseToken = res.data;
          return axios.post('http://localhost:3000/kakao/userinfo', { kakaoAcceseToken })
        })
        .then(res => {
          renderUserInfo(res.data.profile_image, res.data.nickname),
          currentOAuthService = 'kakao';
        })
    }
  }
}

logoutButton.onclick = () => {
  if (currentOAuthService === 'kakao') {
    axios.delete('http://localhost:3000/kakao/logout', { data: { kakaoAcceseToken } })
      .then(res => {
        console.log(res.data);
        renderUserInfo('', '');
      })
  } else if (currentOAuthService === 'naver') {
    axios.delete('http://localhost:3000/naver/logout', { data: { naverAcceseToken } })
      .then(res => {
        console.log(res.data);
        renderUserInfo('', '');
      })
  }
  
}