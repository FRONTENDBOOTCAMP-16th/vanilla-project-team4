const ERROR_MESSAGES = {
  400: '잘못된 요청입니다.',
  401: '로그인이 필요합니다.',
  403: '접근 권한이 없습니다.',
  404: '요청한 리소스를 찾을 수 없습니다.',
  500: '서버 오류가 발생했습니다.',
};

export function getErrorMessage(status) {
  return ERROR_MESSAGES[status] ?? '알 수 없는 오류가 발생했습니다.';
}
