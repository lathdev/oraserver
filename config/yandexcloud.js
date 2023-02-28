import EasyYandexS3 from 'easy-yandex-s3';
let s3 = new EasyYandexS3["default"]({
    auth: {
      accessKeyId: 'YCAJEqBxgWzURnMAb82pEhZWj',
      secretAccessKey: 'YCP8nCnNR4tk-EiAzIvBgFH3P45q_r8LjTo2xk-T',
    },
    Bucket: 'piora',
    debug: false, 
  });
  export default s3;