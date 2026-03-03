const ERROR_MESSAGES = Object.freeze({
  400: '잘못된 요청입니다.',
  401: '로그인이 필요합니다.',
  403: '접근 권한이 없습니다.',
  404: '요청한 리소스를 찾을 수 없습니다.',
  500: '서버 오류가 발생했습니다.',
});

export function getErrorMessage(status) {
  if (ERROR_MESSAGES[status]) return ERROR_MESSAGES[status];

  if (status >= 500) return '서버에 문제가 발생했습니다.';
  if (status >= 400) return '요청 처리 중 오류가 발생했습니다.';

  return '알 수 없는 오류가 발생했습니다.';
}
