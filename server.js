const express = require('express');
const cors = require('cors');
const axios = require('axios');

const kakaoClientId = '09df6759fca037838361f5bdcf7e5e8e';
const redirectURI = 'http://127.0.0.1:5500';

const naverClientId = '3Gak2eE9e7nDwFWFtcFB';
const naverClientSecret = 'njL1FYwamG';
const naverSecret = 'it_is_me';

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['OPTION', 'POST', 'DELETE'],
}))

app.use(express.json())

app.post('/kakao/login', (req, res) => {
  /** 
   * Kakao 인증 서버에 POST 요청을 보내어 authorizationCode로부터 액세스 토큰을 요청하고,
   * 받은 액세스 토큰을 클라이언트에게 반환하는 기능을 수행
   */ 
  const authorizationCode = req.body.authorizationCode;
  axios.post('https://kauth.kakao.com/oauth/token', {
    grant_type: 'authorization_code',
    client_id: kakaoClientId,
    redirect_uri: redirectURI,
    code: authorizationCode,
  },
  {
    headers: {'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'}
  })
  .then(response => res.send(response.data.access_token))
})

app.post('/naver/login', (req, res) => {
  const authorizationCode = req.body.authorizationCode;
  axios.post(`https://nid.naver.com/oauth2.0/token?client_id=${naverClientId}&client_secret=${naverClientSecret}&grant_type=authorization_code&state=${naverSecret}&code=${authorizationCode}`)
    .then(response => res.send(response.data.access_token))
})

app.post('/kakao/userinfo', (req, res) => {
  /**
   * Kakao 액세스 토큰을 사용하여 Kakao API에서 사용자 정보를 가져와
   * 클라이언트에게 반환하는 기능을 수행
   */
  const { kakaoAcceseToken } = req.body;
  axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoAcceseToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
  .then(response => res.json(response.data.properties))
})

app.post('/naver/userinfo', (req, res) => {
  /**
   * Kakao 액세스 토큰을 사용하여 Kakao API에서 사용자 정보를 가져와
   * 클라이언트에게 반환하는 기능을 수행
   */
  const { naverAcceseToken } = req.body;
  axios.get('https://openapi.naver.com/v1/nid/me', {
    headers: {
      Authorization: `Bearer ${naverAcceseToken}`,
    }
  })
  .then(response => res.json(response.data.response))
})


app.delete('/kakao/logout', (req, res) => {
  /**
   * Kakao API를 사용하여 주어진 액세스 토큰으로 사용자를 로그아웃시키고,
   * 성공 메시지를 클라이언트에게 반환하는 기능을 수행
   */
  const { kakaoAcceseToken } = req.body;
  axios.post('https://kapi.kakao.com/v1/user/logout', {}, {
    headers: {
      Authorization: `Bearer ${kakaoAcceseToken}`
    }
  })
  .then(response => res.send('로그아웃 성공'))
})

app.delete('/naver/logout', (req, res) => {
  /**
   * Kakao API를 사용하여 주어진 액세스 토큰으로 사용자를 로그아웃시키고,
   * 성공 메시지를 클라이언트에게 반환하는 기능을 수행
   */
  const { naverAcceseToken } = req.body;
  axios.post(`https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${naverClientId}&client_secret=${naverClientSecret}&access_token=${naverAcceseToken}&service_provider=NAVER`)
  .then(response => res.send('로그아웃 성공'))
})

app.listen(3000, () => console.log('서버 열림'))