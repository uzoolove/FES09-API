import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '2.0.1',
    title: '오픈마켓 API',
    description: `오픈마켓 API Server입니다.<br>
      <a href="/">버전별 변경사항 확인</a>`,
    // description: `오픈마켓 API Server입니다.<br>
    //   <a href="/">버전별 변경사항 확인</a>
    //   <br><br>
    //   <h2>공통 사항</h2>
    //   <details><summary>검색</summary>자세한 내용</details>
    //   <details><summary>페이지네이션</summary>자세한 내용</details>
    //   <details><summary>정렬</summary>자세한 내용</details>
    //   <details><summary>dryRun</summary>자세한 내용</details>
    //   <details><summary>custom 파라미터</summary>자세한 내용</details>
    //   <details><summary>주문 상태</summary>자세한 내용</details>
    //   <details><summary>공통 에러 메세지</summary>자세한 내용</details>
    // `
  },
  servers: [
    {
      url: 'https://market-lion.koyeb.app/api',
      description: ''
    },
    {
      url: 'http://localhost/api',
      description: '로컬 테스트'
    }
  ],
  tags: [
    {
      name: '회원',
      description: '회원 관리 기능',
    },
    {
      name: '상품',
      description: '일반 회원 - 상품 관련 기능',
    },
    {
      name: '구매',
      description: '일반 회원 - 구매 관련 기능',
    },
    {
      name: '구매 후기',
      description: '일반 회원 - 구매 후기 관련 기능',
    },
    {
      name: '장바구니',
      description: '일반 회원 - 장바구니 관련 기능',
    },
    {
      name: '북마크',
      description: '일반 회원 - 북마크(찜하기) 관련 기능',
    },
    {
      name: '상품 관리',
      description: '판매 회원 - 판매 상품 관리 기능',
    },
    {
      name: '주문 관리',
      description: '판매 회원 - 주문 관리 기능',
    },
    {
      name: '후기 관리',
      description: '판매 회원 - 후기 관리 기능',
    },
    {
      name: '게시판',
      description: '게시판(QnA, 공지 등) 관련 기능',
    },
    {
      name: '회원 관리',
      description: '관리자 - 회원 관리 기능',
    },
    {
      name: '코드 관리',
      description: '관리자 - 코드 관리 기능',
    },
    {
      name: '파일',
      description: '시스템 - 파일 관리 기능',
    },
    {
      name: '인증',
      description: '시스템 - 인증 관리 기능',
    },
    {
      name: '코드 조회',
      description: '시스템 - 코드 조회 관리 기능',
    },
  ],
  components: {
    securitySchemes: {
      "Access Token": {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT'
      },
      "Refresh Token": {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT'
      }
    },
    '@schemas': {
      login: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: '이메일',
            example: 'u1@market.com'
          },
          password: {
            type: 'string',
            description: '비밀번호',
            example: '11111111'
          }
        },
        required: ['email', 'password']
      },

      kakaoLogin: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: '카카오 로그인 후 받은 인증 코드',
            example: 'dDWZOcbqOCoTyRMLfDvaAhFuPC-NrQipfytgQ6c4wvyuyt-eKUBuyu1yvYkKPXPsAAABjt8XmL1b9Pmr5eg_ZA'
          },
          user: {
            type: 'object',
            description: '카카오에서 제공하는 사용자 정보 이외에 추가할 사용자 정보를 객체로 전달',
          }
        },
        required: ['code']
      },

      createUser: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: '이메일'
          },
          password: {
            type: 'string',
            description: '비밀번호'
          },
          name: {
            type: 'string',
            description: '이름'
          },
          type: {
            type: 'string',
            enum: ['user', 'seller'],
            description: '회원 구분(user: 일반 회원, seller: 판매 회원)'
          },
          phone: {
            type: 'string',
            description: '전화번호'
          },
          address: {
            type: 'string',
            description: '주소'
          },
          extra: {
            type: 'object',
            description: '추가 속성들 정의'
          },
        },
        required: ['email', 'password', 'name', 'type']
      },
      createCode: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: '코드 아이디'
          },
          title: {
            type: 'string',
            description: '코드명'
          },
          codes: {
            type: 'object',
            description: '코드값 배열'
          }
        },
        required: ['_id', 'title', 'codes']
      }
    },
    schemas: {
      Sample: {
        type: 'object',
        properties: {
          "a": {
            type: 'string',
            required: true,
            default: 'hello',
            description: 'With no swagger-autogen render...'
          }
        }

      },
      error401: {
        "ok": 0,
        "message": "{인증 실패 사유}",
        "errorName": "EmptyAuthorization | TokenExpiredError | JsonWebTokenError"
      },
      error403: {
        "ok": 0,
        "message": "아이디와 패스워드를 확인하시기 바랍니다."
      },
      errorClientId403: {
        "ok": 0,
        "message": "등록되지 않은 client-id 입니다."
      },
      error404: {
        "ok": 0,
        "message": "/api/xxx 리소스를 찾을 수 없습니다."
      },
      error409: {
        "ok": 0,
        "message": "이미 등록된 리소스입니다."
      },
      errorKakao409: {
        "ok": 0,
        "message": "인증 처리중 입니다."
      },
      error422: {
        "ok": 0,
        "message": "잘못된 입력값이 있습니다.",
        "errors": [
          {
            "type": "field",
            "value": "swaggermarket.com",
            "msg": "이메일 형식에 맞지 않습니다.",
            "path": "email",
            "location": "body"
          }
        ]
      },
      error500: {
        "ok": 0,
        "message": "요청하신 작업 처리에 실패했습니다. 잠시 후 다시 이용해 주시기 바랍니다."
      },
      simpleOK: {
        "ok": 1
      },
      emailImpossable: {
        "ok": 1,
        "duplicate": true
      },
      emailPossible: {
        "ok": 1,
        "duplicate": false
      },
      
      accessTokenRes: {
        "ok": 1,
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjUsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNzAwNTU1NjUzLCJleHAiOjE3MDA1NTYyNTMsImlzcyI6IkZFU1AwMSJ9.tBbQZLmwlg0y5juJ_TTkET1buZ4QFGf8RJ0G_IWIyns"
      },
      productCreate: {
        "price": 1000,
        "quantity": 600,
        "name": "ZOZOFO 테이블 게임 축구 보드 사커 게임기 보드게임 2인경기 완구 가족모임 미니 월드컵 스포츠 어린이 크리스마스 선물 생일 선물",
        "mainImages": [
          {
            "path ": "/files/00-sample/sample-football.jpg",
            "name ": "sample-football.jpg",
            "originalname": "사커게임.png"
          }
        ],
        "content": "<div class=\"product-detail\"><p>ZOZOFO 테이블 게임 축구 보드 사커 게임기 보드게임 2인경기 완구 가족모임 미니 월드컵 스포츠 어린이 크리스마스 선물 생일 선물 상세 설명</p></div>",
        "extra": {
            "isNew": true,
            "isBest": true,
            "category": ["PC02", "PC0201"],
            "sort": 7,
            "depth": 2
        }
      },

      productUpdate: {
        "price": 22000,
        "shippingFees": 3000,
        "show": true,
        "extra.isNew": false
      },
      productCreateRes: {
        "ok": 1,
        "item": {
          "price": 1000,
          "quantity": 600,
          "name": "ZOZOFO 테이블 게임 축구 보드 사커 게임기 보드게임 2인경기 완구 가족모임 미니 월드컵 스포츠 어린이 크리스마스 선물 생일 선물",
          "mainImages": [
            {
              "path ": "/files/00-sample/sample-football.jpg",
              "name ": "sample-football.jpg",
              "originalname": "사커게임.png"
            }
          ],
          "content": "<div class=\"product-detail\"><p>ZOZOFO 테이블 게임 축구 보드 사커 게임기 보드게임 2인경기 완구 가족모임 미니 월드컵 스포츠 어린이 크리스마스 선물 생일 선물 상세 설명</p></div>",
          "extra": {
            "isNew": true,
            "isBest": true,
            "category": [
              "PC02",
              "PC0201"
            ],
            "sort": 7,
            "depth": 2
          },
          "show": true,
          "shippingFees": 0,
          "seller_id": 2,
          "_id": 17,
          "active": true,
          "buyQuantity": 0,
          "createdAt": "2024.04.08 20:25:39",
          "updatedAt": "2024.04.08 20:25:39"
        }
      },

      productListRes: {
        "ok": 1,
        "item": [
          {
            "_id": 4,
            "seller_id": 3,
            "price": 45000,
            "shippingFees": 3500,
            "show": true,
            "active": true,
            "name": "레고 테크닉 42151 부가티 볼리드",
            "quantity": 100,
            "buyQuantity": 89,
            "mainImages": [
              {
                "path ": "/files/00-sample/sample-bugatti.png",
                "name ": "sample-bugatti.png",
                "originalname": "부가티.png"
              }
            ],
            "createdAt": "2024.03.06 07:50:28",
            "updatedAt": "2024.03.17 11:50:28",
            "extra": {
              "isNew": false,
              "isBest": true,
              "category": [
                "PC03",
                "PC0303"
              ],
              "sort": 1
            },
            "replies": 0,
            "bookmarks": 1
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 0,
          "total": 1,
          "totalPages": 1
        }
      },

      productInfoRes: {
        "ok": 1,
        "item": {
          "_id": 4,
          "seller_id": 3,
          "price": 45000,
          "shippingFees": 3500,
          "show": true,
          "active": true,
          "name": "레고 테크닉 42151 부가티 볼리드",
          "quantity": 100,
          "buyQuantity": 89,
          "mainImages": [
            {
              "path": "/files/00-sample/sample-bugatti.png",
              "name": "sample-bugatti.png",
              "originalname": "부가티.png"
            }
          ],
          "content": "\n          <div class=\"product-detail\">\n            <p>레고 테크닉 42151 부가티 볼리드 상세 설명</p>\n          </div>",
          "createdAt": "2024.03.13 16:43:39",
          "updatedAt": "2024.03.24 20:43:39",
          "extra": {
            "isNew": false,
            "isBest": true,
            "category": [
              "PC03",
              "PC0303"
            ],
            "sort": 1
          },
          "seller": {
            "_id": 3,
            "email": "s2@market.com",
            "name": "어피치",
            "phone": "01033334444",
            "address": "서울시 강남구 도곡동 789",
            "type": "seller",
            "loginType": "email",
            "createdAt": "2024.03.06 23:13:39",
            "updatedAt": "2024.03.16 23:23:39",
            "extra": {
              "confirm": false,
              "birthday": "11-24",
              "membershipClass": "MC02",
              "addressBook": [
                {
                  "id": 1,
                  "name": "회사",
                  "value": "서울시 마포구 연희동 123"
                },
                {
                  "id": 2,
                  "name": "가게",
                  "value": "서울시 강남구 학동 234"
                }
              ]
            }
          },
          "replies": [],
          "bookmarks": [
            {
              "_id": 2,
              "user_id": 4,
              "type": "product",
              "target_id": 4,
              "memo": "둘째 생일 선물",
              "createdAt": "2024.04.14 11:43:39"
            },
            {
              "_id": 5,
              "user_id": 2,
              "type": "product",
              "target_id": 4,
              "memo": "1순위로 살것!",
              "createdAt": "2024.04.14 11:43:39"
            }
          ]
        }
      },

      productUpdateRes: {
        "ok": 1,
        "updated": {
          "price": 22000,
          "shippingFees": 3000,
          "show": true,
          "extra.isNew": false,
          "updatedAt": "2024.04.11 11:55:00"
        }
      },


      orderCreate: {
        "products": [
          {
            "_id": 4,
            "quantity": 2
          }
        ],
        "address": {
          "name": "학교",
          "value": "서울시 강남구 역삼동 234"
        }
      },

      orderCreateRes: {
        "ok": 1,
        "item": {
          "products": [
            {
              "_id": 4,
              "quantity": 2,
              "name": "레고 테크닉 42151 부가티 볼리드",
              "image": "/uploads/sample-bugatti.png",
              "price": 90000
            }
          ],
          "address": {
            "name": "학교",
            "value": "서울시 강남구 역삼동 234"
          },
          "user_id": 2,
          "_id": 4,
          "createdAt": "2023.11.22 08:41:28",
          "cost": {
            "products": 205000,
            "shippingFees": 6000,
            "total": 211000
          }
        }
      },

      orderListRes: {
        "ok": 1,
        "item": [
          {
            "_id": 1,
            "user_id": 4,
            "state": "OS020",
            "products": [
              {
                "_id": 2,
                "seller_id": 2,
                "state": "OS020",
                "name": "헬로카봇 스톰다이버",
                "image": "/files/sample-diver.jpg",
                "quantity": 2,
                "price": 34520,
                "reply_id": 3,
                "reply": {
                  "rating": 1,
                  "content": "하루만에 고장났어요.",
                  "extra": {
                    "title": "추천하지 않습니다."
                  },
                  "createdAt": "2024.04.05 01:46:27"
                }
              }
            ],
            "cost": {
              "products": 34520,
              "shippingFees": 2500,
              "discount": {
                "products": 0,
                "shippingFees": 0
              },
              "total": 37020
            },
            "address": {
              "name": "회사",
              "value": "서울시 강남구 신사동 234"
            },
            "createdAt": "2024.04.01 08:46:27",
            "updatedAt": "2024.04.01 08:46:27"
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 10,
          "total": 3,
          "totalPages": 1
        }
      },

      orderStateRes: {
        "ok": 1,
        "item": [
          {
            "state": "OS040",
            "products": {
              "state": "OS110"
            }
          }
        ]
      },

      orderInfoRes: {
        "ok": 1,
        "item": {
          "_id": 3,
          "user_id": 4,
          "state": "OS040",
          "products": [
            {
              "_id": 4,
              "seller_id": 3,
              "state": "OS110",
              "name": "레고 테크닉 42151 부가티 볼리드",
              "image": "/files/sample-bugatti.png",
              "quantity": 1,
              "price": 45000,
              "reply_id": 1
            }
          ],
          "cost": {
            "products": 45000,
            "shippingFees": 3500,
            "discount": {
              "products": 4500,
              "shippingFees": 0
            },
            "total": 44000
          },
          "address": {
            "name": "학교",
            "value": "서울시 강남구 역삼동 234"
          },
          "delivery": {
            "company": "한진 택배",
            "trackingNumber": "364495958003",
            "url": "https://trace.cjlogistics.com/next/tracking.html?wblNo=364495958003"
          },
          "createdAt": "2024.04.03 17:46:27",
          "updatedAt": "2024.04.06 10:46:27"
        }
      },

      orderInfoSellerRes: {
        "ok": 1,
        "item": {
          "_id": 4,
          "user_id": 2,
          "state": "OS040",
          "products": [
            {
              "_id": 2,
              "seller_id": 2,
              "state": "OS310",
              "name": "헬로카봇 스톰다이버",
              "image": "/files/sample-diver.jpg",
              "quantity": 1,
              "price": 17260,
              "reply_id": 2
            }
          ],
          "cost": {
            "products": 17260,
            "shippingFees": 2500,
            "discount": {
              "products": 0,
              "shippingFees": 0
            },
            "total": 19760
          },
          "address": {
            "name": "학교",
            "value": "서울시 강남구 역삼동 234"
          },
          "delivery": {
            "company": "한진 택배",
            "trackingNumber": "364495958003",
            "url": "https://trace.cjlogistics.com/next/tracking.html?wblNo=364495958003"
          },
          "createdAt": "2024.04.05 03:05:48",
          "updatedAt": "2024.04.07 20:05:48",
          "user": {
            "_id": 2,
            "email": "s1@market.com",
            "name": "네오",
            "phone": "01022223333",
            "extra": {
              "birthday": "11-23",
              "membershipClass": "MC01",
              "addressBook": [
                {
                  "id": 1,
                  "name": "회사",
                  "value": "서울시 강남구 삼성동 567"
                },
                {
                  "id": 2,
                  "name": "학교",
                  "value": "서울시 강남구 역삼동 234"
                }
              ]
            }
          }
        }
      },

      updateOrder: {
        "state": "OS110",
        "memo": "2개 상품 모두 동작하지 않습니다. 반품 요청합니다."
      },

      updateOrderRes: {
        "ok": 1,
        "updated": {
          "_id": 2,
          "state": "OS110",
          "memo": "2개 상품 모두 동작하지 않습니다. 반품 요청합니다.",
          "updatedAt": "2024.04.08 07:47:00"
        }
      },

      updateOrderProduct: {
        "state": "OS110",
        "memo": "레고 클래식 상품이 동작하지 않습니다. 반품 요청합니다."
      },

      updateOrderProductRes: {
        "ok": 1,
        "updated": {
          "_id": 2,
          "product_id": 3,
          "state": "OS110",
          "memo": "레고 클래식 상품이 동작하지 않습니다. 반품 요청합니다.",
          "updatedAt": "2024.04.08 07:55:34"
        }
      },

      updateOrderProductSellerBody: {
        "state": "OS035",
        "memo": "레고 클래식 상품을 구매한 고객님께 서비스로 미니 레고 블럭을 드립니다.",
        "delivery": {
          "company": "CJ 대한통운",
          "trackingNumber": "364746065376",
          "url": "https://trace.cjlogistics.com/next/tracking.html?wblNo=364746065376"
        }
      },

      updateOrderProductSellerRes: {
        "ok": 1,
        "updated": {
          "_id": 2,
          "product_id": 3,
          "state": "OS035",
          "memo": "레고 클래식 상품을 구매한 고객님께 서비스로 미니 레고 블럭을 드립니다.",
          "delivery": {
            "company": "CJ 대한통운",
            "trackingNumber": "364746065376",
            "url": "https://trace.cjlogistics.com/next/tracking.html?wblNo=364746065376"
          },
          "updatedAt": "2024.04.08 22:37:09"
        }
      },

      updateOrderSellerBody: {
        "state": "OS035",
        "memo": "2건 이상 구매한 고객님에 대해 서비스로 물총을 드립니다.",
        "delivery": {
          "company": "CJ 대한통운",
          "trackingNumber": "364746065376",
          "url": "https://trace.cjlogistics.com/next/tracking.html?wblNo=364746065376"
        }
      },

      updateOrderSellerRes: {
        "ok": 1,
        "updated": {
          "_id": 2,
          "state": "OS035",
          "memo": "2건 이상 구매한 고객님에 대해 서비스로 물총을 드립니다.",
          "delivery": {
            "company": "CJ 대한통운",
            "trackingNumber": "364746065376",
            "url": "https://trace.cjlogistics.com/next/tracking.html?wblNo=364746065376"
          },
          "updatedAt": "2024.04.08 22:53:26"
        }
      },

      orderReplyCreate: {
        "order_id": 1,
        "product_id": 3,
        "rating": 3,
        "content": "배송이 너무 느려요.",
        "extra": {
          "title": "배송 불만"
        }
      },

      orderReplyCreateRes: {
        "ok": 1,
        "item": {
          "order_id": 1,
          "product_id": 3,
          "rating": 3,
          "content": "배송이 너무 느려요.",
          "extra": {
            "title": "배송 불만"
          },
          "user_id": 4,
          "_id": 5,
          "createdAt": "2024.04.08 09:15:38"
        }
      },

      replyListRes: {
        "ok": 1,
        "item": [
          {
            "_id": 5,
            "rating": 3,
            "content": "배송이 너무 느려요.",
            "extra": {
              "title": "배송 불만"
            },
            "createdAt": "2024.04.08 09:15:38",
            "product": {
              "_id": 3,
              "image": {
                "url": "/files/sample-classic.jpg",
                "fileName": "sample-classic.jpg",
                "orgName": "레고 클래식.jpg"
              },
              "name": "레고 클래식 라지 조립 박스 10698"
            },
            "user": {
              "_id": 4,
              "name": "데**"
            }
          }
        ]
      },

      replyInfoRes: {
        "ok": 1,
        "item": {
          "_id": 5,
          "rating": 3,
          "content": "배송이 너무 느려요.",
          "extra": {
            "title": "배송 불만"
          },
          "createdAt": "2024.04.08 09:15:38",
          "product": {
            "_id": 3,
            "image": {
              "url": "/files/sample-classic.jpg",
              "fileName": "sample-classic.jpg",
              "orgName": "레고 클래식.jpg"
            },
            "name": "레고 클래식 라지 조립 박스 10698"
          },
          "user": {
            "_id": 4,
            "name": "데**"
          }
        }
      },

      sellerReplyListRes: {
        "ok": 1,
        "item": [
          {
            "_id": 2,
            "product_id": 2,
            "price": 17260,
            "name": "헬로카봇 스톰다이버",
            "image": {
              "url": "/files/sample-diver.jpg",
              "fileName": "sample-diver.jpg",
              "orgName": "헬로카봇.jpg"
            },
            "replies": [
              {
                "_id": 1,
                "user_name": "데**",
                "rating": 5,
                "content": "아이가 좋아해요.",
                "createdAt": "2024.04.02 23:46:27"
              },
              {
                "_id": 2,
                "user_name": "네*",
                "rating": 4,
                "content": "배송이 좀 느려요.",
                "createdAt": "2024.04.04 10:46:27"
              }
            ]
          }
        ]
      },

      cartList: {
        "products": [
          {
            "_id": 3,
            "quantity": 1
          },
          {
            "_id": 4,
            "quantity": 2
          }
        ]
      },

      cartListRes: {
        "ok": 1,
        "item": {
          "products": [
            {
              "_id": 4,
              "quantity": 2,
              "quantityInStock": 11,
              "seller_id": 3,
              "name": "레고 테크닉 42151 부가티 볼리드",
              "image": {
                "url": "/files/sample-bugatti.png",
                "fileName": "sample-bugatti.png",
                "orgName": "부가티.png"
              },
              "price": 90000,
              "extra": {
                "isNew": false,
                "isBest": true,
                "category": [
                  "PC03",
                  "PC0303"
                ],
                "sort": 1
              }
            }
          ]
        },
        "cost": {
          "products": 138870,
          "shippingFees": 3500,
          "discount": {
            "products": 0,
            "shippingFees": 3500
          },
          "total": 138870
        }
      },

      cartListLoginRes: {
        "ok": 1,
        "item": [
          {
            "_id": 1,
            "product_id": 1,
            "quantity": 2,
            "createdAt": "2024.04.01 08:36:39",
            "updatedAt": "2024.04.01 08:36:39",
            "product": {
              "_id": 1,
              "name": "캥거루 스턴트 독 로봇완구",
              "price": 22800,
              "seller_id": 2,
              "quantity": 320,
              "buyQuantity": 310,
              "image": {
                "url": "/files/sample-dog.jpg",
                "fileName": "sample-dog.jpg",
                "orgName": "스턴트 독.jpg"
              },
              "extra": {
                "isNew": true,
                "isBest": true,
                "category": [
                  "PC03",
                  "PC0301"
                ],
                "sort": 5
              }
            }
          }
        ],
        "cost": {
          "products": 62860,
          "shippingFees": 2500,
          "discount": {
            "products": 6290,
            "shippingFees": 2500
          },
          "total": 56570
        }
      },

      cartCreate: {
        "product_id": 4,
        "quantity": 2
      },

      cartCreateRes: {
        "ok": 1,
        "item": [
          {
            "_id": 5,
            "product_id": 4,
            "quantity": 2,
            "createdAt": "2024.04.08 09:50:51",
            "updatedAt": "2024.04.08 10:02:35",
            "product": {
              "_id": 4,
              "name": "레고 테크닉 42151 부가티 볼리드",
              "price": 45000,
              "seller_id": 3,
              "quantity": 100,
              "buyQuantity": 89,
              "image": {
                "url": "/files/sample-bugatti.png",
                "fileName": "sample-bugatti.png",
                "orgName": "부가티.png"
              },
              "extra": {
                "isNew": false,
                "isBest": true,
                "category": [
                  "PC03",
                  "PC0303"
                ],
                "sort": 1
              }
            }
          },
        ]
      },

      cartUpdate: {
        "quantity": 2
      },

      cartUpdateRes: {
        "ok": 1,
        "updated": {
          "_id": 2,
          "quantity": 2,
          "updatedAt": "2024.04.08 10:10:41"
        }
      },

      cartDeleteBody: {
        "carts": [1, 2]
      },

      cartMergeBody: {
        "products": [
          {
            "_id": 1,
            "quantity": 2
          },
          {
            "_id": 2,
            "quantity": 3
          }
        ]
      },

      addBookmarkBody: {
        "memo": "다음에 재구매"
      },

      addBookmarkRes: {
        "ok": 1,
        "item": {
          "type": "product",
          "user_id": 4,
          "target_id": 4,
          "memo": "다음에 재구매",
          "_id": 9,
          "createdAt": "2024.04.08 16:47:46"
        }
      },

      userBookmarkListRes: {
        "ok": 1,
        "item": {
          "user": [
            {
              "_id": 3,
              "user_id": 4,
              "type": "user",
              "target_id": 2,
              "memo": "단골 셀러",
              "createdAt": "2024.04.13 01:26:20"
            }
          ],
          "post": [
            {
              "_id": 4,
              "user_id": 4,
              "type": "post",
              "target_id": 1,
              "memo": "크기 문의글 북마크",
              "createdAt": "2024.04.14 09:26:20"
            }
          ],
          "product": [
            {
              "_id": 1,
              "user_id": 4,
              "type": "product",
              "target_id": 2,
              "memo": "첫째 크리스마스 선물.",
              "createdAt": "2024.04.12 19:26:20"
            },
            {
              "_id": 2,
              "user_id": 4,
              "type": "product",
              "target_id": 4,
              "memo": "둘째 생일 선물",
              "createdAt": "2024.04.14 09:26:20"
            }
          ]
        }
      },

      bookmarkListRes: {
        "ok": 1,
        "item": [
          {
            "_id": 9,
            "user_id": 4,
            "memo": "다음에 재구매",
            "createdAt": "2024.04.08 16:47:46",
            "product": {
              "_id": 4,
              "name": "레고 테크닉 42151 부가티 볼리드",
              "price": 45000,
              "quantity": 100,
              "buyQuantity": 89,
              "image": {
                "url": "/files/sample-bugatti.png",
                "fileName": "sample-bugatti.png",
                "orgName": "부가티.png"
              },
              "extra": {
                "isNew": false,
                "isBest": true,
                "category": [
                  "PC03",
                  "PC0303"
                ],
                "sort": 1
              }
            }
          }
        ]
      },

      bookmarkInfoRes: {
        "ok": 1,
        "item": {
          "_id": 9,
          "user_id": 4,
          "memo": "다음에 재구매",
          "createdAt": "2024.04.08 16:47:46",
          "product": {
            "_id": 4,
            "name": "레고 테크닉 42151 부가티 볼리드",
            "price": 45000,
            "quantity": 100,
            "buyQuantity": 89,
            "image": {
              "url": "/files/sample-bugatti.png",
              "fileName": "sample-bugatti.png",
              "orgName": "부가티.png"
            },
            "extra": {
              "isNew": false,
              "isBest": true,
              "category": [
                "PC03",
                "PC0303"
              ],
              "sort": 1
            }
          }
        }
      },

      myProductListRes: {
        "ok": 1,
        "item": [
          {
            "_id": 3,
            "seller_id": 2,
            "price": 48870,
            "shippingFees": 0,
            "show": true,
            "active": true,
            "name": "레고 클래식 라지 조립 박스 10698",
            "quantity": 100,
            "buyQuantity": 99,
            "mainImages": [
              {
                "path ": "/files/00-sample/sample-classic.jpg",
                "name ": "sample-classic.jpg",
                "originalname": "레고 클래식.jpg"
              }
            ],
            "createdAt": "2024.03.04 08:50:28",
            "updatedAt": "2024.03.29 14:31:28",
            "extra": {
              "isNew": true,
              "isBest": true,
              "category": [
                "PC01",
                "PC0103"
              ],
              "sort": 3
            },
            "replies": 1,
            "bookmarks": 1,
            "orders": 1,
            "ordersQuantity": 3
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 0,
          "total": 1,
          "totalPages": 1
        }
      },

      postCreateRes: {
        "ok": 1,
        "item": {
          "type": "community",
          "title": "여행 후기 입니다.",
          "content": "주말에 다녀온 여행지 입니다. 날씨가 맑아서 좋았어요.",
          "image": "sample-bugatti.png",
          "tag": "혼자,떠나요,제주도",
          "views": 0,
          "user": {
            "_id": 4,
            "name": "제이지"
          },
          "_id": 6,
          "createdAt": "2024.04.09 08:13:00",
          "updatedAt": "2024.04.09 08:13:00"
        }
      },

      postListRes: {
        "ok": 1,
        "item": [
          {
            "_id": 1,
            "type": "qna",
            "product_id": 1,
            "seller_id": 2,
            "user": {
              "_id": 4,
              "name": "제이지"
            },
            "title": "크기가 얼만만한가요?",
            "content": "아이가 6살인데 가지고 놀기 적당한 크기인가요?",
            "createdAt": "2024.04.08 21:08:10",
            "updatedAt": "2024.04.08 21:08:10",
            "product": {
              "name": "캥거루 스턴트 독 로봇완구",
              "image": {
                "url": "/files/sample-dog.jpg",
                "fileName": "sample-dog.jpg",
                "orgName": "스턴트 독.jpg"
              }
            },
            "repliesCount": 3
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 0,
          "total": 3,
          "totalPages": 1
        }
      },

      postDetailRes: {
        "ok": 1,
        "item": {
          "_id": 1,
          "type": "qna",
          "product_id": 1,
          "seller_id": 2,
          "user": {
            "_id": 4,
            "name": "제이지"
          },
          "title": "크기가 얼만만한가요?",
          "content": "아이가 6살인데 가지고 놀기 적당한 크기인가요?",
          "replies": [
            {
              "_id": 1,
              "user": {
                "_id": 2,
                "name": "네오"
              },
              "content": "크기는 상품 상세정보에 나와 있습니다.",
              "createdAt": "2024.04.09 03:08:10",
              "updatedAt": "2024.04.09 21:08:10"
            },
            {
              "_id": 2,
              "user": {
                "_id": 4,
                "name": "제이지"
              },
              "content": "어디있나 모르겠어요.",
              "createdAt": "2024.04.09 13:08:10",
              "updatedAt": "2024.04.09 22:08:10"
            },
            {
              "_id": 3,
              "user": {
                "_id": 2,
                "name": "네오"
              },
              "content": "높이 60cm 입니다.",
              "createdAt": "2024.04.09 14:08:10",
              "updatedAt": "2024.04.10 03:08:10"
            }
          ],
          "createdAt": "2024.04.08 21:08:10",
          "updatedAt": "2024.04.08 21:08:10"
        }
      },

      userListRes: {
        "ok": 1,
        "item": [
          {
            "_id": 4,
            "email": "u1@market.com",
            "name": "제이지",
            "phone": "01044445555",
            "address": "서울시 강남구 논현동 222",
            "type": "user",
            "createdAt": "2024.03.22 11:10:45",
            "updatedAt": "2024.03.31 23:40:45",
            "extra": {
              "birthday": "11-30",
              "membershipClass": "MC02",
              "address": [
                {
                  "id": 1,
                  "name": "회사",
                  "value": "서울시 강동구 천호동 123"
                },
                {
                  "id": 2,
                  "name": "집",
                  "value": "서울시 강동구 성내동 234"
                }
              ]
            },
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 0,
          "total": 1,
          "totalPages": 1
        }
      },

      fileUploadRes: {
        "ok": 1,
        "item": [
          {
            "originalname": "sample-cat.jpg",
            "name": "nQYGBCVZZ.jpg",
            "path": "/files/00-sample/nQYGBCVZZ.jpg"
          },
          {
            "originalname": "sample-dog.jpg",
            "name": "Gb4OJkEX2k.jpg",
            "path": "/files/00-sample/Gb4OJkEX2k.jpg"
          }
        ]
      },

      codeListRes: {
        "ok": 1,
        "item": {
          "productCategory": {
            "_id": "productCategory",
            "title": "상품 카테고리",
            "codes": [
              {
                "sort": 1,
                "code": "PC02",
                "value": "스포츠",
                "depth": 1
              }
            ]
          },
          "orderState": {
            "_id": "orderState",
            "title": "주문 상태",
            "codes": [
              {
                "sort": 1,
                "code": "OS010",
                "value": "주문 완료"
              }
            ]
          },
          "membershipClass": {
            "_id": "membershipClass",
            "title": "회원 등급",
            "codes": [
              {
                "sort": 1,
                "code": "MC01",
                "value": "일반",
                "discountRate": 0
              }
            ]
          }
        }
      },

      codeDetailRes: {
        "ok": 1,
        "item": {
          "membershipClass": {
            "_id": "membershipClass",
            "title": "회원 등급",
            "codes": [
              {
                "sort": 1,
                "code": "MC01",
                "value": "일반",
                "discountRate": 0
              },
            ]
          }
        }
      }

    },

    examples: {
      loginRes: {
        "ok": 1,
        "item": {
          "_id": 5,
          "email": "gd@market.com",
          "name": "GD",
          "type": "user",
          "loginType": "email",
          "phone": "01011112222",
          "address": "서울시 강남구 역삼동 123",
          "createdAt": "2023.11.21 16:25:54",
          "updatedAt": "2023.11.21 16:25:54",
          "token": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjUsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNzAwNTUxNTcyLCJleHAiOjE3MDA1NTIxNzIsImlzcyI6IkZFU1AwMSJ9.TmYTk4w-iQYjPK172AkSuH7587XZPPoFARTdg-fFGgA",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDA1NTE1NzIsImV4cCI6MTcwMzE0MzU3MiwiaXNzIjoiRkVTUDAxIn0.FSUXGwl3M5xnKpc_gkzdQfJ1FT_9IzwhO_X0iLHzXcE"
          }
        }
      },
      loginKakaoRes: {
        "ok": 1,
        "item": {
          "_id": 5,
          "name": "GD",
          "type": "user",
          "profileImage": "http://k.kakaocdn.net/dn/p4NUj/btsFiuTSVb6/Q4YkWkx4t1AFkFA3rtq6ZK/img_110x110.jpg",
          "kakao": {
              "id": 1234567890,
              "connected_at": "2024-04-13T15:52:13Z",
              "kakao_account": {
                  "profile_nickname_needs_agreement": false,
                  "profile_image_needs_agreement": false,
                  "profile": {
                      "nickname": "GD",
                      "thumbnail_image_url": "http://k.kakaocdn.net/dn/p4NUj/btsFiuTSVb6/Q4YkWkx4t1AFkFA3rtq6ZK/img_110x110.jpg",
                      "profile_image_url": "http://k.kakaocdn.net/dn/p4NUj/btsFiuTSVb6/Q4YkWkx4t1AFkFA3rtq6ZK/img_640x640.jpg",
                      "is_default_image": false,
                      "is_default_nickname": false
                  }
              }
          },
          "loginType": "kakao",
          "createdAt": "2023.11.21 16:25:54",
          "updatedAt": "2023.11.21 16:25:54",
          "token": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjUsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNzAwNTUxNTcyLCJleHAiOjE3MDA1NTIxNzIsImlzcyI6IkZFU1AwMSJ9.TmYTk4w-iQYjPK172AkSuH7587XZPPoFARTdg-fFGgA",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDA1NTE1NzIsImV4cCI6MTcwMzE0MzU3MiwiaXNzIjoiRkVTUDAxIn0.FSUXGwl3M5xnKpc_gkzdQfJ1FT_9IzwhO_X0iLHzXcE"
          },
          "kakaoToken": {
            "accessToken": "45ycguq3mpI34hxxXgB6OxZTExUoJIN5DksKPXMXAAABjt7xLkvo6jj-qNQmaA",
            "refreshToken": "UeS298UOXvpQiBwt0B6yWGlJmystIwK3Um4KPXMXAAABjt7xLkbo6jj-qNQmaA",
            "expiresIn": 21599
          }
        }
      },
      fileUploadFieldError: {
        "ok": 0,
        "message": "첨부 파일 필드명은 attach로 지정해야 합니다."
      },
      fileUploadLimitError: {
        "ok": 0,
        "message": "파일은 한번에 10개 까지만 업로드가 가능합니다."
      },
      createSellerConfirmBody: {
        "_id": "joinState",
        "title": "판매 회원 승인 코드",
        "codes": [
          {
            "sort": 2,
            "code": "JS01",
            "value": "보류"
          }, {
            "sort": 3,
            "code": "JS02",
            "value": "거부"
          }, {
            "sort": 1,
            "code": "JS03",
            "value": "승인"
          }
        ]
     },
      updateMembershipClassCode: {
        "title": "회원 등급",
        "codes": [
          {
            "sort": 1,
            "code": "MC01",
            "value": "일반",
            "discountRate": 0
          }, {
            "sort": 2,
            "code": "MC02",
            "value": "프리미엄",
            "discountRate": 10
          }, {
            "sort": 3,
            "code": "MC03",
            "value": "VIP",
            "discountRate": 20
          }, {
            "sort": 4,
            "code": "MC04",
            "value": "VVIP",
            "discountRate": 30
          }
        ]
      },
      updateMembershipClassCodeRes: {
        "_id": "membershipClass",
        "title": "회원 등급",
        "codes": [
          {
            "sort": 1,
            "code": "MC01",
            "value": "일반",
            "discountRate": 0
          }, {
            "sort": 2,
            "code": "MC02",
            "value": "프리미엄",
            "discountRate": 10
          }, {
            "sort": 3,
            "code": "MC03",
            "value": "VIP",
            "discountRate": 20
          }, {
            "sort": 4,
            "code": "MC04",
            "value": "VVIP",
            "discountRate": 30
          }
        ]
      },
      createCategoryCode: {
        "_id": "productCategory",
        "title": "상품 카테고리 코드",
        "codes": [
          {
            "sort": 1,
            "code": "PC0102",
            "value": "보드게임",
            "parent": "PC01",
            "depth": 2
          },
          {
            "sort": 1,
            "code": "PC02",
            "value": "스포츠",
            "depth": 1
          },
          {
            "sort": 1,
            "code": "PC0201",
            "value": "축구",
            "parent": "PC02",
            "depth": 2
          },
          {
            "sort": 1,
            "code": "PC0301",
            "value": "원격 조종",
            "parent": "PC03",
            "depth": 2
          },
          {
            "sort": 2,
            "code": "PC01",
            "value": "어린이",
            "depth": 1
          },
          {
            "sort": 2,
            "code": "PC0103",
            "value": "레고",
            "parent": "PC01",
            "depth": 2
          },
          {
            "sort": 2,
            "code": "PC0203",
            "value": "농구",
            "parent": "PC02",
            "depth": 2
          },
          {
            "sort": 2,
            "code": "PC0302",
            "value": "퍼즐",
            "parent": "PC03",
            "depth": 2
          },
          {
            "sort": 3,
            "code": "PC0101",
            "value": "퍼즐",
            "parent": "PC01",
            "depth": 2
          },
          {
            "sort": 3,
            "code": "PC0202",
            "value": "야구",
            "parent": "PC02",
            "depth": 2
          },
          {
            "sort": 3,
            "code": "PC03",
            "value": "어른",
            "parent": "PC03",
            "depth": 1
          },
          {
            "sort": 3,
            "code": "PC0303",
            "value": "레고",
            "parent": "PC03",
            "depth": 2
          },
          {
            "sort": 4,
            "code": "PC0104",
            "value": "로봇",
            "parent": "PC01",
            "depth": 2
          }
        ]
      },

      createCodeRes: {
        "ok": 1,
        "item": {
          "_id": "joinState",
          "title": "판매 회원 승인 코드",
          "codes": [
            {
              "sort": 2,
              "code": "JS01",
              "value": "보류"
            },
            {
              "sort": 3,
              "code": "JS02",
              "value": "거부"
            },
            {
              "sort": 1,
              "code": "JS03",
              "value": "승인"
            }
          ]
        }
      },

      createUser: {
        email: 'gd@market.com',
        password: '12345678',
        name: 'GD',
        phone: '01011112222',
        address: '서울시 강남구 역삼동 123',
        type: 'user',
      },

      createUserWithExtra: {
        email: 'gdragon@market.com',
        password: '12345678',
        name: 'G드래곤',
        phone: '01011112222',
        address: '서울시 강남구 역삼동 123',
        type: 'user',
        extra: {
          gender: 'extra에는 프로젝트에서 필요한 아무 속성이나',
          age: '넣으면 됩니다.',
          address: ['배열도', '가능하고'],
          profileImage: {
            "path ": "/files/00-sample/profile.jpg",
            "name ": "profile.jpg",
            "originalname": "사커게임.png"
          },
          obj: {
            hello: '객체로',
            hi: '넣어도 됩니다.'
          },
          addressBook: [{
            name: '집',
            address: '서울시'
          }, {
            name: '회사',
            address: '인천시'
          }]
        }
      },

      createUserRes: {
        "ok": 1,
        "item": {
          "email": "gd@market.com",
          "name": "GD",
          "type": "user",
          "phone": "01011112222",
          "address": "서울시 강남구 역삼동 123",
          "_id": 5,
          "createdAt": "2023.11.21 14:31:15",
          "updatedAt": "2023.11.21 14:31:15"
        }
      },

      createUserResWithExtra: {
        "ok": 1,
        "item": {
          "email": "gdragon@market.com",
          "name": "G드래곤",
          "type": "user",
          "phone": "01011112222",
          "address": "서울시 강남구 역삼동 123",
          "extra": {
            "gender": 'extra에는 프로젝트에서 필요한 아무 속성이나',
            "age": '넣으면 됩니다.',
            "address": ['배열도', '가능하고'],
            "profileImage": {
              "path ": "/files/00-sample/profile.jpg",
              "name ": "profile.jpg",
              "originalname": "사커게임.png"
            },
            "obj": {
              "hello": '객체로',
              "hi": '넣어도 됩니다.'
            },
            "addressBook": [{
              "name": '집',
              "address": '서울시'
            }, {
              "name": '회사',
              "address": '인천시'
            }]
          },
          "_id": 5,
          "createdAt": "2023.11.21 14:33:41",
          "updatedAt": "2023.11.21 14:33:41"
        }
      },

      userInfoResOneAttr: {
        "ok": 1,
        "item": {
          "name": "GD"
        }
      },

      userInfoResWithExtra: {
        "ok": 1,
        "item": {
          "extra": {
            "addressBook": [
              {
                "name": "집",
                "address": "서울시"
              },
              {
                "name": "회사",
                "address": "인천시"
              }
            ]
          }
        }
      },

      updateUserOneAttr: {
        "phone": "01099998888",
        "name": "길드래곤"
      },

      updateUserResOneAttr: {
        "ok": 1,
        "updated": {
          "name": "길드래곤",
          "phone": "01099998888",
          "updatedAt": "2023.11.21 20:16:53"
        }
      },

      updateUserWithExtra: {
        "extra": {
          "address": [
            {
              "id": 1,
              "name": "회사",
              "value": "서울시 강남구 삼성동 111"
            },
            {
              "id": 2,
              "name": "학교",
              "value": "서울시 강남구 역삼동 222"
            }
          ]
        }
      },

      updateUserResWithExtra: {
        "ok": 1,
        "updated": {
          "extra": {
            "address": [
              {
                "id": 1,
                "name": "회사",
                "value": "서울시 강남구 삼성동 111"
              },
              {
                "id": 2,
                "name": "학교",
                "value": "서울시 강남구 역삼동 222"
              }
            ]
          },
          "updatedAt": "2023.11.21 20:13:33"
        }
      },

      createOrder: {
        "products": [
          {
            "_id": 1,
            "quantity": 1
          },
          {
            "_id": 2,
            "quantity": 2
          }
        ]
      },

      createOrderWithExtra: {
        "products": [
          {
            "_id": 1,
            "quantity": 1
          },
          {
            "_id": 2,
            "quantity": 2
          }
        ],
        "address": {
          "name": "학교",
          "value": "서울시 강남구 역삼동 234"
        }
      },

      createOrderRes: {
        "ok": 1,
        "item": {
          "products": [
            {
              "_id": 1,
              "quantity": 1,
              "seller_id": 2,
              "name": "캥거루 스턴트 독 로봇완구",
              "image": {
                "url": "/files/sample-dog.jpg",
                "fileName": "sample-dog.jpg",
                "orgName": "스턴트 독.jpg"
              },
              "price": 22800,
              "extra": {
                "isNew": true,
                "isBest": true,
                "category": [
                  "PC03",
                  "PC0301"
                ],
                "sort": 5
              }
            },
            {
              "_id": 2,
              "quantity": 2,
              "seller_id": 2,
              "name": "헬로카봇 스톰다이버",
              "image": {
                "url": "/files/sample-diver.jpg",
                "fileName": "sample-diver.jpg",
                "orgName": "헬로카봇.jpg"
              },
              "price": 34520,
              "extra": {
                "isNew": false,
                "isBest": true,
                "category": [
                  "PC01",
                  "PC0103"
                ],
                "sort": 4
              }
            }
          ],
          "state": "OS020",
          "user_id": 4,
          "_id": 5,
          "createdAt": "2024.04.07 10:40:44",
          "updatedAt": "2024.04.07 10:40:44",
          "cost": {
            "products": 57320,
            "shippingFees": 2500,
            "discount": {
              "products": 5740,
              "shippingFees": 2500
            },
            "total": 51580
          }
        }
      },

      createOrderWithExtraRes: {
        "ok": 1,
        "item": {
          "products": [
            {
              "_id": 1,
              "quantity": 1,
              "seller_id": 2,
              "name": "캥거루 스턴트 독 로봇완구",
              "image": {
                "url": "/files/sample-dog.jpg",
                "fileName": "sample-dog.jpg",
                "orgName": "스턴트 독.jpg"
              },
              "price": 22800,
              "extra": {
                "isNew": true,
                "isBest": true,
                "category": [
                  "PC03",
                  "PC0301"
                ],
                "sort": 5
              }
            },
            {
              "_id": 2,
              "quantity": 2,
              "seller_id": 2,
              "name": "헬로카봇 스톰다이버",
              "image": {
                "url": "/files/sample-diver.jpg",
                "fileName": "sample-diver.jpg",
                "orgName": "헬로카봇.jpg"
              },
              "price": 34520,
              "extra": {
                "isNew": false,
                "isBest": true,
                "category": [
                  "PC01",
                  "PC0103"
                ],
                "sort": 4
              }
            }
          ],
          "address": {
            "name": "학교",
            "value": "서울시 강남구 역삼동 234"
          },
          "state": "OS020",
          "user_id": 4,
          "_id": 7,
          "createdAt": "2024.04.07 10:36:18",
          "updatedAt": "2024.04.07 10:36:18",
          "cost": {
            "products": 57320,
            "shippingFees": 2500,
            "discount": {
              "products": 5740,
              "shippingFees": 2500
            },
            "total": 51580
          }
        }
      },

      createPostExample: {
        "type": "community",
        "title": "여행 후기 입니다.",
        "content": "주말에 다녀온 여행지 입니다. 날씨가 맑아서 좋았어요.",
        "image": "sample-bugatti.png",
        "tag": "혼자,떠나요,제주도",
      },

      createPostQnAExample: {
        "type": "qna",
        "product_id": 1,
        "title": "배송은 얼마나 걸려요?",
        "content": "주말에 여행가기 전까지 오면 좋겠네요."
      },

      updatePostBody: {
        "title": "크기가 얼마나 큰가요?",
        "content": "6세 아이가 가지고 놀 수 있을 정도로 컸으면 좋겠네요.",
        "extra": {
          "image": "sample-hulk.png"
        }
      },

      updatePostRes: {
        "ok": 1,
        "updated": {
          "_id": 1,
          "title": "크기가 얼마나 큰가요?",
          "content": "6세 아이가 가지고 놀 수 있을 정도로 컸으면 좋겠네요.",
          "extra": {
            "image": "sample-hulk.png"
          },
          "updatedAt": "2024.04.12 09:28:41"
        }
      },

      listReplyRes: {
        "ok": 1,
        "item": [
          {
            "_id": 3,
            "user": {
              "_id": 2,
              "name": "네오"
            },
            "content": "높이 60cm 입니다.",
            "createdAt": "2024.04.09 14:08:10",
            "updatedAt": "2024.04.10 03:08:10"
          }
        ],
        "pagination": {
          "page": 2,
          "limit": 2,
          "total": 3,
          "totalPages": 2
        }
      },

    }
  }
}


const outputFile = './swagger-output.json';
const routes = ['./routes/user/index.js', './routes/seller/index.js', './routes/admin/index.js', './routes/system/index.js'];


const options = {
  openapi: '3.0.0',
  language: 'ko-KR',
};

swaggerAutogen(options)(outputFile, routes, doc);