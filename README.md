# Lion Fortune

사자 운세 카드를 뽑는 React 단일 페이지 애플리케이션입니다.

## 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router v7

## 주요 기능

- 메인 페이지 -> 카드 선택 페이지 -> 결과 페이지 흐름
- `/card` 페이지의 Orbit 카드 UI
- 카드를 선택하지 않고 버튼을 누르면 랜덤 카드 ID로 결과 페이지 이동
- 모바일/데스크톱에서 동일하게 보이도록 Jalnan 2 폰트 전역 적용

## 라우트

- `/` : 메인 페이지
- `/card` : 카드 선택 페이지
- `/result/:cardId` : 선택 또는 랜덤 카드 결과 페이지

## 실행 방법

```bash
npm install
npm run dev
```

기본 로컬 주소:

```txt
http://localhost:5173
```

## 스크립트

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run format:check
```

## 배포 참고 (Vercel)

이 프로젝트는 SPA 라우팅을 사용하므로 `vercel.json`에 rewrite 설정이 필요합니다.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 폰트 참고

- Jalnan 2 폰트는 초기 로딩을 위해 `index.html`의 `<head>`에서 불러옵니다.
- 전역 `font-family`는 `src/index.css`에서 설정합니다.
