// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    // 한글 설명: 개발용 프론트 서버 설정
    proxy: {
      // 한글 설명: /api 로 시작하는 요청은 모두 8080 스프링 서버로 중계
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // 한글 설명: /uploads 로 시작하는 요청도 8080 스프링 서버로 중계
      // -> 백엔드 WebMvcConfig 에서 매핑한 업로드 이미지 파일 서빙용
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
