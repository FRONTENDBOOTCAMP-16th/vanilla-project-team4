// el 공통 유틸리티 함수 생성

export const el = (tag, props = {}, ...children) => {
  const element = document.createElement(tag);

  // 속성 및 이벤트 설정
  Object.keys(props).forEach((key) => {
    if (key === 'className') {
      element.className = props[key];
    } else if (key.startsWith('on') && typeof props[key] === 'function') {
      // onsubmit, onclick 등 이벤트 핸들러 등록
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, props[key]);
    } else {
      element.setAttribute(key, props[key]);
    }
  });

  // 자식 요소 추가
  children.forEach((child) => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  });

  return element;
};
